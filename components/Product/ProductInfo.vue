<script setup lang="ts">
import type { IProduct } from '@/interfaces/product/IProduct'
import { useCartStore } from '@/stores/storeCart'
import { useFavoritesStore } from '@/stores/storeFavorites'
import { useCompareStore } from '@/stores/storeCompare'
import { useFlyToCart } from '@/composables/useFlyToCart'
import { useToaster } from '@/composables/useToaster'
import { declOfNum } from '@/utils/utils'

const props = defineProps<{
	product: IProduct
}>()

const storeCart = useCartStore()
const storeFavorites = useFavoritesStore()
const storeCompare = useCompareStore()

const { flyToCart } = useFlyToCart()
const { showToast } = useToaster()

const quantity = ref<number>(1)
const activeVariant = ref<string>(props.product.variants?.[0]?.name || '')

const variant = computed(() => props.product.variants?.find(item => item.name === activeVariant.value) || null)

// Вариант обивки может стоить дороже базового: цена пересчитывается на лету
const price = computed(() => props.product.price + (variant.value?.priceDiff || 0))
const oldPrice = computed(() => (props.product.oldPrice ? props.product.oldPrice + (variant.value?.priceDiff || 0) : null))

const variantLabel = computed(() => variant.value?.label || null)

const isInCart = computed(() => storeCart.isInCart(props.product.id))
const isFavorite = computed(() => storeFavorites.isFavorite(props.product.id))
const isCompared = computed(() => storeCompare.isCompared(props.product.id))

const deliveryLabel = computed(() => {
	const days = props.product.deliveryDays
	if (!days) return ''
	return `Доставка от ${days} ${declOfNum(days, ['дня', 'дней', 'дней'])}`
})

const addToCart = () => {
	// Цена варианта уже посчитана — в корзину уходит именно она
	storeCart.add({ ...props.product, price: price.value, oldPrice: oldPrice.value }, quantity.value, variantLabel.value)

	// Клон летит из галереи товара в иконку корзины
	flyToCart(document.querySelector('.product-gallery__main') as HTMLElement | null)
	showToast({ title: 'Товар в корзине', text: props.product.title })
}

// Смена товара внутри одной страницы (переход по «похожим») сбрасывает выбор
watch(
	() => props.product.slug,
	() => {
		quantity.value = 1
		activeVariant.value = props.product.variants?.[0]?.name || ''
	}
)
</script>

<template>
	<div class="product-info">
		<p class="product-info__category card-subtitle">
			<NuxtLink class="hover-link" :to="`/catalog/${product.categorySlug}/`">{{ product.category }}</NuxtLink>
		</p>

		<h1 class="product-info__title h2">{{ product.title }}</h1>

		<div class="product-info__meta">
			<UIRating :rating="product.rating" :reviews-count="product.reviewsCount" />
			<span class="product-info__article text-xs">Артикул: {{ product.id }}</span>
		</div>

		<p class="product-info__short text-m">{{ product.shortDescription }}</p>

		<div class="product-info__price-block">
			<UIPrice :price="price" :old-price="oldPrice" size="big" />

			<p :class="['product-info__availability text-s', { 'product-info__availability_out': !product.inStock }]">
				{{ product.availability }}
			</p>
		</div>

		<div v-if="product.variants?.length" class="product-info__variants">
			<p class="product-info__variants-title title-14">
				Обивка: <span class="product-info__variants-value">{{ variant?.label }}</span>
			</p>

			<ul class="product-info__variants-list">
				<li v-for="item in product.variants" :key="item.name">
					<UIColorSwatch
						:color-hex="item.color"
						:label="item.label"
						:selected="item.name === activeVariant"
						@select="activeVariant = item.name"
					/>
				</li>
			</ul>
		</div>

		<div class="product-info__actions">
			<UIQuantity v-model="quantity" class="product-info__quantity" :max="20" />

			<UIButton
				class="product-info__cart-btn"
				as="button"
				type="button"
				:color="isInCart ? 'green' : 'accent'"
				:label="isInCart ? 'Добавить ещё' : 'В корзину'"
				:disabled="!product.inStock"
				@click="addToCart"
			/>
		</div>

		<div class="product-info__secondary">
			<button
				:class="['product-info__icon-btn', { 'product-info__icon-btn_active': isFavorite }]"
				type="button"
				:aria-pressed="isFavorite"
				@click="storeFavorites.toggle(product)"
			>
				<NuxtIcon class="product-info__icon" name="icon-heart" filled />
				<span class="text-s">{{ isFavorite ? 'В избранном' : 'В избранное' }}</span>
			</button>

			<button
				:class="['product-info__icon-btn', { 'product-info__icon-btn_active': isCompared }]"
				type="button"
				:aria-pressed="isCompared"
				:disabled="!isCompared && storeCompare.isFull"
				@click="storeCompare.toggle(product)"
			>
				<NuxtIcon class="product-info__icon" name="icon-compare" filled />
				<span class="text-s">{{ isCompared ? 'В сравнении' : 'К сравнению' }}</span>
			</button>
		</div>

		<ul class="product-info__benefits">
			<li v-if="deliveryLabel" class="product-info__benefit">
				<NuxtIcon class="product-info__benefit-icon" name="icon-truck" filled />
				<span class="text-s">{{ deliveryLabel }}</span>
			</li>
			<li class="product-info__benefit">
				<NuxtIcon class="product-info__benefit-icon" name="icon-wrench" filled />
				<span class="text-s">Сборка входит в стоимость доставки по городу</span>
			</li>
			<li class="product-info__benefit">
				<NuxtIcon class="product-info__benefit-icon" name="icon-shield" filled />
				<span class="text-s">Гарантия 24 месяца и обмен в течение 14 дней</span>
			</li>
		</ul>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-info {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__category {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__title {
		margin: 0;
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 20px;
	}

	&__article {
		color: variables.$color-ink-soft;
	}

	&__short {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__price-block {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-muted;
		gap: 12px 20px;
	}

	&__availability {
		margin: 0;
		color: variables.$color-accent-2;

		&_out {
			color: variables.$color-ink-soft;
		}
	}

	&__variants-title {
		margin: 0 0 10px;
	}

	&__variants-value {
		color: variables.$color-ink-soft;
		font-weight: 400;
	}

	&__variants-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	&__quantity {
		flex: 0 0 auto;
	}

	&__cart-btn {
		flex: 1 1 200px;
	}

	&__secondary {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
	}

	&__icon-btn {
		display: inline-flex;
		align-items: center;
		padding: 0;
		border: 0;
		background-color: transparent;
		color: variables.$color-ink-soft;
		cursor: pointer;
		gap: 8px;
		transition: color 0.3s ease-in-out;

		&_active {
			color: variables.$color-accent;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		@media (min-width: variables.$desktop-small) {
			&:hover:not(:disabled) {
				color: variables.$color-accent;
			}
		}
	}

	&__icon {
		width: 18px;
		height: 18px;
	}

	&__benefits {
		display: flex;
		flex-direction: column;
		padding-top: 8px;
		border-top: 1px solid variables.$color-line;
		gap: 12px;
	}

	&__benefit {
		display: flex;
		align-items: flex-start;
		color: variables.$color-ink-soft;
		gap: 10px;
	}

	&__benefit-icon {
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
		color: variables.$color-accent;
	}
}
</style>
