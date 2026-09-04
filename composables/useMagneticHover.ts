import { onMounted, onUnmounted, type Ref } from 'vue'
import { screens } from '@/utils/utils'

/* Магнитные кнопки: элемент слегка тянется за курсором и упруго возвращается назад.
   Только десктоп с мышью и только без prefers-reduced-motion — на тач-устройствах
   обработчики не навешиваются вовсе.
   Работает по селектору внутри scope, поэтому сигнатуру UIButton менять не нужно. */
export const useMagneticHover = (scope: Ref<HTMLElement | null>, selector: string, strength = 0.25) => {
	const nuxtApp = useNuxtApp()
	const cleanups: (() => void)[] = []

	onMounted(() => {
		if (!scope.value) return
		if (window.innerWidth < parseInt(screens.desktop)) return
		if (!window.matchMedia('(pointer: fine)').matches) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const { $gsap } = nuxtApp
		const elements = Array.from(scope.value.querySelectorAll<HTMLElement>(selector))

		elements.forEach(element => {
			const onMove = (event: MouseEvent) => {
				const { left, top, width, height } = element.getBoundingClientRect()

				$gsap.to(element, {
					x: (event.clientX - (left + width / 2)) * strength,
					y: (event.clientY - (top + height / 2)) * strength,
					duration: 0.4,
					ease: 'power3.out',
				})
			}

			const onLeave = () => {
				$gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
			}

			element.addEventListener('mousemove', onMove)
			element.addEventListener('mouseleave', onLeave)

			cleanups.push(() => {
				element.removeEventListener('mousemove', onMove)
				element.removeEventListener('mouseleave', onLeave)
				$gsap.killTweensOf(element)
				$gsap.set(element, { clearProps: 'x,y' })
			})
		})
	})

	onUnmounted(() => {
		cleanups.forEach(cleanup => cleanup())
		cleanups.length = 0
	})
}
