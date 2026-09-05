<script setup lang="ts">
import type { ICatalogFiltersState, ICatalogRangeName } from '@/stores/storeCatalogFilters'
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
	{ name: 'style', prefix: 'Стиль' },
	{ name: 'constructionType', prefix: 'Тип' },
	{ name: 'bodyMaterial', prefix: 'Корпус' },
	{ name: 'facadeMaterial', prefix: 'Фасады' },
	{ name: 'availability', prefix: 'Наличие' },
]

/* Значения availability приходят машинными — в чипсе показываем человеческую подпись */
const AVAILABILITY_LABELS: Record<string, string> = {
	'in-stock': 'В наличии',
	'made-to-order': 'Под заказ',
}

const RANGE_FILTERS: { name: ICatalogRangeName; prefix: string; isPrice: boolean }[] = [
	{ name: 'price', prefix: 'Цена', isPrice: true },
	{ name: 'width', prefix: 'Ширина', isPrice: false },
	{ name: 'height', prefix: 'Высота', isPrice: false },
]

const activeFilters = computed<IActiveFilter[]>(() => {
	const result: IActiveFilter[] = []
	const { inStock } = store.filters

	RANGE_FILTERS.forEach(({ name, prefix, isPrice }) => {
		const { from, to } = store.rangeValue(name)
		if (from === null && to === null) return

		const format = (value: number) => (isPrice ? priceFormatter(value) : `${value} мм`)
		const fromLabel = from !== null ? `от ${format(from)}` : ''
		const toLabel = to !== null ? `до ${format(to)}` : ''

		result.push({
			key: name,
			label: `${prefix} ${[fromLabel, toLabel].filter(Boolean).join(' ')}`,
			remove: () => store.setRange(name, null, null),
		})
	})

	MULTI_KEYS.forEach(({ name, prefix }) => {
		;(store.filters[name] as string[]).forEach(value => {
			result.push({
				key: `${name}-${value}`,
				label: `${prefix}: ${AVAILABILITY_LABELS[value] || value}`,
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
	gap: 10px 16px;
	align-items: center;

	&__list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__reset {
		padding: 0;
		color: variables.$color-ink-soft;
		cursor: pointer;
		background-color: transparent;
		border: 0;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}
	}
}
</style>
