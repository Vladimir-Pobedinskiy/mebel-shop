import { onMounted, onUnmounted } from 'vue'
import { useScreenHandler } from '@/composables/useScreenHandler'
import { screens } from '@/utils/utils'

export const useScrollMagic = () => {
	const isClient = typeof window !== 'undefined'

	const { isMatchedScreen } = useScreenHandler(screens.desktop)
	let controller: any = null
	let ScrollMagic: any = null

	const initController = async (): Promise<void> => {
		if (!isClient || controller || isMatchedScreen.value) return

		// Динамически импортируем ScrollMagic только на клиенте
		ScrollMagic = (await import('scrollmagic')).default
		controller = new ScrollMagic.Controller()
	}

	const setAnimScrollMagic = async (
		trigger: string,
		target: string,
		triggerHook: number = 0.7,
		offset: number = 50
	): Promise<void> => {
		if (
			!isClient ||
			isMatchedScreen.value ||
			!trigger ||
			!target ||
			!document.querySelector(trigger) ||
			!document.querySelector(target)
		)
			return

		if (!ScrollMagic) {
			await initController()
		}

		new ScrollMagic.Scene({
			triggerElement: trigger,
			triggerHook: triggerHook,
			offset: offset,
		})
			.setClassToggle(target, 'visible')
			.addTo(controller)
	}

	onMounted(() => {
		if (isClient) initController()
	})

	onUnmounted(() => {
		if (isClient && controller) {
			// Передаем true, чтобы сбросить все сцены при уничтожении
			controller.destroy(true)
			controller = null
		}
	})

	return { setAnimScrollMagic }
}
