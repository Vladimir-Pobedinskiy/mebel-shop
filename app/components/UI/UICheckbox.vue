<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string
		errorValue?: string
		disabled?: boolean
	}>(),
	{
		errorValue: '',
		disabled: false,
	}
)

const modelValue = defineModel<boolean>('modelValue')
</script>

<template>
	<div :class="['label-checkbox-wrapper', { selected: modelValue }, { error: errorValue }, { disabled: disabled }]">
		<label class="label-checkbox">
			<input
				v-model="modelValue"
				:value="modelValue"
				:name="name"
				class="label-checkbox__input visually-hidden"
				type="checkbox"
				:disabled="disabled"
			/>

			<span class="label-checkbox__checkbox-icon-wrapper">
				<NuxtIcon class="label-checkbox__checkbox-icon" name="icon-check" filled />
			</span>

			<slot name="content" />
		</label>
		<span v-if="errorValue" class="label-checkbox__checkbox-error text-xs">{{ errorValue }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.label-checkbox {
	position: relative;
	display: flex;
	align-items: center;
	padding-left: 32px;
	width: fit-content;
	cursor: pointer;

	&__checkbox-icon-wrapper {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		min-width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid variables.$color-line-strong;
		border-radius: 6px;
		background-color: variables.$color-surface;
		color: variables.$color-white;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	&__checkbox-icon {
		transform: scale(0);
		width: 14px;
		height: 14px;
		transition: transform 0.3s ease;
	}

	&__checkbox-error {
		position: absolute;
		left: 0;
		top: 105%;
		color: variables.$color-error;
	}
}

.label-checkbox-wrapper {
	position: relative;
	pointer-events: all;

	&.selected {
		.label-checkbox__checkbox-icon-wrapper {
			background-color: variables.$color-accent;
			border-color: variables.$color-accent;
		}

		.label-checkbox__checkbox-icon {
			transform: scale(1);
		}
	}

	&.error {
		.label-checkbox__checkbox-icon-wrapper {
			border-color: variables.$color-error;
		}
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
}
</style>
