import { IMaskDirective } from 'vue-imask'
import type { Directive } from 'vue'

export default defineNuxtPlugin(nuxtApp => {
	// Директива объявлена в пакете обобщённой по типу маски, и её сигнатура
	// не сводится к Directive без приведения. На поведение это не влияет
	nuxtApp.vueApp.directive('imask', IMaskDirective as Directive)
})
