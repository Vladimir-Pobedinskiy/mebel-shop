# Мебель Шоп

Демонстрационный интернет-магазин мебели на Nuxt 4: каталог с фильтрами, карточка товара,
корзина, избранное, сравнение, оформление заказа, авторизация, блог, портфолио
и контентные страницы. Данные отдаёт локальный json-server из `db.json`.

Витрина опубликована на GitHub Pages: <https://vladimir-pobedinskiy.github.io/mebel-shop/>

> Название бренда рабочее. Точки замены перечислены в разделе «Смена названия».

## Стек

Nuxt 4 · Vue 3 (`script setup`) · TypeScript · Pinia · SCSS
GSAP + ScrollTrigger · Swiper · vee-validate + yup · vue-final-modal
@nuxtjs/sitemap · @nuxtjs/robots · nuxt-schema-org · @nuxt/image · @sidebase/nuxt-auth

## Запуск

```bash
npm install
npm run double     # nuxt dev (3000) + json-server (3001) одновременно
npm run lint       # eslint + stylelint, обязателен перед коммитом
npx nuxt typecheck # vue-tsc по проекту
npm run build && npm run preview
```

Переменные окружения — см. `.env.example`:

| Переменная          | Назначение                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| `BASE_URL`          | адрес источника данных (json-server), `http://localhost:3001`            |
| `SITE_URL`          | канонический адрес сайта: canonical, Open Graph, sitemap.xml, robots.txt |
| `YANDEX_MAPS_KEY`   | ключ Яндекс.Карт; пустой — карта салонов заменяется списком              |
| `NUXT_APP_BASE_URL` | префикс подпапки домена для GitHub Pages, `/mebel-shop/`                 |
| `STATIC_DEMO`       | `true` — витрина без бэкенда, формы не ходят в `/api/`                   |

`SITE_URL` на проде обязательно заменить на боевой домен: от него считаются
`<link rel="canonical">`, `og:url` и адреса в `sitemap.xml`.

## Структура

Клиентская часть живёт в `app/` — это `srcDir` по умолчанию в Nuxt 4.
Псевдонимы `~` и `@` ведут в `app/`, а `~~` и `@@` — в корень проекта,
поэтому интерфейсы импортируются как `~~/interfaces/...`.

```
app/
  assets/        scss/{general,mixins,ui}, fonts/, icons/*.svg (nuxt-icons)
  components/    App/, UI/, Auth/, Home/, Catalog/, Product/, Cart/, Checkout/, Blog/, ...
  composables/   usePageSeo, useSiteSchemaOrg, useFormSubmit, useGsapReveal,
                 useMagneticHover, useFlyToCart, useToaster, useScreenHandler, ...
  layouts/       default.vue, error-layout.vue
  middleware/    add-trailing-slash.global.ts, auth.global.ts,
                 redirect-personal-account.global.ts
  pages/         страницы магазина
  plugins/       init.server (general-данные), typograf, vue-final-modal, vue-imask, ...
  stores/        storeGeneral, storeMenu, storeCart, storeFavorites, storeCompare,
                 storeCatalogFilters
  app.vue, error.vue
interfaces/      I*.ts по разделам — в корне, общие для app/ и server/
server/api/      прокси-хендлеры на BASE_URL + источник URL для sitemap
public/          favicon/, img/
db.json, routes.json
config.d.ts      типы $gsap и $ScrollTrigger: модуль их не объявляет
```

## Данные

Страница обращается к своему `server/api/<раздел>/index.get.ts`, тот проксирует запрос
на `${BASE_URL}/api/<раздел>/`. `routes.json` перекладывает `/api/*` на ключи `db.json`.
Каждый раздел-страница отдаёт `seo`, `schemaOrg`, `breadcrumbs` и секции страницы.

**Сопоставление URL и данных живёт только в `routes.json`.** `routeRules` в `nuxt.config.ts`
для этого не используются — так устроен проект.

POST-хендлеры вычитывают тело запроса, но **не пробрасывают** его в json-server:
на singular-ресурсе тот отвечает на POST заменой значения и затёр бы ключ-заглушку.

### Каталог

В каталоге два раздела — «Корпусная мебель» и «Кухни». Объём сокращён намеренно:
проект демонстрационный, и одного развёрнутого раздела достаточно, чтобы показать
листинг, фильтры, сортировку и полную карточку модели.

- **Корпусная мебель** — шкафы и гардеробные, комоды и тумбы, столы и стулья
- **Кухни** — коллекции Luna, Urban, Eco, Village, Neoclassic

Состав меню собирается из `catalog.categories`, чтобы навигация не расходилась
с каталогом. При правке каталога проверять: мегаменю шапки, `burgerNav.navCategory`,
колонку «Каталог» в подвале, `home.categoryTabs` и `home.collections`.

## Авторизация

Страницы `/login/`, `/registration/`, `/password-recovery/`, `/new-password/`
и `/success-registration/`. Регистрация двухшаговая: `POST /api/register/` проверяет
данные и «отправляет» код, `ModalCode` его принимает, дальше `signUp()` создаёт аккаунт.

Личного кабинета нет — после регистрации возвращаем к покупкам.

**`auth.baseURL` обязан быть относительным (`'/api/'`).** Модуль `@sidebase/nuxt-auth`
ходит по своим эндпоинтам сам, минуя всё, что не указано в его конфиге. С адресом
json-server каждый `signIn`/`signUp` уходил бы POST-запросом прямо туда и затирал
заглушки `auth-login` и `auth-registration` телом формы.

## Статическая витрина

На GitHub Pages нет Nitro: GET-данные запекаются в HTML при сборке, а POST в `/api/`
вернул бы 404. Поэтому формы ходят через `composables/useFormSubmit.ts` — при
`STATIC_DEMO=true` запрос не уходит, форма отдаёт заранее заданный ответ.

Сессия в этом режиме не создаётся: вход честно сообщает, что кабинет недоступен.
В обычной сборке всё работает по-настоящему через `@sidebase/nuxt-auth` и json-server.

Деплой — `.github/workflows/deploy.yml`: `npm ci` → линт → json-server → `nuxt generate`
→ `.output/public` на Pages.

## SEO

- `usePageSeo(data, options)` — title, description, canonical, Open Graph, Twitter-карточка
  и микроразметка страницы; `BreadcrumbList` собирается автоматически из `breadcrumbs`.
  `options.type` — `website | article | product`, `options.image` — своя og-картинка.
- `useSiteSchemaOrg()` в `app.vue` — глобальные `Organization`, `WebSite`, `WebPage`
  (телефон, адрес и e-mail берутся из `db.json → general`, как в шапке и подвале).
- `robots.txt` и `sitemap.xml` генерируют модули; список закрытых от индексации разделов —
  константа `noindexRoutes` в `nuxt.config.ts` (корзина, оформление, авторизация, поиск).
- Динамические адреса в карту сайта отдаёт `server/api/__sitemap__/urls.get.ts`
  (для полной карты json-server должен быть запущен во время сборки).
- Обложка для соцсетей — `public/img/og-cover.png`, набор иконок — `public/favicon/`.
  Пути к иконкам в `app.head` идут через `withBase`: в подпапке домена без префикса они 404.

## Анимации

GSAP-анимации живут в `useGsapReveal` (reveal секций, split-заголовки, параллакс).
Микровзаимодействия: магнитные кнопки (`useMagneticHover`),
курсор-точка (`AppCursor`), «полёт» товара в корзину (`useFlyToCart`), тосты (`useToaster`).

Все эффекты уважают `prefers-reduced-motion`: JS-анимации не создаются,
CSS-анимации гасит правило в `app/assets/scss/general/scaffolding.scss`.
Магнитные кнопки и курсор-точка включаются только на десктопе с мышью.

## Известные пробелы

- `/sale/` и `/search/` — ссылки в меню и поиск в шапке ведут на несуществующие страницы.
  Данные под обе в `db.json` готовы, не хватает самих страниц.
- `/personal-account/orders/` — ссылка в подвале, страницы нет. Из-за этого простаивают
  `auth.global.ts` и `redirect-personal-account.global.ts`: оба сторожат кабинет,
  которого нет. Данные заказов в `db.json` при этом лежат готовые.
- В `public/img/` лежат неиспользуемые файлы: старые `.svg`-заглушки рядом с рабочими `.jpg`.

## Смена названия

Рабочее «Мебель Шоп» встречается только здесь:

- `site.name` и `site.description` в `nuxt.config.ts`;
- `general.header` / `general.footer` и `seo.title` разделов в `db.json`;
- `app/assets/icons/icon-logo.svg`, `icon-logo-mobile.svg`;
- `public/favicon/*` и `public/img/og-cover.png` (монограмма и обложка);
- `og:site_name` в `app/composables/usePageSeo.ts`, названия в `useSiteSchemaOrg.ts`.
