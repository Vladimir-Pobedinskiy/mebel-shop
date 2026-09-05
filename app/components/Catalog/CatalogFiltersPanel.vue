<script setup lang="ts">
import type { IFilter } from '~~/interfaces/catalog/IFilter'
import type { ICatalogFiltersState, ICatalogRangeName } from '@/stores/storeCatalogFilters'
import { useCatalogFiltersStore, isMultiKey, isRangeKey } from '@/stores/storeCatalogFilters'
import { productsCountLabel } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		filters: IFilter[]
		/** сколько товаров осталось после применения фильтров — подпись на кнопке «Показать» */
		resultsCount: number
		/** панель показана в модалке (мобильные): нужны шапка и кнопка «Показать N товаров» */
		isModal?: boolean
	}>(),
	{
		isModal: false,
	}
)
const emits = defineEmits<{
	(e: 'apply'): void
}>()

const store = useCatalogFiltersStore()

/* Из db.json приходят только те группы, которые есть у товаров раздела.
   Показываем те, что стор умеет применять, и не выводим группы без опций —
   иначе на старых категориях появились бы пустые аккордеоны. */
const rangeFilters = computed(() =>
	props.filters.filter(filter => filter.type === 'range' && isRangeKey(filter.name) && filter.min !== filter.max)
)

const listFilters = computed(() =>
	props.filters.filter(
		filter =>
			(filter.type === 'checkbox' || filter.type === 'color') && isMultiKey(filter.name) && filter.options?.length
	)
)

const toggleFilter = computed(() => props.filters.find(filter => filter.type === 'toggle'))

// В сторе null означает «границу не трогали»: так в URL не попадают значения по умолчанию
const rangeValue = (filter: IFilter): number[] => {
	const { from, to } = store.rangeValue(filter.name as ICatalogRangeName)
	return [from ?? filter.min ?? 0, to ?? filter.max ?? 0]
}

const onRangeChange = (filter: IFilter, value: number[]) => {
	const min = filter.min ?? 0
	const max = filter.max ?? 0
	// Ползунок всегда отдаёт пару, но подстраховываемся границами фильтра
	const [from = min, to = max] = value

	store.setRange(filter.name as ICatalogRangeName, from <= min ? null : from, to >= max ? null : to)
}

// Шаг ползунка: цена ходит тысячами, габариты — сантиметрами
const rangeStep = (filter: IFilter) => (filter.name === 'price' ? 1000 : 10)

const isChecked = (name: string, value: string) =>
	(store.filters[name as keyof ICatalogFiltersState] as string[]).includes(value)

const onToggleValue = (name: string, value: string) => store.toggleValue(name as keyof ICatalogFiltersState, value)

const inStock = computed({
	get: () => store.filters.inStock,
	set: (value: boolean) => store.setInStock(value),
})
</script>

<template>
	<div class="catalog-filters-panel">
		<div v-if="isModal" class="catalog-filters-panel__head">
			<p class="catalog-filters-panel__head-title h4">Фильтры</p>

			<p v-if="store.activeCount" class="catalog-filters-panel__head-count text-s">выбрано: {{ store.activeCount }}</p>
		</div>

		<div class="catalog-filters-panel__body">
			<UIAccordion
				v-for="filter in rangeFilters"
				:key="filter.name"
				class="catalog-filters-panel__group"
				:title="filter.label"
				is-compact
				default-open
			>
				<template #content>
					<UIRangeSlider
						:model-value="rangeValue(filter)"
						:min="filter.min ?? 0"
						:max="filter.max ?? 0"
						:step="rangeStep(filter)"
						:is-price="filter.name === 'price'"
						@update:model-value="onRangeChange(filter, $event)"
					/>
				</template>
			</UIAccordion>

			<UIAccordion
				v-for="filter in listFilters"
				:key="filter.name"
				class="catalog-filters-panel__group"
				:title="filter.label"
				is-compact
				default-open
			>
				<template #content>
					<ul v-if="filter.type === 'color'" class="catalog-filters-panel__colors">
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

					<ul v-else class="catalog-filters-panel__options">
						<li v-for="option in filter.options" :key="option.value">
							<UICheckbox
								:name="filter.name + '-' + option.value"
								:model-value="isChecked(filter.name, option.value)"
								@update:model-value="onToggleValue(filter.name, option.value)"
							>
								<template #content>
									<span class="catalog-filters-panel__option text-s">
										{{ option.label }}
										<span class="catalog-filters-panel__option-count">{{ option.count }}</span>
									</span>
								</template>
							</UICheckbox>
						</li>
					</ul>
				</template>
			</UIAccordion>

			<div v-if="toggleFilter" class="catalog-filters-panel__group catalog-filters-panel__group_toggle">
				<UICheckbox v-model="inStock" name="inStock">
					<template #content>
						<span class="catalog-filters-panel__option text-s">{{ toggleFilter.label }}</span>
					</template>
				</UICheckbox>
			</div>
		</div>

		<div v-if="isModal || !store.isEmpty" class="catalog-filters-panel__footer">
			<UIButton
				v-if="isModal"
				class="catalog-filters-panel__footer-btn"
				as="button"
				type="button"
				:label="'Показать ' + productsCountLabel(resultsCount)"
				full
				@click="emits('apply')"
			/>

			<UIButton
				v-if="!store.isEmpty"
				class="catalog-filters-panel__footer-btn"
				as="button"
				type="button"
				variant="secondary"
				color="dark"
				label="Сбросить всё"
				full
				@click="store.reset()"
			/>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-filters-panel {
	display: flex;
	flex-direction: column;

	&__head {
		display: flex;
		gap: 16px;
		align-items: baseline;
		justify-content: space-between;
		padding-bottom: 16px;
		border-bottom: 1px solid variables.$color-line;
	}

	&__head-title {
		margin: 0;
	}

	&__head-count {
		color: variables.$color-ink-soft;
	}

	&__body {
		flex: 1 1 auto;
		padding: 4px 0;
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
		gap: 6px;
		align-items: baseline;
	}

	&__option-count {
		color: variables.$color-ink-soft;
	}

	&__footer {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 16px;
	}
}
</style>
