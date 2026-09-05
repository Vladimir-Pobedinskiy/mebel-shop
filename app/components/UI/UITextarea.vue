<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string
		placeholder?: string
		rows?: number
		maxlength?: number
		errorValue?: string
		disabled?: boolean
	}>(),
	{
		placeholder: ' ',
		rows: 4,
		maxlength: 1000,
		errorValue: '',
		disabled: false,
	}
)

const value = defineModel<string>('value')
</script>

<template>
	<div :class="['label-textarea-wrapper', { error: errorValue }, { disabled: disabled }]">
		<label class="label-textarea">
			<textarea
				v-model="value"
				:name="name"
				:rows="rows"
				:maxlength="maxlength"
				placeholder=" "
				:class="['label-textarea__field input-text custom-scrollbar', { error: errorValue }]"
				:disabled="disabled"
			></textarea>
			<span class="label-textarea__title input-text">{{ placeholder }}</span>
		</label>

		<span v-if="errorValue" class="label-textarea__error-message text-xs">{{ errorValue }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.label-textarea {
	position: relative;
	display: block;
	width: 100%;

	&__field {
		display: block;
		width: 100%;
		padding: 16px;
		color: variables.$color-ink;
		resize: vertical;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
		transition:
			border-color 0.4s ease-in-out,
			box-shadow 0.4s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: variables.$color-line-strong;
			}
		}

		&:active,
		&:focus {
			outline: transparent;
			border-color: variables.$color-accent;
			box-shadow: 0 0 0 3px variables.$color-accent-soft;
		}

		&:disabled {
			pointer-events: none;
			background-color: variables.$color-muted;
		}

		&.error {
			border-color: variables.$color-error;
		}
	}

	&__title {
		position: absolute;
		top: 18px;
		left: 16px;
		color: variables.$color-ink-soft;
		pointer-events: none;
		cursor: text;
		transition: all 0.3s ease-in-out;
	}

	&__field:focus + &__title,
	&__field:not(:placeholder-shown) + &__title {
		padding: 0 6px;
		font-size: 12px;
		color: variables.$color-accent;
		background-color: variables.$color-surface;
		border-radius: 4px;
		transform: translateY(-30px);
	}

	&__error-message {
		display: block;
		margin-top: 4px;
		color: variables.$color-error;
	}
}

.label-textarea-wrapper {
	pointer-events: all;

	&.disabled {
		pointer-events: none;
		opacity: 0.6;
	}
}
</style>
