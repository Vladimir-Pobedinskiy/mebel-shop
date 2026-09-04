import { computed, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { LocationQuery } from 'vue-router'
import type { IProduct } from '@/interfaces/product/IProduct'
import { useCatalogFiltersStore } from '@/stores/storeCatalogFilters'

/* Query-параметры, которыми владеет каталог. Остальные параметры страницы не трогаем. */
const QUERY_KEYS = ['priceFrom', 'priceTo', 'material', 'color', 'brand', 'collection', 'inStock', 'sort', 'page']

/* Сравнение наборов query-параметров без оглядки на порядок ключей */
const stringifyQuery = (query: Record<string, string>) =>
	Object.keys(query)
		.sort()
		.map(key => `${key}=${query[key]}`)
		.join('&')

/* Фильтрация, сортировка и пагинация списка товаров категории.
   Источник данных — json-server, он отдаёт всю категорию целиком, поэтому вся выборка
   считается на клиенте, а состояние живёт в storeCatalogFilters и синхронизируется с URL. */
export const useCatalogFilters = (products: ComputedRef<IProduct[]>, perPage: ComputedRef<number>) => {
	const route = useRoute()
	const router = useRouter()
	const store = useCatalogFiltersStore()

	// URL — источник истины при первом рендере и при переходе на другую категорию
	store.fromQuery(route.query)

	// Срез query-параметров каталога из текущего маршрута
	const routeQuery = computed<Record<string, string>>(() => {
		const result: Record<string, string> = {}

		QUERY_KEYS.forEach(key => {
			const value = route.query[key]
			const single = Array.isArray(value) ? value[0] : value
			if (single) result[key] = String(single)
		})

		return result
	})

	// Состояние → URL. Сравнение до записи не даёт watcher'ам зациклиться друг на друге
	watch(
		() => store.toQuery,
		value => {
			if (stringifyQuery(value) === stringifyQuery(routeQuery.value)) return

			// Параметры, которыми каталог не управляет (utm-метки и прочее), переносим как есть
			const rest: LocationQuery = Object.fromEntries(
				Object.entries(route.query).filter(([key]) => !QUERY_KEYS.includes(key))
			)

			router.replace({ query: { ...rest, ...value } })
		},
		{ deep: true }
	)

	// URL → состояние: кнопки «назад/вперёд» браузера и UIPagination, пишущая page в query
	watch(routeQuery, value => {
		if (stringifyQuery(value) === stringifyQuery(store.toQuery)) return
		store.fromQuery(route.query)
	})

	const matchesList = (list: string[], value: string) => !list.length || list.includes(value)

	const filteredProducts = computed(() => {
		const { priceFrom, priceTo, material, color, brand, collection, inStock } = store.filters

		return products.value.filter(product => {
			if (priceFrom !== null && product.price < priceFrom) return false
			if (priceTo !== null && product.price > priceTo) return false
			if (inStock && !product.inStock) return false

			return (
				matchesList(material, product.material) &&
				matchesList(color, product.color) &&
				matchesList(brand, product.brand) &&
				matchesList(collection, product.collection)
			)
		})
	})

	const sortedProducts = computed(() => {
		const list = [...filteredProducts.value]

		switch (store.sort) {
			case 'price-asc':
				return list.sort((a, b) => a.price - b.price)
			case 'price-desc':
				return list.sort((a, b) => b.price - a.price)
			case 'rating':
				return list.sort((a, b) => b.rating - a.rating)
			case 'new':
				// Сначала помеченные бейджем «Новинка», внутри группы — свежие id
				return list.sort((a, b) => {
					const isNew = (product: IProduct) => (product.badges?.some(badge => badge.name === 'new') ? 1 : 0)
					return isNew(b) - isNew(a) || b.id - a.id
				})
			default:
				// «По популярности» — порядок из db.json, он и есть витринный
				return list
		}
	})

	const total = computed(() => sortedProducts.value.length)

	const totalPages = computed(() => Math.max(1, Math.ceil(total.value / (perPage.value || 12))))

	// Страница за пределами выборки (сузили фильтры на 3-й странице) — возвращаем на первую
	const currentPage = computed(() => Math.min(Math.max(1, store.page), totalPages.value))

	const visibleProducts = computed(() => {
		const start = (currentPage.value - 1) * perPage.value
		return sortedProducts.value.slice(start, start + perPage.value)
	})

	watch(totalPages, value => {
		if (store.page > value) store.setPage(1)
	})

	return {
		store,
		filteredProducts,
		sortedProducts,
		visibleProducts,
		total,
		totalPages,
		currentPage,
	}
}
