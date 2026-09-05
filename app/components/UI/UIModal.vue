<script setup lang="ts">
import { VueFinalModal, useVfm } from 'vue-final-modal'
import { useScrollController } from '@/composables/useScrollController'

const props = withDefaults(
	defineProps<{
		modelValue: boolean
		modalId: number | string
		name: string
		lockScroll?: boolean
		/** Закрытие модального окна при нажатии на наложение модального окна */
		clickToClose?: boolean
		/** Нажмите esc, чтобы закрыть модальное окно */
		escToClose?: boolean
		/** Скрытие отображения наложения */
		hideOverlay?: boolean
		swipeToClose?: 'none' | 'up' | 'right' | 'down' | 'left'
		/** 'small' | 'medium' | 'big' */
		size?: string
		isLoading?: boolean
	}>(),
	{
		lockScroll: false,
		clickToClose: true,
		escToClose: true,
		hideOverlay: false,
		swipeToClose: 'none',
		size: 'medium',
		isLoading: false,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const modelValue = computed({
	get: () => props.modelValue,
	set: value => emits('update:modelValue', value),
})

const closeModal = () => {
	emits('update:modelValue', false)
}

const vfm = useVfm()
const openedModals = vfm.openedModals

const customOverlayTransition = {
	enterActiveClass: 'custom-overlay-fade-enter-active',
	leaveActiveClass: 'custom-overlay-fade-leave-active',
	enterFromClass: 'custom-overlay-fade-enter-from',
	leaveToClass: 'custom-overlay-fade-leave-to',
}
const customContentTransition = {
	enterActiveClass: 'custom-content-slide-enter-active',
	leaveActiveClass: 'custom-content-slide-leave-active',
	enterFromClass: 'custom-content-slide-enter-from',
	leaveToClass: 'custom-content-slide-leave-to',
}

// Скролл страницы блокируем только один раз — модалки могут открываться поверх друг друга
const handleBeforeOpen = () => {
	if (!document.body.classList.contains('lock-js')) {
		useScrollController.disableScroll()
	}
}

const handleClosed = () => {
	if (document.body.classList.contains('lock-js') && !openedModals.length) {
		useScrollController.enableScroll()
	}
}
</script>

<template>
	<VueFinalModal
		v-model="modelValue"
		:modal-id="modalId"
		:name="name"
		:lock-scroll="lockScroll"
		:overlay-transition="customOverlayTransition"
		:content-transition="customContentTransition"
		:click-to-close="clickToClose"
		:esc-to-close="escToClose"
		:hide-overlay="hideOverlay"
		:swipe-to-close="swipeToClose"
		class="modal-container"
		:content-class="`modal-content modal-content_${size}`"
		overlay-class="modal-overlay"
		@before-open="handleBeforeOpen"
		@closed="handleClosed"
	>
		<button
			class="modal-close-btn"
			type="button"
			aria-label="Закрыть модальное окно"
			:disabled="isLoading"
			@click="closeModal"
		>
			<NuxtIcon class="modal-close-btn-icon" name="icon-close" filled />
		</button>

		<div class="modal-inner custom-scrollbar">
			<div v-if="$slots.header" class="modal-header">
				<slot name="header" />
			</div>
			<div v-if="$slots.body" class="modal-body">
				<slot name="body" />
			</div>
		</div>
	</VueFinalModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-overlay {
	background-color: rgba(28 26 23 / 45%);
	backdrop-filter: blur(6px);
}

.modal-content {
	position: relative;
	padding: 24px 16px;
	width: calc(100% - 32px);
	max-height: 90vh;
	border-radius: variables.$radius-l;
	background-color: variables.$color-surface;
	box-shadow: variables.$shadow-hover;

	@media (min-width: variables.$desktop) {
		padding: 40px;
	}

	&_small {
		max-width: 480px;
	}

	&_medium {
		max-width: 720px;
	}

	&_big {
		max-width: 1100px;
	}
}

.modal-inner {
	overflow-y: auto;
	max-height: calc(90vh - 48px);

	@media (min-width: variables.$desktop) {
		max-height: calc(90vh - 80px);
	}
}

.modal-header {
	margin-bottom: 20px;
	padding-right: 40px;
}

.modal-close-btn {
	position: absolute;
	right: 12px;
	top: 12px;
	z-index: 2;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: variables.$color-muted;
	color: variables.$color-ink;
	cursor: pointer;
	transition:
		background-color 0.3s ease-in-out,
		color 0.3s ease-in-out;

	@media (min-width: variables.$desktop) {
		right: 20px;
		top: 20px;
	}

	@media (min-width: variables.$desktop-small) {
		&:hover {
			background-color: variables.$color-accent;
			color: variables.$color-white;
		}
	}
}

.modal-close-btn-icon {
	width: 14px;
	height: 14px;
}

/* Переходы наложения и контента */
.custom-overlay-fade-enter-active,
.custom-overlay-fade-leave-active {
	transition: opacity 0.3s ease-in-out;
}

.custom-overlay-fade-enter-from,
.custom-overlay-fade-leave-to {
	opacity: 0;
}

.custom-content-slide-enter-active,
.custom-content-slide-leave-active {
	transition: all 0.4s ease-in-out;
}

.custom-content-slide-enter-from,
.custom-content-slide-leave-to {
	opacity: 0;
	transform: translateY(24px);
}
</style>
