import { onUnmounted } from 'vue'

/* Разбивает текст элемента на слова/буквы внутри масок — для split-reveal заголовков.
   Оригинальный текст уезжает в aria-label, сами спаны скрыты от скринридеров. */
export const splitTextToSpans = (element: HTMLElement, mode: 'words' | 'chars' = 'words'): HTMLElement[] => {
	const source = element.textContent?.trim() || ''
	if (!source) return []

	element.setAttribute('aria-label', source)
	element.textContent = ''

	const targets: HTMLElement[] = []
	const words = source.split(/\s+/)

	const createMask = (content: string) => {
		const mask = document.createElement('span')
		mask.className = 'split-mask'

		const inner = document.createElement('span')
		inner.className = 'split-inner'
		inner.textContent = content

		mask.appendChild(inner)
		targets.push(inner)

		return mask
	}

	words.forEach((word, index) => {
		const wordElement = document.createElement('span')
		wordElement.className = 'split-word'
		wordElement.setAttribute('aria-hidden', 'true')

		if (mode === 'chars') {
			Array.from(word).forEach(char => wordElement.appendChild(createMask(char)))
		} else {
			wordElement.appendChild(createMask(word))
		}

		element.appendChild(wordElement)
		if (index < words.length - 1) element.appendChild(document.createTextNode(' '))
	})

	return targets
}

/* Единая точка входа для GSAP-анимаций секции.
   Все твины живут внутри gsap.context со scope-элементом секции: при размонтировании
   контекст откатывается вместе со своими ScrollTrigger'ами.
   При prefers-reduced-motion анимации не создаются вовсе — вёрстка остаётся в исходном виде. */
export const useGsapReveal = () => {
	const nuxtApp = useNuxtApp()
	const contexts: ReturnType<typeof nuxtApp.$gsap.context>[] = []

	const isReducedMotion = () => import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

	const createAnimation = (
		scope: HTMLElement | null | undefined,
		setup: (payload: { gsap: typeof nuxtApp.$gsap; ScrollTrigger: typeof nuxtApp.$ScrollTrigger }) => void
	) => {
		if (!import.meta.client || !scope || isReducedMotion()) return

		const { $gsap, $ScrollTrigger } = nuxtApp
		$gsap.registerPlugin($ScrollTrigger)

		contexts.push($gsap.context(() => setup({ gsap: $gsap, ScrollTrigger: $ScrollTrigger }), scope))
	}

	/* Появление секции: элементы выезжают снизу со stagger.
	   Везде используется пара set + to, а не from: from-твины GSAP пере-рендериваются
	   в начальное состояние на ScrollTrigger.refresh() (её вызывает pinned-скролл коллекций),
	   и элементы навсегда остаются невидимыми. */
	const revealOnScroll = (
		scope: HTMLElement | null | undefined,
		selectors: string,
		options: { start?: string; stagger?: number; y?: number; duration?: number } = {}
	) => {
		createAnimation(scope, ({ gsap }) => {
			gsap.set(selectors, { y: options.y ?? 40, opacity: 0 })

			gsap.to(selectors, {
				y: 0,
				opacity: 1,
				duration: options.duration ?? 0.9,
				ease: 'power3.out',
				stagger: options.stagger ?? 0.1,
				scrollTrigger: {
					trigger: scope as HTMLElement,
					start: options.start ?? 'top 80%',
				},
			})
		})
	}

	onUnmounted(() => {
		contexts.forEach(context => context.revert())
		contexts.length = 0
	})

	return { createAnimation, revealOnScroll, isReducedMotion, splitTextToSpans }
}
