# Мебель Шоп

Интернет-магазин мебели на Nuxt 3: каталог с фильтрами, карточка товара, корзина,
избранное, сравнение, оформление заказа, блог, портфолио и контентные страницы.
Данные отдаёт локальный json-server из `db.json`.

> Название бренда рабочее. Точки замены перечислены в разделе «Смена названия».

## Стек

Nuxt 3 · Vue 3 (`script setup`) · TypeScript · Pinia · SCSS
GSAP + ScrollTrigger · Swiper · vee-validate + yup · vue-final-modal
@nuxtjs/sitemap · @nuxtjs/robots · nuxt-schema-org · @nuxt/image · @sidebase/nuxt-auth

## Запуск

```bash
npm install
npm run double     # nuxt dev (3000) + json-server (3001) одновременно
npm run lint       # eslint + stylelint, обязателен перед коммитом
npm run build && npm run preview
```

Переменные окружения — см. `.env.example`:

| Переменная | Назначение |
|---|---|
| `BASE_URL` | адрес источника данных (json-server), `http://localhost:3001` |
| `SITE_URL` | канонический адрес сайта: canonical, Open Graph, sitemap.xml, robots.txt |
| `YANDEX_MAPS_KEY` | ключ Яндекс.Карт; пустой — карта салонов заменяется списком |

`SITE_URL` на проде обязательно заменить на боевой домен: от него считаются
`<link rel="canonical">`, `og:url` и адреса в `sitemap.xml`.

## Структура

```
assets/        scss/{general,mixins,ui}, fonts/, icons/*.svg (nuxt-icons)
components/    App/, UI/, Home/, Catalog/, Product/, Cart/, Checkout/, Blog/, ...
composables/   usePageSeo, useSiteSchemaOrg, useGsapReveal,
               useMagneticHover, useFlyToCart, useToaster, useScreenHandler, ...
interfaces/    I*.ts по разделам
layouts/       default.vue, error-layout.vue
middleware/    add-trailing-slash.global.ts, auth.global.ts
pages/         страницы магазина
plugins/       init.server (general-данные), typograf, vue-final-modal, vue-imask, ...
server/api/    прокси-хендлеры на BASE_URL + источник URL для sitemap
stores/        storeGeneral, storeMenu, storeCart, storeFavorites, storeCompare, storeCatalogFilters
public/        favicon/, img/
db.json, routes.json
```

## Данные

Страница обращается к своему `server/api/<раздел>/index.get.ts`, тот проксирует запрос
на `${BASE_URL}/api/<раздел>/`. `routes.json` перекладывает `/api/*` на ключи `db.json`.
Каждый раздел-страница отдаёт `seo`, `schemaOrg`, `breadcrumbs` и секции страницы.

## SEO

- `usePageSeo(data, options)` — title, description, canonical, Open Graph, Twitter-карточка
  и микроразметка страницы; `BreadcrumbList` собирается автоматически из `breadcrumbs`.
  `options.type` — `website | article | product`, `options.image` — своя og-картинка.
- `useSiteSchemaOrg()` в `app.vue` — глобальные `Organization`, `WebSite`, `WebPage`
  (телефон, адрес и e-mail берутся из `db.json → general`, как в шапке и подвале).
- `robots.txt` и `sitemap.xml` генерируют модули; список закрытых от индексации разделов —
  константа `noindexRoutes` в `nuxt.config.ts` (корзина, оформление, кабинет, поиск).
- Динамические адреса в карту сайта отдаёт `server/api/__sitemap__/urls.get.ts`
  (для полной карты json-server должен быть запущен во время сборки).
- Обложка для соцсетей — `public/img/og-cover.png`, набор иконок — `public/favicon/`.

## Анимации

GSAP-анимации живут в `useGsapReveal` (reveal секций, split-заголовки, параллакс).
Микровзаимодействия: магнитные кнопки (`useMagneticHover`),
курсор-точка (`AppCursor`), «полёт» товара в корзину (`useFlyToCart`), тосты (`useToaster`).

Все эффекты уважают `prefers-reduced-motion`: JS-анимации не создаются,
CSS-анимации гасит правило в `assets/scss/general/scaffolding.scss`.
Магнитные кнопки и курсор-точка включаются только на десктопе с мышью.

## Смена названия

Рабочее «Мебель Шоп» встречается только здесь:

- `site.name` и `site.description` в `nuxt.config.ts`;
- `general.header` / `general.footer` и `seo.title` разделов в `db.json`;
- `assets/icons/icon-logo.svg`, `icon-logo-mobile.svg`;
- `public/favicon/*` и `public/img/og-cover.png` (монограмма и обложка);
- `og:site_name` в `composables/usePageSeo.ts`, названия в `composables/useSiteSchemaOrg.ts`.
