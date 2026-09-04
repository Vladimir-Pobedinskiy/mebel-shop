import { onMounted, onUnmounted, shallowRef } from 'vue'
import Lenis from 'lenis'

/* Инстанс один на приложение (Lenis инициализируется в app.vue): к нему обращаются
   блокировка скролла в модалках и бургере, чтобы плавный скролл не боролся
   с фиксированным body */
const lenisInstance = shallowRef<Lenis | null>(null)

/* Останавливаем плавный скролл перед блокировкой страницы */
export const stopSmoothScroll = () => {
	lenisInstance.value?.stop()
}

/* Возвращаем плавный скролл и, если нужно, мгновенно ставим его в сохранённую позицию */
export const startSmoothScroll = (scrollPosition?: number) => {
	if (!lenisInstance.value) return

	lenisInstance.value.start()

	if (typeof scrollPosition === 'number') {
		lenisInstance.value.scrollTo(scrollPosition, { immediate: true, force: true })
	}
}

export const useLenisSmoothScroll = () => {
	onMounted(() => {
		// Уважаем системную настройку «уменьшить движение» — плавный скролл не инициализируем
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const { $gsap, $ScrollTrigger } = useNuxtApp()
		$gsap.registerPlugin($ScrollTrigger)

		lenisInstance.value = new Lenis({
			lerp: 0.06, // linear interpolation (линейная интерполяция) плавность (0.1 и меньше, чем меньше тем медленнее)
			smoothWheel: true,
		})

		// интеграция библиотеки Lenis с GSAP, оптимизация производительности анимаций
		lenisInstance.value.on('scroll', $ScrollTrigger.update)
		$gsap.ticker.add(time => {
			lenisInstance.value?.raf(time * 1000)
		})
		$gsap.ticker.lagSmoothing(0)
	})

	onUnmounted(() => {
		if (lenisInstance.value) {
			lenisInstance.value.destroy()
			lenisInstance.value = null
		}
	})

	return { lenis: lenisInstance }
}
