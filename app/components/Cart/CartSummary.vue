<script setup lang="ts">
import { useCartStore } from '@/stores/storeCart'
import { priceFormatter, productsCountLabel } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		/** стоимость доставки: null — «рассчитывается менеджером» */
		deliveryPrice?: number | null
		promoNote?: string
		showPromo?: boolean
		submitLabel?: string
		/** если задано — кнопка становится ссылкой */
		submitTo?: string
		note?: string
		disabled?: boolean
		isSending?: boolean
	}>(),
	{
		deliveryPrice: null,
		promoNote: '',
		showPromo: true,
		submitLabel: 'Оформить заказ',
		submitTo: '',
		note: '',
		disabled: false,
		isSending: false,
	}
)

const emits = defineEmits<{
	(e: 'submit'): void
}>()

const storeCart = useCartStore()

const promoInput = ref<string>('')
const promoError = ref<string>('')

const total = computed(() => storeCart.totalPrice + (props.deliveryPrice ?? 0))

const onApplyPromo = () => {
	promoError.value = ''

	if (!promoInput.value.trim()) {
		promoError.value = 'Введите промокод'
		return
	}

	if (!storeCart.applyPromo(promoInput.value)) {
		promoError.value = 'Такого промокода нет'
		return
	}

	promoInput.value = ''
}

const onResetPromo = () => {
	storeCart.resetPromo()
	promoError.value = ''
}
</script>

<template>
	<div class="cart-summary">
		<p class="cart-summary__title h4">Ваш заказ</p>

		<dl class="cart-summary__rows">
			<div class="cart-summary__row">
				<dt class="cart-summary__label text-s">Товары, {{ productsCountLabel(storeCart.totalCount) }}</dt>
				<dd class="cart-summary__value text-s">{{ priceFormatter(storeCart.subtotal) }}</dd>
			</div>

			<div v-if="storeCart.discount" class="cart-summary__row cart-summary__row_accent">
				<dt class="cart-summary__label text-s">Скидка по акции</dt>
				<dd class="cart-summary__value text-s">−{{ priceFormatter(storeCart.discount) }}</dd>
			</div>

			<div v-if="storeCart.promoDiscount" class="cart-summary__row cart-summary__row_accent">
				<dt class="cart-summary__label text-s">Промокод {{ storeCart.promo }}</dt>
				<dd class="cart-summary__value text-s">−{{ priceFormatter(storeCart.promoDiscount) }}</dd>
			</div>

			<div v-if="deliveryPrice !== null" class="cart-summary__row">
				<dt class="cart-summary__label text-s">Доставка</dt>
				<dd class="cart-summary__value text-s">
					{{ deliveryPrice ? priceFormatter(deliveryPrice) : 'Бесплатно' }}
				</dd>
			</div>
		</dl>

		<div class="cart-summary__total">
			<span class="cart-summary__total-label title-18">Итого</span>
			<span class="cart-summary__total-value h4">{{ priceFormatter(total) }}</span>
		</div>

		<div v-if="showPromo" class="cart-summary__promo">
			<template v-if="storeCart.promo">
				<div class="cart-summary__promo-applied">
					<span class="cart-summary__promo-code text-s">
						Промокод {{ storeCart.promo }} — −{{ storeCart.promoPercent }}%
					</span>

					<button class="cart-summary__promo-reset text-xs" type="button" @click="onResetPromo">Отменить</button>
				</div>
			</template>

			<template v-else>
				<form class="cart-summary__promo-form" novalidate @submit.prevent="onApplyPromo">
					<UIInput
						v-model:value="promoInput"
						class="cart-summary__promo-input"
						name="promo"
						placeholder="Промокод"
						:error-value="promoError"
					/>

					<UIButton
						class="cart-summary__promo-btn"
						as="button"
						type="submit"
						variant="secondary"
						color="dark"
						size="small"
						label="Применить"
					/>
				</form>
			</template>

			<p v-if="promoNote" class="cart-summary__promo-note text-xs">{{ promoNote }}</p>
		</div>

		<UIButton
			v-if="submitTo"
			class="cart-summary__submit"
			as="NuxtLink"
			:to="submitTo"
			:label="submitLabel"
			:disabled="disabled"
			full
			show-icon
		/>

		<UIButton
			v-else
			class="cart-summary__submit"
			as="button"
			type="button"
			:label="isSending ? 'Отправляем…' : submitLabel"
			:disabled="disabled || isSending"
			full
			show-icon
			@click="emits('submit')"
		/>

		<p v-if="note" class="cart-summary__note text-xs">{{ note }}</p>

		<slot name="content" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.cart-summary {
	padding: 24px;
	background-color: variables.$color-surface;
	border: 1px solid variables.$color-line;
	border-radius: variables.$radius-m;

	@media (min-width: variables.$desktop-small) {
		position: sticky;
		top: 100px;
		padding: 32px;
		box-shadow: variables.$shadow-soft;
		backdrop-filter: blur(12px);
	}

	&__title {
		margin: 0 0 20px;
	}

	&__rows {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0 0 20px;
	}

	&__row {
		display: flex;
		gap: 16px;
		align-items: baseline;
		justify-content: space-between;
	}

	&__label {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__value {
		margin: 0;
		text-align: right;
		white-space: nowrap;

		.cart-summary__row_accent & {
			color: variables.$color-accent;
		}
	}

	&__total {
		display: flex;
		gap: 16px;
		align-items: baseline;
		justify-content: space-between;
		padding-top: 20px;
		border-top: 1px solid variables.$color-line;
	}

	&__total-value {
		white-space: nowrap;
	}

	&__promo {
		padding-top: 24px;
		margin-top: 24px;
		border-top: 1px solid variables.$color-line;
	}

	&__promo-form {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	&__promo-input {
		flex-grow: 1;
	}

	&__promo-btn {
		flex-shrink: 0;
	}

	&__promo-applied {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		background-color: variables.$color-accent-soft;
		border-radius: variables.$radius-s;
	}

	&__promo-code {
		color: variables.$color-accent;
	}

	&__promo-reset {
		color: variables.$color-ink-soft;
		text-decoration: underline;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				color: variables.$color-ink;
			}
		}
	}

	&__promo-note {
		margin: 12px 0 0;
		color: variables.$color-ink-soft;
	}

	&__submit {
		margin-top: 24px;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}
}
</style>
