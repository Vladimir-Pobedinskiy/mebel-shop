<script setup lang="ts">
import type { IHomeSaleBanner } from '@/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { declOfNum } from '@/utils/utils'

const props = defineProps<{
	saleBanner: IHomeSaleBanner
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

/* Таймер акции: считается только на клиенте, чтобы не разъезжалась гидрация */
const timeLeft = ref<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
let timerId: ReturnType<typeof setInterval> | null = null

const updateTimeLeft = () => {
	const diff = new Date(props.saleBanner.endsAt).getTime() - Date.now()

	if (Number.isNaN(diff) || diff <= 0) {
		timeLeft.value = null
		return
	}

	timeLeft.value = {
		days: Math.floor(diff / 86400000),
		hours: Math.floor((diff / 3600000) % 24),
		minutes: Math.floor((diff / 60000) % 60),
		seconds: Math.floor((diff / 1000) % 60),
	}
}

const timerUnits = computed(() => {
	if (!timeLeft.value) return []

	return [
		{ value: timeLeft.value.days, label: declOfNum(timeLeft.value.days, ['день', 'дня', 'дней']) },
		{ value: timeLeft.value.hours, label: declOfNum(timeLeft.value.hours, ['час', 'часа', 'часов']) },
		{ value: timeLeft.value.minutes, label: declOfNum(timeLeft.value.minutes, ['минута', 'минуты', 'минут']) },
		{ value: timeLeft.value.seconds, label: declOfNum(timeLeft.value.seconds, ['секунда', 'секунды', 'секунд']) },
	]
})

onMounted(() => {
	updateTimeLeft()
	timerId = setInterval(updateTimeLeft, 1000)

	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-sale__subtitle', { y: 16, opacity: 0 })
		gsap.set('.home-sale__text', { y: 24, opacity: 0 })
		gsap.set('.home-sale__timer-unit', { y: 20, opacity: 0 })
		gsap.set('.home-sale__btn', { y: 20, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		timeline.to('.home-sale__subtitle', { y: 0, opacity: 1, duration: 0.5 })

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.05 }, '-=0.3')

		timeline
			.to('.home-sale__text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
			.to('.home-sale__timer-unit', { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.3')
			.to('.home-sale__btn', { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')

		gsap.to(mediaRef.value, {
			yPercent: 8,
			ease: 'none',
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top bottom', end: 'bottom top', scrub: true },
		})
	})
})

onUnmounted(() => {
	if (timerId) clearInterval(timerId)
	timerId = null
})
</script>

<template>
	<section ref="rootRef" class="home-sale offset">
		<div class="container">
			<div class="home-sale__inner">
				<div ref="mediaRef" class="home-sale__media">
					<NuxtImg
						class="home-sale__img"
						:src="saleBanner.img.url"
						:alt="saleBanner.img.alt"
						loading="lazy"
						sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
					/>
				</div>

				<div class="home-sale__body">
					<p class="home-sale__subtitle card-subtitle">{{ saleBanner.subtitle }}</p>
					<p ref="titleRef" class="home-sale__title h2">{{ saleBanner.title }}</p>
					<p class="home-sale__text text-m">{{ saleBanner.text }}</p>

					<ClientOnly>
						<ul v-if="timerUnits.length" class="home-sale__timer">
							<li v-for="unit in timerUnits" :key="unit.label" class="home-sale__timer-unit">
								<span class="home-sale__timer-value h3">{{ String(unit.value).padStart(2, '0') }}</span>
								<span class="home-sale__timer-label text-xs">{{ unit.label }}</span>
							</li>
						</ul>
					</ClientOnly>

					<UIButton
						class="home-sale__btn"
						as="NuxtLink"
						:to="saleBanner.link.url"
						color="white"
						:label="saleBanner.link.label"
						show-icon
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-sale {
	&__inner {
		position: relative;
		overflow: hidden;
		border-radius: variables.$radius-l;
		background-color: variables.$color-accent-2;
		color: variables.$color-white;
	}

	&__media {
		position: absolute;
		inset: -8% 0;
		opacity: 0.35;
		will-change: transform;

		&::after {
			position: absolute;
			background: linear-gradient(90deg, rgba(47, 74, 63, 92%) 0%, rgba(47, 74, 63, 45%) 100%);
			content: '';
			inset: 0;
		}
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__body {
		position: relative;
		z-index: 1;
		display: flex;
		max-width: 720px;
		flex-direction: column;
		align-items: flex-start;
		padding: 40px 24px;

		@media (min-width: variables.$tablet) {
			padding: 64px 48px;
		}

		@media (min-width: variables.$desktop) {
			padding: 88px 72px;
		}
	}

	&__subtitle {
		margin: 0 0 14px;
		color: rgba(255, 255, 255, 72%);
	}

	&__title {
		margin: 0 0 16px;
	}

	&__text {
		margin: 0 0 32px;
		color: rgba(255, 255, 255, 82%);
	}

	&__timer {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 32px;
	}

	&__timer-unit {
		display: flex;
		min-width: 84px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 14px 12px;
		border: 1px solid rgba(255, 255, 255, 24%);
		border-radius: variables.$radius-m;
		background-color: rgba(255, 255, 255, 8%);
		backdrop-filter: blur(6px);
	}

	&__timer-label {
		color: rgba(255, 255, 255, 68%);
	}
}
</style>
