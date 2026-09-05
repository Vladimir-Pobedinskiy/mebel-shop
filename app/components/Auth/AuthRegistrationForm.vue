<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { IAuthFormResponse } from '~~/interfaces/auth/IAuthPage'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { useToaster } from '@/composables/useToaster'

const { submitForm, isStaticDemo } = useFormSubmit()
const { showToast } = useToaster()
const { signUp } = useAuth()

/* Правила для имени разбирают частые опечатки по отдельности, чтобы человек
   видел, что именно не так, а не общее «неверный формат» */
const validationSchema = yup.object({
	name: yup
		.string()
		.required('Укажите, как к вам обращаться')
		.max(50, 'Не больше 50 символов')
		.matches(/^\S(.*\S)?$/, 'Имя не может начинаться или заканчиваться пробелом')
		.matches(/^(?!.*\s{2,}).*$/, 'Уберите лишние пробелы между словами')
		.matches(/^(?!.*\d).*$/, 'Имя не может содержать цифры')
		.matches(/^(?!.*[a-zA-Z]).*$/, 'Укажите имя кириллицей')
		.matches(/^(?!.*["'<>;:.,{}[\]|&#%?=+^~/\\-]).*$/, 'Имя не может содержать спецсимволы'),
	email: yup.string().required('Укажите электронную почту').email('Проверьте формат почты'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	password: yup.string().required('Придумайте пароль').min(8, 'Пароль не короче 8 символов'),
	repeatPassword: yup
		.string()
		.required('Повторите пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, values, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', email: '', phone: '', password: '', repeatPassword: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: repeatPassword, errorMessage: repeatPasswordError } = useField<string>('repeatPassword')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)
const isCodeModalOpen = ref<boolean>(false)

/* Шаг 1: данные уходят на проверку, аккаунт ещё не создаётся —
   сначала подтверждаем почту кодом */
const onSubmit = handleSubmit(async formValues => {
	isSending.value = true

	try {
		await submitForm<IAuthFormResponse>('/api/register/', formValues, {
			success: true,
			message: 'Код подтверждения отправлен на указанную почту.',
		})

		isCodeModalOpen.value = true
	} catch {
		showToast({ title: 'Не удалось начать регистрацию', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})

/* Шаг 2: код подтверждён — создаём аккаунт и уходим на страницу успеха */
const onCodeConfirmed = async (regToken: string) => {
	isCodeModalOpen.value = false
	isSending.value = true

	try {
		if (isStaticDemo.value) {
			resetForm()
			await navigateTo('/success-registration/')
			return
		}

		await signUp(
			{
				name: values.name,
				email: values.email,
				phone: values.phone,
				password: values.password,
				repeatPassword: values.repeatPassword,
				agreement: values.agreement,
				regToken,
			},
			{ callbackUrl: '/success-registration/', redirect: true }
		)

		resetForm()
	} catch {
		showToast({ title: 'Не удалось завершить регистрацию', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
}
</script>

<template>
	<form class="auth-form" novalidate @submit="onSubmit">
		<UIInput
			v-model:value="name"
			name="name"
			placeholder="Имя и фамилия"
			autocomplete="name"
			:error-value="nameError"
			:disabled="isSending"
		/>

		<UIInput
			v-model:value="email"
			name="email"
			type="email"
			placeholder="Электронная почта"
			autocomplete="email"
			:error-value="emailError"
			:disabled="isSending"
		/>

		<UIInput
			v-model:value="phone"
			name="phone"
			type="tel"
			placeholder="Телефон"
			autocomplete="tel"
			:error-value="phoneError"
			:disabled="isSending"
		/>

		<UIInput
			v-model:value="password"
			name="password"
			type="password"
			placeholder="Пароль"
			autocomplete="new-password"
			:error-value="passwordError"
			:disabled="isSending"
		/>

		<UIInput
			v-model:value="repeatPassword"
			name="repeatPassword"
			type="password"
			placeholder="Повторите пароль"
			autocomplete="new-password"
			:error-value="repeatPasswordError"
			:disabled="isSending"
		/>

		<UICheckbox v-model="agreement" name="registration-agreement" :error-value="agreementError" :disabled="isSending">
			<template #content>
				<span class="auth-form__agreement text-xs">
					Согласен на обработку персональных данных в соответствии с
					<NuxtLink class="auth-form__link hover-link" to="/privacy-policy/" target="_blank">
						политикой конфиденциальности
					</NuxtLink>
				</span>
			</template>
		</UICheckbox>

		<UIButton
			as="button"
			type="submit"
			:label="isSending ? 'Отправляем…' : 'Зарегистрироваться'"
			:disabled="isSending"
			full
		/>

		<p class="auth-form__bottom text-s">
			Уже есть аккаунт?
			<NuxtLink class="auth-form__link hover-link" to="/login/">Войти</NuxtLink>
		</p>

		<ModalCode v-model="isCodeModalOpen" :email="email" form-key="registration" @success="onCodeConfirmed" />
	</form>
</template>
