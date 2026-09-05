<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { useToaster } from '@/composables/useToaster'

const { isStaticDemo } = useFormSubmit()
const { showToast } = useToaster()
const { signIn } = useAuth()

const validationSchema = yup.object({
	email: yup.string().required('Укажите электронную почту').email('Проверьте формат почты'),
	password: yup.string().required('Введите пароль'),
})

const { handleSubmit } = useForm({
	validationSchema,
	initialValues: { email: '', password: '' },
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		/* На статической витрине бэкенда нет: сессию создавать нечем и незачем
		   притворяться, что вход состоялся. Форма честно об этом говорит */
		if (isStaticDemo.value) {
			showToast({
				title: 'Данные приняты',
				text: 'Это демонстрационная витрина без сервера — личный кабинет здесь не открывается',
			})
			return
		}

		await signIn({ email: values.email, password: values.password }, { callbackUrl: '/', redirect: true })
	} catch {
		showToast({ title: 'Не удалось войти', text: 'Проверьте почту и пароль', type: 'error' })
	} finally {
		isSending.value = false
	}
})
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

		<UIInput
			v-model:value="password"
			name="password"
			type="password"
			placeholder="Пароль"
			autocomplete="current-password"
			:error-value="passwordError"
			:disabled="isSending"
		/>

		<NuxtLink class="auth-form__link auth-form__link_right text-s hover-link" to="/password-recovery/">
			Забыли пароль?
		</NuxtLink>

		<UIButton as="button" type="submit" :label="isSending ? 'Входим…' : 'Войти'" :disabled="isSending" full />

		<p class="auth-form__bottom text-s">
			Нет аккаунта?
			<NuxtLink class="auth-form__link hover-link" to="/registration/">Зарегистрироваться</NuxtLink>
		</p>
	</form>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.auth-form {
	display: grid;
	gap: 16px;

	&__link {
		color: variables.$color-accent;

		&_right {
			justify-self: end;
			margin-top: -8px;
		}
	}

	&__bottom {
		margin: 0;
		color: variables.$color-ink-soft;
		text-align: center;
	}

	&__agreement {
		color: variables.$color-ink-soft;
	}
}
</style>
