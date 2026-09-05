<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { ICheckoutPage } from '@/interfaces/checkout/ICheckoutPage'
import type { ICheckoutOrderResponse } from '@/interfaces/checkout/ICheckoutOrderResponse'
import { useCartStore } from '@/stores/storeCart'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { priceFormatter, productsCountLabel } from '@/utils/utils'

const { data, error, status } = await useAsyncData('checkout-page', async () => $fetch<ICheckoutPage>('/api/checkout/'))
const pending = computed(() => status.value === 'pending')

const { submitForm } = useFormSubmit()

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Страница не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const storeCart = useCartStore()

/* Шаги: контакты → доставка → оплата → подтверждение */
const steps = computed(() => data.value?.steps ?? [])
const currentIndex = ref<number>(0)
const currentStep = computed(() => steps.value[currentIndex.value]?.name ?? 'contacts')
const isLastStep = computed(() => currentIndex.value === steps.value.length - 1)

/* Поля каждого шага — их и проверяем перед переходом дальше */
const stepFields: Record<string, string[]> = {
	contacts: ['name', 'phone', 'email'],
	delivery: ['deliveryType', 'city', 'address', 'date'],
	payment: ['paymentType', 'comment'],
	confirm: ['agreement'],
}

const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	email: yup.string().required('Укажите электронную почту').email('Проверьте формат почты'),
	deliveryType: yup.string().required('Выберите способ доставки'),
	city: yup.string().when('deliveryType', {
		is: (value: string) => value !== 'pickup',
		then: schema => schema.required('Укажите город'),
		otherwise: schema => schema.notRequired(),
	}),
	address: yup.string().when('deliveryType', {
		is: (value: string) => value !== 'pickup',
		then: schema => schema.required('Укажите адрес доставки'),
		otherwise: schema => schema.notRequired(),
	}),
	date: yup.string().max(60, 'Слишком длинное значение'),
	paymentType: yup.string().required('Выберите способ оплаты'),
	comment: yup.string().max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { validateField, values } = useForm({
	validationSchema,
	initialValues: {
		name: '',
		phone: '',
		email: '',
		deliveryType: 'courier',
		city: 'Москва',
		address: '',
		date: '',
		paymentType: 'card',
		comment: '',
		agreement: false,
	},
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: deliveryType, errorMessage: deliveryTypeError } = useField<string>('deliveryType')
const { value: city, errorMessage: cityError } = useField<string>('city')
const { value: address, errorMessage: addressError } = useField<string>('address')
const { value: date, errorMessage: dateError } = useField<string>('date')
const { value: paymentType, errorMessage: paymentTypeError } = useField<string>('paymentType')
const { value: comment, errorMessage: commentError } = useField<string>('comment')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isPickup = computed(() => deliveryType.value === 'pickup')

const selectedDelivery = computed(() => data.value?.deliveryTypes.find(type => type.value === deliveryType.value))
const selectedPayment = computed(() => data.value?.paymentTypes.find(type => type.value === paymentType.value))

/* Доставка бесплатна от суммы, указанной в данных страницы */
const isFreeDelivery = computed(() => storeCart.subtotal >= (data.value?.freeDeliveryFrom ?? 0))
const deliveryPrice = computed(() => (isFreeDelivery.value ? 0 : (selectedDelivery.value?.price ?? 0)))

const goToStep = (index: number) => {
	if (index < 0 || index >= steps.value.length) return
	currentIndex.value = index
}

const onPrev = () => goToStep(currentIndex.value - 1)

const onNext = async () => {
	const fields = stepFields[currentStep.value] ?? []
	const results = await Promise.all(fields.map(field => validateField(field)))

	if (results.some(result => !result.valid)) return

	goToStep(currentIndex.value + 1)
}

const isSending = ref<boolean>(false)
const isOrderPlaced = ref<boolean>(false)
const isToastShown = ref<boolean>(false)
const toastTitle = ref<string>('')
const toastText = ref<string>('')

const onSubmit = async () => {
	const results = await Promise.all(
		Object.values(stepFields)
			.flat()
			.map(field => validateField(field))
	)

	if (results.some(result => !result.valid)) {
		toastTitle.value = 'Проверьте данные заказа'
		toastText.value = 'Часть полей заполнена неверно — вернитесь к нужному шагу'
		isToastShown.value = true
		return
	}

	isSending.value = true

	try {
		const order = {
			customer: { name: values.name, phone: values.phone, email: values.email },
			delivery: {
				type: selectedDelivery.value?.label ?? '',
				city: values.city,
				address: values.address,
				date: values.date,
				price: deliveryPrice.value,
			},
			payment: selectedPayment.value?.label ?? '',
			comment: values.comment,
			items: storeCart.items,
			discount: storeCart.discount + storeCart.promoDiscount,
			total: storeCart.totalPrice + deliveryPrice.value,
		}

		const response = await submitForm<ICheckoutOrderResponse>('/api/checkout-order/', order, {
			success: true,
			message: 'Заказ оформлен',
			number: 'МШ-26-004518',
		})

		isOrderPlaced.value = true
		storeCart.clear()

		await navigateTo({ path: '/order-success/', query: { number: response?.number || undefined } })
	} catch {
		toastTitle.value = 'Не удалось оформить заказ'
		toastText.value = 'Попробуйте ещё раз или позвоните нам — оформим по телефону'
		isToastShown.value = true
	} finally {
		isSending.value = false
	}
}
</script>

<template>
	<div class="checkout-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="checkout-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<h1 class="checkout-page__title h1">{{ data.seo.h1 }}</h1>

				<!-- Состав заказа лежит в localStorage — оформление рендерим только на клиенте -->
				<ClientOnly>
					<div v-if="!storeCart.isEmpty || isOrderPlaced" class="checkout-page__layout">
						<div class="checkout-page__main">
							<CheckoutSteps
								class="checkout-page__steps"
								:steps="data.steps"
								:current-index="currentIndex"
								@go="goToStep"
							/>

							<form class="checkout-page__form" novalidate @submit.prevent="isLastStep ? onSubmit() : onNext()">
								<!-- Шаг 1: контакты -->
								<fieldset v-show="currentStep === 'contacts'" class="checkout-page__fieldset">
									<legend class="checkout-page__legend h4">Контактные данные</legend>

									<div class="checkout-page__fields">
										<div class="checkout-page__field">
											<UIInput v-model:value="name" name="name" placeholder="Имя и фамилия" :error-value="nameError" />
										</div>

										<div class="checkout-page__field">
											<UIInput
												v-model:value="phone"
												name="phone"
												type="tel"
												placeholder="Телефон"
												autocomplete="tel"
												:error-value="phoneError"
											/>
										</div>

										<div class="checkout-page__field checkout-page__field_full">
											<UIInput
												v-model:value="email"
												name="email"
												type="email"
												placeholder="Электронная почта"
												autocomplete="email"
												:error-value="emailError"
											/>
										</div>
									</div>
								</fieldset>

								<!-- Шаг 2: доставка -->
								<fieldset v-show="currentStep === 'delivery'" class="checkout-page__fieldset">
									<legend class="checkout-page__legend h4">Доставка</legend>

									<p v-if="isFreeDelivery" class="checkout-page__hint text-s">
										Сумма заказа больше {{ priceFormatter(data.freeDeliveryFrom) }} — доставка бесплатная.
									</p>

									<div class="radio-list-wrapper checkout-page__radio-list">
										<UIRadio
											v-for="type in data.deliveryTypes"
											:key="type.value"
											v-model="deliveryType"
											class="checkout-page__radio"
											name="deliveryType"
											:value="type.value"
										>
											<template #content>
												<span class="checkout-page__radio-body">
													<span class="checkout-page__radio-label text-s">{{ type.label }}</span>
													<span class="checkout-page__radio-meta text-xs">
														{{ type.term }} ·
														{{ isFreeDelivery || !type.price ? 'бесплатно' : priceFormatter(type.price) }}
													</span>
												</span>
											</template>
										</UIRadio>

										<span v-if="deliveryTypeError" class="radio-list-error-message text-xs">
											{{ deliveryTypeError }}
										</span>
									</div>

									<div class="checkout-page__fields">
										<div class="checkout-page__field">
											<UIInput
												v-model:value="city"
												name="city"
												placeholder="Город"
												:disabled="isPickup"
												:error-value="cityError"
											/>
										</div>

										<div class="checkout-page__field">
											<UIInput
												v-model:value="date"
												name="date"
												placeholder="Желаемая дата, например 12 сентября"
												:error-value="dateError"
											/>
										</div>

										<div class="checkout-page__field checkout-page__field_full">
											<UIInput
												v-model:value="address"
												name="address"
												placeholder="Адрес: улица, дом, квартира, этаж"
												:disabled="isPickup"
												:error-value="addressError"
											/>
										</div>
									</div>
								</fieldset>

								<!-- Шаг 3: оплата -->
								<fieldset v-show="currentStep === 'payment'" class="checkout-page__fieldset">
									<legend class="checkout-page__legend h4">Оплата</legend>

									<div class="radio-list-wrapper checkout-page__radio-list">
										<UIRadio
											v-for="type in data.paymentTypes"
											:key="type.value"
											v-model="paymentType"
											class="checkout-page__radio"
											name="paymentType"
											:value="type.value"
											:label="type.label"
										/>

										<span v-if="paymentTypeError" class="radio-list-error-message text-xs">
											{{ paymentTypeError }}
										</span>
									</div>

									<div class="checkout-page__fields">
										<div class="checkout-page__field checkout-page__field_full">
											<UITextarea
												v-model:value="comment"
												name="comment"
												placeholder="Комментарий к заказу: этаж, лифт, удобное время"
												:rows="3"
												:error-value="commentError"
											/>
										</div>
									</div>
								</fieldset>

								<!-- Шаг 4: подтверждение -->
								<fieldset v-show="currentStep === 'confirm'" class="checkout-page__fieldset">
									<legend class="checkout-page__legend h4">Проверьте заказ</legend>

									<dl class="checkout-page__recap">
										<div class="checkout-page__recap-row">
											<dt class="checkout-page__recap-label text-xs">Покупатель</dt>
											<dd class="checkout-page__recap-value text-s">{{ name }}, {{ phone }}, {{ email }}</dd>
										</div>

										<div class="checkout-page__recap-row">
											<dt class="checkout-page__recap-label text-xs">Доставка</dt>
											<dd class="checkout-page__recap-value text-s">
												{{ selectedDelivery?.label }}<template v-if="!isPickup">, {{ city }}, {{ address }}</template>
												<template v-if="date">, {{ date }}</template>
											</dd>
										</div>

										<div class="checkout-page__recap-row">
											<dt class="checkout-page__recap-label text-xs">Оплата</dt>
											<dd class="checkout-page__recap-value text-s">{{ selectedPayment?.label }}</dd>
										</div>

										<div v-if="comment" class="checkout-page__recap-row">
											<dt class="checkout-page__recap-label text-xs">Комментарий</dt>
											<dd class="checkout-page__recap-value text-s">{{ comment }}</dd>
										</div>

										<div class="checkout-page__recap-row">
											<dt class="checkout-page__recap-label text-xs">
												Состав, {{ productsCountLabel(storeCart.totalCount) }}
											</dt>
											<dd class="checkout-page__recap-value text-s">
												<ul class="checkout-page__recap-items">
													<li v-for="item in storeCart.items" :key="`${item.id}-${item.variant ?? 'base'}`">
														{{ item.title }} — {{ item.quantity }} шт.
													</li>
												</ul>
											</dd>
										</div>
									</dl>

									<div class="checkout-page__agreement">
										<UICheckbox v-model="agreement" name="agreement" :error-value="agreementError">
											<template #content>
												<span class="checkout-page__note text-xs">{{ data.note }}</span>
											</template>
										</UICheckbox>
									</div>
								</fieldset>

								<div class="checkout-page__actions">
									<UIButton
										v-if="currentIndex > 0"
										as="button"
										type="button"
										variant="secondary"
										color="dark"
										label="Назад"
										@click="onPrev"
									/>

									<UIButton v-if="!isLastStep" as="button" type="submit" label="Продолжить" show-icon />

									<UIButton
										v-else
										as="button"
										type="submit"
										:label="isSending ? 'Отправляем…' : 'Оформить заказ'"
										:disabled="isSending"
										show-icon
									/>
								</div>
							</form>
						</div>

						<aside class="checkout-page__aside">
							<CartSummary
								:delivery-price="deliveryPrice"
								:show-promo="false"
								:note="data.note"
								submit-label="Оформить заказ"
								:disabled="!isLastStep"
								:is-sending="isSending"
								@submit="onSubmit"
							/>
						</aside>
					</div>

					<UIEmptyState
						v-else
						class="checkout-page__empty"
						title="Оформлять пока нечего"
						text="Корзина пуста — выберите мебель в каталоге, и мы всё привезём и соберём."
						icon="icon-cart"
						link-url="/catalog/"
						link-label="Перейти в каталог"
					/>

					<template #fallback>
						<UISkeleton variant="box" height="420px" radius="16px" />
					</template>
				</ClientOnly>
			</div>

			<UIToast v-model="isToastShown" type="error" :title="toastTitle" :text="toastText" />
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.checkout-page {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__title {
		margin: 0 0 28px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__layout {
		display: grid;
		grid-template-columns: 1fr;
		align-items: start;
		gap: 24px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 1fr) 380px;
			gap: 32px;
		}
	}

	&__steps {
		margin-bottom: 28px;
	}

	&__form {
		padding: 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;

		@media (min-width: variables.$tablet) {
			padding: 32px;
		}
	}

	&__fieldset {
		padding: 0;
		border: none;
	}

	&__legend {
		margin-bottom: 24px;
		padding: 0;
	}

	&__hint {
		margin: 0 0 16px;
		color: variables.$color-accent-2;
	}

	&__radio-list {
		margin-bottom: 28px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__radio-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__radio-meta {
		color: variables.$color-ink-soft;
	}

	&__fields {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__field_full {
		@media (min-width: variables.$tablet) {
			grid-column: 1 / -1;
		}
	}

	&__recap {
		margin: 0 0 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__recap-row {
		padding-bottom: 16px;
		border-bottom: 1px solid variables.$color-line;

		&:last-child {
			padding-bottom: 0;
			border-bottom: none;
		}
	}

	&__recap-label {
		margin: 0 0 4px;
		color: variables.$color-ink-soft;
	}

	&__recap-value {
		margin: 0;
	}

	&__recap-items {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__note {
		color: variables.$color-ink-soft;
	}

	&__actions {
		margin-top: 28px;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
}
</style>
