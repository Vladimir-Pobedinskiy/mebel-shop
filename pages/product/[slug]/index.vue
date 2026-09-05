<script setup lang="ts">
import type { IProductPage } from '@/interfaces/product/IProductPage'
import { useGsapReveal } from '@/composables/useGsapReveal'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error, status } = await useAsyncData(
	() => `product-${slug.value}`,
	async () => $fetch<IProductPage>(`/api/product/${slug.value}/`),
	{ watch: [slug] }
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Товар не найден',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value), { type: 'product' })

const product = computed(() => data.value?.product)

/* Якорь формы расчёта: на него уводят «Рассчитать стоимость» из карточки
   и из блока факторов цены */
const REQUEST_ANCHOR = 'product-request'

const { isReducedMotion } = useGsapReveal()

const scrollToRequest = () => {
	const target = document.getElementById(REQUEST_ANCHOR)
	if (!target) return

	target.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
	<div class="product-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data && product">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="product-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<h1 class="visually-hidden">{{ data.seo.h1 }}</h1>

				<div class="product-page__top">
					<ProductGallery
						class="product-page__gallery"
						:gallery="product.gallery"
						:title="product.title"
						:badges="product.badges"
						:video="product.video"
					/>

					<ProductInfo class="product-page__info" :product="product" @request="scrollToRequest" />
				</div>

				<ProductTabs class="product-page__tabs" :product="product" :reviews="data.reviews || []" />

				<!-- Коммерческие блоки заполнены только у эталонной модели:
				     остальные товары рендерят карточку в прежнем виде -->
				<ProductConfigurations
					v-if="product.configurations?.length"
					class="product-page__unit"
					:configurations="product.configurations"
				/>

				<ProductPriceFactors
					v-if="product.priceFactors?.length"
					class="product-page__unit"
					:price-factors="product.priceFactors"
					:base-price="product.price"
					@request="scrollToRequest"
				/>

				<ProductOrderSteps
					v-if="product.orderSteps?.length"
					class="product-page__unit"
					:order-steps="product.orderSteps"
					:production-term="product.productionTerm"
				/>

				<ProductFiles v-if="product.files?.length" class="product-page__unit" :files="product.files" />

				<ProductRequestForm
					v-if="product.priceFactors?.length || product.configurations?.length"
					:id="REQUEST_ANCHOR"
					class="product-page__unit"
					:product="product"
				/>

				<ProductRelated class="product-page__related" :products="data.related || []" />
			</div>

			<!-- Блок доверия сквозной: показываем его у развёрнутой карточки модели -->
			<AppTrustUnit
				v-if="product.priceFactors?.length || product.configurations?.length"
				class="product-page__trust"
			/>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-page {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__top {
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
			gap: 40px;
		}

		@media (min-width: variables.$desktop-big) {
			gap: 56px;
		}
	}

	&__tabs {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 72px;
		}
	}

	&__unit {
		margin-top: 48px;
		scroll-margin-top: 100px;

		@media (min-width: variables.$desktop) {
			margin-top: 72px;
		}
	}

	&__related {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 80px;
		}
	}

	&__trust {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 80px;
		}
	}
}
</style>
