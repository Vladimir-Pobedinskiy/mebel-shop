import { stopSmoothScroll, startSmoothScroll } from '@/composables/useLenisSmoothScroll'

export const useScrollController = {
	scrollPosition: 0,
	paddingOffset: 0,

	disableScroll() {
		this.scrollPosition = window.scrollY
		this.paddingOffset = window.innerWidth - document.documentElement.clientWidth
		// Lenis крутит свой rAF-скролл и конфликтует с фиксированным body — останавливаем
		stopSmoothScroll()
		document.body.classList.add('lock-js')
		const header = document.querySelector('header') as HTMLElement
		const burgerNav = document.querySelector('.burger-nav') as HTMLElement
		if (header) header.style.paddingRight = `${this.paddingOffset}px`
		if (burgerNav) burgerNav.style.paddingRight = `${this.paddingOffset}px`
		document.body.style.cssText = `
			position: fixed;
      left: 0;
      top: -${this.scrollPosition}px;
      padding-right: ${this.paddingOffset}px;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    `
	},

	enableScroll() {
		document.body.classList.remove('lock-js')
		document.body.style.cssText = ''
		const header = document.querySelector('header') as HTMLElement
		const burgerNav = document.querySelector('.burger-nav') as HTMLElement
		if (header) header.style.paddingRight = '0px'
		if (burgerNav) burgerNav.style.paddingRight = '0px'

		window.scrollTo({
			top: this.scrollPosition,
			behavior: 'auto',
		})

		// Возвращаем плавный скролл ровно в ту же точку, иначе Lenis дёрнет страницу вверх
		startSmoothScroll(this.scrollPosition)
	},
}
