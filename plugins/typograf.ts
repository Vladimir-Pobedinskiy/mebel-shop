import Typograf from 'typograf'

export default defineNuxtPlugin(nuxtApp => {
	const tp = new Typograf({ locale: ['ru'] })
	tp.enableRule('common/nbsp/afterShortWord')

	nuxtApp.vueApp.directive('typograf', {
		mounted(el) {
			el.innerHTML = tp.execute(el.innerHTML)
		},
		updated(el) {
			el.innerHTML = tp.execute(el.innerHTML)
		}
	})

	return {
		provide: {
			typograf: tp
		}
	}
})
