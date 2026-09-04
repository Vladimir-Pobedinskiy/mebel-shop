<script setup lang="ts">
import type { IFilter } from '@/interfaces/catalog/IFilter'
import type { ICatalogFiltersState } from '@/stores/storeCatalogFilters'
import { useCatalogFiltersStore } from '@/stores/storeCatalogFilters'
import { useScrollController } from '@/composables/useScrollController'
import { productsCountLabel } from '@/utils/utils'

const props = defineProps<{
	filters: IFilter[]
	/** сколько товаров осталось после применения фильтров — подпись на кнопке «Показать» */
	resultsCount: number
}>()

/* Открытое состояние мобильной панели: страница держит его у себя,
   чтобы кнопкой «Фильтры» в тулбаре управлять из общего места */
const isOpen = defineModel<boolean>('isOpen', { default: false })

const store = useCatalogFiltersStore()

const priceFilter = computed(() => props.filters.find(filter => filter.type === 'range'))
const listFilters = computed(() => props.filters.filter(filter => filter.type === 'checkbox' || filter.type === 'color'))
const toggleFilter = computed(() => props.filters.find(filter => filter.type === 'toggle'))

const priceMin = computed(() => priceFilter.value?.min ?? 0)
const priceMax = computed(() => priceFilter.value?.max ?? 0)

// В сторе null означает «границу не трогали»: так в URL не попадают значения по умолчанию
const priceValue = computed<number[]>(() => [
	store.filters.priceFrom ?? priceMin.value,
	store.filters.priceTo ?? priceMax.value,
])

const onPriceChange = (value: number[]) => {
	store.setPrice(value[0] <= priceMin.value ? null : value[0], value[1] >= priceMax.value ? null : value[1])
}

const isChecked = (name: string, value: string) =>
	(store.filters[name as keyof ICatalogFiltersState] as string[]).includes(value)

const onToggleValue = (name: string, value: string) => store.toggleValue(name as keyof ICatalogFiltersState, value)

const inStock = computed({
	get: () => store.filters.inStock,
	set: (value: boolean) => store.setInStock(value),
})

const close = () => {
	isOpen.value = false
}

// Панель на мобильных перекрывает экран — под ней скролл страницы блокируется
watch(isOpen, value => {
	if (!import.meta.client) return
	if (value) useScrollController.disableScroll()
	else useScrollController.enableScroll()
})

onUnmounted(() => {
	if (import.meta.client && isOpen.value) useScrollController.enableScroll()
})
</script>

<template>
	<div :class="['catalog-filters', { 'catalog-filters_open': isOpen }]">
		<div class="catalog-filters__overlay" @click="close" />

		<div class="catalog-filters__panel">
			<div class="catalog-filters__head">
				<p class="catalog-filters__head-title h4">Фильтры</p>

				<button class="catalog-filters__close" type="button" aria-label="Закрыть фильтры" @click="close">
					<NuxtIcon class="catalog-filters__close-icon" name="icon-close" filled />
				</button>
			</div>

			<div class="catalog-filters__body">
				<UIAccordion
					v-if="priceFilter"
					class="catalog-filters__group"
					:title="priceFilter.label"
					is-compact
					default-open
				>
					<template #content>
						<UIRangeSlider
							:model-value="priceValue"
							:min="priceMin"
							:max="priceMax"
							:step="1000"
							@update:model-value="onPriceChange"
						/>
					</template>
				</UIAccordion>

				<UIAccordion
					v-for="filter in listFilters"
					:key="filter.name"
					class="catalog-filters__group"
					:title="filter.label"
					is-compact
					default-open
				>
					<template #content>
						<ul v-if="filter.type === 'color'" class="catalog-filters__colors">
							<li v-for="option in filter.options" :key="option.value">
								<UIColorSwatch
									:color-hex="option.colorHex || '#ffffff'"
									:label="option.label + ' (' + option.count + ')'"
									:selected="isChecked(filter.name, option.value)"
									size="small"
									@select="onToggleValue(filter.name, option.value)"
								/>
							</li>
						</ul>

						<ul v-else class="catalog-filters__options">
							<li v-for="option in filter.options" :key="option.value">
								<UICheckbox
									:name="filter.name + '-' + option.value"
									:model-value="isChecked(filter.name, option.value)"
									@update:model-value="onToggleValue(filter.name, option.value)"
								>
									<template #content>
										<span class="catalog-filters__option text-s">
											{{ option.label }}
											<span class="catalog-filters__option-count">{{ option.count }}</span>
										</span>
									</template>
								</UICheckbox>
							</li>
						</ul>
					</template>
				</UIAccordion>

				<div v-if="toggleFilter" class="catalog-filters__group catalog-filters__group_toggle">
					<UICheckbox v-model="inStock" name="inStock">
						<template #content>
							<span class="catalog-filters__option text-s">{{ toggleFilter.label }}</span>
						</template>
					</UICheckbox>
				</div>
			</div>

			<div class="catalog-filters__footer">
				<UIButton
					class="catalog-filters__footer-btn catalog-filters__footer-btn_apply"
					as="button"
					type="button"
					:label="'Показать ' + productsCountLabel(resultsCount)"
					full
					@click="close"
				/>

				<UIButton
					v-if="!store.isEmpty"
					class="catalog-filters__footer-btn"
					as="button"
					type="button"
					variant="secondary"
					color="dark"
					label="Сбросить"
					full
					@click="store.reset()"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-filters {
	&__overlay {
		position: fixed;
		z-index: 60;
		inset: 0;
		background-color: rgba(28, 26, 23, 45%);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.4s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			display: none;
		}
	}

	&__panel {
		position: fixed;
		z-index: 61;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		width: min(360px, 90vw);
		flex-direction: column;
		background-color: variables.$color-surface;
		transform: translateX(-100%);
		transition: transform 0.4s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			position: sticky;
			z-index: 1;
			top: 115px;
			bottom: auto;
			width: 100%;
			border: 1px solid variables.$color-line;
			border-radius: variables.$radius-m;
			transform: none;
		}
	}

	&_open &__overlay {
		opacity: 1;
		pointer-events: auto;
	}

	&_open &__panel {
		transform: translateX(0);
	}

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		border-bottom: 1px solid variables.$color-line;
		gap: 16px;

		@media (min-width: variables.$desktop-small) {
			display: none;
		}
	}

	&__head-title {
		margin: 0;
	}

	&__close {
		display: flex;
		width: 40px;
		height: 40px;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 50%;
		background-color: variables.$color-muted;
		color: variables.$color-ink;
		cursor: pointer;
	}

	&__close-icon {
		width: 14px;
		height: 14px;
	}

	&__body {
		overflow-y: auto;
		flex: 1 1 auto;
		padding: 8px 20px;

		@media (min-width: variables.$desktop-small) {
			max-height: calc(100vh - 260px);
			padding: 4px 20px;
		}
	}

	&__group {
		border-bottom: 1px solid variables.$color-line;

		&:last-child {
			border-bottom: 0;
		}

		&_toggle {
			padding: 18px 0;
		}
	}

	&__options {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 16px;
	}

	&__colors {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding-bottom: 16px;
	}

	&__option {
		display: inline-flex;
		align-items: baseline;
		gap: 6px;
	}

	&__option-count {
		color: variables.$color-ink-soft;
	}

	&__footer {
		display: flex;
		flex-direction: column;
		padding: 16px 20px;
		border-top: 1px solid variables.$color-line;
		gap: 10px;
	}

	&__footer-btn {
		&_apply {
			@media (min-width: variables.$desktop-small) {
				display: none;
			}
		}
	}
}
</style>
