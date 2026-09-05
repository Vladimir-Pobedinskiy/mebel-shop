/* Типы, которых не хватает подключённым пакетам.

   @hypernym/nuxt-gsap кладёт $gsap и $ScrollTrigger в NuxtApp, но объявления
   для них не поставляет: без этого дополнения useNuxtApp().$gsap имеет тип
   unknown, и вся анимационная обвязка (useGsapReveal и её потребители)
   не проверяется по типам. */
import type { gsap } from 'gsap'
import type { ScrollTrigger } from 'gsap/ScrollTrigger'

declare module '#app' {
	interface NuxtApp {
		$gsap: typeof gsap
		$ScrollTrigger: typeof ScrollTrigger
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$gsap: typeof gsap
		$ScrollTrigger: typeof ScrollTrigger
	}
}

export {}
