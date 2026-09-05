<script setup lang="ts">
import type { IHomeShowroom } from '~~/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

defineProps<{
	showroomUnit: { title: string; text: string; items: IHomeShowroom[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-showroom__text', { y: 20, opacity: 0 })
		gsap.set('.home-showroom__item', { y: 40, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-showroom__text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.home-showroom__item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }, '-=0.35')
	})
})
</script>

<template>
	<section ref="rootRef" class="home-showroom offset">
		<div class="container">
			<div class="home-showroom__head">
				<div class="home-showroom__head-main">
					<p ref="titleRef" class="home-showroom__title h2">{{ showroomUnit.title }}</p>
					<p class="home-showroom__text text-m">{{ showroomUnit.text }}</p>
				</div>

				<UIButton
					class="home-showroom__head-btn"
					as="NuxtLink"
					to="/map/"
					variant="secondary"
					color="dark"
					label="Салоны на карте"
					show-icon
					icon="icon-location"
				/>
			</div>

			<ul class="home-showroom__list">
				<li v-for="item in showroomUnit.items" :key="item.title" class="home-showroom__item hover-scale">
					<span class="home-showroom__item-media hover-scale-img-wrapper">
						<NuxtImg
							class="home-showroom__item-img"
							:src="item.img.url"
							:alt="item.img.alt"
							loading="lazy"
							sizes="xs:100vw sm:100vw md:33vw lg:33vw xl:33vw xxl:33vw"
						/>
					</span>

					<div class="home-showroom__item-body">
						<h3 class="home-showroom__item-title title-18">{{ item.title }}</h3>

						<p class="home-showroom__item-line text-s">
							<NuxtIcon class="home-showroom__item-icon" name="icon-location" filled />
							{{ item.address }}
						</p>

						<p class="home-showroom__item-line text-s">
							<NuxtIcon class="home-showroom__item-icon" name="icon-check" filled />
							{{ item.operatingMode }}
						</p>

						<a class="home-showroom__item-phone title-18 hover-link" :href="`tel:${item.phone.url}`">
							{{ item.phone.label }}
						</a>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-showroom {
	&__head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 36px;

		@media (min-width: variables.$tablet-big) {
			flex-direction: row;
			gap: 32px;
			align-items: flex-end;
			justify-content: space-between;
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

	&__list {
		display: grid;
		gap: 20px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
	}

	&__item-media {
		display: block;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background-color: variables.$color-muted;
	}

	&__item-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__item-body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
	}

	&__item-title {
		margin: 0 0 4px;
	}

	&__item-line {
		display: flex;
		gap: 8px;
		align-items: flex-start;
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__item-icon {
		width: 16px;
		min-width: 16px;
		height: 16px;
		margin-top: 2px;
		color: variables.$color-accent;
	}

	&__item-phone {
		padding-top: 12px;
		margin-top: auto;
	}
}
</style>
