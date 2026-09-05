import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { ICartItem } from '~~/interfaces/cart/ICartItem'
import type { IProduct } from '~~/interfaces/product/IProduct'

/* Промокоды-заглушки: код → размер скидки в процентах */
const PROMO_CODES: Record<string, number> = {
	MEBEL10: 10,
	UYUT5: 5,
}

export const useCartStore = defineStore('cart', () => {
	/**
	 * Персист в localStorage: корзина переживает перезагрузку страницы.
	 *
	 * Ref-ы хранилища намеренно НЕ возвращаются из стора и наружу отдаются
	 * через computed: возвращённый ref стал бы state Pinia, а тот на клиенте
	 * восстанавливается из SSR-пейлоада (пустой массив) и затирал бы localStorage.
	 *
	 * initOnMounted — чтение хранилища откладывается до onMounted, поэтому серверная
	 * разметка и первый клиентский рендер совпадают (без ошибок гидрации).
	 */
	const itemsStorage = useLocalStorage<ICartItem[]>('mebel-shop-cart', [], { initOnMounted: true })
	const promoStorage = useLocalStorage<string>('mebel-shop-cart-promo', '', { initOnMounted: true })

	const items = computed(() => itemsStorage.value)
	const promo = computed(() => promoStorage.value)

	const totalCount = computed(() => itemsStorage.value.reduce((sum, item) => sum + item.quantity, 0))

	const subtotal = computed(() => itemsStorage.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

	// Сумма выгоды по акциям: разница между старыми ценами и текущими
	const discount = computed(() =>
		itemsStorage.value.reduce((sum, item) => sum + (item.oldPrice ? (item.oldPrice - item.price) * item.quantity : 0), 0)
	)

	const promoPercent = computed(() => PROMO_CODES[promoStorage.value] ?? 0)

	// Скидка по промокоду не суммируется с акционной — считается от текущей суммы
	const promoDiscount = computed(() => Math.round((subtotal.value * promoPercent.value) / 100))

	const totalPrice = computed(() => Math.max(0, subtotal.value - promoDiscount.value))

	const isEmpty = computed(() => !itemsStorage.value.length)

	const isInCart = (id: number) => itemsStorage.value.some(item => item.id === id)

	const add = (product: IProduct, quantity: number = 1, variant: string | null = null) => {
		const existing = itemsStorage.value.find(item => item.id === product.id && item.variant === variant)

		if (existing) {
			existing.quantity += quantity
			return
		}

		itemsStorage.value.push({
			id: product.id,
			slug: product.slug,
			title: product.title,
			price: product.price,
			oldPrice: product.oldPrice,
			quantity,
			variant,
			img: product.img,
			url: product.url,
		})
	}

	const remove = (id: number, variant: string | null = null) => {
		itemsStorage.value = itemsStorage.value.filter(item => !(item.id === id && item.variant === variant))
	}

	const updateQty = (id: number, quantity: number, variant: string | null = null) => {
		const existing = itemsStorage.value.find(item => item.id === id && item.variant === variant)
		if (!existing) return

		if (quantity <= 0) {
			remove(id, variant)
			return
		}

		existing.quantity = quantity
	}

	// Возвращает false, если код неизвестен — страница покажет ошибку
	const applyPromo = (code: string) => {
		const normalized = code.trim().toUpperCase()

		if (!PROMO_CODES[normalized]) return false

		promoStorage.value = normalized
		return true
	}

	const resetPromo = () => {
		promoStorage.value = ''
	}

	const clear = () => {
		itemsStorage.value = []
		resetPromo()
	}

	return {
		items,
		promo,
		totalCount,
		subtotal,
		discount,
		promoPercent,
		promoDiscount,
		totalPrice,
		isEmpty,
		isInCart,
		add,
		remove,
		updateQty,
		applyPromo,
		resetPromo,
		clear,
	}
})
