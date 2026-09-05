<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { IAuthFormResponse } from '~~/interfaces/auth/IAuthPage'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { useToaster } from '@/composables/useToaster'

const { submitForm } = useFormSubmit()
const { showToast } = useToaster()

const validationSchema = yup.object({
	email: yup.string().required('Укажите электронную почту').email('Проверьте формат почты'),
})

const { handleSubmit } = useForm({
	validationSchema,
	initialValues: { email: '' },
})

const { value: email, errorMessage: emailError } = useField<string>('email')

const isSending = ref<boolean>(false)
const isCodeModalOpen = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm<IAuthFormResponse>('/api/password-recovery-request/', values, {
			success: true,
			message: 'Код для смены пароля отправлен на почту.',
		})

		isCodeModalOpen.value = true
	} catch {
		showToast({ title: 'Не удалось отправить код', text: 'Проверьте почту и попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})

/* Код принят — пускаем на смену пароля. Почту передаём в адресе:
   форма нового пароля показывает, для какого аккаунта его меняют */
const onCodeConfirmed = async () => {
	isCodeModalOpen.value = false
	await navigateTo({ path: '/new-password/', query: { email: email.value } })
}
</script>

<template>
	<form class="auth-form" novalidate @submit="onSubmit">
		<UIInput
			v-model:value="email"
			name="email"
			type="email"
			placeholder="Электронная почта"
			autocomplete="email"
			:error-value="emailError"
			:disabled="isSending"
		/>

		<UIButton
			as="button"
			type="submit"
			:label="isSending ? 'Отправляем…' : 'Прислать код'"
			:disabled="isSending"
			full
		/>

		<p class="auth-form__bottom text-s">
			Вспомнили пароль?
			<NuxtLink class="auth-form__link hover-link" to="/login/">Войти</NuxtLink>
		</p>

		<ModalCode v-model="isCodeModalOpen" :email="email" form-key="password-recovery" @success="onCodeConfirmed" />
	</form>
</template>
