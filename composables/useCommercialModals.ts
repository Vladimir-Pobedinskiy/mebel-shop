interface ICommercialModalsState {
	isCallbackOpen: boolean
	isCalcPriceOpen: boolean
	isPriceRequestOpen: boolean
	/** раздел или модель, из которых открыли расчёт */
	subject: string
	/** подпись в модалке прайса — задаёт блок, из которого её открыли */
	priceNote: string
}

/* Сквозные коммерческие модалки: обратный звонок, расчёт стоимости и запрос прайса.
   Состояние общее, сами окна монтирует AppCommercialModals в app.vue — так шапка,
   бургер и блоки страниц открывают одно и то же окно, а не свои копии. */
export const useCommercialModals = () => {
	const state = useState<ICommercialModalsState>('commercial-modals', () => ({
		isCallbackOpen: false,
		isCalcPriceOpen: false,
		isPriceRequestOpen: false,
		subject: '',
		priceNote: '',
	}))

	const openCallback = () => {
		state.value.isCallbackOpen = true
	}

	const openCalcPrice = (subject = '') => {
		state.value.subject = subject
		state.value.isCalcPriceOpen = true
	}

	const openPriceRequest = (note = '') => {
		state.value.priceNote = note
		state.value.isPriceRequestOpen = true
	}

	return { state, openCallback, openCalcPrice, openPriceRequest }
}
