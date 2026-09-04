<script setup lang="ts">
import type { IHomeHero } from '@/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { useMagneticHover } from '@/composables/useMagneticHover'

defineProps<{
	hero: IHomeHero
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

// Кнопки hero тянутся за курсором — только десктоп с мышью
useMagneticHover(rootRef, '.home-hero__link')

onMounted(() => {
	// Посимвольный reveal заголовка + параллакс фона + выезд остального контента
	createAnimation(rootRef.value, ({ gsap }) => {
		const chars = titleRef.value ? splitTextToSpans(titleRef.value, 'chars') : []
		const content = '.home-hero__subtitle, .home-hero__text, .home-hero__link, .home-hero__stat'

		gsap.set(chars, { yPercent: 110 })
		gsap.set(content, { y: 20, opacity: 0 })

		const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

		if (chars.length) {
			timeline.to(chars, { yPercent: 0, duration: 0.9, stagger: 0.02 })
		}

		timeline
			.to('.home-hero__subtitle', { y: 0, opacity: 1, duration: 0.7 }, '-=0.6')
			.to('.home-hero__text', { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
			.to('.home-hero__link', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.45')
			.to('.home-hero__stat', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.4')

		// Параллакс: фон отстаёт от скролла, контент, наоборот, уезжает вверх быстрее и растворяется
		const parallaxTrigger = {
			trigger: rootRef.value as HTMLElement,
			start: 'top top',
			end: 'bottom top',
			scrub: true,
		}

		gsap.to(mediaRef.value, {
			yPercent: 14,
			ease: 'none',
			scrollTrigger: parallaxTrigger,
		})

		gsap.to(innerRef.value, {
			yPercent: -16,
			opacity: 0.2,
			ease: 'none',
			scrollTrigger: parallaxTrigger,
		})

		gsap.to('.home-hero__scroll', {
			opacity: 0,
			ease: 'none',
			scrollTrigger: { ...parallaxTrigger, end: 'top+=35% top' },
		})
	})
})
</script>

<template>
	<section ref="rootRef" class="home-hero pull-under-header">
		<div ref="mediaRef" class="home-hero__media">
			<NuxtImg
				class="home-hero__img"
				:src="hero.img.url"
				:alt="hero.img.alt"
				preload
				sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
			/>
		</div>

		<div ref="innerRef" class="home-hero__inner container">
			<p class="home-hero__subtitle card-subtitle">{{ hero.subtitle }}</p>

			<p ref="titleRef" class="home-hero__title h1">{{ hero.title }}</p>

			<p class="home-hero__text text-l">{{ hero.text }}</p>

			<div class="home-hero__links">
				<UIButton
					v-for="(link, index) in hero.links"
					:key="link.url"
					class="home-hero__link"
					as="NuxtLink"
					:to="link.url"
					:variant="index === 0 ? 'primary' : 'secondary'"
					:color="index === 0 ? 'accent' : 'white'"
					:label="link.label"
					show-icon
				/>
			</div>

			<ul class="home-hero__stats">
				<li v-for="stat in hero.stats" :key="stat.label" class="home-hero__stat">
					<span class="home-hero__stat-value h4">{{ stat.value }}</span>
					<span class="home-hero__stat-label text-s">{{ stat.label }}</span>
				</li>
			</ul>
		</div>

		<a class="home-hero__scroll" href="#home-categories" aria-label="Перейти к каталогу категорий">
			<span class="home-hero__scroll-label tag-typo">Листайте вниз</span>
			<span class="home-hero__scroll-line" />
		</a>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-hero {
	position: relative;
	display: flex;
	overflow: hidden;
	align-items: flex-end;
	background-color: variables.$color-ink;
	color: variables.$color-white;

	/* Ровно экран: .pull-under-header поднимает секцию на высоту шапки и компенсирует её отступом */
	min-height: 100svh;

	&__media {
		position: absolute;
		inset: -10% 0;
		will-change: transform;

		&::after {
			position: absolute;
			z-index: 1;
			background: linear-gradient(
				180deg,
				rgba(28, 26, 23, 65%) 0%,
				rgba(28, 26, 23, 52%) 45%,
				rgba(28, 26, 23, 85%) 100%
			);
			content: '';
			inset: 0;
		}
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__inner {
		position: relative;
		z-index: 2;
		padding-top: 96px;
		padding-bottom: 64px;

		@media (min-width: variables.$desktop-small) {
			padding-top: 120px;
			padding-bottom: 100px;
		}

		@media (min-width: variables.$desktop) {
			padding-bottom: 140px;
		}

		/* Невысокое окно ноутбука: поджимаем отступы, чтобы блок с цифрами влезал в экран */
		@media (min-width: variables.$desktop-small) and (height <= 820px) {
			padding-top: 96px;
			padding-bottom: 64px;
		}
	}

	&__subtitle {
		margin-bottom: 16px;
		color: rgba(255, 255, 255, 72%);
	}

	&__title {
		max-width: 16em;
		margin: 0 0 20px;
	}

	&__text {
		max-width: 620px;
		margin: 0 0 32px;
		color: rgba(255, 255, 255, 82%);
	}

	&__links {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__stats {
		display: grid;
		gap: 16px;
		padding-top: 24px;
		margin-top: 32px;
		border-top: 1px solid rgba(255, 255, 255, 22%);

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			gap: 20px;
			padding-top: 40px;
			margin-top: 48px;
		}

		@media (min-width: variables.$desktop-small) and (height <= 820px) {
			padding-top: 24px;
			margin-top: 28px;
		}
	}

	&__stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__stat-label {
		color: rgba(255, 255, 255, 68%);
	}

	&__scroll {
		position: absolute;
		bottom: 28px;
		left: 50%;
		z-index: 2;
		display: none;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		color: rgba(255, 255, 255, 72%);
		transform: translateX(-50%);

		@media (min-width: variables.$desktop-small) {
			display: flex;
		}
	}

	&__scroll-line {
		width: 1px;
		height: 56px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 70%), rgba(255, 255, 255, 0%));
		animation: hero-scroll-hint 2.4s ease-in-out infinite;
	}
}

@keyframes hero-scroll-hint {
	0%,
	100% {
		opacity: 0.4;
		transform: scaleY(0.6);
		transform-origin: top center;
	}

	50% {
		opacity: 1;
		transform: scaleY(1);
		transform-origin: top center;
	}
}
</style>
