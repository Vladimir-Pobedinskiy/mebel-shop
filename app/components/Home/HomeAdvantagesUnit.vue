<script setup lang="ts">
import type { IAdvantage } from '~~/interfaces/IAdvantage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

defineProps<{
	advantagesUnit: { title: string; text: string; items: IAdvantage[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-advantages__text', { y: 20, opacity: 0 })
		gsap.set('.home-advantages__item', { y: 40, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-advantages__text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.home-advantages__item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.35')
	})
})
</script>

<template>
	<section ref="rootRef" class="home-advantages offset">
		<div class="container">
			<div class="home-advantages__head">
				<p ref="titleRef" class="home-advantages__title h2">{{ advantagesUnit.title }}</p>
				<p class="home-advantages__text text-m">{{ advantagesUnit.text }}</p>
			</div>

			<ul class="home-advantages__list">
				<li v-for="item in advantagesUnit.items" :key="item.title" class="home-advantages__item hover-lift">
					<span class="home-advantages__icon-wrapper">
						<NuxtIcon class="home-advantages__icon" :name="item.icon" filled />
					</span>

					<h3 class="home-advantages__item-title title-18">{{ item.title }}</h3>
					<p class="home-advantages__item-text text-s">{{ item.text }}</p>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-advantages {
	&__head {
		max-width: 760px;
		margin-bottom: 36px;
	}

	&__title {
		margin: 0 0 14px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
			gap: 24px;
		}
	}

	&__item {
		display: flex;
		height: 100%;
		flex-direction: column;
		gap: 12px;
		padding: 28px 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__icon-wrapper {
		display: flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		margin-bottom: 8px;
		background-color: variables.$color-accent-soft;
		color: variables.$color-accent;
	}

	&__icon {
		width: 24px;
		height: 24px;
	}

	&__item-title {
		margin: 0;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
