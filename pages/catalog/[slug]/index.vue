<script setup lang="ts">
import type { ICategoryPage } from '@/interfaces/catalog/ICategoryPage'
import { QUERY_KEYS } from '@/composables/useCatalogFilters'

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

/* Фильтры, сортировка и страницы живут в query. В индекс идёт только чистый URL раздела,
   комбинации закрываем noindex — ссылки при этом остаются обходимыми */
const isQueryView = computed(() => QUERY_KEYS.some(key => route.query[key] !== undefined))

useHead(() => ({
	meta: isQueryView.value ? [{ name: 'robots', content: 'noindex, follow' }] : [],
}))
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
					:show-consult="Boolean(data.intro)"
					:consult-subject="data.seo.h1"
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
