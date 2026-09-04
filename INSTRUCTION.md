# Инструкция для Claude: создание интернет-магазина мебели `mebel-shop`

> Читать целиком перед первой строкой кода. Проект создаётся в `d:\web\my_works\mebel-shop`
> на той же сборке, что и `d:\web\my_works\alternative` (эталон-донор). Донор — сайт-каталог
> мебели; здесь делаем **полноценный интернет-магазин** (корзина, оформление заказа, фильтры,
> избранное) с современным «вау»-визуалом.

---

## 0. Правила работы

- Эталон читать, но **не копировать бездумно**: из `alternative` берём стек, архитектуру,
  конвенции кода и набор секций/страниц. Дизайн — новый.
- **Никогда не копировать** из донора: файл `core` (дамп на 1.2 ГБ), `.output`, `.nuxt`,
  `node_modules`, `.git`, ID Яндекс.Метрики `105439892`, verification-метатеги
  (`yandex-verification`, `google-site-verification`), ключ Яндекс.Карт `196c1971-...`,
  эндпоинты авторизации боевого API.
- Работать этапами (раздел 12). После каждого этапа — `npm run lint` и проверка `npm run dev`.
- Все тексты интерфейса — на русском. Комментарии в коде — на русском, как в доноре.
- **Название бренда ещё не выбрано.** Везде используется рабочее «Мебель Шоп». Держать его
  только в этих местах, чтобы замена была в одно действие: `site.name` в `nuxt.config.ts`,
  `general.header` / `general.footer` в `db.json`, `assets/icons/icon-logo.svg` +
  `icon-logo-mobile.svg`, `seo.title` каждого раздела `db.json`, `<title>`-шаблон и schema.org
  (`Organization.name`). В вёрстку и классы имя не зашивать — только `AppLogo` и данные из API.

---

## 1. Стек (повторить один в один)

Nuxt 3 (`^3.17`) + Vue 3 `script setup` + TypeScript + SCSS + Pinia.

`package.json` — за основу взять донорский `d:\web\my_works\alternative\package.json`.

**dependencies:** `nuxt`, `vue`, `vue-router`, `pinia`, `@pinia/nuxt`, `@nuxt/image`,
`nuxt-icons`, `@hypernym/nuxt-gsap`, `nuxt-schema-org`, `@nuxtjs/seo`,
`@formkit/auto-animate`, `@headlessui/vue`, `@vueuse/core`, `swiper`, `glightbox`,
`normalize.css`, `typograf`, `vee-validate`, `yup`, `vue-final-modal`, `vue-imask`,
`vue-multiselect`, `vue3-marquee`,
`vue-yandex-maps`, `@sidebase/nuxt-auth`.

**devDependencies:** `@nuxt/eslint(-config)`, `eslint`, `eslint-config-prettier`,
`eslint-plugin-prettier`, `prettier`, `stylelint`, `stylelint-config-standard-scss`,
`stylelint-prettier`, `postcss-html`, `sass`, `typescript`, `vite-plugin-checker`,
`json-server@^0.17.4`, `concurrently`, `cross-env`, `husky`, `lint-staged`.

**scripts** — скопировать донорские: `dev`, `server` (json-server на 3001),
`double` (concurrently dev + server), `build`, `generate`, `preview`, `lint`, `lint:script`,
`lint:style`, `format`, `prebuild`, `postinstall`, `prepare`.

Node ≥ 20 (локально 24.x).

---

## 2. Файлы конфигурации

Копировать из донора **без изменений**: `.prettierrc` (табы, без `;`, одинарные кавычки,
printWidth 120), `.prettierignore`, `eslint.config.mjs`, `stylelint.config.cjs`,
`tsconfig.json`, `.gitignore`, `.husky/`, секцию `lint-staged`.

`.env`:

```
BASE_URL="http://localhost:3001"
```

(в доноре здесь боевой домен; у нас источник данных — json-server, см. §5)

`ecosystem.config.cjs` — того же вида, `name: 'mebel-shop'`, `port: '8099'`.

`nuxt.config.ts` — за основу донорский, но:

- `site`: `name: 'Мебель Шоп'` (или согласованный нейминг), `description` про интернет-магазин
  мебели, `defaultLocale: 'ru'`.
- Из `app.head` **удалить** метрику, verification-метатеги и noscript-пиксель. Оставить
  charset / viewport / format-detection / theme-color и блок favicon-ссылок.
- Модуль `yandex-metrika-module-nuxt3` и секцию `yandexMetrika` не подключать (добавим,
  когда будет реальный счётчик).
- `yandexMaps.apikey` — вынести в `process.env.YANDEX_MAPS_KEY`, в `.env` положить пустую строку.
- Оставить: `pageTransition`, `router.options.linkActiveClass`, `gsap.extraPlugins.scrollTrigger`,
  `vite.plugins: [checker(...)]`, `vite.css.preprocessorOptions.scss.silenceDeprecations`,
  `runtimeConfig.public.baseUrl`, `css: ['normalize.css', 'vue-final-modal/style.css',
  '~/assets/css/main.css', '~/assets/scss/main.scss']`.
- `auth` (@sidebase/nuxt-auth) — оставить конфиг с локальным провайдером
  (`/auth-login/`, `/auth-logout/`, `/auth-session/`), `globalAppMiddleware: false`.

---

## 3. Структура проекта (как в доноре)

```
assets/        css/main.css, scss/{general,mixins,ui}, fonts/, icons/*.svg (nuxt-icons)
components/    App/, UI/, Home/, Catalog/, Product/, Cart/, Checkout/, ...
composables/   usePageSeo, useScreenHandler, useScrollController,
               useSwipeHandler, useGLightbox
interfaces/    I*.ts по папкам-разделам
layouts/       default.vue (<main class="main"><slot/></main>), error-layout.vue
middleware/    add-trailing-slash.global.ts, auth.global.ts
pages/         см. §6
plugins/       init.server.ts, typograf.ts, vue-final-modal.ts, vue-imask.ts, vue-multiselect.ts
server/api/    прокси-хендлеры на BASE_URL (см. §5)
stores/        storeGeneral, storeMenu, storeCart, storeFavorites, storeCatalogFilters
utils/         utils.ts (screens, declOfNum, priceFormatter, ...)
app.vue, error.vue, db.json, routes.json
```

`app.vue` — как в доноре: `NuxtLoadingIndicator` + `.body-inner` + `AppHeader` / `NuxtLayout`
/ `NuxtPage` / `AppFooter` + page-transition (opacity + blur).

`composables/`, `utils/utils.ts`, `middleware/add-trailing-slash.global.ts`, `plugins/*` —
переносить из донора как есть (это инфраструктура, а не дизайн).

---

## 4. SCSS-архитектура

`assets/scss/main.scss` подключает через `@use`:
`general/reset`, `general/fonts`, `general/variables`, `mixins/mixins`, `general/scaffolding`,
`general/animations`, `general/typography`, `general/user-content`, `ui/hover-state`,
`ui/rubber-button`, `ui/radio-input`, `ui/skeleton-box`, `ui/glightbox`.

В компонентах — **не** `scoped`, а BEM-именование + `<style lang="scss">` с
`@use '@/assets/scss/general/variables';` и обращением `variables.$color-...`
(именно так в доноре — воспроизвести).

Брейкпоинты в `variables.scss` — оставить донорский набор (`$mobile`…`$four-k-display`,
`*-for-max-width`), а также `$container-width`, `$padding-offset`. Дублировать их в
`utils/utils.ts` в объекте `screens` (его использует `useScreenHandler`).

### Палитра и типографика — НОВЫЕ (главное отличие от донора)

Тёплая «премиум-мебельная» тема вместо донорской сине-чёрной:

```scss
$color-bg:        #f7f4ef;  // тёплый песочный фон
$color-surface:   #ffffff;
$color-ink:       #1c1a17;  // основной текст
$color-ink-soft:  #6b6357;
$color-accent:    #b4632a;  // терракота / орех — CTA
$color-accent-2:  #2f4a3f;  // глубокий зелёный — акцент секций
$color-line:      #e4ddd2;
```

Плюс сохранить служебные `$color-success/warning/error` и соц-цвета из донора.

Шрифты: заголовки — гротеск с характером (`Unbounded` / `Manrope` / донорский `Steppe`),
текст — `Manrope` / `Inter`. Подключать локально через `assets/fonts/*.woff2` и
`general/fonts.scss` (`@font-face`, `font-display: swap`) — как в доноре, без Google Fonts CDN.
Заголовки — `clamp()`-типографика, крупные (до 6–8vw на hero), `letter-spacing: -0.02em`.

---

## 5. Данные: db.json + json-server

Как в доноре: страницы вызывают **свой** `server/api/<раздел>/index.get.ts`, который
проксирует на `${config.public.baseUrl}/api/<раздел>/`; `routes.json` перекладывает
`/api/*` → `/$1` и алиасит вложенные URL на ключи `db.json`.

Шаблон хендлера (повторять для каждого раздела):

```ts
export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const response: any = await $fetch(`${config.public.baseUrl}/api/home/`)

	return response
})
```

Для динамических — `getRouterParam(event, 'slug')` и подстановка в URL.

`db.json` — писать свой, по образцу донорского (`d:\web\my_works\alternative\db.json`, 106 КБ;
ключи: `general`, `home`, `catalog`, `<slug-категории>`, `<slug-товара>`, `blog`, `about`,
`contacts`, `map`, `privacy-policy`, ...). Каждый раздел-страница отдаёт объект вида:

```jsonc
{
  "seo": { "title": "", "h1": "", "canonical": "", "meta": [] },
  "schemaOrg": [],
  "breadcrumbs": [{ "label": "", "url": "" }]
  /* ...секции страницы... */
}
```

Наполнение — правдоподобный контент мебельного магазина: категории (диваны, кровати, шкафы,
кухни, столы и стулья, кресла, тумбы, освещение), 30–40 товаров с ценой, старой ценой,
характеристиками, галереей, вариантами обивки/цвета, наличием, рейтингом.

POST-эндпоинты (`ask-question`, `callback`, `checkout-order`, `auth-login`) — как в доноре:
`server/api/<name>/index.post.ts` + ключ-заглушка в `db.json`.

Изображения: `public/img/...`. Реальных фото нет — сгенерировать плейсхолдеры (SVG или
градиентные заглушки с подписью) и **везде** отдавать через `<NuxtImg>` с `loading="lazy"`,
`sizes`, `format="webp"`. Никаких внешних CDN-картинок.

---

## 6. Страницы (маппинг донора → магазин)

Из донора берём и адаптируем:

| Донор | mebel-shop |
|---|---|
| `pages/index.vue` | Главная |
| `catalog/index.vue`, `catalog/[slug]/index.vue`, `catalog/[slug]/[collection]/index.vue` | Каталог → категория → подкатегория/коллекция |
| `product/[slug]/index.vue` | Карточка товара |
| `catalogs.vue` | PDF-каталоги / лукбуки |
| `portfolio/index.vue`, `portfolio/[slug]/index.vue` | Проекты / «Наши работы» |
| `blog/index.vue`, `blog/[slug]/index.vue`, `blog/[slug]/[id]/index.vue` | Блог: разделы → статья |
| `about.vue` | О компании |
| `contacts.vue`, `map.vue` | Контакты, Карта салонов |
| `guarantees.vue` | Гарантия и сервис |
| `become-dealer.vue` | Сотрудничество / Дилерам |
| `privacy-policy.vue`, `user-agreement.vue` | Правовые страницы |
| `login.vue`, `personal-account/[slug]/index.vue`, `personal-account/[slug]/[id]/index.vue` | Вход, Личный кабинет: заказы → заказ |

Добавить (новое, магазинное):

- `pages/cart.vue` — корзина
- `pages/checkout.vue` — оформление заказа (шаги: контакты → доставка → оплата → подтверждение)
- `pages/order-success.vue` — спасибо за заказ (номер заказа)
- `pages/favorites.vue` — избранное
- `pages/compare.vue` — сравнение товаров
- `pages/search.vue` — результаты поиска
- `pages/delivery.vue` — доставка и оплата
- `pages/sale.vue` — акции / распродажа

У каждой страницы — паттерн донора:

```ts
const { data, error, status } = await useAsyncData('home-page', async () => $fetch<IHomePageData>('/api/home/'))
const pending = computed(() => status.value === 'pending')
if (error.value) throw createError({ statusCode: ..., statusMessage: ..., fatal: true })
usePageSeo(computed(() => data.value))
```

плюс `<AppLoading :is-loading-local="true" />` пока нет `data`, `<h1 class="visually-hidden">`
и секции через `v-if="data.<section>"`.

---

## 7. Секции главной

По образцу донора (`HomeBanner` → `HomeCategoryTabs` → `HomeAboutUnit` → `MarqueeUnit` →
`HomeArticlePreviewsUnit`), но расширенно:

1. `HomeHero` — полноэкранный баннер: крупный заголовок с посимвольным reveal, фоновое
   видео/изображение с параллаксом, «липкий» индикатор скролла.
2. `HomeCategoryTabs` — категории табами + крупные карточки-превью с hover-зумом.
3. `HomeBestsellers` — слайдер хитов (Swiper) с карточками товара.
4. `HomeAboutUnit` — о бренде: split-текст + числа-счётчики.
5. `HomeCollections` — коллекции, горизонтальный pinned-скролл (GSAP ScrollTrigger).
6. `HomeSaleBanner` — акция с таймером.
7. `MarqueeUnit` — бегущая строка (vue3-marquee), как в доноре.
8. `HomeAdvantagesUnit` — преимущества и сервис (доставка, сборка, гарантия, рассрочка).
9. `HomeShowroomUnit` — салоны + карта.
10. `HomeReviews` — отзывы, слайдер.
11. `HomeArticlePreviewsUnit` — блог, как в доноре.
12. `HomeCtaUnit` — форма «Бесплатный дизайн-проект» (vee-validate + yup + vue-imask).

---

## 8. Компоненты

**UI (перенести из донора, перекрасить под новую палитру):** `UIButton` (сигнатуру
`as/to/href/type/variant/color/size/full/label/showIcon/disabled` + `withDefaults` — сохранить),
`UIInput`, `UITextarea`, `UISelect`, `UICheckbox`, `UISearchInput`, `UISuggest`, `UIModal`,
`UIPagination`, `UITag`, `UIBreadcrumbs`, `UISlider`, `UIMarquee`, `UIStatus`, `UIStatusStage`.

**Добавить UI:** `UIQuantity` (± количество), `UIPrice` (цена + старая + скидка, через
`priceFormatter`), `UIRating`, `UIBadge`, `UIRangeSlider` (цена), `UIColorSwatch`,
`UIAccordion`, `UISkeleton`, `UIEmptyState`, `UIToast`.

**App:** `AppHeader` (прозрачная шапка на hero → «стеклянная» при скролле, мега-меню каталога,
поиск, иконки избранного/сравнения/корзины со счётчиками), `AppFooter`, `AppBurger`
(fullscreen-меню со stagger-анимацией), `AppLogo`, `AppLoading`, `AppIntro` (прелоадер),
`AppSocialsLink(s)`.

**Магазинные:** `ProductCard`, `ProductGallery` (glightbox + zoom), `ProductVariants`,
`ProductCharacteristics`, `ProductTabs`, `ProductStickyBuyBar` (моб.), `ProductRelated`,
`CatalogFilters` (цена, категория, материал, цвет, бренд, наличие), `CatalogSort`,
`CatalogGrid` (+ `auto-animate`), `CartItem`, `CartSummary`, `CheckoutSteps`,
`ModalQuickView`, `ModalAddedToCart`, `ModalCallback`, `ModalError`.

---

## 9. Stores (Pinia, composition-style как `storeGeneral`)

- `storeGeneral` — header/footer/socials из `/api/general/` (перенести из донора).
- `storeMenu` — состояние бургера и мега-меню.
- `storeCart` — `items`, `add/remove/updateQty/clear`, геттеры `totalCount`, `totalPrice`,
  `discount`; персист в `localStorage` (`useLocalStorage` из `@vueuse/core`), гидрация на клиенте.
- `storeFavorites`, `storeCompare` — аналогично, с персистом.
- `storeCatalogFilters` — фильтры и сортировка, синхронизация с query-параметрами роутера.

---

## 10. Интерфейсы TS

Каждой сущности — свой файл в `interfaces/` по донорской схеме именования (`I<Name>.ts`,
`export interface I...`). Обязательно: `ISeo`, `ISchemaOrg`, `ILink`, `IImg`, `IGeneral*`,
`IProduct`, `IProductVariant`, `IProductCharacteristic`, `ICategory`, `ICartItem`, `IOrder`,
`IFilter`, `IReview`, `IArticlePreview`, `IPagination`.
`any` не использовать (кроме донорского шаблона прокси-хендлеров).

---

## 11. Вау-эффекты: чем и как

Всё уже есть в стеке — новые библиотеки не тянуть.

- **GSAP + ScrollTrigger** (`@hypernym/nuxt-gsap`, плагин уже включён в конфиге):
  - reveal секций: `y: 40, opacity: 0 → 1`, `stagger`, `start: 'top 80%'`;
  - посимвольный / пословный reveal заголовков hero и секций;
  - параллакс фоновых изображений (`yPercent`);
  - pinned горизонтальный скролл коллекций;
  - счётчики чисел в блоке «о компании»;
  - **обязательно** уважать `prefers-reduced-motion` и чистить триггеры в `onUnmounted`.
- **CSS-переходы**: page-transition (opacity + `blur(1rem)`) из донора; hover-состояния через
  `ui/hover-state.scss` только внутри `@media (min-width: $desktop-small)` (как в доноре).
- **Магнитные кнопки** и кастомный курсор-«точка», расширяющийся над интерактивом, — только
  на десктопе (`useScreenHandler(screens.desktop)`), на тач-устройствах отключать.
- **Карточка товара**: 3D-tilt на hover, смена изображения на второе фото, плавное появление
  кнопки «В корзину», бейджи (`Хит`, `-20%`, `Новинка`).
- **Стекло и глубина**: `backdrop-filter: blur()` в шапке и sticky-панелях, мягкие тени
  (`0 20px 60px rgba(28, 26, 23, 0.08)`), скругления 16–24px.
- **Микровзаимодействия**: «полёт» товара в корзину при добавлении, пульс счётчика корзины,
  toast-уведомление, skeleton-загрузка (`ui/skeleton-box.scss`).
- **auto-animate** — на списках каталога, корзины и фильтров.

Производительность: анимировать только `transform` / `opacity`, `will-change` точечно,
Lighthouse Performance ≥ 85 на десктопе, CLS ≈ 0.

---

## 12. Порядок выполнения

1. **Каркас**: `npm create nuxt@latest` (или копирование конфигов донора) → package.json,
   конфиги, `.env`, установка зависимостей, `app.vue`, `layouts/`, `error.vue`.
2. **Стили**: `assets/scss/*` (новая палитра и типографика), шрифты, `assets/css/main.css`,
   иконки в `assets/icons/*.svg`.
3. **Инфраструктура**: `composables/`, `utils/utils.ts`, `plugins/`, `middleware/`, `stores/`.
4. **Данные**: `db.json` + `routes.json` + все `server/api/**`. Проверить `npm run server`
   и ответ `http://localhost:3001/api/home/`.
5. **UI-кит**: `components/UI/**` целиком, до страниц.
6. **App-слой**: `AppHeader`, `AppFooter`, `AppBurger`, `AppLoading`, `AppIntro`.
7. **Главная** со всеми секциями (§7).
8. **Каталог**: список → категория → карточка товара, фильтры, сортировка, пагинация.
9. **Магазинный флоу**: корзина → избранное/сравнение → checkout → order-success.
10. **Контентные страницы**: about, blog, portfolio, contacts/map, guarantees, delivery,
    become-dealer, правовые.
11. **Личный кабинет**: login + заказы (на @sidebase/nuxt-auth, как в доноре).
12. **Полировка**: анимации, SEO (`usePageSeo`, schema.org, `robots.txt`, `sitemap`),
    favicon-набор в `public/favicon/`, 404 (`error.vue`).
13. **Финал**: `npm run lint` без ошибок, `npm run build` + `npm run preview`, README.

После этапов 4, 7, 9 и 13 — запускать `npm run double` и проверять вживую.

---

## 13. Команды

```bash
npm install
npm run double     # nuxt dev (3000) + json-server (3001) одновременно
npm run lint       # eslint + stylelint — обязателен перед коммитом
npm run build && npm run preview
```

---

## 14. Чек-лист приёмки

- [ ] Все страницы §6 существуют, отдают данные из `db.json`, имеют SEO и хлебные крошки.
- [ ] Корзина и избранное переживают перезагрузку страницы.
- [ ] Адаптив от 360px до 2560px, без горизонтального скролла.
- [ ] Клавиатурная навигация и фокус-стили в шапке, модалках, формах; `aria-label` на иконках.
- [ ] `prefers-reduced-motion` отключает GSAP-анимации.
- [ ] `npm run lint` и `npm run build` проходят чисто.
- [ ] Нет чужих ключей и счётчиков из донора.
