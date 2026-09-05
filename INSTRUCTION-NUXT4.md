# Инструкция: миграция `mebel-shop` на Nuxt 4

> Читать целиком перед первой строкой кода. Документ описывает **перевод существующего
> проекта** с Nuxt 3 на Nuxt 4 по образцу двух доноров, добавление флоу регистрации и
> повторный деплой статической витрины на GitHub Pages.
> Базовая `INSTRUCTION.md` (стек, секции, дизайн) остаётся в силе — здесь только то,
> что меняется.

---

## 0. Доноры и что берём из каждого

| Донор | Путь | Что берём |
| --- | --- | --- |
| `avto-landing` | `d:\work\my_projects\avto-landing` | Структура Nuxt 4 (`app/`), версии пакетов, `eslint.config.mjs`, `stylelint.config.mjs`, `.prettierrc`, `.editorconfig`, `tsconfig.json`, `.prettierignore`, husky 9, `lint-staged`, набор npm-скриптов |
| `rexas` | `d:\work\my_projects\rexas` | Флоу регистрации: страницы, формы, модалка кода подтверждения, серверные эндпоинты, секция `auth` в `nuxt.config.ts` |

**Не копировать из доноров:** `.nuxt`, `.output`, `node_modules`, `.git`, `dist`,
`.env`, ключи (`YANDEX_MAPS_API_KEY`, `PUBLIC_CAPTCHA_KEY`, `API_KEY_CDEK`,
`DADATA_API_KEY`), боевые эндпоинты, чужой дизайн и чужие SCSS-переменные.
Дизайн `mebel-shop` остаётся своим — из доноров берём **структуру и логику**, не вёрстку.

---

## 1. Исходное состояние (что есть сейчас)

- Nuxt `^3.17.3`, плоская структура в корне: `pages/`, `components/`, `composables/`,
  `stores/`, `middleware/`, `plugins/`, `layouts/`, `utils/`, `assets/`, `app.vue`, `error.vue`.
- 23 страницы, 115 компонентов, 15 composables, 6 сторов, 40 серверных эндпоинтов,
  41 интерфейс. Данные — `db.json` + json-server на 3001.
- Уже работает деплой на GitHub Pages: `.github/workflows/deploy.yml`,
  `nuxt generate` → `.output/public`, флаг `STATIC_DEMO` и `composables/useFormSubmit.ts`.
- `@sidebase/nuxt-auth` `^0.10.1` подключён, есть `server/api/auth-login|auth-logout|auth-session`,
  `middleware/auth.global.ts` и ключ `login` в `db.json` — **но страницы `/login/` нет**,
  как и страниц регистрации и личного кабинета.

Итог: авторизация в проекте настроена наполовину — её и достраиваем из `rexas`.

---

## 2. Решения по объёму (согласованы, не пересматривать)

1. **Капчи нет.** `UICaptcha`, `@gladesinger/vue3-yandex-smartcaptcha`, поле `captchaToken`
   и его правило в Yup-схемах из `rexas` не переносим.
2. **Личный кабинет не делаем.** Только страницы авторизации. `/personal-account/**`
   остаётся в `nitro.prerender.ignore` и в `noindexRoutes`. `success-registration`
   ведёт на главную, а не в кабинет.
3. **На GitHub Pages сессия не создаётся.** Формы авторизации валидируются и показывают
   экран или сообщение успеха, вход не происходит, кабинет недоступен. Настоящий
   `@sidebase/nuxt-auth` работает только в обычной сборке с бэкендом.

---

## 3. Целевая структура (Nuxt 4)

```
mebel-shop/
├─ app/                    ← srcDir, всё клиентское
│  ├─ app.vue
│  ├─ error.vue
│  ├─ assets/              (css, fonts, icons, scss)
│  ├─ components/
│  ├─ composables/
│  ├─ layouts/
│  ├─ middleware/
│  ├─ pages/
│  ├─ plugins/
│  ├─ stores/
│  └─ utils/
├─ interfaces/             ← остаётся в корне (как у обоих доноров)
├─ server/                 ← остаётся в корне
├─ public/
├─ db.json, routes.json
├─ nuxt.config.ts, tsconfig.json, config.d.ts
├─ eslint.config.mjs, stylelint.config.mjs, .prettierrc, .prettierignore, .editorconfig
└─ .github/workflows/deploy.yml
```

Переносить **через `git mv`**, чтобы история файлов не потерялась.

### 3.1. Псевдонимы путей — единственная массовая правка

В Nuxt 4 `~` и `@` указывают на `app/`, а `~~` и `@@` — на корень проекта.

| Было | Стало | Сколько |
| --- | --- | --- |
| `@/interfaces/...` | `~~/interfaces/...` | 192 вхождения в 130 файлах (+4 в `server/`) |
| `@/assets`, `@/composables`, `@/stores`, `@/utils` | без изменений | 307 вхождений — эти папки уезжают в `app/`, алиас продолжает резолвиться |
| `@use '@/assets/scss/...'` в SCSS | без изменений | 130 вхождений |

То есть правится только `interfaces`. Замену делать разом и потом проверять
`npx nuxt prepare` + `npm run lint`, а не глазами.

---

## 4. Пакеты

Версии берём из `avto-landing` — там самый свежий набор. Для пакетов, которых у него нет,
ставим последнюю версию и **сверяем поддержку Nuxt 4** (`npm view <pkg> peerDependencies`)
до того, как править код.

### 4.1. Из `avto-landing` один в один

**dependencies:** `nuxt@^4.5.2`, `vue@^3.5.42`, `vue-router@^5.3.1`, `pinia@^4.0.3`,
`@pinia/nuxt@^1.0.2`, `pinia-plugin-persistedstate@^4.7.1`, `@vueuse/core@^14.4.0`,
`@formkit/auto-animate@^0.9.0`, `nuxt-icons@^4.0.0`, `@hypernym/nuxt-gsap@^2.4.3`,
`nuxt-schema-org@^6.3.1`, `swiper@^14.2.0`, `typograf@^7.8.0`, `vee-validate@^4.15.1`,
`yup@^1.7.1`, `vue-final-modal@^4.5.5`, `vue-imask@^7.6.1`, `vue3-marquee@^4.2.2`,
`glightbox@^3.3.1`, `normalize.css@^8.0.1`.

**devDependencies:** `@nuxt/eslint@^1.17.0`, `eslint@^10.9.1`, `eslint-config-prettier@^10.1.8`,
`eslint-plugin-prettier@^5.5.4`, `@types/eslint-config-prettier@^6.11.3`, `@types/node@^26.4.1`,
`prettier@^3.9.6`, `stylelint@^17.14.1`, `stylelint-config-standard@^40.0.0`,
`stylelint-config-standard-scss@^17.0.0`, `stylelint-config-recommended-vue@^2.0.0`,
`stylelint-config-recess-order@^7.8.0`, `stylelint-config-html@^2.0.0`, `stylelint-order@^8.1.1`,
`stylelint-prettier@^5.0.3`, `postcss-html@^2.0.0`, `postcss-scss@^4.0.9`, `sass@^1.103.1`,
`sass-loader@^17.0.1`, `typescript@~6.0.3`, `vite-plugin-checker@^0.14.5`, `husky@^9.1.7`,
`lint-staged@^17.4.1`, `concurrently@^10.0.5`, `json-server@^0.17.4`.

### 4.2. Нужны только нам — версию подобрать при установке

| Пакет | Зачем | Примечание |
| --- | --- | --- |
| `@nuxt/image` | `NuxtImg` в 25 файлах | нужна версия с поддержкой Nuxt 4 |
| `@nuxtjs/sitemap` | `sitemap.xml` с динамическими URL | ставим отдельно, см. 4.4 |
| `@nuxtjs/robots` | `robots.txt` | ставим отдельно, см. 4.4 |
| `@sidebase/nuxt-auth` | авторизация | в `rexas` `^1.1.1` под Nuxt 4 — брать от неё и выше |
| `@headlessui/vue` | 3 файла | если под Vue 3.5 конфликт — переписать эти 3 места руками |
| `vue-multiselect` | 1 файл (`plugins/vue-multiselect.ts`) | в `rexas` `^3.4.0` |
| `vue-yandex-maps` | карта салонов, подключается только при ключе | оставить как есть |

### 4.3. Убрать из `package.json`

- `@nuxt/eslint-config` — новый `eslint.config.mjs` работает через `@nuxt/eslint`.
- `cross-env` — скрипты `avto-landing` его не используют, а `NODE_ENV`-ветки уходят
  вместе со старым `stylelint.config.cjs`.
- `@nuxtjs/seo` — см. 4.4.

### 4.4. Развязка SEO-модулей

Сейчас в `package.json` одновременно `@nuxtjs/seo` (мета-модуль) и `nuxt-schema-org`,
а в `modules` перечислены `nuxt-schema-org`, `@nuxtjs/sitemap`, `@nuxtjs/robots` — то есть
мета-модуль тянется зря и дублирует состав.

**Решение:** `@nuxtjs/seo` удалить, поставить три модуля напрямую — `nuxt-schema-org` (версия
из `avto-landing`), `@nuxtjs/sitemap`, `@nuxtjs/robots`. Список `modules` в `nuxt.config.ts`
при этом не меняется, а неизвестных по совместимости пакетов становится меньше.
Секция `site` (`url`, `name`, `description`, `trailingSlash`) продолжает работать — её читает
`nuxt-site-config`, общая зависимость этих модулей.

### 4.5. Скрипты `package.json` — из `avto-landing`

`dev`, `build`, `generate`, `preview`, `postinstall`, `prepare` (husky 9, без аргумента
`install`), `lint`, `lint:styles(:fix)`, `lint:scripts(:fix)`, `format`, `format:fix`
плюс наши `server` и `double` (json-server на 3001).

`prebuild` **не возвращать**: линт уже отдельным шагом в CI и в pre-commit.

---

## 5. Конфиги (копия из `avto-landing`, с оговорками)

| Файл | Действие |
| --- | --- |
| `eslint.config.mjs` | заменить целиком: `withNuxt` + `eslint-plugin-prettier`. Требует `nuxt prepare` до запуска — его делает `postinstall` |
| `stylelint.config.cjs` | **удалить**, вместо него `stylelint.config.mjs` из `avto-landing` (ESM, `recess-order`, `recommended-vue`, `postcss-scss`) |
| `.prettierrc` | заменить (добавляется `vueIndentScriptAndStyle: false`) |
| `.editorconfig` | добавить — сейчас его нет |
| `tsconfig.json` | заменить на форму с `references` на `.nuxt/tsconfig.{app,server,shared,node}.json` |
| `.prettierignore` | заменить |
| `config.d.ts` | добавить, если после обновления `swiper` ругается на `swiper/css` |
| `.husky/pre-commit` | обновить под husky 9: убрать строку с `husky.sh`, оставить `npx lint-staged` |
| `lint-staged` | секция из `avto-landing`: `eslint --fix`, `stylelint --fix`, `prettier --write` |
| `.gitignore` | оставить наш (в донорском игнорируется `INSTRUCTION.md` — нам это не нужно) |
| `ecosystem.config.cjs` | оставить как есть |

Новый `stylelint.config.mjs` строже старого (`recess-order` требует порядок свойств).
Прогнать `npm run lint:styles:fix` один раз и закоммитить результат отдельным коммитом,
чтобы автоправки не смешались с содержательными.

---

## 6. `nuxt.config.ts`

Оставляем весь наш текущий конфиг (комментарии, `noindexRoutes`, `siteUrl`/`siteOrigin`,
`baseURL`/`withBase`, `robots`, `sitemap`, `nitro.prerender`, `runtimeConfig`, `$development`
с `vite-plugin-checker`, `auth`) и правим точечно:

1. `compatibilityDate: '2025-07-15'` (как у обоих доноров).
2. `modules`: состав по 4.4, без `@nuxtjs/seo`.
3. `pinia-plugin-persistedstate` **не подключать**, хотя он есть у обоих доноров.
   Корзина, избранное и сравнение уже персистятся через `useLocalStorage` из
   `@vueuse/core` с `initOnMounted` — это осознанный обход гидрации, при котором
   пустой SSR-пейлоад не затирает localStorage. Плагин задвоил бы механизм.
4. `auth.provider.endpoints`: добавить `signUp: { path: '/auth-registration/', method: 'post' }`.
5. `auth.provider.session.dataType` — по образцу `rexas`, поля под нас:
   `{ id: 'string | number', fio: 'string', email: 'string', tel: 'string' }`.
6. `noindexRoutes`: добавить `/registration/`, `/success-registration/`,
   `/password-recovery/`, `/new-password/` (`/login/` уже есть).
7. `nitro.prerender.ignore`: `/personal-account/` и `/sale/` оставить.
   Страницы авторизации, наоборот, должны пререндериться.
8. `vite-plugin-checker` держать в `$development` — в продакшн-сборке он лишний
   и конфликтует по зависимостям.

---

## 7. Ломающие изменения Nuxt 4, которые заденут этот код

Проверять адресно, не на глаз:

1. **Алиасы** — раздел 3.1.
2. **`useAsyncData` / `useFetch`**: `data` и `error` теперь `undefined` вместо `null`,
   а `data` по умолчанию `shallowRef`. Любая мутация вложенных полей ответа
   (`data.value.items.push(...)`, правка полей товара) перестанет быть реактивной.
   Пройти по `pages/catalog`, `pages/product`, `useCatalogFilters.ts`, `storeCart.ts`:
   где мутируем — либо копировать в отдельный `ref`, либо ставить `deep: true`.
3. **Общий ключ — общее состояние.** Два `useAsyncData` с одинаковым первым аргументом
   теперь делят состояние. Проверить, что ключи страниц уникальны.
4. **`tsconfig`**: типы из `.nuxt/tsconfig.app.json` и `.nuxt/tsconfig.server.json` разделены —
   после `nuxt prepare` прогнать `npx nuxt typecheck` и починить всплывшее.
5. **Vue Router 5**: проверить `navigateTo(..., { redirectCode: 301 })`
   в `middleware/redirect-personal-account.global.ts` и `middleware/add-trailing-slash.global.ts`.
6. **Pinia 4**: сторы переносятся без изменений, но проверить `storeToRefs`
   и работу плагина персиста.
7. **`server/`**: 4 файла импортируют `@/interfaces` — в Nitro этот алиас теперь
   тоже ведёт в `app/`, поэтому правка на `~~/interfaces` обязательна.

---

## 8. Регистрация (из `rexas`)

### 8.1. Страницы — `app/pages/`

| Файл | Эндпоинт данных | Содержимое |
| --- | --- | --- |
| `login.vue` | `GET /api/login/` | `h1` из seo + `AuthLoginForm` |
| `registration.vue` | `GET /api/registration/` | `h1` + `AuthRegistrationForm` |
| `password-recovery.vue` | `GET /api/password-recovery/` | `h1` + `AuthPasswordRecoveryForm` |
| `new-password.vue` | `GET /api/new-password/` | `h1` + `AuthNewPasswordForm` |
| `success-registration.vue` | `GET /api/success-registration/` | `h1` + кнопка **на главную** (кабинета нет) |

Структура файла — как в `rexas`: `useAsyncData` → `usePageError(error)` → `usePageSeo(data)`.
Вёрстка и классы — наши, по палитре и типографике `mebel-shop`; донорские SCSS-переменные
(`variables.$color-gray-7` и прочее) не переносить.

### 8.2. Компоненты — `app/components/Auth/`

**Идиома форм — наша, не донорская.** `rexas` пишет формы на компонентах `<Form>`/`<Field>`
из `vee-validate`; в `mebel-shop` все формы (`ModalCallback`, `ProductRequestForm` и прочие)
собраны на `useForm`/`useField` + `useFormSubmit` + `useToaster`, а поля зовутся
`name`, `phone`, `agreement` (не `fio`, `tel`, `agree`). Из донора берём **логику и
последовательность шагов**, пишем в своём стиле — иначе в проекте окажутся две несовместимые
школы форм. Поля сессии — те же, что уже отдаёт `/api/auth-session/`: `id`, `name`, `phone`, `email`.

- `AuthLoginForm.vue` — email + пароль, ссылки «Забыли пароль?» → `/password-recovery/`
  и «Регистрация» → `/registration/`.
- `AuthRegistrationForm.vue` — по донорскому сценарию, **без** блока капчи и
  **без** `AuthSignInWithSocials`. Поля: `name`, `email`, `phone`, `password`,
  `repeatPassword`, `agreement`. Правила валидации с русскими сообщениями взять из донора
  (там аккуратно разобраны спецсимволы, цифры и латиница в имени), переложив на `yup`
  в нашей записи; правило `captchaToken` убрать.
- `AuthPasswordRecoveryForm.vue` — email → код → переход на `/new-password/`.
- `AuthNewPasswordForm.vue` — новый пароль + повтор.

Двухшаговость регистрации сохраняем: `POST /api/register/` проверяет данные и «отправляет»
код → открывается `ModalCode` → успешный код отдаёт `regToken` → `signUp()` с этим токеном →
редирект на `/success-registration/`.

### 8.3. Модалка и поле кода

- `app/components/Modal/ModalCode.vue` — из `rexas` (таймер 60 секунд, повтор отправки
  через `POST /api/repeat-code-verification-request/`), перевести на наш `UIModal`
  (`modelValue`, `modalId`, `name`, `size`).
- `app/components/UI/UICodeInput.vue` — **написать своё** на нативных `input`,
  пакет `@venegrad/vue3-code-input` не ставить.
- `ModalError` из донора **не переносить**: ошибки показываем через существующий
  `useToaster().showToast({ type: 'error' })`.

Наш `UIInput` по API совпадает с донорским (`v-model:value`, `name`, `type`, `errorValue`,
`disabled`, `autocomplete`), кроме пропа `label` — в вызовах его убрать либо добавить проп
в `UIInput`, но одинаково по всему проекту.

### 8.4. Серверные эндпоинты — `server/api/`

Новые GET (обёртка над json-server, по образцу существующих):
`registration/`, `password-recovery/`, `new-password/`, `success-registration/`.

Новые POST (проксируют тело в json-server, как в `rexas`):
`register/`, `auth-registration/`, `code-verification-request/`,
`repeat-code-verification-request/`, `password-recovery-request/`, `new-password-request/`.

Уже есть и не трогаем: `login/`, `auth-login/`, `auth-logout/`, `auth-session/`.

### 8.5. `db.json` и `routes.json`

Добавить ключи верхнего уровня — по имени, совпадающему с путём:
`registration`, `password-recovery`, `new-password`, `success-registration`
(каждый с `seo` и `schemaOrg`, как у остальных страниц), плюс ответы форм:
`register`, `auth-registration`, `code-verification-request`,
`repeat-code-verification-request`, `password-recovery-request`, `new-password-request`.

`routes.json` править **не нужно**: правило `"/api/*": "/$1"` уже покрывает все эти адреса.

### 8.6. Ссылки в интерфейсе

- В `AppHeader` иконка пользователя ведёт на `/login/`.
- В `middleware/auth.global.ts` список защищённых путей оставить как есть
  (`/personal-account/`), кабинет мы не делаем.

---

## 9. Поведение на статической витрине

На GitHub Pages нет Nitro: `GET`-данные запечены в HTML на этапе сборки, а `POST /api/...`
вернул бы 404. Поэтому все формы авторизации ходят через существующий
`composables/useFormSubmit.ts` — он при `STATIC_DEMO=true` не делает запрос,
а отдаёт заранее заданный ответ.

Правила режима (согласованы, раздел 2):

- **Регистрация**: валидация → `ModalCode` → код принимается любой из 4+ символов →
  переход на `/success-registration/`. Сессия не создаётся, `signUp()` не вызывается.
- **Вход**: валидация → тост об успехе с прямым пояснением, что на демо-витрине
  сессия не создаётся. Врать про «вы вошли» не надо.
- **Восстановление пароля**: тот же приём — экран успеха без реальной отправки.
- Ссылки на `/personal-account/` в статической сборке не показывать (флаг
  `config.public.staticDemo`).

В обычной сборке (`npm run double`) всё работает по-настоящему через `@sidebase/nuxt-auth`
и json-server.

---

## 10. GitHub Pages

`.github/workflows/deploy.yml` в целом остаётся. Проверить и поправить:

1. `node-version: 24` — сверить с движком, который требует Nuxt 4 и `typescript@~6`.
2. Шаг `npm install` заменить на `npm ci` после того, как новый `package-lock.json`
   зафиксирован и сборка проходит локально.
3. Переменные окружения не меняются: `BASE_URL`, `SITE_URL`, `NUXT_APP_BASE_URL=/mebel-shop/`,
   `STATIC_DEMO=true`, `HUSKY=0`.
4. Шаг `Lint` остаётся отдельным — он должен идти **после** установки (нужен
   `.nuxt/eslint.config.mjs` от `postinstall`).
5. Артефакт — `.output/public`, без изменений.

Локальная проверка до пуша (обязательна, иначе ошибку базового пути ловим уже на проде):

```bash
SITE_URL=https://vladimir-pobedinskiy.github.io/mebel-shop \
NUXT_APP_BASE_URL=/mebel-shop/ STATIC_DEMO=true npm run generate
npx serve .output/public
```

---

## 11. Порядок этапов

| Этап | Содержание | Проверка |
| --- | --- | --- |
| 1 | Закоммитить текущие изменения, завести ветку `nuxt4` | `git status` чистый |
| 2 | `git mv` в `app/`, замена `@/interfaces` → `~~/interfaces` | структура из §3 |
| 3 | `package.json`: версии, удаления, скрипты; `npm install` | установка без конфликтов пиров |
| 4 | Конфиги и линтеры из `avto-landing`, husky 9 | `npm run lint` (после `nuxt prepare`) |
| 5 | `nuxt.config.ts` по §6 | `npm run dev` поднимается |
| 6 | Разбор ломающих изменений по §7 | все страницы открываются без ошибок в консоли |
| 7 | `db.json` + серверные эндпоинты регистрации (§8.4–8.5) | `curl` по каждому новому адресу |
| 8 | Страницы и формы авторизации (§8.1–8.3, §8.6) | флоу проходится в dev целиком |
| 9 | Демо-режим форм (§9), sitemap/robots/ссылки | `npm run generate` локально |
| 10 | Пуш в `main`, деплой, проверка живого сайта | все новые адреса открываются на Pages |

После каждого этапа — `npm run lint` и коммит. Этапы 2 и 4 дают огромные механические
диффы: коммитить их отдельно от содержательных правок.

---

## 12. Чек-лист приёмки

- [ ] `npm run lint` — ноль ошибок.
- [ ] `npm run dev` — ни одной ошибки и предупреждения Nuxt в консоли при обходе всех страниц.
- [ ] `npx nuxt typecheck` — проходит.
- [ ] `npm run double` — json-server отвечает на все новые адреса.
- [ ] Регистрация проходится целиком: форма → код → успех.
- [ ] Вход и выход работают в обычной сборке; защищённый путь редиректит на `/login/`.
- [ ] `npm run generate` с базовым путём `/mebel-shop/` собирается без ошибок пререндера.
- [ ] В `.output/public` есть `login/`, `registration/`, `password-recovery/`,
      `new-password/`, `success-registration/`.
- [ ] `sitemap.xml` не содержит служебных адресов из `noindexRoutes`.
- [ ] На живом сайте формы авторизации не дают 404 и ведут себя по §9.
- [ ] Ни одного упоминания капчи, соцсетей и личного кабинета в новом коде.

---

## 13. Чего не делать

- Не переносить из `rexas` личный кабинет, бонусы, СДЭК и Деловые линии, DaData, Lenis,
  соцавторизацию и `auth/callback.vue`.
- Не тащить пакеты, которые в `mebel-shop` никто не импортирует
  (`split-type`, `lodash.clonedeep`, `floating-vue`, `lenis`, `qs`) — они есть у доноров,
  но у нас без применения.
- Не менять дизайн, палитру и вёрстку существующих страниц под доноров.
- Не удалять `useFormSubmit`, `STATIC_DEMO` и комментарии к ним — это рабочий механизм
  витрины, а не временный костыль.
- Не переписывать `db.json` целиком: только добавлять ключи.
