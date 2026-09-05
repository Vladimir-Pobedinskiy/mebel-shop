<script setup lang="ts">
import type { IHomeAboutUnit } from '~~/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { numberFormatter } from '@/utils/utils'

defineProps<{
	aboutUnit: IHomeAboutUnit
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-about__subtitle', { y: 16, opacity: 0 })
		gsap.set('.home-about__text', { y: 24, opacity: 0 })
		gsap.set('.home-about__btn', { y: 20, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 75%' },
		})

		timeline.to('.home-about__subtitle', { y: 0, opacity: 1, duration: 0.5 })

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.05 }, '-=0.3')

		timeline
			.to('.home-about__text', { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
			.to('.home-about__btn', { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')

		// Параллакс фотографии производства
		gsap.to('.home-about__img', {
			yPercent: 10,
			ease: 'none',
			scrollTrigger: { trigger: mediaRef.value as HTMLElement, start: 'top bottom', end: 'bottom top', scrub: true },
		})

		// Счётчики: числа набегают при появлении блока
		gsap.utils.toArray<HTMLElement>('.home-about__counter-value').forEach(element => {
			const target = Number(element.dataset.value || 0)
			const counter = { value: 0 }

			gsap.fromTo(
				counter,
				{ value: 0 },
				{
					value: target,
					duration: 1.6,
					ease: 'power2.out',
					// до появления блока в поле зрения в разметке остаётся итоговое число из данных
					immediateRender: false,
					scrollTrigger: { trigger: element, start: 'top 90%' },
					onUpdate: () => {
						element.textContent = numberFormatter(Math.round(counter.value))
					},
				}
			)
		})
	})
})
</script>

<template>
	<section ref="rootRef" class="home-about offset">
		<div class="container home-about__inner">
			<div ref="mediaRef" class="home-about__media">
				<NuxtImg
					class="home-about__img"
					:src="aboutUnit.img.url"
					:alt="aboutUnit.img.alt"
					loading="lazy"
					sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw"
				/>
			</div>

			<div class="home-about__body">
				<p class="home-about__subtitle card-subtitle">{{ aboutUnit.subtitle }}</p>
				<p ref="titleRef" class="home-about__title h2">{{ aboutUnit.title }}</p>
				<p class="home-about__text text-m">{{ aboutUnit.text }}</p>

				<ul class="home-about__counters">
					<li v-for="counter in aboutUnit.counters" :key="counter.label" class="home-about__counter">
						<p class="home-about__counter-number h3">
							<span class="home-about__counter-value" :data-value="counter.value">
								{{ numberFormatter(counter.value) }}
							</span>
							<span v-if="counter.suffix" class="home-about__counter-suffix">{{ counter.suffix }}</span>
						</p>
						<p class="home-about__counter-label text-s">{{ counter.label }}</p>
					</li>
				</ul>

				<UIButton
					class="home-about__btn"
					as="NuxtLink"
					:to="aboutUnit.link.url"
					variant="secondary"
					color="green"
					:label="aboutUnit.link.label"
					show-icon
				/>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-about {
	&__inner {
		display: grid;
		gap: 32px;
		align-items: center;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: 1fr 1fr;
			gap: 56px;
		}
	}

	&__media {
		position: relative;
		overflow: hidden;
		aspect-ratio: 4 / 5;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;

		@media (min-width: variables.$tablet-big) {
			aspect-ratio: 1 / 1;
		}
	}

	&__img {
		position: absolute;
		top: -6%;
		left: 0;
		width: 100%;
		height: 112%;
		object-fit: cover;
		will-change: transform;
	}

	&__body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__subtitle {
		margin: 0 0 14px;
	}

	&__title {
		margin: 0 0 18px;
	}

	&__text {
		margin: 0 0 32px;
		color: variables.$color-ink-soft;
	}

	&__counters {
		display: grid;
		width: 100%;
		gap: 24px;
		padding: 28px 0;
		border-top: 1px solid variables.$color-line;
		border-bottom: 1px solid variables.$color-line;
		margin-bottom: 32px;
		grid-template-columns: repeat(2, 1fr);

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
		}
	}

	&__counter-number {
		display: flex;
		align-items: baseline;
		margin: 0 0 6px;
		color: variables.$color-accent;
	}

	&__counter-suffix {
		white-space: pre;
	}

	&__counter-label {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
