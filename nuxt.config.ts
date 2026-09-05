import checker from 'vite-plugin-checker'

// Страницы магазинного флоу, авторизации и личного кабинета: закрыты от индексации
const noindexRoutes = [
	'/cart/',
	'/checkout/',
	'/order-success/',
	'/favorites/',
	'/compare/',
	'/search/',
	'/login/',
	'/registration/',
	'/success-registration/',
	'/password-recovery/',
	'/new-password/',
	'/personal-account/**',
]

/* Адрес витрины. Когда проект живёт в подпапке домена (GitHub Pages), модулям
   site-config — sitemap и schema.org — нужен origin: базовый префикс они
   подставляют в путь сами, и полный адрес дал бы его дважды.
   usePageSeo работает с полным адресом из runtimeConfig.public.siteUrl. */
const siteUrl = process.env.SITE_URL || ''
const siteOrigin = siteUrl ? new URL(siteUrl).origin : undefined

/* Базовый путь витрины: '/' в обычной сборке, '/mebel-shop/' на GitHub Pages.
   Адреса в sitemap модуль сверяет уже с префиксом, поэтому исключения тоже с ним */
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const withBase = (route: string) => (baseURL === '/' ? route : `${baseURL.replace(/\/$/, '')}${route}`)

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
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
		url: siteOrigin,
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
		// robots.txt читается только из корня домена. Когда витрина собирается в подпапку
		// (GitHub Pages), файл отдать некуда — модуль в этом случае откажется его собирать
		robotsTxt: !process.env.NUXT_APP_BASE_URL,
	},
	sitemap: {
		autoLastmod: true,
		// Корневой маршрут витрины в подпапке приходит в модуль уже с префиксом и получает
		// его второй раз — этот ложный адрес убираем. Главная попадает в карту отдельно
		exclude: [...noindexRoutes.map(withBase), ...(baseURL === '/' ? [] : [withBase(baseURL)])],
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
	nitro: {
		prerender: {
			// Страницы ещё нет, а ссылки на неё в шапке и подвале есть:
			// без этого краулер получает 404 и роняет nuxt generate.
			// Регулярка, а не строка: при сборке в подпапку домена путь идёт с префиксом.
			// Личный кабинет по той же причине: ссылка в шапке есть, страницы ещё нет
			ignore: [/\/sale\/$/, /\/personal-account\//],
			// Маршруты без завершающего слэша (их добавляет сам Nuxt) отвечают редиректом.
			// С autoSubfolderIndex они писались бы в тот же index.html, что и готовая
			// страница, и затирали её заглушкой-редиректом — храним их отдельными .html
			autoSubfolderIndex: false,
		},
	},
	css: ['normalize.css', 'vue-final-modal/style.css', '~/assets/css/main.css', '~/assets/scss/main.scss'],
	runtimeConfig: {
		public: {
			baseUrl: process.env.BASE_URL,
			siteUrl: process.env.SITE_URL,
			// Флаг для страниц: без ключа модуль карт не подключён, показываем список салонов
			yandexMapsEnabled: Boolean(process.env.YANDEX_MAPS_KEY),
			// Витрина без бэкенда (GitHub Pages): формы показывают успех, не уходя в /api/
			staticDemo: process.env.STATIC_DEMO === 'true',
		},
	},
	/* Линтер на лету нужен только в разработке. В продакшн-сборке он лишний:
	   перед build отрабатывает npm run lint, а в CI линт вынесен отдельным шагом.
	   Заодно из сборки уходит vite-plugin-checker с его конфликтом версий meow */
	$development: {
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
		},
	},
	vite: {
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
				signUp: { path: '/auth-registration/', method: 'post' },
				signOut: { path: '/auth-logout/', method: 'post' },
				getSession: { path: '/auth-session/', method: 'get' },
			},
			// Форма полей сессии: из неё модуль выводит типы для useAuth().data.
			// Поля те же, что отдаёт /api/auth-session/ в db.json
			session: {
				dataType: {
					id: 'string | number',
					name: 'string',
					phone: 'string',
					email: 'string',
				},
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
