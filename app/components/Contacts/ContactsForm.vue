<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useFormSubmit } from '@/composables/useFormSubmit'

withDefaults(
	defineProps<{
		title?: string
		text?: string
		note?: string
	}>(),
	{
		title: 'Задать вопрос',
		text: '',
		note: 'Нажимая кнопку, я соглашаюсь с политикой обработки персональных данных',
	}
)

/* Обратная связь: те же правила, что и в форме дизайн-проекта на главной */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	email: yup.string().email('Проверьте адрес электронной почты'),
	message: yup.string().required('Напишите вопрос').max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', email: '', message: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: message, errorMessage: messageError } = useField<string>('message')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const { submitForm } = useFormSubmit()
const isToastShown = ref<boolean>(false)
const toastType = ref<'success' | 'error'>('success')
const toastTitle = ref<string>('')
const toastText = ref<string>('')

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		const response = await submitForm('/api/ask-question/', values, {
			success: true,
			message: 'Спасибо! Мы получили вопрос и ответим в течение 15 минут.',
		})

		toastType.value = 'success'
		toastTitle.value = 'Вопрос отправлен'
		toastText.value = response?.message || 'Мы ответим в рабочее время'
		resetForm()
	} catch {
		toastType.value = 'error'
		toastTitle.value = 'Не удалось отправить вопрос'
		toastText.value = 'Попробуйте ещё раз или позвоните нам'
	} finally {
		isSending.value = false
		isToastShown.value = true
	}
})
</script>

<template>
	<div class="contacts-form">
		<div class="contacts-form__head">
			<h2 class="contacts-form__title h3">{{ title }}</h2>
			<p v-if="text" class="contacts-form__text text-m">{{ text }}</p>
		</div>

		<form class="contacts-form__form" novalidate @submit="onSubmit">
			<div class="contacts-form__field">
				<UIInput v-model:value="name" name="name" placeholder="Ваше имя" autocomplete="name" :error-value="nameError" />
			</div>

			<div class="contacts-form__field">
				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>
			</div>

			<div class="contacts-form__field contacts-form__field_full">
				<UIInput
					v-model:value="email"
					name="email"
					type="email"
					placeholder="Электронная почта (необязательно)"
					autocomplete="email"
					:error-value="emailError"
				/>
			</div>

			<div class="contacts-form__field contacts-form__field_full">
				<UITextarea
					v-model:value="message"
					name="message"
					placeholder="Вопрос: модель, номер заказа, город"
					:rows="4"
					:error-value="messageError"
				/>
			</div>

			<div class="contacts-form__field contacts-form__field_full">
				<UICheckbox v-model="agreement" name="agreement" :error-value="agreementError">
					<template #content>
						<span class="contacts-form__note text-xs">{{ note }}</span>
					</template>
				</UICheckbox>
			</div>

			<div class="contacts-form__field contacts-form__field_full">
				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Отправить вопрос'"
					:disabled="isSending"
					show-icon
				/>
			</div>
		</form>

		<UIToast v-model="isToastShown" :type="toastType" :title="toastTitle" :text="toastText" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.contacts-form {
	padding: 28px 20px;
	background-color: variables.$color-surface;
	border: 1px solid variables.$color-line;
	border-radius: variables.$radius-l;

	@media (min-width: variables.$desktop) {
		padding: 40px;
	}

	&__head {
		margin-bottom: 24px;
	}

	&__title {
		margin: 0 0 10px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__form {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__field_full {
		@media (min-width: variables.$mobile-big) {
			grid-column: 1 / -1;
		}
	}

	&__note {
		color: variables.$color-ink-soft;
	}
}
</style>
