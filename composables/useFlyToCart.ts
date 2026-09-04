/* «Полёт» товара в корзину: клон картинки летит из карточки в иконку корзины в шапке.
   Клон живёт в body с position: fixed и удаляется по завершении анимации.
   При prefers-reduced-motion ничего не создаётся. */
export const useFlyToCart = () => {
	const nuxtApp = useNuxtApp()

	const flyToCart = (source: HTMLElement | null | undefined) => {
		if (!import.meta.client || !source) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const image = source.querySelector('img') || source
		const target = document.querySelector('[data-cart-target]')
		if (!target) return

		const from = image.getBoundingClientRect()
		const to = target.getBoundingClientRect()
		if (!from.width || !from.height) return

		const clone = document.createElement('div')
		clone.className = 'fly-to-cart'
		clone.style.cssText = `
			left: ${from.left}px;
			top: ${from.top}px;
			width: ${from.width}px;
			height: ${from.height}px;
			background-image: url('${image instanceof HTMLImageElement ? image.currentSrc || image.src : ''}');
		`
		document.body.appendChild(clone)

		const { $gsap } = nuxtApp

		$gsap.to(clone, {
			left: to.left + to.width / 2 - 20,
			top: to.top + to.height / 2 - 20,
			width: 40,
			height: 40,
			opacity: 0.2,
			borderRadius: '50%',
			duration: 0.8,
			ease: 'power2.inOut',
			onComplete: () => clone.remove(),
		})
	}

	return { flyToCart }
}
