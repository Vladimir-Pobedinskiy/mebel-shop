import withNuxt from './.nuxt/eslint.config.mjs'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default withNuxt({
	plugins: {
		prettier: prettierPlugin,
	},
	rules: {
		'prettier/prettier': 'error',
		'vue/multi-word-component-names': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		// I hope you understand what you are doing
		'vue/no-v-html': 'off',
		...prettierConfig.rules,
	},
})
