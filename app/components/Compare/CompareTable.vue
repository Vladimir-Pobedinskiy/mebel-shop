<script setup lang="ts">
import type { IProduct } from '~~/interfaces/product/IProduct'
import { useCartStore } from '@/stores/storeCart'
import { useCompareStore } from '@/stores/storeCompare'

const props = defineProps<{
	products: IProduct[]
	characteristicKeys: string[]
}>()

const storeCart = useCartStore()
const storeCompare = useCompareStore()

/* В листинге у товара нет массива characteristics — подставляем плоские поля карточки */
const fallbackValue = (product: IProduct, key: string): string => {
	const map: Record<string, string | undefined> = {
		Коллекция: product.collection,
		Бренд: product.brand,
		Материал: product.material,
		Цвет: product.color,
		'Габариты (Ш×Г×В)': product.sizes,
		'Срок изготовления': product.availability,
	}

	return map[key] || '—'
}

const getValue = (product: IProduct, key: string): string => {
	const found = product.characteristics?.find(characteristic => characteristic.label === key)

	return found?.value || fallbackValue(product, key)
}

/* Показывать только строки, в которых значения товаров различаются */
const isOnlyDifferences = ref<boolean>(false)

const rows = computed(() =>
	props.characteristicKeys
		.map(key => ({
			key,
			values: props.products.map(product => getValue(product, key)),
		}))
		.filter(row => (isOnlyDifferences.value ? new Set(row.values).size > 1 : true))
)

const addToCart = (product: IProduct) => {
	if (storeCart.isInCart(product.id)) return
	storeCart.add(product)
}
</script>

<template>
	<div class="compare-table">
		<div class="compare-table__toolbar">
			<UICheckbox v-model="isOnlyDifferences" name="only-differences">
				<template #content>
					<span class="compare-table__toolbar-label text-s">Только различия</span>
				</template>
			</UICheckbox>

			<button class="compare-table__clear text-s" type="button" @click="storeCompare.clear()">
				<NuxtIcon class="compare-table__clear-icon" name="icon-trash" filled />
				<span>Очистить список</span>
			</button>
		</div>

		<div class="compare-table__scroll custom-scrollbar">
			<table class="compare-table__table">
				<caption class="visually-hidden">
					Сравнение характеристик выбранных товаров
				</caption>

				<thead>
					<tr>
						<th class="compare-table__corner" scope="col">
							<span class="visually-hidden">Характеристика</span>
						</th>

						<th v-for="product in products" :key="product.id" class="compare-table__product-cell" scope="col">
							<div class="compare-table__product">
								<button
									class="compare-table__remove"
									type="button"
									:aria-label="`Убрать ${product.title} из сравнения`"
									@click="storeCompare.remove(product.id)"
								>
									<NuxtIcon class="compare-table__remove-icon" name="icon-close" filled />
								</button>

								<NuxtLink class="compare-table__media" :to="product.url" :aria-label="product.title">
									<NuxtImg
										class="compare-table__img"
										:src="product.img.url"
										:alt="product.img.alt"
										loading="lazy"
										format="webp"
										sizes="xs:60vw sm:40vw md:30vw lg:240px xl:240px xxl:240px"
									/>
								</NuxtLink>

								<p class="compare-table__product-title title-18">
									<NuxtLink class="hover-link" :to="product.url">{{ product.title }}</NuxtLink>
								</p>

								<UIPrice
									class="compare-table__price"
									:price="product.price"
									:old-price="product.oldPrice"
									size="small"
								/>

								<UIButton
									class="compare-table__cart-btn"
									as="button"
									type="button"
									size="small"
									:color="storeCart.isInCart(product.id) ? 'green' : 'accent'"
									:label="storeCart.isInCart(product.id) ? 'В корзине' : 'В корзину'"
									:disabled="!product.inStock"
									full
									@click="addToCart(product)"
								/>
							</div>
						</th>
					</tr>
				</thead>

				<tbody v-auto-animate>
					<tr v-for="row in rows" :key="row.key" class="compare-table__row">
						<th class="compare-table__row-label text-s" scope="row">{{ row.key }}</th>

						<td v-for="(value, index) in row.values" :key="`${row.key}-${index}`" class="compare-table__cell text-s">
							{{ value }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p v-if="!rows.length" class="compare-table__no-rows text-m">
			Различий по выбранным характеристикам нет — товары совпадают.
		</p>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.compare-table {
	&__toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 24px;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	&__toolbar-label {
		color: variables.$color-ink-soft;
	}

	&__clear {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		color: variables.$color-ink-soft;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				color: variables.$color-error;
			}
		}
	}

	&__clear-icon {
		display: flex;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	&__scroll {
		overflow-x: auto;
		background-color: variables.$color-surface;
		border-radius: variables.$radius-m;
	}

	&__table {
		width: 100%;
		min-width: 640px;
		text-align: left;
		border-collapse: collapse;
	}

	&__corner {
		width: 180px;
		min-width: 180px;
		background-color: variables.$color-surface;
	}

	&__product-cell {
		width: 240px;
		min-width: 240px;
		padding: 20px 16px;
		vertical-align: top;
		border-left: 1px solid variables.$color-line;
	}

	&__product {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__remove {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		color: variables.$color-ink-soft;
		background-color: variables.$color-muted;
		border-radius: 50%;
		transition:
			color 0.3s ease-in-out,
			background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-error;
			}
		}
	}

	&__remove-icon {
		display: flex;

		svg {
			width: 12px;
			height: 12px;
		}
	}

	&__media {
		display: block;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-s;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__product-title {
		margin: 0;
	}

	&__row {
		&:nth-child(odd) {
			background-color: variables.$color-bg;
		}
	}

	&__row-label {
		padding: 14px 16px;
		font-weight: 500;
		vertical-align: top;
		color: variables.$color-ink-soft;
	}

	&__cell {
		padding: 14px 16px;
		vertical-align: top;
		border-left: 1px solid variables.$color-line;
	}

	&__no-rows {
		margin: 24px 0 0;
		color: variables.$color-ink-soft;
	}
}
</style>
