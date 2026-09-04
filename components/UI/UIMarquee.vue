<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee'

withDefaults(
	defineProps<{
		direction?: 'reverse' | 'normal'
		duration?: number
		pauseOnHover?: boolean
		pauseOnClick?: boolean
		/** Количество экземпляров, которые должна запустить анимация бегущей строки (0 — бесконечность) */
		loop?: number
		/** Нужно ли клонировать контент */
		clone?: boolean
		gradient?: boolean
		gradientColor?: any
		gradientLength?: string
		vertical?: boolean
		/** Анимировать ли бегущую строку, если содержимое выходит за пределы контейнера */
		animateOnOverflowOnly?: boolean
	}>(),
	{
		direction: 'normal',
		duration: 40,
		pauseOnHover: true,
		pauseOnClick: false,
		loop: 0,
		clone: true,
		gradient: false,
		gradientColor: [247, 244, 239],
		gradientLength: '30px',
		vertical: false,
		animateOnOverflowOnly: false,
	}
)
</script>

<template>
	<Vue3Marquee
		:direction="direction"
		:duration="duration"
		:loop="loop"
		:clone="clone"
		:vertical="vertical"
		:gradient="gradient"
		:gradient-color="gradientColor"
		:gradient-length="gradientLength"
		:pause-on-hover="pauseOnHover"
		:pause-on-click="pauseOnClick"
		:animate-on-overflow-only="animateOnOverflowOnly"
		class="ui-marquee"
	>
		<template v-if="$slots['content']">
			<slot name="content" />
		</template>
	</Vue3Marquee>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.ui-marquee {
	color: variables.$color-ink;

	/* Анимация бегущей строки не должна работать при prefers-reduced-motion */
	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none !important;
		}
	}
}
</style>
