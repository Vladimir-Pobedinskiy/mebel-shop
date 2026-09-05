<script setup lang="ts">
import type { IReview } from '~~/interfaces/IReview'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { formatDateRu } from '@/utils/utils'

defineProps<{
	reviewsUnit: { title: string; text: string; rating: number; items: IReview[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

const swiperOptions = {
	slidesPerView: 1.1,
	spaceBetween: 16,
	speed: 600,
	keyboard: { enabled: true },
	navigation: {
		prevEl: '.home-reviews__nav-btn_prev',
		nextEl: '.home-reviews__nav-btn_next',
	},
	breakpoints: {
		768: { slidesPerView: 2.1, spaceBetween: 20 },
		1024: { slidesPerView: 3, spaceBetween: 24 },
	},
}

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-reviews__head-aside', { y: 20, opacity: 0 })
		gsap.set('.home-reviews__slider', { y: 40, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-reviews__head-aside', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.home-reviews__slider', { y: 0, opacity: 1, duration: 0.8 }, '-=0.35')
	})
})
</script>

<template>
	<section ref="rootRef" class="home-reviews offset">
		<div class="container">
			<div class="home-reviews__head">
				<div class="home-reviews__head-main">
					<p ref="titleRef" class="home-reviews__title h2">{{ reviewsUnit.title }}</p>
					<p class="home-reviews__text text-m">{{ reviewsUnit.text }}</p>
				</div>

				<div class="home-reviews__head-aside">
					<UIRating class="home-reviews__rating" :rating="reviewsUnit.rating" size="big" />

					<div class="home-reviews__nav">
						<button
							class="home-reviews__nav-btn home-reviews__nav-btn_prev slider-nav-btn"
							type="button"
							aria-label="Предыдущие отзывы"
						>
							<NuxtIcon class="home-reviews__nav-icon" name="icon-arrow-left" filled />
						</button>
						<button
							class="home-reviews__nav-btn home-reviews__nav-btn_next slider-nav-btn"
							type="button"
							aria-label="Следующие отзывы"
						>
							<NuxtIcon class="home-reviews__nav-icon" name="icon-arrow-right" filled />
						</button>
					</div>
				</div>
			</div>

			<UISlider class="home-reviews__slider" :swiper-options="swiperOptions" :slides="reviewsUnit.items">
				<template #content="{ slide }">
					<article class="home-reviews__card">
						<UIRating class="home-reviews__card-rating" :rating="slide.rating" :show-value="false" />

						<blockquote class="home-reviews__card-text text-m">{{ slide.text }}</blockquote>

						<footer class="home-reviews__card-footer">
							<p class="home-reviews__card-author title-18">{{ slide.author }}</p>
							<p class="home-reviews__card-meta text-xs">{{ slide.city }} · {{ formatDateRu(slide.date) }}</p>
							<p class="home-reviews__card-product text-xs">{{ slide.productTitle }}</p>
						</footer>
					</article>
				</template>
			</UISlider>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-reviews {
	overflow: hidden;

	&__head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 32px;

		@media (min-width: variables.$tablet-big) {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			gap: 32px;
		}
	}

	&__head-main {
		max-width: 680px;
	}

	&__title {
		margin: 0 0 14px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__head-aside {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	&__nav {
		display: none;
		gap: 8px;

		@media (min-width: variables.$tablet-big) {
			display: flex;
		}
	}

	&__nav-icon {
		width: 18px;
		height: 18px;
	}

	&__slider {
		overflow: visible;
	}

	&__card {
		display: flex;
		height: 100%;
		flex-direction: column;
		gap: 16px;
		padding: 28px 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__card-text {
		margin: 0;
		color: variables.$color-ink;
	}

	&__card-footer {
		margin-top: auto;
		padding-top: 16px;
		border-top: 1px solid variables.$color-line;
	}

	&__card-author {
		margin: 0 0 4px;
	}

	&__card-meta {
		margin: 0 0 6px;
		color: variables.$color-ink-soft;
	}

	&__card-product {
		margin: 0;
		color: variables.$color-accent;
	}
}
</style>
