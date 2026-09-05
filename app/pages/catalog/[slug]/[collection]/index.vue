<script setup lang="ts">
import type { ICategoryPage } from '~~/interfaces/catalog/ICategoryPage'
import type { IFilter } from '~~/interfaces/catalog/IFilter'
import { slugify } from '@/utils/utils'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const collectionSlug = computed(() => String(route.params.collection))

/* Коллекция — срез категории: json-server отдаёт категорию целиком,
   а страница показывает только товары нужной коллекции */
const { data, error, status } = await useAsyncData(
	() => `catalog-collection-${slug.value}-${collectionSlug.value}`,
	async () => $fetch<ICategoryPage>(`/api/catalog/${slug.value}/`),
	{ watch: [slug, collectionSlug] }
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Категория не найдена',
		fatal: true,
	})
}

const products = computed(() =>
	(data.value?.products || []).filter(product => slugify(product.collection) === collectionSlug.value)
)

if (data.value && !products.value.length) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Коллекция не найдена',
		fatal: true,
	})
}

const collectionTitle = computed(() => products.value[0]?.collection || '')

const collectionLink = computed(() =>
	(data.value?.category?.collections || []).find(link => link.url === route.path)
)

/* Фильтр «Коллекция» на этой странице лишний, остальные пересчитываются
   по товарам коллекции — иначе счётчики и диапазон цены обещают несуществующее */
const filters = computed<IFilter[]>(() => {
	const source = data.value?.filters || []
	const list = products.value

	return source
		.filter(filter => filter.name !== 'collection')
		.map(filter => {
			if (filter.type === 'range') {
				const prices = list.map(product => product.price)
				return { ...filter, min: Math.min(...prices), max: Math.max(...prices) }
			}

			const countBy = (value: string) =>
				list.filter(product => {
					if (filter.name === 'inStock') return product.inStock
					return String(product[filter.name as keyof typeof product]) === value
				}).length

			return {
				...filter,
				options: (filter.options || [])
					.map(option => ({ ...option, count: countBy(option.value) }))
					.filter(option => option.count > 0),
			}
		})
		.filter(filter => filter.type === 'range' || (filter.options || []).length > 0)
})

const breadcrumbs = computed(() => [
	...(data.value?.breadcrumbs || []),
	{ url: route.path, label: collectionLink.value?.label || collectionTitle.value },
])

const pageTitle = computed(() => `${data.value?.category?.title} — коллекция ${collectionTitle.value}`)

// SEO собирается из данных категории: у коллекции нет своего раздела в db.json
const seoData = computed(() => {
	if (!data.value) return null

	return {
		seo: {
			...data.value.seo,
			h1: pageTitle.value,
			title: `${pageTitle.value} — Мебель Шоп`,
			canonical: '',
		},
		schemaOrg: data.value.schemaOrg,
	}
})

usePageSeo(seoData)
</script>

<template>
	<div class="catalog-collection offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<CatalogHeader
					class="catalog-collection__header"
					:breadcrumbs="breadcrumbs"
					:title="pageTitle"
					:description="data.category?.description"
					:collections="data.category?.collections"
					:active-url="route.path"
				/>

				<CatalogListing
					:products="products"
					:filters="filters"
					:sort-options="data.sortOptions || []"
					:per-page="data.pagination?.perPage || 12"
				/>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-collection {
	&__header {
		margin-bottom: 28px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}
}
</style>
