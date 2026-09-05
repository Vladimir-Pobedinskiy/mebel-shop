/* Breakpoints */
export const screens = {
	mobile: '480px',
	mobileBig: '576px',
	tablet: '768px',
	tabletBig: '992px',
	desktopSmall: '1024px',
	desktop: '1200px',
	desktopBig: '1400px',
	fullHd: '1920px',
	twoK: '2560px',
	fourK: '3840px',
}

/* Склонение числительных. Второй аргумент — три формы: «товар», «товара», «товаров» */
export const declOfNum = (number: number, txt: string[]) => {
	const cases = [2, 0, 1, 1, 1, 2]
	const caseIndex = number % 100 > 4 && number % 100 < 20 ? 2 : (cases[number % 10 < 5 ? number % 10 : 5] ?? 2)
	return txt[caseIndex] ?? ''
}

// priceFormatter
export const priceFormatter = (value: number) => {
	if (value === null || value === undefined) return ''
	if (value === 0) return '0 ₽'
	const parts = value.toString().split('.')
	parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
	return `${parts.join(',')} ₽`
}

/* clear Object */
export const clearObject = (obj: any) => {
	Object.keys(obj).forEach(key => {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			clearObject(obj[key]) // Рекурсия
		}
		obj[key] = null
	})
}

/* getCurrentDate */
export const getCurrentDate = () => {
	const currentDate = new Date()
	const day = String(currentDate.getDate()).padStart(2, '0')
	const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
	const year = currentDate.getFullYear()
	const hours = String(currentDate.getHours()).padStart(2, '0')
	const minutes = String(currentDate.getMinutes()).padStart(2, '0')
	const seconds = String(currentDate.getSeconds()).padStart(2, '0')

	return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`
}

/* Скидка в процентах: старая цена → текущая */
export const discountPercent = (price: number, oldPrice?: number | null) => {
	if (!oldPrice || oldPrice <= price) return 0
	return Math.round(((oldPrice - price) / oldPrice) * 100)
}

/* Подпись количества товаров: 1 товар / 2 товара / 5 товаров */
export const productsCountLabel = (count: number) => {
	return `${count} ${declOfNum(count, ['товар', 'товара', 'товаров'])}`
}

/* Слаг из строки — для служебных нужд (якоря, ключи) */
export const slugify = (value: string) => {
	const map: Record<string, string> = {
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'g',
		д: 'd',
		е: 'e',
		ё: 'e',
		ж: 'zh',
		з: 'z',
		и: 'i',
		й: 'j',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'h',
		ц: 'c',
		ч: 'ch',
		ш: 'sh',
		щ: 'sch',
		ъ: '',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'yu',
		я: 'ya',
	}

	return value
		.toLowerCase()
		.split('')
		.map(char => (char in map ? map[char] : char))
		.join('')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/* Статус заказа: русская подпись из db.json → служебный флаг для стилей */
export const orderStatus = (label: string) => {
	const map: Record<string, string> = {
		новый: 'new',
		подтверждён: 'confirmed',
		'в производстве': 'in-production',
		'в доставке': 'in-delivery',
		выполнен: 'completed',
		отменён: 'cancelled',
	}

	return {
		value: map[label.toLowerCase()] || 'new',
		label,
	}
}

/* Дата из db.json (2026-08-12) → «12 августа 2026» */
export const formatDateRu = (value: string) => {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	const formatted = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)

	// Intl добавляет « г.» в конце — в интерфейсе он лишний
	return formatted.replace(/\s*г\.$/, '')
}

/* Число с неразрывными пробелами между разрядами: 18500 → «18 500» (одинаково на сервере и клиенте) */
export const numberFormatter = (value: number) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
