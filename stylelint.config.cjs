module.exports = {
	extends: ['stylelint-config-standard-scss', 'stylelint-prettier/recommended'],
	plugins: [],
	rules: {
		'block-no-empty': process.env.NODE_ENV === 'production' ? true : null,
		'color-hex-length': 'long',

		'color-named': 'never', // Запретить именованные цвета
		'color-no-invalid-hex': true, // Проверка на валидность hex-цветов (оставляем включенной)
		'color-function-notation': null, // Отключаем проверку нотации цветовых функций (rgba, hsla)
		'selector-class-pattern': null,
		'property-no-vendor-prefix': null,
	},
	overrides: [
		{
			files: ['*.vue'],
			customSyntax: 'postcss-html',
		},
	],
}
