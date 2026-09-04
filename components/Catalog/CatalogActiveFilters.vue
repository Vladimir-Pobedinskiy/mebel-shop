<script setup lang="ts">
import type { ICatalogFiltersState } from '@/stores/storeCatalogFilters'
import { useCatalogFiltersStore } from '@/stores/storeCatalogFilters'
import { priceFormatter } from '@/utils/utils'

const store = useCatalogFiltersStore()

interface IActiveFilter {
	key: string
	label: string
	remove: () => void
}

const MULTI_KEYS: { name: keyof ICatalogFiltersState; prefix: string }[] = [
	{ name: 'collection', prefix: 'Коллекция' },
	{ name: 'material', prefix: 'Материал' },
	{ name: 'color', prefix: 'Цвет' },
	{ name: 'brand', prefix: 'Бренд' },
]

const activeFilters = computed<IActiveFilter[]>(() => {
	const result: IActiveFilter[] = []
	const { priceFrom, priceTo, inStock } = store.filters

	if (priceFrom !== null || priceTo !== null) {
		const from = priceFrom !== null ? `от ${priceFormatter(priceFrom)}` : ''
		const to = priceTo !== null ? `до ${priceFormatter(priceTo)}` : ''

		result.push({
			key: 'price',
			label: `Цена ${[from, to].filter(Boolean).join(' ')}`,
			remove: () => store.setPrice(null, null),
		})
	}

	MULTI_KEYS.forEach(({ name, prefix }) => {
		;(store.filters[name] as string[]).forEach(value => {
			result.push({
				key: `${name}-${value}`,
				label: `${prefix}: ${value}`,
				remove: () => store.toggleValue(name, value),
			})
		})
	})

	if (inStock) {
		result.push({ key: 'inStock', label: 'В наличии', remove: () => store.setInStock(false) })
	}

	return result
})
</script>

<template>
	<div v-if="activeFilters.length" class="catalog-active-filters">
		<ul v-auto-animate class="catalog-active-filters__list">
			<li v-for="filter in activeFilters" :key="filter.key">
				<UITag :label="filter.label" color="light" removable @remove="filter.remove()" />
			</li>
		</ul>

		<button class="catalog-active-filters__reset text-s hover-underline" type="button" @click="store.reset()">
			Сбросить всё
		</button>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-active-filters {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10px 16px;

	&__list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__reset {
		padding: 0;
		border: 0;
		background-color: transparent;
		color: variables.$color-ink-soft;
		cursor: pointer;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}
	}
}
</style>
