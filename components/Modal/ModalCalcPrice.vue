<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useGeneralStore } from '@/stores/storeGeneral'
import { useToaster } from '@/composables/useToaster'

const props = withDefaults(
	defineProps<{
		/** раздел или модель, из которых открыли расчёт — уходит в тело заявки */
		subject?: string
	}>(),
	{
		subject: '',
	}
)

const isOpen = defineModel<boolean>('modelValue', { default: false })

const storeGeneral = useGeneralStore()
const contacts = computed(() => storeGeneral.contacts)

const { showToast } = useToaster()

/* Расчёт стоимости: без размеров проёма считать нечего, поэтому поле обязательное */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	size: yup.string().required('Укажите размеры проёма').max(120, 'Не больше 120 символов'),
	comment: yup.string().max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', size: '', comment: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: size, errorMessage: sizeError } = useField<string>('size')
const { value: comment, errorMessage: commentError } = useField<string>('comment')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await $fetch('/api/calculate-project/', { method: 'POST', body: { ...values, subject: props.subject } })

		showToast({
			title: 'Заявка на расчёт принята',
			text: contacts.value?.replyTime || 'Ответим в течение 15 минут в рабочее время',
		})
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
	<UIModal v-model="isOpen" modal-id="calc-price" name="calc-price" size="small" :is-loading="isSending" lock-scroll>
		<template #header>
			<p class="modal-calc-price__title h4">Рассчитать стоимость</p>
			<p class="modal-calc-price__subtitle text-s">
				Посчитаем по вашим размерам и покажем, из чего складывается цена.
				<template v-if="subject">Расчёт по «{{ subject }}».</template>
			</p>
		</template>

		<template #body>
			<form class="modal-calc-price__form" novalidate @submit="onSubmit">
				<UIInput v-model:value="name" name="name" placeholder="Имя" autocomplete="name" :error-value="nameError" />

				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>

				<UIInput
					v-model:value="size"
					name="size"
					placeholder="Размеры проёма, мм — например, 2400 × 600 × 2500"
					autocomplete="off"
					:error-value="sizeError"
				/>

				<UITextarea
					v-model:value="comment"
					name="comment"
					placeholder="Материалы, цвет фасадов, наполнение, бюджет"
					:rows="3"
					:error-value="commentError"
				/>

				<UICheckbox v-model="agreement" name="calc-price-agreement" :error-value="agreementError">
					<template #content>
						<span class="modal-calc-price__note text-xs">Согласен на обработку персональных данных</span>
					</template>
				</UICheckbox>

				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Получить расчёт'"
					:disabled="isSending"
					full
					show-icon
				/>

				<p class="modal-calc-price__reply text-xs">
					{{ contacts?.replyTime || 'Ответим в течение 15 минут в рабочее время' }}.
				</p>
			</form>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-calc-price {
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
