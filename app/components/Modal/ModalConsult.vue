<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useToaster } from '@/composables/useToaster'
import { useFormSubmit } from '@/composables/useFormSubmit'

withDefaults(
	defineProps<{
		/** к какому разделу или товару относится запрос — уходит в тексте заявки */
		subject?: string
	}>(),
	{
		subject: '',
	}
)

const isOpen = defineModel<boolean>('modelValue', { default: false })

const { showToast } = useToaster()

const { submitForm } = useFormSubmit()

/* Консультация из каталога: минимум полей — имя, телефон и вопрос */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	comment: yup.string().max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', comment: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: comment, errorMessage: commentError } = useField<string>('comment')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm('/api/ask-question/', values, {
			success: true,
			message: 'Спасибо! Мы получили вопрос и ответим в течение 15 минут.',
		})

		showToast({ title: 'Заявка отправлена', text: 'Ответим в течение 15 минут в рабочее время' })
		resetForm()
		isOpen.value = false
	} catch {
		showToast({ title: 'Не удалось отправить заявку', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})
</script>

<template>
	<UIModal v-model="isOpen" modal-id="consult" name="consult" size="small" :is-loading="isSending" lock-scroll>
		<template #header>
			<p class="modal-consult__title h4">Запросить консультацию</p>
			<p class="modal-consult__subtitle text-s">
				Подберём модель под ваш проём и бюджет.
				<template v-if="subject">Вопрос по разделу «{{ subject }}».</template>
			</p>
		</template>

		<template #body>
			<form class="modal-consult__form" novalidate @submit="onSubmit">
				<UIInput v-model:value="name" name="name" placeholder="Имя" autocomplete="name" :error-value="nameError" />

				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>

				<UITextarea
					v-model:value="comment"
					name="comment"
					placeholder="Что нужно подобрать: размеры проёма, стиль, бюджет"
					:rows="3"
					:error-value="commentError"
				/>

				<UICheckbox v-model="agreement" name="consult-agreement" :error-value="agreementError">
					<template #content>
						<span class="modal-consult__note text-xs">Согласен на обработку персональных данных</span>
					</template>
				</UICheckbox>

				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Получить консультацию'"
					:disabled="isSending"
					full
					show-icon
				/>

				<p class="modal-consult__reply text-xs">Ответим в течение 15 минут в рабочее время.</p>
			</form>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-consult {
	&__title {
		margin: 0 0 8px;
	}

	&__subtitle {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__form {
		display: grid;
		gap: 16px;
	}

	&__reply {
		margin: 0;
		color: variables.$color-ink-soft;
		text-align: center;
	}
}
</style>
