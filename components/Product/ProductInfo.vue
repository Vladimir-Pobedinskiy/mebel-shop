<script setup lang="ts">
import type { IProductDetails, IProductFinish } from '@/interfaces/product/IProduct'
import { useCartStore } from '@/stores/storeCart'
import { useFavoritesStore } from '@/stores/storeFavorites'
import { useCompareStore } from '@/stores/storeCompare'
import { useFlyToCart } from '@/composables/useFlyToCart'
import { useToaster } from '@/composables/useToaster'
import { declOfNum, priceFormatter } from '@/utils/utils'

const props = defineProps<{
	product: IProductDetails
}>()
const emits = defineEmits<{
	(e: 'request'): void
}>()

const storeCart = useCartStore()
const storeFavorites = useFavoritesStore()
const storeCompare = useCompareStore()

const { flyToCart } = useFlyToCart()
const { showToast } = useToaster()

const quantity = ref<number>(1)

/* Отделка без своего HEX — например, «под покраску»: свотч рисуем нейтральным цветом */
const FINISH_FALLBACK_COLOR = '#d9d3c8'

/* Отделка есть только у развёрнутой карточки модели: там свотчи считают доплату
   за материал фасадов. У остальных товаров работают прежние варианты обивки */
const finishes = computed<IProductFinish[]>(() => props.product.finishes || [])
const hasFinishes = computed(() => finishes.value.length > 0)

const activeFinish = ref<string>(props.product.finishes?.[0]?.label || '')
const activeVariant = ref<string>(props.product.variants?.[0]?.name || '')

const finish = computed(() => finishes.value.find(item => item.label === activeFinish.value) || null)
const variant = computed(() => props.product.variants?.find(item => item.name === activeVariant.value) || null)

// Доплата берётся из активной отделки, а если её нет — из варианта обивки
const priceDiff = computed(() => (hasFinishes.value ? finish.value?.priceDiff || 0 : variant.value?.priceDiff || 0))

const price = computed(() => props.product.price + priceDiff.value)
const oldPrice = computed(() => (props.product.oldPrice ? props.product.oldPrice + priceDiff.value : null))

const selectionLabel = computed(() => (hasFinishes.value ? finish.value?.label : variant.value?.label) || null)

const isInCart = computed(() => storeCart.isInCart(props.product.id))
const isFavorite = computed(() => storeFavorites.isFavorite(props.product.id))
const isCompared = computed(() => storeCompare.isCompared(props.product.id))

// Назначение и стиль — коммерческие поля, у остальных товаров строка остаётся пустой
const purposeLabel = computed(() => [props.product.purpose, props.product.style].filter(Boolean).join(' · '))

const availabilityLabel = computed(() => {
	const { availabilityType, productionDays, productionTerm, availability } = props.product
	if (!availabilityType) return availability
	if (availabilityType === 'in-stock') return 'В наличии, отгрузка со склада'
	if (productionTerm) return `Изготовление ${productionTerm}`
	if (!productionDays) return availability
	return `Изготовление ${productionDays} ${declOfNum(productionDays, ['рабочий день', 'рабочих дня', 'рабочих дней'])}`
})

const specs = computed(() => {
	const { dimensions, bodyMaterial, facadeMaterial, constructionType } = props.product
	const items: { label: string; value: string }[] = []

	if (constructionType) items.push({ label: 'Тип конструкции', value: constructionType })

	if (dimensions) {
		items.push({
			label: 'Размеры (Ш×Г×В)',
			value: `${dimensions.width} × ${dimensions.depth} × ${dimensions.height} мм`,
		})
	}

	if (bodyMaterial) items.push({ label: 'Корпус', value: bodyMaterial })
	if (facadeMaterial) items.push({ label: 'Фасады', value: facadeMaterial })

	return items
})

const deliveryLabel = computed(() => {
	const days = props.product.deliveryDays
	if (!days) return ''
	return `Доставка от ${days} ${declOfNum(days, ['дня', 'дней', 'дней'])}`
})

/* Условия под кнопками: у модели — гарантия, доставка, сборка и подъём из db.json,
   у остальных товаров остаётся прежний общий список */
const terms = computed(() => {
	const { warranty, deliveryPrice, liftingTerms } = props.product
	const items: { icon: string; text: string }[] = []

	if (warranty) items.push({ icon: 'icon-shield', text: `Гарантия ${warranty.term}. ${warranty.text}` })

	for (const item of deliveryPrice || []) {
		const icon = item.title.toLowerCase().includes('сборка') ? 'icon-wrench' : 'icon-truck'
		items.push({ icon, text: `${item.title} — ${item.value}` })
	}

	if (liftingTerms) items.push({ icon: 'icon-truck', text: liftingTerms })

	return items
})

/* Модалки монтируем по первому клику: на карточке их две */
const isQuickOrderUsed = ref<boolean>(false)
const isQuickOrderOpen = ref<boolean>(false)
const isConsultUsed = ref<boolean>(false)
const isConsultOpen = ref<boolean>(false)

const openQuickOrder = () => {
	isQuickOrderUsed.value = true
	nextTick(() => {
		isQuickOrderOpen.value = true
	})
}

const openConsult = () => {
	isConsultUsed.value = true
	nextTick(() => {
		isConsultOpen.value = true
	})
}

// Плавающая панель показывается, когда основные кнопки ушли за верхнюю кромку экрана
const actionsRef = ref<HTMLElement | null>(null)

const addToCart = () => {
	// Цена выбранной отделки уже посчитана — в корзину уходит именно она
	storeCart.add({ ...props.product, price: price.value, oldPrice: oldPrice.value }, quantity.value, selectionLabel.value)

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
		activeFinish.value = props.product.finishes?.[0]?.label || ''
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
			<span v-if="purposeLabel" class="product-info__purpose text-xs">{{ purposeLabel }}</span>
		</div>

		<p class="product-info__short text-m">{{ product.shortDescription }}</p>

		<div class="product-info__price-block">
			<div class="product-info__price-body">
				<UIPrice :price="price" :old-price="oldPrice" :is-from="product.priceFrom" size="big" />

				<button
					v-if="product.priceFrom && product.priceFactors?.length"
					class="product-info__price-hint text-xs"
					type="button"
					@click="emits('request')"
				>
					Итог зависит от конфигурации — рассчитаем по вашим размерам
				</button>
			</div>

			<p :class="['product-info__availability text-s', { 'product-info__availability_out': !product.inStock }]">
				{{ availabilityLabel }}
			</p>
		</div>

		<ul v-if="specs.length" class="product-info__specs">
			<li v-for="item in specs" :key="item.label" class="product-info__spec">
				<span class="product-info__spec-label text-xs">{{ item.label }}</span>
				<span class="product-info__spec-value text-s">{{ item.value }}</span>
			</li>
		</ul>

		<div v-if="hasFinishes" class="product-info__variants">
			<p class="product-info__variants-title title-14">
				Отделка: <span class="product-info__variants-value">{{ finish?.label }}</span>
				<span v-if="finish?.priceDiff" class="product-info__variants-diff">
					+{{ priceFormatter(finish.priceDiff) }}
				</span>
			</p>

			<ul class="product-info__variants-list">
				<li v-for="item in finishes" :key="item.label">
					<UIColorSwatch
						:color-hex="item.colorHex || FINISH_FALLBACK_COLOR"
						:label="item.priceDiff ? `${item.label} (+${priceFormatter(item.priceDiff)})` : item.label"
						:selected="item.label === activeFinish"
						@select="activeFinish = item.label"
					/>
				</li>
			</ul>
		</div>

		<div v-else-if="product.variants?.length" class="product-info__variants">
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

		<div ref="actionsRef" class="product-info__actions">
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

		<div class="product-info__extra-actions">
			<UIButton
				class="product-info__extra-btn"
				as="button"
				type="button"
				variant="secondary"
				size="small"
				label="Купить в 1 клик"
				@click="openQuickOrder"
			/>

			<UIButton
				v-if="product.priceFactors?.length || product.configurations?.length"
				class="product-info__extra-btn"
				as="button"
				type="button"
				variant="secondary"
				size="small"
				label="Рассчитать стоимость"
				@click="emits('request')"
			/>

			<UIButton
				class="product-info__extra-btn"
				as="button"
				type="button"
				variant="secondary"
				size="small"
				label="Задать вопрос"
				@click="openConsult"
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

		<ul v-if="terms.length" class="product-info__benefits">
			<li v-for="item in terms" :key="item.text" class="product-info__benefit">
				<NuxtIcon class="product-info__benefit-icon" :name="item.icon" filled />
				<span class="text-s">{{ item.text }}</span>
			</li>

			<li class="product-info__benefit">
				<NuxtIcon class="product-info__benefit-icon" name="icon-phone" filled />
				<span class="text-s">Менеджер отвечает в течение 15 минут в рабочее время</span>
			</li>
		</ul>

		<ul v-else class="product-info__benefits">
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

		<ProductStickyBar
			:product="product"
			:price="price"
			:old-price="oldPrice"
			:is-in-cart="isInCart"
			:trigger-el="actionsRef"
			@cart="addToCart"
			@quick="openQuickOrder"
		/>

		<ModalQuickOrder v-if="isQuickOrderUsed" v-model="isQuickOrderOpen" :product="product" />
		<ModalConsult v-if="isConsultUsed" v-model="isConsultOpen" :subject="product.title" />
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

	&__article,
	&__purpose {
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

	&__price-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__price-hint {
		padding: 0;
		border: 0;
		background-color: transparent;
		color: variables.$color-ink-soft;
		cursor: pointer;
		text-align: left;
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}
	}

	&__availability {
		margin: 0;
		color: variables.$color-accent-2;

		&_out {
			color: variables.$color-ink-soft;
		}
	}

	&__specs {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
		}
	}

	&__spec {
		display: flex;
		flex-direction: column;
		padding: 12px 14px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
		gap: 4px;
	}

	&__spec-label {
		color: variables.$color-ink-soft;
	}

	&__variants-title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		margin: 0 0 10px;
		gap: 6px;
	}

	&__variants-value {
		color: variables.$color-ink-soft;
		font-weight: 400;
	}

	&__variants-diff {
		color: variables.$color-accent;
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

	&__extra-actions {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__extra-btn {
		width: 100%;
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
