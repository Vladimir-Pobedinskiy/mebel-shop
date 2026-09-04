import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { IProduct } from '@/interfaces/product/IProduct'

const MAX_COMPARE_ITEMS = 4

export const useCompareStore = defineStore('compare', () => {
	/**
	 * Персист в localStorage: список сравнения переживает перезагрузку страницы.
	 * Ref хранилища не возвращается наружу (иначе Pinia сделала бы его state и затёрла бы
	 * localStorage пустым SSR-пейлоадом), а initOnMounted откладывает чтение до onMounted —
	 * серверная разметка и первый клиентский рендер совпадают. Подробности — в storeCart.
	 */
	const itemsStorage = useLocalStorage<IProduct[]>('mebel-shop-compare', [], { initOnMounted: true })

	const items = computed(() => itemsStorage.value)

	const totalCount = computed(() => itemsStorage.value.length)

	const isEmpty = computed(() => !itemsStorage.value.length)

	const isFull = computed(() => itemsStorage.value.length >= MAX_COMPARE_ITEMS)

	const maxItems = computed(() => MAX_COMPARE_ITEMS)

	const isCompared = (id: number) => itemsStorage.value.some(item => item.id === id)

	const add = (product: IProduct) => {
		if (isCompared(product.id) || isFull.value) return
		itemsStorage.value.push(product)
	}

	const remove = (id: number) => {
		itemsStorage.value = itemsStorage.value.filter(item => item.id !== id)
	}

	const toggle = (product: IProduct) => {
		if (isCompared(product.id)) {
			remove(product.id)
			return
		}
		add(product)
	}

	const clear = () => {
		itemsStorage.value = []
	}

	return { items, totalCount, isEmpty, isFull, maxItems, isCompared, add, remove, toggle, clear }
})
