<script setup lang="ts">
import type { ICatalogPage } from '~~/interfaces/catalog/ICatalogPage'
import { useGsapReveal } from '@/composables/useGsapReveal'

const { data, error, status } = await useAsyncData('catalog-page', async () => $fetch<ICatalogPage>('/api/catalog/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Каталог не найден',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const rootRef = ref<HTMLElement | null>(null)
const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.catalog-page__item', { stagger: 0.08 })
})
</script>

<template>
	<div ref="rootRef" class="catalog-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="catalog-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<div class="catalog-page__head">
					<h1 class="catalog-page__title h1">{{ data.seo.h1 }}</h1>
				</div>

				<ul v-if="data.categories?.length" class="catalog-page__list">
					<li v-for="category in data.categories" :key="category.id" class="catalog-page__item">
						<CatalogCategoryCard :category="category" />
					</li>
				</ul>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-page {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__head {
		margin-bottom: 28px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__title {
		margin: 0;
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}

		@media (min-width: variables.$desktop-big) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__item {
		display: flex;
	}
}
</style>
