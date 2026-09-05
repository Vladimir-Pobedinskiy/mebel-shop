<script setup lang="ts">
import { useScreenHandler } from '@/composables/useScreenHandler'
import { screens } from '@/utils/utils'

/* Курсор-«точка»: догоняет мышь и расширяется над интерактивными элементами.
   Системный курсор не скрываем — он остаётся ориентиром и точкой доступности,
   точка работает как акцент. Только десктоп с мышью, при prefers-reduced-motion выключен. */
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'

const nuxtApp = useNuxtApp()
const { isMatchedScreen } = useScreenHandler(screens.desktop)

const cursorRef = ref<HTMLElement | null>(null)
const isEnabled = ref<boolean>(false)
const isVisible = ref<boolean>(false)
const isActive = ref<boolean>(false)

let moveX: ((value: number) => void) | null = null
let moveY: ((value: number) => void) | null = null

const onMouseMove = (event: MouseEvent) => {
	isVisible.value = true
	moveX?.(event.clientX)
	moveY?.(event.clientY)
}

const onMouseOver = (event: MouseEvent) => {
	const target = event.target as HTMLElement | null

	isActive.value = Boolean(target?.closest?.(INTERACTIVE_SELECTOR))
}

const onMouseLeave = () => {
	isVisible.value = false
}

onMounted(() => {
	if (!isMatchedScreen.value) return
	if (!window.matchMedia('(pointer: fine)').matches) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	isEnabled.value = true

	nextTick(() => {
		if (!cursorRef.value) return

		const { $gsap } = nuxtApp
		moveX = $gsap.quickTo(cursorRef.value, 'x', { duration: 0.35, ease: 'power3.out' })
		moveY = $gsap.quickTo(cursorRef.value, 'y', { duration: 0.35, ease: 'power3.out' })

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseover', onMouseOver)
		document.addEventListener('mouseleave', onMouseLeave)
	})
})

onUnmounted(() => {
	document.removeEventListener('mousemove', onMouseMove)
	document.removeEventListener('mouseover', onMouseOver)
	document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
	<div
		v-if="isEnabled"
		ref="cursorRef"
		:class="['app-cursor', { 'app-cursor_visible': isVisible, 'app-cursor_active': isActive }]"
		aria-hidden="true"
	/>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.app-cursor {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	width: 12px;
	height: 12px;
	margin: -6px 0 0 -6px;
	pointer-events: none;
	background-color: variables.$color-accent;
	border-radius: 50%;
	opacity: 0;
	transition:
		opacity 0.3s ease-in-out,
		width 0.3s ease-in-out,
		height 0.3s ease-in-out,
		margin 0.3s ease-in-out,
		background-color 0.3s ease-in-out;
	will-change: transform;

	&_visible {
		opacity: 1;
	}

	&_active {
		width: 44px;
		height: 44px;
		margin: -22px 0 0 -22px;
		background-color: rgb(180 99 42 / 22%);
	}
}
</style>
