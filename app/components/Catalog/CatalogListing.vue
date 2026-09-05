<script setup lang="ts">
import type { IFilter } from '~~/interfaces/catalog/IFilter'
import type { IProduct } from '~~/interfaces/product/IProduct'
import type { ISelect } from '~~/interfaces/ISelect'
import { useCatalogFilters } from '@/composables/useCatalogFilters'
import { productsCountLabel } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		products: IProduct[]
		filters: IFilter[]
		sortOptions: ISelect[]
		perPage?: number
		pending?: boolean
		/** блок «запросите консультацию» — только у коммерческих разделов */
		showConsult?: boolean
		/** раздел, о котором спрашивают: уходит в заявку */
		consultSubject?: string
	}>(),
	{
		perPage: 12,
		pending: false,
		showConsult: false,
		consultSubject: '',
	}
)

const productsList = computed(() => props.products)
const perPageValue = computed(() => props.perPage)

const { store, visibleProducts, total, totalPages } = useCatalogFilters(productsList, perPageValue)

const isFiltersOpen = ref<boolean>(false)
const isConsultOpen = ref<boolean>(false)

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

				<div v-if="showConsult" class="catalog-listing__consult">
					<div class="catalog-listing__consult-body">
						<p class="catalog-listing__consult-title h4">Не нашли подходящее?</p>
						<p class="catalog-listing__consult-text text-s">
							Расскажите про проём и задачу — подберём модель или посчитаем мебель по вашим размерам.
						</p>
					</div>

					<UIButton
						class="catalog-listing__consult-btn"
						as="button"
						type="button"
						label="Запросить консультацию"
						show-icon
						@click="isConsultOpen = true"
					/>
				</div>
			</div>
		</div>

		<ModalConsult v-if="showConsult" v-model="isConsultOpen" :subject="consultSubject" />
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
			gap: 32px;
			align-items: flex-start;
		}
	}

	&__aside {
		@media (min-width: variables.$desktop-small) {
			flex: 0 0 auto;
			width: 280px;
		}

		@media (min-width: variables.$desktop-big) {
			width: 300px;
		}
	}

	&__main {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 20px;
		min-width: 0;
	}

	&__toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	&__filters-btn {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		padding: 10px 16px;
		color: variables.$color-ink;
		cursor: pointer;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
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
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		font-size: 12px;
		line-height: 1;
		color: variables.$color-white;
		background-color: variables.$color-accent;
		border-radius: 999px;
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

	&__consult {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px 20px;
		margin-top: 12px;
		background-color: variables.$color-muted;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$tablet) {
			flex-direction: row;
			gap: 24px;
			align-items: center;
			justify-content: space-between;
			padding: 28px 32px;
		}
	}

	&__consult-title {
		margin: 0 0 6px;
	}

	&__consult-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__consult-btn {
		flex: 0 0 auto;
	}
}
</style>
