<script setup lang="ts">
import type { ILink } from '~~/interfaces/ILink'
import type { IProduct } from '~~/interfaces/product/IProduct'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

defineProps<{
	bestsellers: { title: string; text: string; link: ILink; products: IProduct[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

const swiperOptions = {
	slidesPerView: 1.15,
	spaceBetween: 16,
	speed: 600,
	keyboard: { enabled: true },
	navigation: {
		prevEl: '.home-bestsellers__nav-btn_prev',
		nextEl: '.home-bestsellers__nav-btn_next',
	},
	breakpoints: {
		576: { slidesPerView: 2.1, spaceBetween: 16 },
		768: { slidesPerView: 2.4, spaceBetween: 20 },
		1024: { slidesPerView: 3.2, spaceBetween: 24 },
		1400: { slidesPerView: 4, spaceBetween: 24 },
	},
}

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-bestsellers__head-aside', { y: 24, opacity: 0 })
		gsap.set('.home-bestsellers__slider', { y: 48, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-bestsellers__head-aside', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.home-bestsellers__slider', { y: 0, opacity: 1, duration: 0.9 }, '-=0.4')
	})
})
</script>

<template>
	<section ref="rootRef" class="home-bestsellers offset">
		<div class="container">
			<div class="home-bestsellers__head">
				<div class="home-bestsellers__head-main">
					<p ref="titleRef" class="home-bestsellers__title h2">{{ bestsellers.title }}</p>
					<p class="home-bestsellers__text text-m">{{ bestsellers.text }}</p>
				</div>

				<div class="home-bestsellers__head-aside">
					<UIButton
						class="home-bestsellers__head-btn"
						as="NuxtLink"
						:to="bestsellers.link.url"
						variant="secondary"
						color="dark"
						:label="bestsellers.link.label"
						show-icon
					/>

					<div class="home-bestsellers__nav">
						<button
							class="home-bestsellers__nav-btn home-bestsellers__nav-btn_prev slider-nav-btn"
							type="button"
							aria-label="Предыдущие товары"
						>
							<NuxtIcon class="home-bestsellers__nav-icon" name="icon-arrow-left" filled />
						</button>
						<button
							class="home-bestsellers__nav-btn home-bestsellers__nav-btn_next slider-nav-btn"
							type="button"
							aria-label="Следующие товары"
						>
							<NuxtIcon class="home-bestsellers__nav-icon" name="icon-arrow-right" filled />
						</button>
					</div>
				</div>
			</div>

			<UISlider class="home-bestsellers__slider" :swiper-options="swiperOptions" :slides="bestsellers.products">
				<template #content="{ slide }">
					<ProductCard :product="slide as IProduct" />
				</template>
			</UISlider>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-bestsellers {
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
		max-width: 620px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__head-aside {
		display: flex;
		align-items: center;
		gap: 16px;
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
}
</style>
