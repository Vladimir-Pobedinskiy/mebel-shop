import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt().append({
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'vue/html-self-closing': 'off', // Отключаем правило vue/html-self-closing
		// I hope you understand what you are doing
		'vue/no-v-html': 'off',
	},
})
