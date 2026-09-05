<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		type?: 'text' | 'password' | 'number' | 'email' | 'tel'
		name: string
		placeholder?: string
		min?: number
		max?: number
		errorValue?: string
		disabled?: boolean
		autocomplete?: string
	}>(),
	{
		type: 'text',
		placeholder: ' ',
		min: 0,
		max: 1000000000000,
		errorValue: '',
		disabled: false,
		autocomplete: 'on',
	}
)

const value = defineModel<string | number>('value')

const isShowPassword = ref<boolean>(false)
const togglePasswordVisibility = () => {
	if (props.type !== 'password') return
	isShowPassword.value = !isShowPassword.value
}

// В числовом поле запрещаем всё, кроме цифр и запятой
const preventInvalidKeys = (event: KeyboardEvent) => {
	if (props.type !== 'number') return

	const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ',']
	if (allowedKeys.includes(event.key)) return

	if (!/^\d$/.test(event.key) && event.key !== ',') event.preventDefault()

	if (event.target instanceof HTMLInputElement && Number(event.target.value) >= props.max) {
		event.target.value = props.max.toString()
	}
}
</script>

<template>
	<div :class="['label-input-wrapper', { error: errorValue }, { disabled: disabled }]">
		<div class="label-input-box">
			<label class="label-input">
				<input
					v-model="value"
					v-imask="type === 'tel' ? { mask: '+7 (000) 000-00-00' } : undefined"
					:type="type !== 'password' ? type : isShowPassword ? 'text' : 'password'"
					:name="name"
					:placeholder="type === 'tel' ? '+7 ' : ' '"
					:max="type === 'number' ? max : undefined"
					:min="type === 'number' ? min : undefined"
					:autocomplete="autocomplete"
					:class="['label-input__input input-text', { error: errorValue }]"
					:disabled="disabled"
					@keydown="preventInvalidKeys"
				/>
				<span class="label-input__title input-text">{{ placeholder }}</span>
			</label>

			<button
				v-if="type === 'password'"
				class="toggle-password-visibility-btn"
				type="button"
				:aria-label="isShowPassword ? 'Скрыть пароль' : 'Показать пароль'"
				:disabled="disabled"
				@click="togglePasswordVisibility"
			>
				<template v-if="isShowPassword">
					<NuxtIcon class="icon-eye-password" name="icon-eye-input-password" filled />
				</template>
				<template v-else>
					<NuxtIcon class="icon-eye-password-hidden" name="icon-eye-input-password-hidden" filled />
				</template>
			</button>
		</div>

		<span v-if="errorValue" class="label-input__error-message text-xs">{{ errorValue }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.label-input {
	position: relative;
	display: block;
	width: 100%;
	height: 52px;

	&__input {
		width: 100%;
		height: 52px;
		padding: 14px 16px;
		color: variables.$color-ink;
		pointer-events: all;
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
			cursor: default;
			background-color: variables.$color-muted;
		}

		&.error {
			border-color: variables.$color-error;
		}
	}

	&__title {
		position: absolute;
		top: 50%;
		left: 16px;
		display: block;
		color: variables.$color-ink-soft;
		pointer-events: none;
		cursor: text;
		background-color: transparent;
		transform: translateY(-50%);
		transition: all 0.3s ease-in-out;
		will-change: transform;
	}

	&__input:focus + &__title,
	&__input:not(:placeholder-shown) + &__title {
		padding: 0 6px;
		font-size: 12px;
		color: variables.$color-accent;
		background-color: variables.$color-surface;
		border-radius: 4px;
		transform: translateY(-36px);
	}

	&__error-message {
		display: block;
		margin-top: 4px;
		color: variables.$color-error;
	}
}

.label-input-wrapper {
	pointer-events: all;
	background-color: transparent;

	&.disabled {
		pointer-events: none;
		opacity: 0.6;

		.label-input__title {
			cursor: default;
		}
	}
}

.label-input-box {
	position: relative;
}

.toggle-password-visibility-btn {
	position: absolute;
	top: 50%;
	right: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	color: variables.$color-ink-soft;
	cursor: pointer;
	background-color: transparent;
	transform: translateY(-50%);

	.icon-eye-password,
	.icon-eye-password-hidden {
		width: 20px;
		height: 20px;
	}
}

/* скрываем у input[type="tel"] placeholder в обычном состоянии */
[type='tel']::placeholder {
	font-size: 0;
	transition: font-size 0.3s ease;
}

input[type='tel']:focus::placeholder {
	font-size: 16px;
	transition: font-size 0.3s ease;
}

/* убираем стрелки у input[type="number"] */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	margin: 0;
	appearance: none;
}

input[type='number'] {
	appearance: textfield;
}
</style>
