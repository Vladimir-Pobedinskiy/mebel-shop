<script setup lang="ts">
import type { ICategoryAdvantagesUnit } from '~~/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	advantagesUnit: ICategoryAdvantagesUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-advantages__item', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="category-advantages">
		<div class="container">
			<div class="category-advantages__head">
				<h2 class="category-advantages__title h2">{{ advantagesUnit.title }}</h2>
				<p v-if="advantagesUnit.text" class="category-advantages__text text-m">{{ advantagesUnit.text }}</p>
			</div>

			<ul class="category-advantages__list">
				<li v-for="item in advantagesUnit.items" :key="item.title" class="category-advantages__item hover-lift">
					<span class="category-advantages__icon-wrapper">
						<NuxtIcon class="category-advantages__icon" :name="item.icon" filled />
					</span>

					<h3 class="category-advantages__item-title title-18">{{ item.title }}</h3>
					<p class="category-advantages__item-text text-s">{{ item.text }}</p>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-advantages {
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
		height: 100%;
		flex-direction: column;
		gap: 12px;
		padding: 28px 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__icon-wrapper {
		display: flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		margin-bottom: 8px;
		background-color: variables.$color-accent-soft;
		color: variables.$color-accent;
	}

	&__icon {
		width: 24px;
		height: 24px;
	}

	&__item-title {
		margin: 0;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
