<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { IProductDetails } from '~~/interfaces/product/IProduct'
import { useToaster } from '@/composables/useToaster'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { priceFormatter } from '@/utils/utils'

const props = defineProps<{
	product: IProductDetails
}>()

const { showToast } = useToaster()

const { submitForm } = useFormSubmit()

/* Расчёт по модели: те же правила, что в форме раздела, плюс размеры проёма —
   без них конструктор не посчитает смету */
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

const benefits = computed(() => [
	'Замер бесплатный, выезд в удобное время',
	'3D-проект и смета за два рабочих дня',
	`Цена базовой конфигурации — от ${priceFormatter(props.product.price)}`,
	'Стоимость фиксируется в договоре и не растёт',
])

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm(
			'/api/calculate-project/',
			{ ...values, subject: props.product.title, productUrl: props.product.url },
			{ success: true, message: 'Заявка на дизайн-проект принята.' }
		)

		showToast({ title: 'Заявка на расчёт принята', text: 'Пришлём смету в течение рабочего дня' })
		resetForm()
	} catch {
		showToast({ title: 'Не удалось отправить заявку', text: 'Попробуйте ещё раз или позвоните нам', type: 'error' })
	} finally {
		isSending.value = false
	}
})
</script>

<template>
	<section class="product-request">
		<div class="product-request__body">
			<h2 class="product-request__title h3">Получить расчёт «{{ product.title }}»</h2>
			<p class="product-request__text text-m">
				Пришлите размеры проёма — конструктор соберёт конфигурацию под вашу нишу и посчитает точную стоимость.
			</p>

			<ul class="product-request__benefits">
				<li v-for="benefit in benefits" :key="benefit" class="product-request__benefit text-s">
					<NuxtIcon class="product-request__benefit-icon" name="icon-check" filled />
					<span>{{ benefit }}</span>
				</li>
			</ul>
		</div>

		<form class="product-request__form" novalidate @submit="onSubmit">
			<UIInput v-model:value="name" name="name" placeholder="Ваше имя" autocomplete="name" :error-value="nameError" />

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
				placeholder="Размеры проёма, мм: ширина × глубина × высота"
				:error-value="sizeError"
			/>

			<UITextarea
				v-model:value="comment"
				name="comment"
				placeholder="Что важно учесть: наполнение, материал фасадов, антресоль"
				:rows="3"
				:error-value="commentError"
			/>

			<UICheckbox v-model="agreement" name="product-request-agreement" :error-value="agreementError">
				<template #content>
					<span class="product-request__note text-xs">Согласен на обработку персональных данных</span>
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

			<p class="product-request__reply text-xs">Ответим в течение 15 минут в рабочее время.</p>
		</form>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-request {
	display: grid;
	grid-template-columns: 1fr;
	gap: 28px;
	padding: 28px 20px;
	background-color: variables.$color-muted;
	border-radius: variables.$radius-l;

	@media (min-width: variables.$desktop-small) {
		grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
		gap: 48px;
		padding: 48px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__benefits {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 20px;
	}

	&__benefit {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		color: variables.$color-ink-soft;
	}

	&__benefit-icon {
		flex: 0 0 auto;
		width: 18px;
		height: 18px;
		color: variables.$color-accent;
	}

	&__form {
		display: grid;
		gap: 16px;
		padding: 24px 20px;
		background-color: variables.$color-surface;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$desktop-small) {
			padding: 32px;
		}
	}

	&__reply {
		margin: 0;
		color: variables.$color-ink-soft;
		text-align: center;
	}
}
</style>
