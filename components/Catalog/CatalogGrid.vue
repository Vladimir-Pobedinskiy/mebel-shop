<script setup lang="ts">
import type { IProduct } from '@/interfaces/product/IProduct'

withDefaults(
	defineProps<{
		products: IProduct[]
		/** пока данные не пришли — вместо карточек показываются скелетоны */
		pending?: boolean
		/** сколько скелетонов рисовать во время загрузки */
		skeletonCount?: number
		/** ссылка кнопки в пустом состоянии */
		emptyLinkUrl?: string
		emptyLinkLabel?: string
	}>(),
	{
		pending: false,
		skeletonCount: 6,
		emptyLinkUrl: '/catalog/',
		emptyLinkLabel: 'Вернуться в каталог',
	}
)
</script>

<template>
	<div class="catalog-grid">
		<ul v-if="pending" class="catalog-grid__list">
			<li v-for="index in skeletonCount" :key="index" class="catalog-grid__item">
				<div class="catalog-grid__skeleton">
					<UISkeleton variant="box" height="220px" radius="16px" />
					<UISkeleton variant="title" width="70%" />
					<UISkeleton variant="text" :count="2" />
				</div>
			</li>
		</ul>

		<ul v-else-if="products.length" v-auto-animate class="catalog-grid__list">
			<li v-for="product in products" :key="product.id" class="catalog-grid__item">
				<ProductCard :product="product" />
			</li>
		</ul>

		<UIEmptyState
			v-else
			class="catalog-grid__empty"
			title="Ничего не нашлось"
			text="По выбранным фильтрам товаров нет. Попробуйте сбросить часть условий или расширить диапазон цены."
			icon="icon-filter"
			:link-url="emptyLinkUrl"
			:link-label="emptyLinkLabel"
		/>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-grid {
	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			gap: 24px;
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		display: flex;
	}

	&__skeleton {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__empty {
		padding: 40px 0;
	}
}
</style>
