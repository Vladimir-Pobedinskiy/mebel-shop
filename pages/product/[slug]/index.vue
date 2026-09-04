<script setup lang="ts">
import type { IProductPage } from '@/interfaces/product/IProductPage'

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
</script>

<template>
	<div class="product-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="product-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<h1 class="visually-hidden">{{ data.seo.h1 }}</h1>

				<div class="product-page__top">
					<ProductGallery
						class="product-page__gallery"
						:gallery="data.product.gallery"
						:title="data.product.title"
						:badges="data.product.badges"
					/>

					<ProductInfo class="product-page__info" :product="data.product" />
				</div>

				<ProductTabs class="product-page__tabs" :product="data.product" :reviews="data.reviews || []" />

				<ProductRelated class="product-page__related" :products="data.related || []" />
			</div>
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

	&__related {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 80px;
		}
	}
}
</style>
