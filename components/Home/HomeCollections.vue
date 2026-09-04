<script setup lang="ts">
import type { IHomeCollection } from '@/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

defineProps<{
	collections: { title: string; text: string; items: IHomeCollection[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const stickyRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })

		if (words.length) {
			gsap.to(words, {
				yPercent: 0,
				duration: 0.8,
				ease: 'power3.out',
				stagger: 0.06,
				scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
			})
		}

		// Горизонтальный pinned-скролл — только на десктопе; на узких экранах остаётся обычный свайп
		// matchMedia создан внутри gsap.context — откатится вместе с ним в useGsapReveal
		const mm = gsap.matchMedia()

		mm.add('(min-width: 1024px)', () => {
			const track = trackRef.value
			const sticky = stickyRef.value
			if (!track || !sticky) return

			const getDistance = () => Math.max(0, track.scrollWidth - sticky.clientWidth)

			gsap.to(track, {
				x: () => -getDistance(),
				ease: 'none',
				scrollTrigger: {
					trigger: sticky,
					pin: true,
					scrub: 1,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					end: () => `+=${getDistance()}`,
				},
			})
		})
	})
})
</script>

<template>
	<section ref="rootRef" class="home-collections offset">
		<div ref="stickyRef" class="home-collections__sticky">
			<div class="container home-collections__head">
				<p ref="titleRef" class="home-collections__title h2">{{ collections.title }}</p>
				<p class="home-collections__text text-m">{{ collections.text }}</p>
			</div>

			<div class="home-collections__viewport">
				<ul ref="trackRef" class="home-collections__track">
					<li v-for="item in collections.items" :key="item.title" class="home-collections__item">
						<NuxtLink class="home-collections__card hover-scale" :to="item.link.url">
							<span class="home-collections__card-media hover-scale-img-wrapper">
								<NuxtImg
									class="home-collections__card-img"
									:src="item.img.url"
									:alt="item.img.alt"
									loading="lazy"
									sizes="xs:85vw sm:85vw md:45vw lg:32vw xl:32vw xxl:32vw"
								/>
							</span>

							<span class="home-collections__card-body">
								<span class="home-collections__card-title h3">{{ item.title }}</span>
								<span class="home-collections__card-text text-s">{{ item.text }}</span>
								<span class="home-collections__card-link button-typo">
									{{ item.link.label }}
									<NuxtIcon class="home-collections__card-icon" name="icon-arrow-right" filled />
								</span>
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-collections {
	overflow: hidden;

	&__sticky {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 32px;

		@media (min-width: variables.$desktop-small) {
			min-height: 100svh;
		}
	}

	&__head {
		max-width: 760px;
	}

	&__title {
		margin: 0 0 14px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__viewport {
		overflow: hidden;
		width: 100%;
	}

	&__track {
		display: flex;
		overflow-x: auto;
		gap: 16px;
		padding: 0 16px 8px;
		scroll-snap-type: x mandatory;
		will-change: transform;

		@media (min-width: variables.$desktop-small) {
			overflow-x: visible;
			gap: 24px;
			padding: 0 max(16px, calc((100vw - #{variables.$container-width}) / 2 + 16px));
		}
	}

	&__item {
		flex: 0 0 auto;
		width: 82vw;
		scroll-snap-align: start;

		@media (min-width: variables.$tablet) {
			width: 46vw;
		}

		@media (min-width: variables.$desktop-small) {
			width: 34vw;
			max-width: 480px;
		}
	}

	&__card {
		display: flex;
		overflow: hidden;
		height: 100%;
		flex-direction: column;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;
		background-color: variables.$color-surface;
	}

	&__card-media {
		display: block;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background-color: variables.$color-muted;
	}

	&__card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__card-body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
	}

	&__card-text {
		color: variables.$color-ink-soft;
	}

	&__card-link {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: auto;
		padding-top: 12px;
		color: variables.$color-accent;
	}

	&__card-icon {
		width: 18px;
		height: 18px;
	}
}
</style>
