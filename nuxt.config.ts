import checker from 'vite-plugin-checker'

// Страницы магазинного флоу и личного кабинета: закрыты от индексации
const noindexRoutes = [
	'/cart/',
	'/checkout/',
	'/order-success/',
	'/favorites/',
	'/compare/',
	'/search/',
	'/login/',
	'/personal-account/**',
]

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: false },
	devServer: {
		port: 3000,
		host: '0.0.0.0',
	},
	router: {
		// https://router.vuejs.org/api/interfaces/routeroptions.html
		options: {
			linkActiveClass: 'active',
			linkExactActiveClass: 'active-exact',
		},
	},
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
		head: {
			htmlAttrs: { lang: 'ru' },
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'format-detection', content: 'telephone=no' },
				{ name: 'msapplication-TileColor', content: '#b4632a' },
				{ name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
				{ name: 'theme-color', content: '#f7f4ef' },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon/favicon-48x48.png' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
				{ rel: 'manifest', href: '/favicon/site.webmanifest' },
				{ rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#b4632a' },
			],
		},
	},
	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@pinia/nuxt',
		'nuxt-icons',
		'@hypernym/nuxt-gsap',
		'nuxt-schema-org',
		'@nuxtjs/sitemap',
		'@nuxtjs/robots',
		'@formkit/auto-animate/nuxt',
		'@sidebase/nuxt-auth',
		// Карта салонов подключается только при заданном ключе: без него модуль падает на старте
		...(process.env.YANDEX_MAPS_KEY ? ['vue-yandex-maps/nuxt'] : []),
	],
	gsap: {
		extraPlugins: {
			scrollTrigger: true,
		},
	},
	site: {
		url: process.env.SITE_URL,
		name: 'Мебель Шоп',
		description: 'Интернет-магазин мебели «Мебель Шоп»: диваны, кровати, шкафы, кухни и столы с доставкой и сборкой',
		defaultLocale: 'ru', // not needed if you have @nuxtjs/i18n installed
		trailingSlash: true,
	},
	// Служебные страницы (корзина, оформление, кабинет, поиск) не индексируются:
	// один список на robots.txt и на sitemap.xml
	robots: {
		// В robots.txt закрывающий слэш уже покрывает вложенные адреса, glob-звёздочки не нужны
		disallow: noindexRoutes.map(route => route.replace('/**', '/')),
	},
	sitemap: {
		autoLastmod: true,
		exclude: noindexRoutes,
		// Динамические URL (категории, коллекции, товары, статьи, проекты) отдаёт свой эндпоинт
		sources: ['/api/__sitemap__/urls'],
		defaults: {
			changefreq: 'weekly',
			priority: 0.7,
		},
	},
	yandexMaps: {
		apikey: process.env.YANDEX_MAPS_KEY || '',
		lang: 'ru_RU',
	},
	css: ['normalize.css', 'vue-final-modal/style.css', '~/assets/css/main.css', '~/assets/scss/main.scss'],
	runtimeConfig: {
		public: {
			baseUrl: process.env.BASE_URL,
			siteUrl: process.env.SITE_URL,
			// Флаг для страниц: без ключа модуль карт не подключён, показываем список салонов
			yandexMapsEnabled: Boolean(process.env.YANDEX_MAPS_KEY),
		},
	},
	vite: {
		plugins: [
			checker({
				eslint: {
					useFlatConfig: true,
					lintCommand: 'eslint "**/*.{js,ts,vue}"',
				},
				stylelint: {
					lintCommand: 'stylelint "**/*.{css,scss,vue}"',
				},
			}) as any,
		],
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ['legacy-js-api'],
				},
			},
		},
	},
	auth: {
		globalAppMiddleware: false,
		disableServerSideAuth: false,
		originEnvKey: process.env.BASE_URL,
		baseURL: `${process.env.BASE_URL}/api/`,
		provider: {
			type: 'local',
			pages: {
				login: '/login/',
			},
			endpoints: {
				signIn: { path: '/auth-login/', method: 'post' },
				signOut: { path: '/auth-logout/', method: 'post' },
				getSession: { path: '/auth-session/', method: 'get' },
			},
			token: {
				signInResponseTokenPointer: '/token',
				type: 'Bearer',
				cookieName: 'auth.token',
				headerName: 'Authorization',
				maxAgeInSeconds: 28800, // 8 часов
				sameSiteAttribute: 'lax',
				secureCookieAttribute: false,
				httpOnlyCookieAttribute: false,
			},
		},
	},
})
