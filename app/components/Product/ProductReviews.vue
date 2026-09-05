<script setup lang="ts">
import type { IReview } from '~~/interfaces/IReview'
import { formatDateRu } from '@/utils/utils'

withDefaults(
	defineProps<{
		reviews: IReview[]
		rating: number
		reviewsCount?: number
	}>(),
	{
		reviewsCount: 0,
	}
)
</script>

<template>
	<div class="product-reviews">
		<div v-if="reviews.length" class="product-reviews__summary">
			<p class="product-reviews__rating h2">{{ rating.toFixed(1) }}</p>

			<div class="product-reviews__summary-body">
				<UIRating :rating="rating" :reviews-count="reviewsCount" size="big" :show-value="false" />
				<p class="product-reviews__summary-text text-s">Средняя оценка покупателей по этой модели</p>
			</div>
		</div>

		<ul v-if="reviews.length" v-auto-animate class="product-reviews__list">
			<li v-for="review in reviews" :key="review.id" class="product-reviews__item">
				<div class="product-reviews__item-head">
					<div>
						<p class="product-reviews__author title-14">{{ review.author }}</p>
						<p class="product-reviews__city text-xs">{{ review.city }}</p>
					</div>

					<div class="product-reviews__item-meta">
						<UIRating :rating="review.rating" :show-value="false" />
						<time class="product-reviews__date text-xs" :datetime="review.date">{{ formatDateRu(review.date) }}</time>
					</div>
				</div>

				<p class="product-reviews__text text-s">{{ review.text }}</p>

				<p v-if="review.productTitle" class="product-reviews__product text-xs">О товаре: {{ review.productTitle }}</p>
			</li>
		</ul>

		<UIEmptyState
			v-else
			title="Отзывов пока нет"
			text="Станьте первым, кто расскажет об этой модели: напишите нам после доставки — опубликуем отзыв на странице товара."
			icon="icon-star"
			link-url="/contacts/"
			link-label="Написать нам"
		/>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-reviews {
	display: flex;
	flex-direction: column;
	gap: 24px;

	&__summary {
		display: flex;
		gap: 20px;
		align-items: center;
		padding: 20px;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-m;
	}

	&__rating {
		margin: 0;
		color: variables.$color-accent;
	}

	&__summary-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__summary-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
	}

	&__item-head {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		align-items: flex-start;
		justify-content: space-between;
	}

	&__item-meta {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: flex-end;
	}

	&__author {
		margin: 0;
	}

	&__city,
	&__date,
	&__product {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__text {
		margin: 0;
	}

	&__product {
		padding-top: 4px;
		margin-top: auto;
	}
}
</style>
