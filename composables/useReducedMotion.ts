import { ref, onMounted, onUnmounted } from 'vue'

/* Отслеживает системную настройку «уменьшить движение» — все GSAP-анимации обязаны её уважать */
export const useReducedMotion = () => {
	const isReducedMotion = ref<boolean>(false)
	let mediaQuery: MediaQueryList | null = null

	const updateIsReducedMotion = (event: MediaQueryListEvent | MediaQueryList) => {
		isReducedMotion.value = event.matches
	}

	onMounted(() => {
		mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		updateIsReducedMotion(mediaQuery)
		mediaQuery.addEventListener('change', updateIsReducedMotion)
	})

	onUnmounted(() => {
		if (mediaQuery) mediaQuery.removeEventListener('change', updateIsReducedMotion)
	})

	return { isReducedMotion }
}
