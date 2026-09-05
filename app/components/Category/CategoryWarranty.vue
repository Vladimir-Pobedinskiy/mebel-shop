<script setup lang="ts">
import type { ICategoryWarrantyUnit } from '~~/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	warrantyUnit: ICategoryWarrantyUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-warranty__item', { stagger: 0.08, y: 28 })
})
</script>

<template>
	<section ref="rootRef" class="category-warranty">
		<div class="container">
			<div class="category-warranty__inner">
				<div class="category-warranty__head">
					<span class="category-warranty__icon-wrapper">
						<NuxtIcon class="category-warranty__icon" name="icon-shield" filled />
					</span>

					<h2 class="category-warranty__title h2">{{ warrantyUnit.title }}</h2>
					<p v-if="warrantyUnit.text" class="category-warranty__text text-m">{{ warrantyUnit.text }}</p>
					<p v-if="warrantyUnit.note" class="category-warranty__note text-s">{{ warrantyUnit.note }}</p>

					<UIButton
						v-if="warrantyUnit.link"
						class="category-warranty__link"
						as="NuxtLink"
						:to="warrantyUnit.link.url"
						:label="warrantyUnit.link.label"
						variant="secondary"
						show-icon
					/>
				</div>

				<ul class="category-warranty__list">
					<li v-for="item in warrantyUnit.items" :key="item.title" class="category-warranty__item">
						<h3 class="category-warranty__item-title title-18">{{ item.title }}</h3>
						<p class="category-warranty__item-text text-s">{{ item.text }}</p>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-warranty {
	&__inner {
		display: grid;
		gap: 28px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
			gap: 48px;
			align-items: start;
		}
	}

	&__head {
		@media (min-width: variables.$desktop-small) {
			position: sticky;
			top: 120px;
		}
	}

	&__icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		margin-bottom: 20px;
		color: variables.$color-accent;
		background-color: variables.$color-accent-soft;
		border-radius: 50%;
	}

	&__icon {
		width: 24px;
		height: 24px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}

	&__link {
		margin-top: 24px;
	}

	&__list {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			gap: 24px;
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		padding: 28px 24px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
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
