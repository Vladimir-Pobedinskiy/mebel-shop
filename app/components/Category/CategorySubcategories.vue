<script setup lang="ts">
import type { ICategorySubcategoriesUnit } from '~~/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'
import { productsCountLabel } from '@/utils/utils'

defineProps<{
	subcategoriesUnit: ICategorySubcategoriesUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-subcategories__item', { stagger: 0.1, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="category-subcategories">
		<div class="container">
			<div class="category-subcategories__head">
				<h2 class="category-subcategories__title h2">{{ subcategoriesUnit.title }}</h2>
				<p v-if="subcategoriesUnit.text" class="category-subcategories__text text-m">
					{{ subcategoriesUnit.text }}
				</p>
			</div>

			<ul class="category-subcategories__list">
				<li v-for="item in subcategoriesUnit.items" :key="item.url" class="category-subcategories__item hover-lift">
					<NuxtLink class="category-subcategories__link" :to="item.url">
						<span class="category-subcategories__media">
							<NuxtImg
								class="category-subcategories__img"
								:src="item.img.url"
								:alt="item.img.alt"
								loading="lazy"
								format="webp"
								sizes="xs:90vw sm:90vw md:45vw lg:33vw xl:33vw"
							/>
							<span class="category-subcategories__count tag-typo">
								{{ productsCountLabel(item.productsCount) }}
							</span>
						</span>

						<span class="category-subcategories__body">
							<span class="category-subcategories__item-title title-18">{{ item.title }}</span>
							<span class="category-subcategories__item-text text-s">{{ item.text }}</span>
						</span>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-subcategories {
	&__head {
		max-width: 760px;
		margin-bottom: 28px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	&__item {
		display: flex;
	}

	&__link {
		display: flex;
		overflow: hidden;
		width: 100%;
		flex-direction: column;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
		transition: border-color 0.4s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: variables.$color-accent;
			}
		}
	}

	&__media {
		position: relative;
		display: block;
		overflow: hidden;
		background-color: variables.$color-muted;
	}

	&__img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		transition: transform 0.6s ease-in-out;
	}

	&__count {
		position: absolute;
		top: 12px;
		left: 12px;
		display: inline-flex;
		padding: 6px 12px;
		border-radius: 999px;
		background-color: variables.$color-surface;
		color: variables.$color-ink-soft;
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 8px;
		padding: 20px;

		@media (min-width: variables.$desktop) {
			padding: 24px;
		}
	}

	&__item-text {
		color: variables.$color-ink-soft;
	}

	@media (min-width: variables.$desktop-small) {
		&__link:hover &__img {
			transform: scale(1.04);
		}
	}
}
</style>
