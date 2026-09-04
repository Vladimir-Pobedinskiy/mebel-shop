<script setup lang="ts">
import type { IFilter } from '@/interfaces/catalog/IFilter'
import type { IProduct } from '@/interfaces/product/IProduct'
import type { ISelect } from '@/interfaces/ISelect'
import { useCatalogFilters } from '@/composables/useCatalogFilters'
import { productsCountLabel } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		products: IProduct[]
		filters: IFilter[]
		sortOptions: ISelect[]
		perPage?: number
		pending?: boolean
	}>(),
	{
		perPage: 12,
		pending: false,
	}
)

const productsList = computed(() => props.products)
const perPageValue = computed(() => props.perPage)

const { store, visibleProducts, total, totalPages } = useCatalogFilters(productsList, perPageValue)

const isFiltersOpen = ref<boolean>(false)

const listRef = ref<HTMLElement | null>(null)

// После смены страницы возвращаем пользователя к началу списка, а не оставляем внизу
watch(
	() => store.page,
	() => {
		if (!import.meta.client || !listRef.value) return
		const top = listRef.value.getBoundingClientRect().top + window.scrollY - 140
		window.scrollTo({ top, behavior: 'smooth' })
	}
)
</script>

<template>
	<div ref="listRef" class="catalog-listing">
		<div class="catalog-listing__inner">
			<aside class="catalog-listing__aside">
				<CatalogFilters v-model:is-open="isFiltersOpen" :filters="filters" :results-count="total" />
			</aside>

			<div class="catalog-listing__main">
				<div class="catalog-listing__toolbar">
					<button class="catalog-listing__filters-btn" type="button" @click="isFiltersOpen = true">
						<NuxtIcon class="catalog-listing__filters-icon" name="icon-filter" filled />
						<span class="catalog-listing__filters-label button-typo">Фильтры</span>
						<span v-if="store.activeCount" class="catalog-listing__filters-count">{{ store.activeCount }}</span>
					</button>

					<p class="catalog-listing__total text-s">{{ productsCountLabel(total) }}</p>

					<CatalogSort class="catalog-listing__sort" :options="sortOptions" />
				</div>

				<CatalogActiveFilters class="catalog-listing__active" />

				<CatalogGrid class="catalog-listing__grid" :products="visibleProducts" :pending="pending" />

				<UIPagination
					v-if="totalPages > 1"
					class="catalog-listing__pagination"
					:page-total="totalPages"
					:show-more="false"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-listing {
	&__inner {
		display: flex;
		flex-direction: column;
		gap: 24px;

		@media (min-width: variables.$desktop-small) {
			flex-direction: row;
			align-items: flex-start;
			gap: 32px;
		}
	}

	&__aside {
		@media (min-width: variables.$desktop-small) {
			width: 280px;
			flex: 0 0 auto;
		}

		@media (min-width: variables.$desktop-big) {
			width: 300px;
		}
	}

	&__main {
		display: flex;
		min-width: 0;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 20px;
	}

	&__toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	&__filters-btn {
		display: inline-flex;
		align-items: center;
		padding: 10px 16px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		background-color: variables.$color-surface;
		color: variables.$color-ink;
		cursor: pointer;
		gap: 8px;
		transition: border-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			display: none;
		}
	}

	&__filters-icon {
		width: 16px;
		height: 16px;
	}

	&__filters-count {
		display: inline-flex;
		min-width: 20px;
		height: 20px;
		align-items: center;
		justify-content: center;
		padding: 0 6px;
		border-radius: 999px;
		background-color: variables.$color-accent;
		color: variables.$color-white;
		font-size: 12px;
		line-height: 1;
	}

	&__total {
		color: variables.$color-ink-soft;
	}

	&__sort {
		width: 100%;
		margin-left: auto;

		@media (min-width: variables.$tablet) {
			width: auto;
		}
	}

	&__pagination {
		margin-top: 12px;
	}
}
</style>
