import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useScrollController } from '@/composables/useScrollController'

export const useMenuStore = defineStore('menu', () => {
	const menuName = ref<string | undefined>(undefined)

	const toggleState = (name: string) => {
		if (menuName.value === name) {
			useScrollController.enableScroll()
			menuName.value = ''
		} else {
			useScrollController.disableScroll()
			menuName.value = name
		}
	}

	const closeMenu = () => {
		menuName.value = ''
	}

	return { menuName, toggleState, closeMenu }
})
