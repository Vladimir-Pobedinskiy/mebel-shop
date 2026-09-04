import { ref, onMounted, onUnmounted } from 'vue'

export const useScreenHandler = (screen: string) => {
	const isMatchedScreen = ref<boolean | null>(null)

	const updateIsScreen = () => {
		if (window.innerWidth >= parseInt(screen)) {
			isMatchedScreen.value = true
		} else {
			isMatchedScreen.value = false
		}
	}

	onMounted(() => {
		updateIsScreen()
		window.addEventListener('resize', updateIsScreen)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', updateIsScreen)
	})

	return {
		isMatchedScreen,
	}
}
