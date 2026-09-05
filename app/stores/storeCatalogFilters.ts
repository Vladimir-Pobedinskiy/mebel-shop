import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'

export interface ICatalogFiltersState {
	priceFrom: number | null
	priceTo: number | null
	widthFrom: number | null
	widthTo: number | null
	heightFrom: number | null
	heightTo: number | null
	material: string[]
	color: string[]
	brand: string[]
	collection: string[]
	style: string[]
	constructionType: string[]
	bodyMaterial: string[]
	facadeMaterial: string[]
	availability: string[]
	inStock: boolean
}

/* Имя диапазона в db.json → пара ключей состояния `<name>From` / `<name>To` */
export type ICatalogRangeName = 'price' | 'width' | 'height'

const createEmptyState = (): ICatalogFiltersState => ({
	priceFrom: null,
	priceTo: null,
	widthFrom: null,
	widthTo: null,
	heightFrom: null,
	heightTo: null,
	material: [],
	color: [],
	brand: [],
	collection: [],
	style: [],
	constructionType: [],
	bodyMaterial: [],
	facadeMaterial: [],
	availability: [],
	inStock: false,
})

export const MULTI_KEYS: (keyof ICatalogFiltersState)[] = [
	'material',
	'color',
	'brand',
	'collection',
	'style',
	'constructionType',
	'bodyMaterial',
	'facadeMaterial',
	'availability',
]

export const RANGE_KEYS: ICatalogRangeName[] = ['price', 'width', 'height']

/* Группу фильтров из db.json показываем только если стор умеет её применять */
export const isMultiKey = (name: string): name is keyof ICatalogFiltersState =>
	MULTI_KEYS.includes(name as keyof ICatalogFiltersState)

export const isRangeKey = (name: string): name is ICatalogRangeName => RANGE_KEYS.includes(name as ICatalogRangeName)

export const useCatalogFiltersStore = defineStore('catalogFilters', () => {
	const filters = ref<ICatalogFiltersState>(createEmptyState())
	const sort = ref<string>('popular')
	const page = ref<number>(1)

	const rangeValue = (name: ICatalogRangeName) => ({
		from: filters.value[`${name}From`] as number | null,
		to: filters.value[`${name}To`] as number | null,
	})

	// Количество применённых фильтров — для бейджа на кнопке «Фильтры»
	const activeCount = computed(() => {
		let count = 0
		RANGE_KEYS.forEach(name => {
			const { from, to } = rangeValue(name)
			if (from !== null || to !== null) count += 1
		})
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

	const setRange = (name: ICatalogRangeName, from: number | null, to: number | null) => {
		filters.value = { ...filters.value, [`${name}From`]: from, [`${name}To`]: to }
		page.value = 1
	}

	const setPrice = (from: number | null, to: number | null) => setRange('price', from, to)

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

		RANGE_KEYS.forEach(name => {
			const { from, to } = rangeValue(name)
			if (from !== null) query[`${name}From`] = String(from)
			if (to !== null) query[`${name}To`] = String(to)
		})
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

		RANGE_KEYS.forEach(name => {
			const from = readString(query[`${name}From`])
			const to = readString(query[`${name}To`])
			if (from) (state[`${name}From`] as number | null) = Number(from)
			if (to) (state[`${name}To`] as number | null) = Number(to)
		})

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
		rangeValue,
		toggleValue,
		setRange,
		setPrice,
		setInStock,
		setSort,
		setPage,
		reset,
		toQuery,
		fromQuery,
	}
})
