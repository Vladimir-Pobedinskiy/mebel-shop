<script setup lang="ts">
import type { IDealerReviewsUnit } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	reviewsUnit: IDealerReviewsUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-reviews__item', { stagger: 0.08, y: 28 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-reviews">
		<div class="dealer-reviews__head">
			<h2 class="dealer-reviews__title h2">{{ reviewsUnit.title }}</h2>
			<p class="dealer-reviews__text text-m">{{ reviewsUnit.text }}</p>
		</div>

		<ul class="dealer-reviews__list">
			<li v-for="review in reviewsUnit.items" :key="review.id" class="dealer-reviews__item surface">
				<UIRating class="dealer-reviews__rating" :rating="review.rating" />

				<blockquote class="dealer-reviews__quote">
					<p class="dealer-reviews__quote-text text-s">{{ review.text }}</p>
				</blockquote>

				<div class="dealer-reviews__author">
					<p class="dealer-reviews__author-name title-14">{{ review.author }}</p>
					<p class="dealer-reviews__author-company text-xs">{{ review.company }}, {{ review.city }}</p>
					<p class="dealer-reviews__author-since text-xs">{{ review.since }}</p>
				</div>
			</li>
		</ul>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-reviews {
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
		grid-template-columns: 1fr;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		padding: 24px 20px;
		gap: 14px;
	}

	&__quote {
		margin: 0;
		flex: 1 1 auto;
	}

	&__quote-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__author {
		padding-top: 14px;
		border-top: 1px solid variables.$color-line;
	}

	&__author-name {
		margin: 0 0 4px;
	}

	&__author-company {
		margin: 0 0 2px;
		color: variables.$color-ink-soft;
	}

	&__author-since {
		margin: 0;
		color: variables.$color-accent;
	}
}
</style>
