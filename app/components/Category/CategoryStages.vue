<script setup lang="ts">
import type { ICategoryStagesUnit } from '~~/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	stagesUnit: ICategoryStagesUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-stages__item', { stagger: 0.1, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="category-stages">
		<div class="container">
			<div class="category-stages__head">
				<h2 class="category-stages__title h2">{{ stagesUnit.title }}</h2>
				<p v-if="stagesUnit.text" class="category-stages__text text-m">{{ stagesUnit.text }}</p>
			</div>

			<ol class="category-stages__list">
				<li v-for="item in stagesUnit.items" :key="item.step" class="category-stages__item">
					<span class="category-stages__step">{{ item.step }}</span>

					<span class="category-stages__body">
						<span class="category-stages__item-head">
							<h3 class="category-stages__item-title title-18">{{ item.title }}</h3>
							<span v-if="item.term" class="category-stages__term tag-typo">{{ item.term }}</span>
						</span>

						<span class="category-stages__item-text text-s">{{ item.text }}</span>
					</span>
				</li>
			</ol>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-stages {
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
		gap: 12px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(5, 1fr);
			gap: 20px;
		}
	}

	&__item {
		display: flex;
		gap: 16px;
		padding: 24px 20px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$desktop-small) {
			flex-direction: column;
			gap: 16px;
			padding: 28px 24px;
		}
	}

	&__step {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		font-family: variables.$font-secondary;
		font-size: 18px;
		line-height: 1;
		color: variables.$color-accent;
		background-color: variables.$color-accent-soft;
		border-radius: 50%;
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__item-head {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	&__item-title {
		margin: 0;
	}

	&__term {
		display: inline-flex;
		padding: 4px 10px;
		color: variables.$color-ink-soft;
		background-color: variables.$color-muted;
		border-radius: 999px;
	}

	&__item-text {
		color: variables.$color-ink-soft;
	}
}
</style>
