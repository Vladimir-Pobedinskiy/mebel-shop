<script setup lang="ts">
import type { ICategoryPage } from '@/interfaces/catalog/ICategoryPage'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error, status } = await useAsyncData(
	() => `catalog-category-${slug.value}`,
	async () => $fetch<ICategoryPage>(`/api/catalog/${slug.value}/`),
	{ watch: [slug] }
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Категория не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))
</script>

<template>
	<div class="catalog-category offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<CatalogHeader
					class="catalog-category__header"
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					:description="data.category?.description"
					:collections="data.category?.collections"
				/>

				<CatalogListing
					:products="data.products || []"
					:filters="data.filters || []"
					:sort-options="data.sortOptions || []"
					:per-page="data.pagination?.perPage || 12"
				/>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-category {
	&__header {
		margin-bottom: 28px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}
}
</style>
