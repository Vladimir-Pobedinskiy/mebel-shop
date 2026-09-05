<script setup lang="ts">
import type { ICategoryMaterialsUnit } from '~~/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	materialsUnit: ICategoryMaterialsUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-materials__group, .category-materials__hardware', { stagger: 0.1, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="category-materials">
		<div class="container">
			<div class="category-materials__head">
				<h2 class="category-materials__title h2">{{ materialsUnit.title }}</h2>
				<p v-if="materialsUnit.text" class="category-materials__text text-m">{{ materialsUnit.text }}</p>
			</div>

			<div class="category-materials__groups">
				<article v-for="group in materialsUnit.groups" :key="group.title" class="category-materials__group">
					<h3 class="category-materials__group-title h4">{{ group.title }}</h3>
					<p v-if="group.text" class="category-materials__group-text text-s">{{ group.text }}</p>

					<dl class="category-materials__specs">
						<div v-for="item in group.items" :key="item.label" class="category-materials__spec">
							<dt class="category-materials__spec-label title-14">{{ item.label }}</dt>
							<dd class="category-materials__spec-value text-s">{{ item.value }}</dd>
						</div>
					</dl>
				</article>
			</div>

			<div v-if="materialsUnit.hardware?.length" class="category-materials__hardware">
				<h3 class="category-materials__hardware-title h4">Фурнитура</h3>

				<ul class="category-materials__hardware-list">
					<li v-for="item in materialsUnit.hardware" :key="item.brand" class="category-materials__hardware-item">
						<span class="category-materials__hardware-brand title-18">{{ item.brand }}</span>
						<span class="category-materials__hardware-text text-s">{{ item.description }}</span>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-materials {
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

	&__groups {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}
	}

	&__group {
		padding: 28px 24px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$desktop) {
			padding: 36px 32px;
		}
	}

	&__group-title {
		margin: 0 0 8px;
	}

	&__group-text {
		margin: 0 0 20px;
		color: variables.$color-ink-soft;
	}

	&__spec {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 0;
		border-top: 1px solid variables.$color-line;

		@media (min-width: variables.$mobile-big) {
			flex-direction: row;
			gap: 16px;
		}
	}

	&__spec-label {
		@media (min-width: variables.$mobile-big) {
			flex: 0 0 auto;
			width: 44%;
		}
	}

	&__spec-value {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__hardware {
		padding: 28px 24px;
		margin-top: 16px;
		color: variables.$color-white;
		background-color: variables.$color-accent-2;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$desktop) {
			padding: 40px 32px;
			margin-top: 24px;
		}
	}

	&__hardware-title {
		margin: 0 0 20px;
	}

	&__hardware-list {
		display: grid;
		gap: 20px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
			gap: 24px;
		}
	}

	&__hardware-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__hardware-text {
		opacity: 0.75;
	}
}
</style>
