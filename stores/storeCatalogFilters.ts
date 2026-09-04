import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'

export interface ICatalogFiltersState {
	priceFrom: number | null
	priceTo: number | null
	material: string[]
	color: string[]
	brand: string[]
	collection: string[]
	inStock: boolean
}

const createEmptyState = (): ICatalogFiltersState => ({
	priceFrom: null,
	priceTo: null,
	material: [],
	color: [],
	brand: [],
	collection: [],
	inStock: false,
})

const MULTI_KEYS: (keyof ICatalogFiltersState)[] = ['material', 'color', 'brand', 'collection']

export const useCatalogFiltersStore = defineStore('catalogFilters', () => {
	const filters = ref<ICatalogFiltersState>(createEmptyState())
	const sort = ref<string>('popular')
	const page = ref<number>(1)

	// Количество применённых фильтров — для бейджа на кнопке «Фильтры»
	const activeCount = computed(() => {
		let count = 0
		if (filters.value.priceFrom !== null || filters.value.priceTo !== null) count += 1
		MULTI_KEYS.forEach(key => {
			count += (filters.value[key] as string[]).length
		})
		if (filters.value.inStock) count += 1
		return count
	})

	const isEmpty = computed(() => activeCount.value === 0)

	const toggleValue = (name: keyof ICatalogFiltersState, value: string) => {
		const list = filters.value[name] as string[]
		if (!Array.isArray(list)) return

		filters.value = {
			...filters.value,
			[name]: list.includes(value) ? list.filter(item => item !== value) : [...list, value],
		}
		page.value = 1
	}

	const setPrice = (from: number | null, to: number | null) => {
		filters.value.priceFrom = from
		filters.value.priceTo = to
		page.value = 1
	}

	const setInStock = (value: boolean) => {
		filters.value.inStock = value
		page.value = 1
	}

	const setSort = (value: string) => {
		sort.value = value
		page.value = 1
	}

	const setPage = (value: number) => {
		page.value = value
	}

	const reset = () => {
		filters.value = createEmptyState()
		sort.value = 'popular'
		page.value = 1
	}

	// Состояние → query-параметры роутера
	const toQuery = computed<Record<string, string>>(() => {
		const query: Record<string, string> = {}

		if (filters.value.priceFrom !== null) query.priceFrom = String(filters.value.priceFrom)
		if (filters.value.priceTo !== null) query.priceTo = String(filters.value.priceTo)
		MULTI_KEYS.forEach(key => {
			const list = filters.value[key] as string[]
			if (list.length) query[key] = list.join(',')
		})
		if (filters.value.inStock) query.inStock = '1'
		if (sort.value !== 'popular') query.sort = sort.value
		if (page.value > 1) query.page = String(page.value)

		return query
	})

	// Query-параметры роутера → состояние (гидрация при заходе по прямой ссылке)
	const fromQuery = (query: LocationQuery) => {
		const state = createEmptyState()
		const readString = (value: unknown) => (Array.isArray(value) ? value[0] : value)

		const priceFrom = readString(query.priceFrom)
		const priceTo = readString(query.priceTo)
		if (priceFrom) state.priceFrom = Number(priceFrom)
		if (priceTo) state.priceTo = Number(priceTo)

		MULTI_KEYS.forEach(key => {
			const value = readString(query[key])
			if (value) (state[key] as string[]) = String(value).split(',').filter(Boolean)
		})

		state.inStock = readString(query.inStock) === '1'

		filters.value = state
		sort.value = String(readString(query.sort) || 'popular')
		page.value = Number(readString(query.page) || 1)
	}

	return {
		filters,
		sort,
		page,
		activeCount,
		isEmpty,
		toggleValue,
		setPrice,
		setInStock,
		setSort,
		setPage,
		reset,
		toQuery,
		fromQuery,
	}
})
