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
		padding: 16px;
		width: 100%;
		display: block;
		resize: vertical;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
		background-color: variables.$color-surface;
		color: variables.$color-ink;
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
			background-color: variables.$color-muted;
			pointer-events: none;
		}

		&.error {
			border-color: variables.$color-error;
		}
	}

	&__title {
		position: absolute;
		left: 16px;
		top: 18px;
		color: variables.$color-ink-soft;
		cursor: text;
		pointer-events: none;
		transition: all 0.3s ease-in-out;
	}

	&__field:focus + &__title,
	&__field:not(:placeholder-shown) + &__title {
		padding: 0 6px;
		transform: translateY(-30px);
		font-size: 12px;
		border-radius: 4px;
		background-color: variables.$color-surface;
		color: variables.$color-accent;
	}

	&__error-message {
		margin-top: 4px;
		display: block;
		color: variables.$color-error;
	}
}

.label-textarea-wrapper {
	pointer-events: all;

	&.disabled {
		opacity: 0.6;
		pointer-events: none;
	}
}
</style>
