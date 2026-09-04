<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { IProduct } from '@/interfaces/product/IProduct'
import type { IReview } from '@/interfaces/IReview'

const props = withDefaults(
	defineProps<{
		product: IProduct
		reviews?: IReview[]
	}>(),
	{
		reviews: () => [],
	}
)

const reviewsLabel = computed(() => {
	const count = props.reviews.length
	if (!count) return 'Отзывы'
	return `Отзывы (${count})`
})

const deliveryItems = [
	{
		title: 'Доставка по городу',
		text: 'Собственная служба доставки, интервал на выбор с 9:00 до 21:00. Подъём на этаж и распаковка входят в стоимость.',
	},
	{
		title: 'Доставка по России',
		text: 'Транспортные компании до терминала или до двери. Срок — от 3 до 14 дней в зависимости от региона.',
	},
	{
		title: 'Сборка',
		text: 'Бригада собирает мебель на месте в день доставки. Упаковку забираем с собой.',
	},
	{
		title: 'Оплата',
		text: 'Картой на сайте, наличными или картой при получении, рассрочка на 6 и 12 месяцев без переплаты.',
	},
]

const ratingsCount = computed(() => props.reviews.length)
</script>

<template>
	<section class="product-tabs">
		<TabGroup>
			<TabList class="product-tabs__nav">
				<Tab v-slot="{ selected }" as="template">
					<button :class="['product-tabs__nav-item menu', { active: selected }]" type="button">Описание</button>
				</Tab>
				<Tab v-slot="{ selected }" as="template">
					<button :class="['product-tabs__nav-item menu', { active: selected }]" type="button">Характеристики</button>
				</Tab>
				<Tab v-slot="{ selected }" as="template">
					<button :class="['product-tabs__nav-item menu', { active: selected }]" type="button">{{ reviewsLabel }}</button>
				</Tab>
				<Tab v-slot="{ selected }" as="template">
					<button :class="['product-tabs__nav-item menu', { active: selected }]" type="button">Доставка и оплата</button>
				</Tab>
			</TabList>

			<TabPanels class="product-tabs__panels">
				<TabPanel class="product-tabs__panel">
					<div class="product-tabs__text user-content">
						<p>{{ product.description }}</p>
					</div>
				</TabPanel>

				<TabPanel class="product-tabs__panel">
					<ul v-if="product.characteristics?.length" class="product-tabs__characteristics">
						<li v-for="item in product.characteristics" :key="item.label" class="product-tabs__characteristic">
							<span class="product-tabs__characteristic-label text-s">{{ item.label }}</span>
							<span class="product-tabs__characteristic-value text-s">{{ item.value }}</span>
						</li>
					</ul>
				</TabPanel>

				<TabPanel class="product-tabs__panel">
					<ProductReviews :reviews="reviews" :rating="product.rating" :reviews-count="ratingsCount" />
				</TabPanel>

				<TabPanel class="product-tabs__panel">
					<ul class="product-tabs__delivery">
						<li v-for="item in deliveryItems" :key="item.title" class="product-tabs__delivery-item">
							<p class="product-tabs__delivery-title title-18">{{ item.title }}</p>
							<p class="product-tabs__delivery-text text-s">{{ item.text }}</p>
						</li>
					</ul>
				</TabPanel>
			</TabPanels>
		</TabGroup>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-tabs {
	&__nav {
		display: flex;
		overflow-x: auto;
		margin-bottom: 24px;
		border-bottom: 1px solid variables.$color-line;
		gap: 8px;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__nav-item {
		position: relative;
		padding: 14px 4px;
		border: 0;
		margin-right: 16px;
		background-color: transparent;
		color: variables.$color-ink-soft;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.3s ease-in-out;

		&::after {
			position: absolute;
			right: 0;
			bottom: -1px;
			left: 0;
			height: 2px;
			background-color: variables.$color-accent;
			content: '';
			transform: scaleX(0);
			transform-origin: left center;
			transition: transform 0.3s ease-in-out;
		}

		&.active {
			color: variables.$color-ink;

			&::after {
				transform: scaleX(1);
			}
		}

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-ink;
			}
		}
	}

	&__text {
		max-width: 860px;
	}

	&__characteristics {
		display: grid;
		max-width: 860px;
		grid-template-columns: 1fr;
		gap: 0;
	}

	&__characteristic {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 12px 0;
		border-bottom: 1px solid variables.$color-line;
		gap: 8px 20px;

		&:last-child {
			border-bottom: 0;
		}
	}

	&__characteristic-label {
		color: variables.$color-ink-soft;
	}

	&__characteristic-value {
		text-align: right;
	}

	&__delivery {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__delivery-item {
		padding: 20px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__delivery-title {
		margin: 0 0 8px;
	}

	&__delivery-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
