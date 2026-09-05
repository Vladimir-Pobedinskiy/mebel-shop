<script setup lang="ts">
import type { ICartPage } from '~~/interfaces/cart/ICartPage'
import { useCartStore } from '@/stores/storeCart'
import { productsCountLabel } from '@/utils/utils'

const { data, error, status } = await useAsyncData('cart-page', async () => $fetch<ICartPage>('/api/cart/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Корзина не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const storeCart = useCartStore()

const onClear = () => {
	if (storeCart.isEmpty) return
	storeCart.clear()
}
</script>

<template>
	<div class="cart-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="cart-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<div class="cart-page__head">
					<h1 class="cart-page__title h1">{{ data.seo.h1 }}</h1>

					<!-- Корзина живёт в localStorage, поэтому её состав рендерится только на клиенте -->
					<ClientOnly>
						<p v-if="!storeCart.isEmpty" class="cart-page__count text-m">
							{{ productsCountLabel(storeCart.totalCount) }}
						</p>
					</ClientOnly>
				</div>

				<ClientOnly>
					<div v-if="!storeCart.isEmpty" class="cart-page__layout">
						<div class="cart-page__main">
							<ul v-auto-animate class="cart-page__list">
								<li v-for="item in storeCart.items" :key="`${item.id}-${item.variant ?? 'base'}`">
									<CartItem
										:item="item"
										@update-qty="storeCart.updateQty(item.id, $event, item.variant)"
										@remove="storeCart.remove(item.id, item.variant)"
									/>
								</li>
							</ul>

							<button class="cart-page__clear text-s" type="button" @click="onClear">
								<NuxtIcon class="cart-page__clear-icon" name="icon-trash" filled />
								<span>Очистить корзину</span>
							</button>
						</div>

						<aside class="cart-page__aside">
							<CartSummary :promo-note="data.promoNote" submit-to="/checkout/" submit-label="Перейти к оформлению" />
						</aside>
					</div>

					<UIEmptyState
						v-else
						class="cart-page__empty"
						:title="data.emptyState.title"
						:text="data.emptyState.text"
						icon="icon-cart"
						:link-url="data.emptyState.link.url"
						:link-label="data.emptyState.link.label"
					/>

					<template #fallback>
						<div class="cart-page__skeleton">
							<UISkeleton variant="box" height="140px" radius="16px" />
							<UISkeleton variant="box" height="140px" radius="16px" />
							<UISkeleton variant="box" height="140px" radius="16px" />
						</div>
					</template>
				</ClientOnly>

				<section v-if="data.recommended?.length" class="cart-page__recommended">
					<h2 class="cart-page__recommended-title h2">Может подойти к заказу</h2>

					<ul class="cart-page__recommended-list">
						<li v-for="product in data.recommended" :key="product.id" class="cart-page__recommended-item">
							<ProductCard :product="product" size="small" />
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.cart-page {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__head {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		align-items: baseline;
		margin-bottom: 28px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__title {
		margin: 0;
	}

	&__count {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		align-items: start;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 1fr) 380px;
			gap: 32px;
		}
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 12px;

		@media (min-width: variables.$tablet) {
			gap: 16px;
		}
	}

	&__clear {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		margin-top: 20px;
		color: variables.$color-ink-soft;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				color: variables.$color-error;
			}
		}
	}

	&__clear-icon {
		display: flex;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	&__skeleton {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__recommended {
		margin-top: 56px;

		@media (min-width: variables.$desktop) {
			margin-top: 96px;
		}
	}

	&__recommended-title {
		margin: 0 0 24px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__recommended-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
			gap: 24px;
		}
	}

	&__recommended-item {
		display: flex;
	}
}
</style>
