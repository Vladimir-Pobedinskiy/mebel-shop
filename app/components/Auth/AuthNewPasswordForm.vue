<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { IAuthFormResponse } from '~~/interfaces/auth/IAuthPage'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { useToaster } from '@/composables/useToaster'

const { submitForm } = useFormSubmit()
const { showToast } = useToaster()
const route = useRoute()

// Почта приходит с шага восстановления — показываем, для какого аккаунта меняем пароль
const email = computed(() => String(route.query.email || ''))

const validationSchema = yup.object({
	password: yup.string().required('Придумайте пароль').min(8, 'Пароль не короче 8 символов'),
	repeatPassword: yup
		.string()
		.required('Повторите пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
})

const { handleSubmit } = useForm({
	validationSchema,
	initialValues: { password: '', repeatPassword: '' },
})

const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: repeatPassword, errorMessage: repeatPasswordError } = useField<string>('repeatPassword')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm<IAuthFormResponse>(
			'/api/new-password-request/',
			{ ...values, email: email.value },
			{ success: true, message: 'Пароль изменён. Войдите с новым паролем.' }
		)

		showToast({ title: 'Пароль изменён', text: 'Войдите с новым паролем' })
		await navigateTo('/login/')
	} catch {
		showToast({ title: 'Не удалось сменить пароль', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})
</script>

<template>
	<form class="auth-form" novalidate @submit="onSubmit">
		<p v-if="email" class="auth-form__bottom text-s">
			Меняем пароль для <span class="auth-form__email">{{ email }}</span>
		</p>

		<UIInput
			v-model:value="password"
			name="password"
			type="password"
			placeholder="Новый пароль"
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

		<UIButton
			as="button"
			type="submit"
			:label="isSending ? 'Сохраняем…' : 'Сохранить пароль'"
			:disabled="isSending"
			full
		/>

		<p class="auth-form__bottom text-s">
			<NuxtLink class="auth-form__link hover-link" to="/login/">Вернуться ко входу</NuxtLink>
		</p>
	</form>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.auth-form {
	&__email {
		color: variables.$color-ink;
		white-space: nowrap;
	}
}
</style>
