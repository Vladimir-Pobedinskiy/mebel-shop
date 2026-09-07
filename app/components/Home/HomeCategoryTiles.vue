<script setup lang="ts">
import type { IHomeCategoryTile } from '~~/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

defineProps<{
	categoryTiles: { title: string; text: string; items: IHomeCategoryTile[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const { createAnimation, revealOnScroll } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-category-tiles__lead', { y: 24, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })
		timeline.to('.home-category-tiles__lead', { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
	})

	revealOnScroll(rootRef.value, '.home-category-tiles__item', { stagger: 0.06 })
})
</script>

<template>
	<section id="home-categories" ref="rootRef" class="home-category-tiles offset theme-light">
		<div class="container">
			<div class="home-category-tiles__head">
				<p ref="titleRef" class="home-category-tiles__title h2">{{ categoryTiles.title }}</p>
				<p class="home-category-tiles__lead text-m">{{ categoryTiles.text }}</p>
			</div>

			<ul class="home-category-tiles__grid">
				<li v-for="item in categoryTiles.items" :key="item.name" class="home-category-tiles__item">
					<NuxtLink class="home-category-tiles__tile hover-scale" :to="item.link.url" :aria-label="item.title">
						<span class="home-category-tiles__media hover-scale-img-wrapper">
							<NuxtImg
								class="home-category-tiles__img"
								:src="item.img.url"
								:alt="item.img.alt"
								loading="lazy"
								sizes="xs:45vw sm:30vw md:30vw lg:18vw xl:18vw"
							/>
						</span>

						<span class="home-category-tiles__title-tag h4">{{ item.title }}</span>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-category-tiles {
	&__head {
		max-width: 760px;
		margin-bottom: 32px;
	}

	&__title {
		margin: 0 0 16px;
	}

	&__lead {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(5, 1fr);
			gap: 20px;
		}
	}

	&__tile {
		position: relative;
		display: block;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		border-radius: variables.$radius-m;
	}

	&__media {
		position: absolute;
		inset: 0;
		background-color: variables.$color-muted;

		&::after {
			position: absolute;
			inset: 0;
			z-index: 1;
			content: '';
			background: linear-gradient(180deg, rgb(28 26 23 / 0%) 45%, rgb(28 26 23 / 65%) 100%);
		}
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__title-tag {
		position: relative;
		z-index: 2;
		display: block;
		padding: 16px;
		color: variables.$color-white;
	}
}
</style>
