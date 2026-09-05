<script setup lang="ts">
import type { IAuthFormResponse } from '~~/interfaces/auth/IAuthPage'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { useToaster } from '@/composables/useToaster'

/* Подтверждение почты кодом. Второй шаг регистрации и восстановления пароля:
   до ввода кода аккаунт не создаётся и пароль не меняется. */
const props = withDefaults(
	defineProps<{
		email: string
		/** какой сценарий подтверждаем — от этого зависят подписи */
		formKey?: 'registration' | 'password-recovery'
	}>(),
	{
		formKey: 'registration',
	}
)

const emits = defineEmits<{
	(e: 'success', regToken: string): void
}>()

const isOpen = defineModel<boolean>('modelValue', { default: false })

const CODE_LENGTH = 4
const RESEND_SECONDS = 60

const { submitForm, isStaticDemo } = useFormSubmit()
const { showToast } = useToaster()

const code = ref<string>('')
const codeError = ref<string>('')
const isSending = ref<boolean>(false)

/* Обратный отсчёт до повторной отправки: держим таймер здесь, а не в сторе —
   он живёт ровно столько, сколько открыта модалка */
const secondsLeft = ref<number>(RESEND_SECONDS)
let timerId: ReturnType<typeof setInterval> | null = null

const stopTimer = () => {
	if (timerId) {
		clearInterval(timerId)
		timerId = null
	}
}

const startTimer = () => {
	stopTimer()
	secondsLeft.value = RESEND_SECONDS
	timerId = setInterval(() => {
		secondsLeft.value -= 1
		if (secondsLeft.value <= 0) stopTimer()
	}, 1000)
}

const canResend = computed(() => secondsLeft.value <= 0)

const title = computed(() => (props.formKey === 'registration' ? 'Подтвердите почту' : 'Введите код из письма'))

const onSubmit = async () => {
	if (code.value.length < CODE_LENGTH) {
		codeError.value = `Код состоит из ${CODE_LENGTH} цифр`
		return
	}

	codeError.value = ''
	isSending.value = true

	try {
		const response = await submitForm<IAuthFormResponse>(
			'/api/code-verification-request/',
			{ email: props.email, code: code.value },
			{ success: true, message: 'Почта подтверждена.', regToken: 'demo-reg-token-mebel-shop' }
		)

		emits('success', response?.regToken || '')
		code.value = ''
	} catch {
		codeError.value = 'Неверный код. Проверьте письмо и попробуйте ещё раз'
	} finally {
		isSending.value = false
	}
}

const onResend = async () => {
	if (!canResend.value || isSending.value) return

	isSending.value = true

	try {
		await submitForm('/api/repeat-code-verification-request/', { email: props.email }, {
			success: true,
			message: 'Новый код отправлен на почту.',
		} as IAuthFormResponse)

		startTimer()
		showToast({ title: 'Код отправлен повторно', text: `Письмо ушло на ${props.email}` })
	} catch {
		showToast({ title: 'Не удалось отправить код', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
}

// Отсчёт начинаем при каждом открытии, а на закрытии гасим и чистим поле
watch(isOpen, opened => {
	if (opened) {
		code.value = ''
		codeError.value = ''
		startTimer()
	} else {
		stopTimer()
	}
})

onBeforeUnmount(stopTimer)
</script>

<template>
	<UIModal v-model="isOpen" modal-id="code-verification" name="code-verification" size="small" :is-loading="isSending">
		<template #header>
			<p class="modal-code__title h4">{{ title }}</p>
			<p class="modal-code__subtitle text-s">
				Отправили код на <span class="modal-code__email">{{ email }}</span
				>. Введите его, чтобы продолжить.
			</p>
		</template>

		<template #body>
			<form class="modal-code__form" novalidate @submit.prevent="onSubmit">
				<UICodeInput v-model:value="code" :length="CODE_LENGTH" :error-value="codeError" :disabled="isSending" />

				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Проверяем…' : 'Подтвердить'"
					:disabled="isSending"
					full
				/>

				<button
					v-if="canResend"
					class="modal-code__resend text-s hover-link"
					type="button"
					:disabled="isSending"
					@click="onResend"
				>
					Отправить код ещё раз
				</button>
				<p v-else class="modal-code__timer text-xs">Отправить код повторно можно через {{ secondsLeft }} с</p>

				<p v-if="isStaticDemo" class="modal-code__demo text-xs">
					Витрина демонстрационная: письма не уходят, подойдёт любой код из {{ CODE_LENGTH }} цифр.
				</p>
			</form>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-code {
	&__title {
		margin: 0 0 8px;
	}

	&__subtitle {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__email {
		color: variables.$color-ink;
		white-space: nowrap;
	}

	&__form {
		display: grid;
		gap: 20px;
	}

	&__resend {
		color: variables.$color-accent;
		text-align: center;
		cursor: pointer;
		background: none;
		border: none;
	}

	&__timer,
	&__demo {
		margin: 0;
		color: variables.$color-ink-soft;
		text-align: center;
	}
}
</style>
