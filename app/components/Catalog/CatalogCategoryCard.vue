<script setup lang="ts">
import type { ICategory } from '~~/interfaces/catalog/ICategory'
import { productsCountLabel } from '@/utils/utils'

defineProps<{
	category: ICategory
}>()
</script>

<template>
	<article class="catalog-category-card">
		<NuxtLink class="catalog-category-card__media" :to="category.url" :aria-label="category.title">
			<NuxtImg
				class="catalog-category-card__img"
				:src="category.img.url"
				:alt="category.img.alt"
				loading="lazy"
				format="webp"
				sizes="xs:90vw sm:45vw md:45vw lg:33vw xl:33vw"
			/>
			<span class="catalog-category-card__count tag-typo">{{ productsCountLabel(category.productsCount) }}</span>
		</NuxtLink>

		<div class="catalog-category-card__body">
			<h2 class="catalog-category-card__title title-18">
				<NuxtLink class="catalog-category-card__title-link hover-link" :to="category.url">
					{{ category.title }}
				</NuxtLink>
			</h2>

			<p class="catalog-category-card__text text-s">{{ category.description }}</p>

			<ul v-if="category.collections?.length" class="catalog-category-card__collections">
				<li v-for="collection in category.collections" :key="collection.url">
					<NuxtLink class="catalog-category-card__collection text-xs" :to="collection.url">
						{{ collection.label }}
					</NuxtLink>
				</li>
			</ul>
		</div>
	</article>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-category-card {
	display: flex;
	overflow: hidden;
	height: 100%;
	flex-direction: column;
	border: 1px solid variables.$color-line;
	border-radius: variables.$radius-m;
	background-color: variables.$color-surface;
	transition:
		border-color 0.4s ease-in-out,
		box-shadow 0.4s ease-in-out;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			border-color: transparent;
			box-shadow: variables.$shadow-hover;
		}

		&:hover .catalog-category-card__img {
			transform: scale(1.06);
		}
	}

	&__media {
		position: relative;
		display: block;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background-color: variables.$color-muted;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease-out;
	}

	&__count {
		position: absolute;
		bottom: 12px;
		left: 12px;
		padding: 6px 12px;
		border-radius: 999px;
		background-color: rgba(255, 255, 255, 90%);
		color: variables.$color-ink;
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
	}

	&__title {
		margin: 0;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__collections {
		display: flex;
		flex-wrap: wrap;
		margin-top: auto;
		gap: 6px;
		padding-top: 8px;
	}

	&__collection {
		display: inline-flex;
		padding: 5px 10px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		color: variables.$color-ink-soft;
		transition:
			border-color 0.3s ease-in-out,
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: variables.$color-accent;
				background-color: variables.$color-accent-soft;
				color: variables.$color-accent;
			}
		}
	}
}
</style>
