<script setup lang="ts">
withDefaults(
	defineProps<{
		/** HEX-цвет образца обивки */
		colorHex: string
		label: string
		selected?: boolean
		disabled?: boolean
		/** 'small' | 'big' */
		size?: string
	}>(),
	{
		selected: false,
		disabled: false,
		size: 'big',
	}
)
const emits = defineEmits<{
	(e: 'select'): void
}>()
</script>

<template>
	<button
		:class="['color-swatch', `color-swatch_${size}`, { 'color-swatch_selected': selected }]"
		type="button"
		:title="label"
		:aria-label="label"
		:aria-pressed="selected"
		:disabled="disabled"
		@click="emits('select')"
	>
		<span class="color-swatch__fill" :style="{ backgroundColor: colorHex }">
			<span class="visually-hidden">{{ label }}</span>
		</span>
	</button>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.color-swatch {
	padding: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid transparent;
	border-radius: 50%;
	background-color: transparent;
	cursor: pointer;
	transition: border-color 0.3s ease-in-out;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			border-color: variables.$color-line-strong;
		}
	}

	&:disabled {
		opacity: 0.4;
		cursor: default;
		pointer-events: none;
	}

	&_selected {
		border-color: variables.$color-accent;
	}

	&__fill {
		display: block;
		border: 1px solid variables.$color-line;
		border-radius: 50%;
	}

	&_big {
		.color-swatch__fill {
			width: 32px;
			height: 32px;
		}
	}

	&_small {
		.color-swatch__fill {
			width: 20px;
			height: 20px;
		}
	}
}
</style>
