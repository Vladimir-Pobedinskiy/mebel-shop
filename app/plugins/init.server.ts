import { useGeneralStore } from '@/stores/storeGeneral'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(async nuxtApp => {
	const pinia = nuxtApp.$pinia as Pinia
	const general = useGeneralStore(pinia)
	const config = useRuntimeConfig()

	await general.getGeneralData(config.public.baseUrl)
})
