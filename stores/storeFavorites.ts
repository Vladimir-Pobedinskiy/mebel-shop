import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { IProduct } from '@/interfaces/product/IProduct'

export const useFavoritesStore = defineStore('favorites', () => {
	/**
	 * Персист в localStorage: избранное переживает перезагрузку страницы.
	 * Ref хранилища не возвращается наружу (иначе Pinia сделала бы его state и затёрла бы
	 * localStorage пустым SSR-пейлоадом), а initOnMounted откладывает чтение до onMounted —
	 * серверная разметка и первый клиентский рендер совпадают. Подробности — в storeCart.
	 */
	const itemsStorage = useLocalStorage<IProduct[]>('mebel-shop-favorites', [], { initOnMounted: true })

	const items = computed(() => itemsStorage.value)

	const totalCount = computed(() => itemsStorage.value.length)

	const isEmpty = computed(() => !itemsStorage.value.length)

	const isFavorite = (id: number) => itemsStorage.value.some(item => item.id === id)

	const add = (product: IProduct) => {
		if (isFavorite(product.id)) return
		itemsStorage.value.push(product)
	}

	const remove = (id: number) => {
		itemsStorage.value = itemsStorage.value.filter(item => item.id !== id)
	}

	const toggle = (product: IProduct) => {
		if (isFavorite(product.id)) {
			remove(product.id)
			return
		}
		add(product)
	}

	const clear = () => {
		itemsStorage.value = []
	}

	return { items, totalCount, isEmpty, isFavorite, add, remove, toggle, clear }
})
