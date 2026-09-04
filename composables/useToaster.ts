interface IToast {
	isShown: boolean
	title: string
	text: string
	/** 'success' | 'error' | 'info' */
	type: string
}

/* Общий тост приложения: сообщение показывает AppToaster в app.vue,
   а вызывать showToast можно из любого компонента (добавление в корзину, ошибки). */
export const useToaster = () => {
	const toast = useState<IToast>('app-toast', () => ({ isShown: false, title: '', text: '', type: 'success' }))

	const showToast = (payload: { title: string; text?: string; type?: string }) => {
		// Гасим предыдущий тост, чтобы перезапустился таймер автоскрытия и анимация
		toast.value.isShown = false

		nextTick(() => {
			toast.value = {
				isShown: true,
				title: payload.title,
				text: payload.text || '',
				type: payload.type || 'success',
			}
		})
	}

	const hideToast = () => {
		toast.value.isShown = false
	}

	return { toast, showToast, hideToast }
}
