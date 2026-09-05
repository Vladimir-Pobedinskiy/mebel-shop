# mebel-shop

Интернет-магазин мебели на Nuxt 3. Проект создаётся с нуля.

**Перед любой работой прочитать `INSTRUCTION.md`** — там стек, архитектура, конвенции,
список страниц и секций, порядок этапов и чек-лист приёмки.

**Идёт миграция на Nuxt 4** — спецификация в `INSTRUCTION-NUXT4.md`, промпты по этапам
в `PROMPTS-NUXT4.md`. Доноры: `d:\work\my_projects\avto-landing` (структура Nuxt 4,
версии пакетов, линтеры) и `d:\work\my_projects\rexas` (флоу регистрации).
Пока миграция не завершена, эти два файла главнее `INSTRUCTION.md` в спорных местах.

## Ключевое

- Эталон-донор: `d:\web\my_works\alternative` (та же сборка). Оттуда берём стек,
  архитектуру и конвенции; дизайн — новый.
- Из донора **не копировать**: файл `core`, `.output`, `.nuxt`, `node_modules`, `.git`,
  ID Яндекс.Метрики, verification-метатеги, ключ Яндекс.Карт.
- Данные — `db.json` + json-server (порт 3001), `BASE_URL="http://localhost:3001"`.
- Стиль кода: табы, без `;`, одинарные кавычки, printWidth 120. `npm run lint` обязателен.
- Название бренда не выбрано, рабочее — «Мебель Шоп» (см. §0 в `INSTRUCTION.md`).

## Команды

```bash
npm run double   # nuxt dev (3000) + json-server (3001)
npm run lint
npm run build && npm run preview
```
