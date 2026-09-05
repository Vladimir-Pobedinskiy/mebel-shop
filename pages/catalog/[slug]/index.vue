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

/* ItemList листинга: показывает поисковику состав раздела.
   Отдаём только при товарах — пустой список размечать нечем */
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')

if (data.value?.products?.length) {
	useSchemaOrg([
		{
			'@type': 'ItemList',
			name: data.value.seo.h1,
			numberOfItems: data.value.products.length,
			itemListElement: data.value.products.map((product, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: product.title,
				url: `${siteUrl}${product.url}`,
			})),
		},
	])
}

/* Фильтры, сортировка и страницы живут в query. В индекс идёт только чистый URL раздела,
   комбинации закрываем noindex — ссылки при этом остаются обходимыми */
const isQueryView = computed(() => QUERY_KEYS.some(key => route.query[key] !== undefined))

useHead(() => ({
	meta: isQueryView.value ? [{ name: 'robots', content: 'noindex, follow' }] : [],
}))

/* Якорь формы расчёта: на него уводит CTA из вступления */
const CALC_ANCHOR = 'category-calc'
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
			</div>

			<!-- Коммерческие блоки есть только у разделов, где они заведены в db.json:
			     остальные категории рендерят ровно то же, что и раньше -->
			<CategoryIntro
				v-if="data.intro"
				:title="data.introTitle || data.seo.h1"
				:text="data.intro"
				:stats="data.introStats"
				:calc-anchor="data.calcUnit ? CALC_ANCHOR : ''"
			/>

			<CategorySubcategories
				v-if="data.subcategoriesUnit"
				class="catalog-category__unit"
				:subcategories-unit="data.subcategoriesUnit"
			/>

			<div :class="['container', { 'catalog-category__listing': data.subcategoriesUnit }]">
				<CatalogListing
					:products="data.products || []"
					:filters="data.filters || []"
					:sort-options="data.sortOptions || []"
					:per-page="data.pagination?.perPage || 12"
					:show-consult="Boolean(data.intro)"
					:consult-subject="data.seo.h1"
				/>
			</div>

			<CategoryCalcUnit
				v-if="data.calcUnit"
				:id="CALC_ANCHOR"
				class="catalog-category__unit"
				:calc-unit="data.calcUnit"
				:subject="data.seo.h1"
			/>

			<CategoryAdvantages
				v-if="data.advantagesUnit"
				class="catalog-category__unit"
				:advantages-unit="data.advantagesUnit"
			/>

			<CategoryMaterials
				v-if="data.materialsUnit"
				class="catalog-category__unit"
				:materials-unit="data.materialsUnit"
			/>

			<CategoryStages v-if="data.stagesUnit" class="catalog-category__unit" :stages-unit="data.stagesUnit" />

			<CategoryDelivery v-if="data.deliveryUnit" class="catalog-category__unit" :delivery-unit="data.deliveryUnit" />

			<CategoryWarranty v-if="data.warrantyUnit" class="catalog-category__unit" :warranty-unit="data.warrantyUnit" />

			<CategoryProjects v-if="data.projectsUnit" class="catalog-category__unit" :projects-unit="data.projectsUnit" />

			<!-- Блок доверия сквозной: сертификаты, производство, счётчики и отзывы -->
			<AppTrustUnit v-if="data.intro" class="catalog-category__unit" />

			<CategoryFaq v-if="data.faqUnit" class="catalog-category__unit" :faq-unit="data.faqUnit" />

			<CategoryLinks v-if="data.linksUnit" class="catalog-category__unit" :links-unit="data.linksUnit" />
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

	// Отступ между коммерческими секциями — как между секциями главной
	&__unit,
	&__listing {
		margin-top: 60px;

		@media (min-width: variables.$desktop) {
			margin-top: 100px;
		}
	}
}
</style>
