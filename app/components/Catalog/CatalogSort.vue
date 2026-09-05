<script setup lang="ts">
import type { ISelect } from '~~/interfaces/ISelect'
import { useCatalogFiltersStore } from '@/stores/storeCatalogFilters'

const props = defineProps<{
	options: ISelect[]
}>()

const store = useCatalogFiltersStore()

// UISelect работает с объектом опции целиком, а в сторе лежит только value
const selected = computed({
	get: () => props.options.find(option => option.value === store.sort) || props.options[0],
	set: (option: ISelect) => store.setSort(option.value),
})
</script>

<template>
	<div class="catalog-sort">
		<span class="catalog-sort__label text-s">Сортировка</span>

		<UISelect
			v-model="selected"
			class="catalog-sort__select"
			:select="{ options }"
			placeholder="По популярности"
			label="label"
			track-by="value"
			variant="secondary"
		/>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-sort {
	display: flex;
	gap: 10px;
	align-items: center;

	&__label {
		display: none;
		flex: 0 0 auto;
		color: variables.$color-ink-soft;

		@media (min-width: variables.$tablet) {
			display: block;
		}
	}

	&__select {
		width: 100%;
		min-width: 0;

		@media (min-width: variables.$tablet) {
			width: 240px;
		}
	}
}
</style>
