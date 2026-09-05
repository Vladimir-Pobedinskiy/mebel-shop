<script setup lang="ts">
import type { IProduct } from '~~/interfaces/product/IProduct'
import { useCartStore } from '@/stores/storeCart'
import { useFavoritesStore } from '@/stores/storeFavorites'
import { useCompareStore } from '@/stores/storeCompare'
import { useScreenHandler } from '@/composables/useScreenHandler'
import { useGsapReveal } from '@/composables/useGsapReveal'
import { useFlyToCart } from '@/composables/useFlyToCart'
import { useToaster } from '@/composables/useToaster'
import { screens, declOfNum } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		product: IProduct
		/** компактная карточка для слайдеров в узких блоках */
		size?: 'default' | 'small'
	}>(),
	{
		size: 'default',
	}
)

const storeCart = useCartStore()
const storeFavorites = useFavoritesStore()
const storeCompare = useCompareStore()

const { isMatchedScreen } = useScreenHandler(screens.desktopSmall)
const { isReducedMotion } = useGsapReveal()
const { flyToCart } = useFlyToCart()
const { showToast } = useToaster()

/* Коммерческие поля есть только у товаров корпусной мебели —
   по ним включаются срок изготовления, габариты, свотчи и быстрый заказ */
const isCommerce = computed(() => Boolean(props.product.availabilityType || props.product.priceFrom))

// «В наличии» либо срок изготовления; у остальных категорий остаётся текст из db.json
const availabilityLabel = computed(() => {
	const { availabilityType, productionDays, availability } = props.product
	if (!availabilityType) return availability
	if (availabilityType === 'in-stock') return 'В наличии, отгрузка со склада'
	if (!productionDays) return availability
	return `Изготовление ${productionDays} ${declOfNum(productionDays, ['рабочий день', 'рабочих дня', 'рабочих дней'])}`
})

const dimensionsLabel = computed(() => {
	const dimensions = props.product.dimensions
	if (!dimensions) return ''
	return `Ш ${dimensions.width} × Г ${dimensions.depth} × В ${dimensions.height} мм`
})

/* Модалку монтируем только после первого клика: на странице до 12 карточек */
const isQuickOrderUsed = ref<boolean>(false)
const isQuickOrderOpen = ref<boolean>(false)

const openQuickOrder = () => {
	isQuickOrderUsed.value = true
	nextTick(() => {
		isQuickOrderOpen.value = true
	})
}

const isInCart = computed(() => storeCart.isInCart(props.product.id))
const isFavorite = computed(() => storeFavorites.isFavorite(props.product.id))
const isCompared = computed(() => storeCompare.isCompared(props.product.id))

const mediaRef = ref<HTMLElement | null>(null)

const addToCart = () => {
	if (isInCart.value) return

	storeCart.add(props.product)
	flyToCart(mediaRef.value)
	showToast({ title: 'Товар в корзине', text: props.product.title })
}

const toggleFavorite = () => {
	storeFavorites.toggle(props.product)
}

const toggleCompare = () => {
	storeCompare.toggle(props.product)
}

/* 3D-tilt: только на десктопе и только если пользователь не просил убрать движение */
const cardRef = ref<HTMLElement | null>(null)
const tiltStyle = ref<Record<string, string>>({})

const onTiltMove = (event: MouseEvent) => {
	if (!isMatchedScreen.value || isReducedMotion() || !cardRef.value) return

	const { left, top, width, height } = cardRef.value.getBoundingClientRect()
	const x = (event.clientX - left) / width - 0.5
	const y = (event.clientY - top) / height - 0.5

	tiltStyle.value = {
		transform: `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`,
	}
}

const onTiltLeave = () => {
	tiltStyle.value = {}
}
</script>

<template>
	<article
		ref="cardRef"
		:class="['product-card', `product-card_${size}`]"
		:style="tiltStyle"
		@mousemove="onTiltMove"
		@mouseleave="onTiltLeave"
	>
		<div ref="mediaRef" class="product-card__media">
			<NuxtLink class="product-card__media-link" :to="product.url" :aria-label="product.title">
				<NuxtImg
					class="product-card__img"
					:src="product.img.url"
					:alt="product.img.alt"
					loading="lazy"
					sizes="xs:90vw sm:45vw md:33vw lg:25vw xl:25vw xxl:25vw"
				/>
				<NuxtImg
					v-if="product.imgHover"
					class="product-card__img product-card__img_hover"
					:src="product.imgHover.url"
					:alt="product.imgHover.alt"
					loading="lazy"
					sizes="xs:90vw sm:45vw md:33vw lg:25vw xl:25vw xxl:25vw"
				/>
			</NuxtLink>

			<ul v-if="product.badges?.length" class="product-card__badges">
				<li v-for="badge in product.badges" :key="badge.name">
					<UIBadge :badge="badge" />
				</li>
			</ul>

			<div class="product-card__actions">
				<button
					:class="['product-card__favorite', { active: isFavorite }]"
					type="button"
					:aria-label="isFavorite ? 'Убрать из избранного' : 'В избранное'"
					:aria-pressed="isFavorite"
					@click="toggleFavorite"
				>
					<NuxtIcon class="product-card__favorite-icon" name="icon-heart" filled />
				</button>

				<button
					:class="['product-card__favorite', { active: isCompared }]"
					type="button"
					:aria-label="isCompared ? 'Убрать из сравнения' : 'Добавить к сравнению'"
					:aria-pressed="isCompared"
					:disabled="!isCompared && storeCompare.isFull"
					@click="toggleCompare"
				>
					<NuxtIcon class="product-card__favorite-icon" name="icon-compare" filled />
				</button>
			</div>

			<UIButton
				class="product-card__cart-btn"
				as="button"
				type="button"
				size="small"
				:color="isInCart ? 'green' : 'accent'"
				:label="isInCart ? 'В корзине' : 'В корзину'"
				:disabled="!product.inStock"
				@click="addToCart"
			/>
		</div>

		<div class="product-card__body">
			<p class="product-card__category card-subtitle">{{ product.category }}</p>

			<h3 class="product-card__title title-18">
				<NuxtLink class="product-card__title-link hover-link" :to="product.url">{{ product.title }}</NuxtLink>
			</h3>

			<UIRating class="product-card__rating" :rating="product.rating" :reviews-count="product.reviewsCount" />

			<p :class="['product-card__availability text-xs', { 'product-card__availability_out': !product.inStock }]">
				{{ availabilityLabel }}
			</p>

			<p v-if="dimensionsLabel" class="product-card__dimensions text-xs">{{ dimensionsLabel }}</p>

			<ul v-if="product.variants?.length" class="product-card__colors">
				<li v-for="variant in product.variants" :key="variant.name">
					<UIColorSwatch
						:color-hex="variant.color"
						:label="variant.label"
						size="small"
						@select="navigateTo(product.url)"
					/>
				</li>
			</ul>

			<UIPrice
				class="product-card__price"
				:price="product.price"
				:old-price="product.oldPrice"
				:is-from="product.priceFrom"
				size="medium"
			/>

			<button
				v-if="isCommerce"
				class="product-card__quick text-xs hover-underline"
				type="button"
				@click="openQuickOrder"
			>
				Быстрый заказ
			</button>
		</div>

		<ModalQuickOrder v-if="isQuickOrderUsed" v-model="isQuickOrderOpen" :product="product" />
	</article>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-card {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
	background-color: variables.$color-surface;
	border: 1px solid variables.$color-line;
	border-radius: variables.$radius-m;
	transition:
		transform 0.4s ease-out,
		border-color 0.4s ease-in-out,
		box-shadow 0.4s ease-in-out;
	will-change: transform;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			border-color: transparent;
			box-shadow: variables.$shadow-hover;
		}

		&:hover .product-card__img_hover {
			opacity: 1;
		}

		&:hover .product-card__cart-btn {
			opacity: 1;
			transform: translateY(0);
		}
	}

	&__media {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: variables.$color-muted;
	}

	&__media-link {
		display: block;
		width: 100%;
		height: 100%;
	}

	&__img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;

		&_hover {
			opacity: 0;
			transition: opacity 0.5s ease-in-out;
		}
	}

	&__badges {
		position: absolute;
		top: 12px;
		left: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__actions {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__favorite {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: variables.$color-ink;
		cursor: pointer;
		background-color: rgb(255, 255, 255, 88%);
		border: 0;
		border-radius: 50%;
		transition:
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		&.active {
			color: variables.$color-white;
			background-color: variables.$color-accent;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		@media (min-width: variables.$desktop-small) {
			&:not(:disabled):hover {
				color: variables.$color-white;
				background-color: variables.$color-accent;
			}
		}
	}

	&__favorite-icon {
		width: 18px;
		height: 18px;
	}

	&__cart-btn {
		position: absolute;
		right: 12px;
		bottom: 12px;
		left: 12px;
		width: auto !important;

		@media (min-width: variables.$desktop-small) {
			opacity: 0;
			transform: translateY(12px);
			transition:
				opacity 0.4s ease-in-out,
				transform 0.4s ease-in-out,
				background-color 0.4s ease-in-out;
		}
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 8px;
		padding: 16px;
	}

	&__title {
		margin: 0;
	}

	&__availability {
		color: variables.$color-accent-2;

		&_out {
			color: variables.$color-ink-soft;
		}
	}

	&__dimensions {
		color: variables.$color-ink-soft;
	}

	&__colors {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__price {
		padding-top: 8px;
		margin-top: auto;
	}

	&__quick {
		align-self: flex-start;
		padding: 0;
		color: variables.$color-ink-soft;
		cursor: pointer;
		background-color: transparent;
		border: 0;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}
	}

	&_small &__body {
		padding: 14px;
	}
}
</style>
