<script setup lang="ts">
import type { ICategoryStat } from '@/interfaces/catalog/ICategoryUnits'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = withDefaults(
	defineProps<{
		text: string
		title: string
		stats?: ICategoryStat[]
		/** id блока расчёта — на него уводит CTA */
		calcAnchor?: string
	}>(),
	{
		stats: () => [],
		calcAnchor: '',
	}
)

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()
const { isReducedMotion } = useReducedMotion()

/* Вступление приходит одной строкой — разбиваем на абзацы по предложениям,
   чтобы длинный коммерческий текст читался, а не стоял монолитом */
const paragraphs = computed<string[]>(() => {
	const sentences = props.text.split(/(?<=[.!?])\s+/).filter(Boolean)
	if (sentences.length < 4) return [props.text]

	const size = Math.ceil(sentences.length / 3)

	return [0, 1, 2].map(index => sentences.slice(index * size, (index + 1) * size).join(' ')).filter(Boolean)
})

const onCalcClick = () => {
	if (!import.meta.client || !props.calcAnchor) return

	const target = document.getElementById(props.calcAnchor)
	if (!target) return

	const top = target.getBoundingClientRect().top + window.scrollY - 100
	window.scrollTo({ top, behavior: isReducedMotion.value ? 'auto' : 'smooth' })
}

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.category-intro__paragraph', { y: 24, opacity: 0 })
		gsap.set('.category-intro__stat', { y: 24, opacity: 0 })
		gsap.set('.category-intro__action', { y: 16, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 85%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.category-intro__paragraph', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.5')
			.to('.category-intro__stat', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.35')
			.to('.category-intro__action', { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
	})
})
</script>

<template>
	<section ref="rootRef" class="category-intro">
		<div class="container">
			<div class="category-intro__inner">
				<div class="category-intro__body">
					<p ref="titleRef" class="category-intro__title h2">{{ title }}</p>

					<div class="category-intro__text">
						<p v-for="paragraph in paragraphs" :key="paragraph" class="category-intro__paragraph text-m">
							{{ paragraph }}
						</p>
					</div>

					<div v-if="calcAnchor" class="category-intro__action">
						<UIButton as="button" type="button" label="Рассчитать стоимость" show-icon @click="onCalcClick" />
					</div>
				</div>

				<ul v-if="stats?.length" class="category-intro__stats">
					<li v-for="stat in stats" :key="stat.label" class="category-intro__stat">
						<span class="category-intro__stat-value h3">{{ stat.value }}</span>
						<span class="category-intro__stat-label text-s">{{ stat.label }}</span>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-intro {
	&__inner {
		display: grid;
		gap: 28px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
			align-items: start;
			gap: 48px;
		}
	}

	&__title {
		margin: 0 0 16px;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 780px;
	}

	&__paragraph {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__action {
		margin-top: 24px;
	}

	&__stats {
		display: grid;
		gap: 12px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}

	&__stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__stat-value {
		color: variables.$color-accent;
	}

	&__stat-label {
		color: variables.$color-ink-soft;
	}
}
</style>
