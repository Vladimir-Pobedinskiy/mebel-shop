<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue: number
		min?: number
		max?: number
		/** 'small' | 'big' */
		size?: string
		disabled?: boolean
	}>(),
	{
		min: 1,
		max: 99,
		size: 'big',
		disabled: false,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue', value: number): void
}>()

const setValue = (value: number) => {
	const next = Math.min(props.max, Math.max(props.min, value))
	if (next === props.modelValue) return
	emits('update:modelValue', next)
}

const onDecrease = () => setValue(props.modelValue - 1)
const onIncrease = () => setValue(props.modelValue + 1)

const onInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const parsed = Number(target.value.replace(/\D/g, ''))
	setValue(Number.isNaN(parsed) ? props.min : parsed)
	target.value = String(props.modelValue)
}
</script>

<template>
	<div :class="['quantity', `quantity_${size}`, { quantity_disabled: disabled }]">
		<button
			class="quantity__btn"
			type="button"
			aria-label="Уменьшить количество"
			:disabled="disabled || modelValue <= min"
			@click="onDecrease"
		>
			<NuxtIcon class="quantity__icon" name="icon-minus" filled />
		</button>

		<input
			class="quantity__input"
			type="text"
			inputmode="numeric"
			aria-label="Количество"
			:value="modelValue"
			:disabled="disabled"
			@change="onInput"
		/>

		<button
			class="quantity__btn"
			type="button"
			aria-label="Увеличить количество"
			:disabled="disabled || modelValue >= max"
			@click="onIncrease"
		>
			<NuxtIcon class="quantity__icon" name="icon-plus" filled />
		</button>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.quantity {
	display: inline-flex;
	align-items: center;
	background-color: variables.$color-surface;
	border: 1px solid variables.$color-line;
	border-radius: 999px;

	&_disabled {
		pointer-events: none;
		opacity: 0.5;
	}

	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: variables.$color-ink;
		cursor: pointer;
		background-color: transparent;
		border-radius: 50%;
		transition:
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-muted;
			}
		}

		&:disabled {
			pointer-events: none;
			cursor: default;
			opacity: 0.35;
		}
	}

	&__icon {
		width: 14px;
		height: 14px;
	}

	&__input {
		width: 40px;
		height: 40px;
		font-family: variables.$font;
		font-size: 15px;
		font-weight: 600;
		color: variables.$color-ink;
		text-align: center;
		background-color: transparent;
		border: 0;

		&:focus {
			outline: transparent;
		}
	}

	&_small {
		.quantity__btn,
		.quantity__input {
			width: 32px;
			height: 32px;
		}

		.quantity__input {
			font-size: 14px;
		}
	}
}
</style>
