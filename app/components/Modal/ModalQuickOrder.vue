<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { IProduct } from '~~/interfaces/product/IProduct'
import { useToaster } from '@/composables/useToaster'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { priceFormatter } from '@/utils/utils'

const props = defineProps<{
	product: IProduct
}>()

const isOpen = defineModel<boolean>('modelValue', { default: false })

const { showToast } = useToaster()

const { submitForm } = useFormSubmit()

/* Быстрый заказ: только имя и телефон, остальное менеджер уточняет по звонку */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm(
			'/api/callback/',
			{ ...values, product: props.product.title, productUrl: props.product.url },
			{ success: true, message: 'Заявка принята, менеджер перезвонит в ближайшее время.' }
		)

		showToast({ title: 'Заказ принят', text: 'Ответим в течение 15 минут в рабочее время' })
		resetForm()
		isOpen.value = false
	} catch {
		showToast({ title: 'Не удалось отправить заказ', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})
</script>

<template>
	<UIModal v-model="isOpen" modal-id="quick-order" name="quick-order" size="small" :is-loading="isSending" lock-scroll>
		<template #header>
			<p class="modal-quick-order__title h4">Быстрый заказ</p>
		</template>

		<template #body>
			<div class="modal-quick-order__product">
				<NuxtImg
					class="modal-quick-order__img"
					:src="product.img.url"
					:alt="product.img.alt"
					loading="lazy"
					sizes="xs:20vw sm:20vw md:10vw"
				/>

				<div class="modal-quick-order__product-body">
					<p class="modal-quick-order__product-title title-14">{{ product.title }}</p>
					<p class="modal-quick-order__product-price text-s">
						<template v-if="product.priceFrom">от </template>{{ priceFormatter(product.price) }}
					</p>
				</div>
			</div>

			<form class="modal-quick-order__form" novalidate @submit="onSubmit">
				<UIInput v-model:value="name" name="name" placeholder="Имя" autocomplete="name" :error-value="nameError" />

				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>

				<UICheckbox v-model="agreement" name="quick-order-agreement" :error-value="agreementError">
					<template #content>
						<span class="modal-quick-order__note text-xs">Согласен на обработку персональных данных</span>
					</template>
				</UICheckbox>

				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Заказать в один клик'"
					:disabled="isSending"
					full
					show-icon
				/>

				<p class="modal-quick-order__reply text-xs">Перезвоним в течение 15 минут в рабочее время.</p>
			</form>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-quick-order {
	&__title {
		margin: 0;
	}

	&__product {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid variables.$color-line;
		gap: 14px;
	}

	&__img {
		width: 72px;
		height: 72px;
		flex: 0 0 auto;
		border-radius: variables.$radius-s;
		background-color: variables.$color-muted;
		object-fit: cover;
	}

	&__product-title {
		margin: 0 0 4px;
	}

	&__product-price {
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
