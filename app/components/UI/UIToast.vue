<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue: boolean
		title: string
		text?: string
		/** 'success' | 'error' | 'info' */
		type?: string
		/** время показа в мс, 0 — не скрывать автоматически */
		duration?: number
	}>(),
	{
		text: '',
		type: 'success',
		duration: 4000,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const iconName = computed(() => {
	if (props.type === 'error') return 'icon-close'
	if (props.type === 'info') return 'icon-shield'
	return 'icon-check'
})

let timerId: ReturnType<typeof setTimeout> | null = null

const close = () => {
	emits('update:modelValue', false)
}

const clearTimer = () => {
	if (timerId) clearTimeout(timerId)
	timerId = null
}

// Автоскрытие перезапускается на каждое открытие
watch(
	() => props.modelValue,
	value => {
		clearTimer()
		if (value && props.duration > 0) timerId = setTimeout(close, props.duration)
	},
	{ immediate: true }
)

onUnmounted(() => clearTimer())
</script>

<template>
	<Teleport to="body">
		<Transition name="blur-in">
			<div v-if="modelValue" :class="['toast', `toast_${type}`]" role="status" aria-live="polite">
				<span class="toast__icon-wrapper">
					<NuxtIcon class="toast__icon" :name="iconName" filled />
				</span>

				<div class="toast__content">
					<p class="toast__title title-18">{{ title }}</p>
					<p v-if="text" class="toast__text text-s">{{ text }}</p>
				</div>

				<button class="toast__close" type="button" aria-label="Закрыть уведомление" @click="close">
					<NuxtIcon class="toast__close-icon" name="icon-close" filled />
				</button>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.toast {
	position: fixed;
	right: 16px;
	bottom: 16px;
	z-index: 10000;
	display: flex;
	gap: 12px;
	align-items: flex-start;
	width: calc(100% - 32px);
	max-width: 380px;
	padding: 16px;
	background-color: variables.$color-surface;
	border-radius: variables.$radius-m;
	box-shadow: variables.$shadow-hover;

	@media (min-width: variables.$desktop) {
		right: 32px;
		bottom: 32px;
	}

	&__icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		min-width: 36px;
		height: 36px;
		color: variables.$color-accent-2;
		background-color: variables.$color-muted;
		border-radius: 50%;
	}

	&__icon {
		width: 16px;
		height: 16px;
	}

	&__text {
		margin-top: 4px;
		color: variables.$color-ink-soft;
	}

	&__content {
		flex: 1 1 auto;
	}

	&__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		min-width: 24px;
		height: 24px;
		color: variables.$color-ink-soft;
		cursor: pointer;
		background-color: transparent;
	}

	&__close-icon {
		width: 12px;
		height: 12px;
	}

	&_error {
		.toast__icon-wrapper {
			color: variables.$color-error;
		}
	}

	&_info {
		.toast__icon-wrapper {
			color: variables.$color-accent;
		}
	}
}
</style>
