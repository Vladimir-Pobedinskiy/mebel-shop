<script setup lang="ts">
import { priceFormatter } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		/** [от, до] */
		modelValue: number[]
		min: number
		max: number
		step?: number
		/** форматировать подписи как цену */
		isPrice?: boolean
		disabled?: boolean
	}>(),
	{
		step: 1000,
		isPrice: true,
		disabled: false,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue', value: number[]): void
}>()

const from = computed(() => props.modelValue[0] ?? props.min)
const to = computed(() => props.modelValue[1] ?? props.max)

// Ползунки не должны перепрыгивать друг через друга
const onFrom = (value: number) => {
	const next = Math.min(Math.max(props.min, value), to.value)
	emits('update:modelValue', [next, to.value])
}
const onTo = (value: number) => {
	const next = Math.max(Math.min(props.max, value), from.value)
	emits('update:modelValue', [from.value, next])
}

const onFromInput = (event: Event) => onFrom(Number((event.target as HTMLInputElement).value))
const onToInput = (event: Event) => onTo(Number((event.target as HTMLInputElement).value))

const onFromField = (event: Event) => {
	const target = event.target as HTMLInputElement
	onFrom(Number(target.value.replace(/\D/g, '')) || props.min)
	target.value = String(from.value)
}
const onToField = (event: Event) => {
	const target = event.target as HTMLInputElement
	onTo(Number(target.value.replace(/\D/g, '')) || props.max)
	target.value = String(to.value)
}

const percent = (value: number) => ((value - props.min) / (props.max - props.min || 1)) * 100

const trackStyle = computed(() => ({
	left: `${percent(from.value)}%`,
	width: `${Math.max(0, percent(to.value) - percent(from.value))}%`,
}))

const formatValue = (value: number) => (props.isPrice ? priceFormatter(value) : String(value))
</script>

<template>
	<div :class="['range-slider', { 'range-slider_disabled': disabled }]">
		<div class="range-slider__fields">
			<label class="range-slider__field">
				<span class="range-slider__field-title text-xs">от</span>
				<input
					class="range-slider__field-input"
					type="text"
					inputmode="numeric"
					aria-label="Значение от"
					:value="from"
					:disabled="disabled"
					@change="onFromField"
				/>
			</label>
			<label class="range-slider__field">
				<span class="range-slider__field-title text-xs">до</span>
				<input
					class="range-slider__field-input"
					type="text"
					inputmode="numeric"
					aria-label="Значение до"
					:value="to"
					:disabled="disabled"
					@change="onToField"
				/>
			</label>
		</div>

		<div class="range-slider__track-wrapper">
			<span class="range-slider__track"></span>
			<span class="range-slider__track-active" :style="trackStyle"></span>

			<input
				class="range-slider__input range-slider__input_from"
				type="range"
				aria-label="Значение от"
				:min="min"
				:max="max"
				:step="step"
				:value="from"
				:disabled="disabled"
				@input="onFromInput"
			/>
			<input
				class="range-slider__input range-slider__input_to"
				type="range"
				aria-label="Значение до"
				:min="min"
				:max="max"
				:step="step"
				:value="to"
				:disabled="disabled"
				@input="onToInput"
			/>
		</div>

		<div class="range-slider__limits">
			<span class="text-xs">{{ formatValue(min) }}</span>
			<span class="text-xs">{{ formatValue(max) }}</span>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.range-slider {
	width: 100%;

	&_disabled {
		pointer-events: none;
		opacity: 0.5;
	}

	&__fields {
		display: flex;
		gap: 12px;
	}

	&__field {
		display: flex;
		flex: 1 1 0;
		gap: 8px;
		align-items: center;
		padding: 8px 12px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
	}

	&__field-title {
		color: variables.$color-ink-soft;
	}

	&__field-input {
		width: 100%;
		font-family: variables.$font;
		font-size: 14px;
		font-weight: 600;
		color: variables.$color-ink;
		background-color: transparent;
		border: 0;

		&:focus {
			outline: transparent;
		}
	}

	&__track-wrapper {
		position: relative;
		height: 4px;
		margin: 24px 0 8px;
	}

	&__track,
	&__track-active {
		position: absolute;
		top: 0;
		height: 4px;
		border-radius: 999px;
	}

	&__track {
		left: 0;
		width: 100%;
		background-color: variables.$color-line;
	}

	&__track-active {
		background-color: variables.$color-accent;
	}

	&__input {
		position: absolute;
		top: -8px;
		left: 0;
		width: 100%;
		height: 20px;
		margin: 0;
		appearance: none;
		pointer-events: none;
		background-color: transparent;

		&::-webkit-slider-thumb {
			width: 20px;
			height: 20px;
			appearance: none;
			pointer-events: all;
			cursor: pointer;
			background-color: variables.$color-surface;
			border: 2px solid variables.$color-accent;
			border-radius: 50%;
			box-shadow: variables.$shadow-soft;
		}

		&::-moz-range-thumb {
			width: 20px;
			height: 20px;
			pointer-events: all;
			cursor: pointer;
			background-color: variables.$color-surface;
			border: 2px solid variables.$color-accent;
			border-radius: 50%;
		}

		&:focus {
			outline: transparent;
		}
	}

	&__limits {
		display: flex;
		justify-content: space-between;
		color: variables.$color-ink-soft;
	}
}
</style>
