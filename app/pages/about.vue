<script setup lang="ts">
import type { IAboutPage } from '~~/interfaces/about/IAboutPage'
import { useGsapReveal } from '@/composables/useGsapReveal'

const { data, error, status } = await useAsyncData('about-page', async () => $fetch<IAboutPage>('/api/about/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Страница не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const bannerRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const productionRef = ref<HTMLElement | null>(null)

const { createAnimation, revealOnScroll } = useGsapReveal()

onMounted(() => {
	// Параллакс фотографии в баннере
	createAnimation(bannerRef.value, ({ gsap }) => {
		gsap.to('.about-banner__img', {
			yPercent: 8,
			ease: 'none',
			scrollTrigger: {
				trigger: bannerRef.value as HTMLElement,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
			},
		})
	})

	revealOnScroll(timelineRef.value, '.about-timeline__item', { stagger: 0.1, y: 32 })
	revealOnScroll(productionRef.value, '.about-production__shot', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<div class="about-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					:text="data.banner.text"
					subtitle="О компании"
				/>

				<section ref="bannerRef" class="about-banner">
					<NuxtImg
						class="about-banner__img"
						:src="data.banner.img.url"
						:alt="data.banner.img.alt"
						format="webp"
						sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
					/>

					<p class="about-banner__title h2">{{ data.banner.title }}</p>
				</section>

				<section v-if="data.counters?.length" class="about-page__section">
					<ContentCounters :items="data.counters" />
				</section>

				<ContentCards
					v-if="data.advantages?.length"
					class="about-page__section"
					title="Почему с нами удобно"
					text="Четыре вещи, которые мы не отдаём на подряд и поэтому за них отвечаем."
					:items="data.advantages"
					:columns="4"
				/>

				<section v-if="data.production" ref="productionRef" class="about-production about-page__section">
					<div class="about-production__head">
						<h2 class="about-production__title h2">{{ data.production.title }}</h2>
						<p class="about-production__text text-m">{{ data.production.text }}</p>
					</div>

					<ul class="about-production__gallery">
						<li v-for="img in data.production.gallery" :key="img.url" class="about-production__shot">
							<NuxtImg
								class="about-production__shot-img"
								:src="img.url"
								:alt="img.alt"
								loading="lazy"
								format="webp"
								sizes="xs:100vw sm:50vw md:50vw lg:25vw xl:25vw xxl:25vw"
							/>
						</li>
					</ul>

					<ContentCards class="about-production__stages" :items="data.production.stages" variant="numbered" />
				</section>

				<section v-if="data.timeline?.length" ref="timelineRef" class="about-timeline about-page__section">
					<h2 class="about-timeline__title h2">Как мы к этому пришли</h2>

					<ol class="about-timeline__list">
						<li v-for="item in data.timeline" :key="item.year" class="about-timeline__item">
							<p class="about-timeline__year h3">{{ item.year }}</p>
							<p class="about-timeline__text text-m">{{ item.text }}</p>
						</li>
					</ol>
				</section>

				<section v-if="data.team" class="about-page__section">
					<div class="about-page__team-head">
						<h2 class="about-page__team-title h2">{{ data.team.title }}</h2>
						<p class="about-page__team-text text-m">{{ data.team.text }}</p>
					</div>

					<ContentCounters :items="data.team.items" />
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.about-page {
	&__section {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}

	&__team-head {
		max-width: 760px;
		margin-bottom: 28px;
	}

	&__team-title {
		margin: 0 0 12px;
	}

	&__team-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}

.about-banner {
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: flex-end;
	min-height: 320px;
	padding: 24px;
	border-radius: variables.$radius-l;
	background-color: variables.$color-muted;

	@media (min-width: variables.$desktop) {
		min-height: 520px;
		padding: 48px;
	}

	&__img {
		position: absolute;
		inset: -6% 0;
		width: 100%;
		height: 112%;
		object-fit: cover;
		will-change: transform;
	}

	&__title {
		position: relative;
		max-width: 760px;
		margin: 0;
		color: variables.$color-white;
		text-shadow: 0 2px 24px rgba(28, 26, 23, 40%);
	}
}

.about-production {
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

	&__gallery {
		display: grid;
		gap: 12px;
		margin-bottom: 32px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
			gap: 20px;
		}
	}

	&__shot {
		overflow: hidden;
		border-radius: variables.$radius-m;
		background-color: variables.$color-muted;
	}

	&__shot-img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}
}

.about-timeline {
	&__title {
		margin: 0 0 28px;
	}

	&__list {
		display: grid;
		gap: 20px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	&__item {
		position: relative;
		padding-top: 24px;
		border-top: 2px solid variables.$color-line;

		&::before {
			content: '';
			position: absolute;
			top: -6px;
			left: 0;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background-color: variables.$color-accent;
		}
	}

	&__year {
		margin: 0 0 10px;
		color: variables.$color-accent;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
