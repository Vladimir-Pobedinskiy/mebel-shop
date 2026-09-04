import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IGeneralRequest } from '@/interfaces/api/IGeneralRequest'
import type { IHeader, IFooter, ISocialLink } from '@/interfaces/IGeneral'

export const useGeneralStore = defineStore('general', () => {
	const header = ref<IHeader | undefined>(undefined)
	const footer = ref<IFooter | undefined>(undefined)
	const socials = ref<ISocialLink[]>([])

	const getGeneralData = async (baseUrl: string): Promise<void> => {
		const { data, error } = await useAsyncData('general-data', async () => {
			return $fetch<IGeneralRequest>(`${baseUrl}/api/general/`)
		})

		if (error.value) {
			throw createError({
				statusCode: error.value.statusCode,
				message: error.value.message || 'Ошибка сервера',
			})
		}

		if (data.value) {
			header.value = data.value.header
			footer.value = data.value.footer
			socials.value = data.value.socials
		}
	}

	return { header, footer, socials, getGeneralData }
})
