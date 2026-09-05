<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useGeneralStore } from '@/stores/storeGeneral'
import { useToaster } from '@/composables/useToaster'
import { useFormSubmit } from '@/composables/useFormSubmit'

withDefaults(
	defineProps<{
		/** подпись под заголовком: что именно пришлём и когда */
		note?: string
	}>(),
	{
		note: '',
	}
)

const isOpen = defineModel<boolean>('modelValue', { default: false })

const storeGeneral = useGeneralStore()
const contacts = computed(() => storeGeneral.contacts)

const { showToast } = useToaster()

const { submitForm } = useFormSubmit()

/* Прайс уходит на почту, поэтому e-mail и компания обязательны: по ним менеджер
   считает условия под объём дилера */
const validationSchema = yup.object({
	company: yup.string().required('Укажите название компании').min(2, 'Слишком короткое название'),
	name: yup.string().required('Укажите контактное лицо').min(2, 'Слишком короткое имя'),
	email: yup.string().required('Укажите почту для прайса').email('Проверьте адрес электронной почты'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	city: yup.string().max(60, 'Не больше 60 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { company: '', name: '', email: '', phone: '', city: '', agreement: false },
})

const { value: company, errorMessage: companyError } = useField<string>('company')
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: city, errorMessage: cityError } = useField<string>('city')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		const response = await submitForm('/api/price-request/', values, {
			success: true,
			message: 'Прайс-лист отправлен на указанную почту. Если письма нет — проверьте папку «Спам».',
		})

		showToast({
			title: 'Прайс отправлен',
			text: response?.message || contacts.value?.replyTime || 'Ответим в течение 15 минут в рабочее время',
		})
		resetForm()
		isOpen.value = false
	} catch {
		showToast({ title: 'Не удалось отправить прайс', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})
</script>

<template>
	<UIModal
		v-model="isOpen"
		modal-id="price-request"
		name="price-request"
		size="small"
		:is-loading="isSending"
		lock-scroll
	>
		<template #header>
			<p class="modal-price-request__title h4">Прислать прайс на e-mail</p>
			<p class="modal-price-request__subtitle text-s">
				{{ note || 'Пришлём оптовый прайс на корпусную мебель и условия под ваш объём.' }}
			</p>
		</template>

		<template #body>
			<form class="modal-price-request__form" novalidate @submit="onSubmit">
				<UIInput
					v-model:value="company"
					name="company"
					placeholder="Компания"
					autocomplete="organization"
					:error-value="companyError"
				/>

				<UIInput
					v-model:value="name"
					name="name"
					placeholder="Контактное лицо"
					autocomplete="name"
					:error-value="nameError"
				/>

				<UIInput
					v-model:value="email"
					name="email"
					type="email"
					placeholder="Электронная почта"
					autocomplete="email"
					:error-value="emailError"
				/>

				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>

				<UIInput
					v-model:value="city"
					name="city"
					placeholder="Город"
					autocomplete="address-level2"
					:error-value="cityError"
				/>

				<UICheckbox v-model="agreement" name="price-request-agreement" :error-value="agreementError">
					<template #content>
						<span class="modal-price-request__note text-xs">Согласен на обработку персональных данных</span>
					</template>
				</UICheckbox>

				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Прислать прайс'"
					:disabled="isSending"
					full
					show-icon
				/>

				<p class="modal-price-request__reply text-xs">
					{{ contacts?.replyTime || 'Ответим в течение 15 минут в рабочее время' }}.
				</p>
			</form>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-price-request {
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
