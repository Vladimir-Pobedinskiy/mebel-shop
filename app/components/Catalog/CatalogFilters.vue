<script setup lang="ts">
import type { IFilter } from '~~/interfaces/catalog/IFilter'

defineProps<{
	filters: IFilter[]
	/** сколько товаров осталось после применения фильтров — подпись на кнопке «Показать» */
	resultsCount: number
}>()

/* Открытое состояние мобильной панели: страница держит его у себя,
   чтобы кнопкой «Фильтры» в тулбаре управлять из общего места */
const isOpen = defineModel<boolean>('isOpen', { default: false })

const close = () => {
	isOpen.value = false
}
</script>

<template>
	<div class="catalog-filters">
		<!-- Десктоп: липкая колонка рядом с сеткой -->
		<div class="catalog-filters__aside">
			<CatalogFiltersPanel :filters="filters" :results-count="resultsCount" />
		</div>

		<!-- Мобильные: те же группы в модалке с кнопкой «Показать N товаров» -->
		<UIModal v-model="isOpen" modal-id="catalog-filters" name="catalog-filters" size="small" lock-scroll>
			<template #body>
				<CatalogFiltersPanel :filters="filters" :results-count="resultsCount" is-modal @apply="close" />
			</template>
		</UIModal>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-filters {
	&__aside {
		display: none;

		/* Высоту колонке не задаём: за компактность отвечают сами аккордеоны.
		   Ограничение высоты без скролла как раз и роняло панель на футер. */
		@media (min-width: variables.$desktop-small) {
			position: sticky;
			top: 115px;
			z-index: 1;
			display: block;
			padding: 4px 20px;
			background-color: variables.$color-surface;
			border: 1px solid variables.$color-line;
			border-radius: variables.$radius-m;
		}
	}
}
</style>
