<script setup lang="ts">
import type { ICategoryLinksUnit } from '@/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	linksUnit: ICategoryLinksUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-links__group', { stagger: 0.1, y: 28 })
})
</script>

<template>
	<section ref="rootRef" class="category-links">
		<div class="container">
			<div class="category-links__head">
				<h2 class="category-links__title h2">{{ linksUnit.title }}</h2>
				<p v-if="linksUnit.text" class="category-links__text text-m">{{ linksUnit.text }}</p>
			</div>

			<div class="category-links__groups">
				<div v-for="group in linksUnit.groups" :key="group.title" class="category-links__group">
					<h3 class="category-links__group-title title-18">{{ group.title }}</h3>

					<ul class="category-links__list">
						<li v-for="link in group.links" :key="link.url">
							<NuxtLink class="category-links__link text-s hover-link" :to="link.url">{{ link.label }}</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-links {
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

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	&__group {
		padding: 28px 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__group-title {
		margin: 0 0 16px;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__link {
		color: variables.$color-ink-soft;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}
	}
}
</style>
