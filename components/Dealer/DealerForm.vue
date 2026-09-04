<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

withDefaults(
	defineProps<{
		note?: string
	}>(),
	{
		note: 'Менеджер по партнёрам свяжется с вами в течение рабочего дня.',
	}
)

/* Дилерская заявка: к контактам добавляются компания, город и формат работы */
const validationSchema = yup.object({
	company: yup.string().required('Укажите название компании').min(2, 'Слишком короткое название'),
	name: yup.string().required('Укажите контактное лицо').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	email: yup.string().required('Укажите почту для документов').email('Проверьте адрес электронной почты'),
	city: yup.string().required('Укажите город'),
	comment: yup.string().max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { company: '', name: '', phone: '', email: '', city: '', comment: '', agreement: false },
})

const { value: company, errorMessage: companyError } = useField<string>('company')
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: city, errorMessage: cityError } = useField<string>('city')
const { value: comment, errorMessage: commentError } = useField<string>('comment')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)
const isToastShown = ref<boolean>(false)
const toastType = ref<'success' | 'error'>('success')
const toastTitle = ref<string>('')
const toastText = ref<string>('')

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		const response = await $fetch<{ success: boolean; message: string }>('/api/become-dealer-application/', {
			method: 'POST',
			body: values,
		})

		toastType.value = 'success'
		toastTitle.value = 'Заявка отправлена'
		toastText.value = response?.message || 'Менеджер по партнёрам свяжется с вами'
		resetForm()
	} catch {
		toastType.value = 'error'
		toastTitle.value = 'Не удалось отправить заявку'
		toastText.value = 'Попробуйте ещё раз или напишите на partners@mebel-shop.ru'
	} finally {
		isSending.value = false
		isToastShown.value = true
	}
})
</script>

<template>
	<div class="dealer-form">
		<div class="dealer-form__head">
			<h2 class="dealer-form__title h3">Заявка на сотрудничество</h2>
			<p class="dealer-form__text text-m">
				Расскажите о компании — пришлём прайс, матрицу скидок и условия под ваш объём.
			</p>
		</div>

		<form class="dealer-form__form" novalidate @submit="onSubmit">
			<div class="dealer-form__field">
				<UIInput
					v-model:value="company"
					name="company"
					placeholder="Компания"
					autocomplete="organization"
					:error-value="companyError"
				/>
			</div>

			<div class="dealer-form__field">
				<UIInput
					v-model:value="name"
					name="name"
					placeholder="Контактное лицо"
					autocomplete="name"
					:error-value="nameError"
				/>
			</div>

			<div class="dealer-form__field">
				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>
			</div>

			<div class="dealer-form__field">
				<UIInput
					v-model:value="email"
					name="email"
					type="email"
					placeholder="Электронная почта"
					autocomplete="email"
					:error-value="emailError"
				/>
			</div>

			<div class="dealer-form__field dealer-form__field_full">
				<UIInput
					v-model:value="city"
					name="city"
					placeholder="Город"
					autocomplete="address-level2"
					:error-value="cityError"
				/>
			</div>

			<div class="dealer-form__field dealer-form__field_full">
				<UITextarea
					v-model:value="comment"
					name="comment"
					placeholder="Формат работы: салон, дизайн-студия, застройщик, планируемый объём"
					:rows="3"
					:error-value="commentError"
				/>
			</div>

			<div class="dealer-form__field dealer-form__field_full">
				<UICheckbox v-model="agreement" name="agreement" :error-value="agreementError">
					<template #content>
						<span class="dealer-form__note text-xs">{{ note }}</span>
					</template>
				</UICheckbox>
			</div>

			<div class="dealer-form__field dealer-form__field_full">
				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Отправить заявку'"
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

.dealer-form {
	padding: 28px 20px;
	border: 1px solid variables.$color-line;
	border-radius: variables.$radius-l;
	background-color: variables.$color-surface;

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
