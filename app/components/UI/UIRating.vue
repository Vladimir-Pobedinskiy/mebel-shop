<script setup lang="ts">
import { declOfNum } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		rating: number
		reviewsCount?: number | null
		/** 'small' | 'big' */
		size?: string
		showValue?: boolean
	}>(),
	{
		reviewsCount: null,
		size: 'small',
		showValue: true,
	}
)

// Доля закрашенных звёзд: 4.5 → 90%
const fillWidth = computed(() => `${Math.max(0, Math.min(5, props.rating)) * 20}%`)

const reviewsLabel = computed(() => {
	if (!props.reviewsCount) return ''
	return `${props.reviewsCount} ${declOfNum(props.reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}`
})
</script>

<template>
	<div :class="['rating', `rating_${size}`]">
		<span class="rating__stars" :aria-label="`Рейтинг ${rating} из 5`">
			<span class="rating__stars-empty">
				<NuxtIcon v-for="star in 5" :key="`empty-${star}`" class="rating__star" name="icon-star" filled />
			</span>
			<span class="rating__stars-fill" :style="{ width: fillWidth }">
				<NuxtIcon v-for="star in 5" :key="`fill-${star}`" class="rating__star" name="icon-star" filled />
			</span>
		</span>

		<span v-if="showValue" class="rating__value text-s">{{ rating.toFixed(1) }}</span>
		<span v-if="reviewsLabel" class="rating__reviews text-s">{{ reviewsLabel }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.rating {
	display: flex;
	gap: 8px;
	align-items: center;

	&__stars {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
	}

	&__stars-empty,
	&__stars-fill {
		display: flex;
		gap: 2px;
		align-items: center;
	}

	&__stars-empty {
		color: variables.$color-line-strong;
	}

	&__stars-fill {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		color: variables.$color-warning;
		white-space: nowrap;
	}

	&__value {
		font-weight: 600;
	}

	&__reviews {
		color: variables.$color-ink-soft;
	}

	&_small &__star {
		width: 14px;
		height: 14px;
	}

	&_big &__star {
		width: 20px;
		height: 20px;
	}
}
</style>
