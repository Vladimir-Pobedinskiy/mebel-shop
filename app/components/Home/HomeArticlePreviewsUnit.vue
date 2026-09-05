<script setup lang="ts">
import type { ILink } from '~~/interfaces/ILink'
import type { IArticlePreview } from '~~/interfaces/article/IArticlePreview'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { formatDateRu } from '@/utils/utils'

defineProps<{
	articlePreviewsUnit: { title: string; link: ILink; items: IArticlePreview[] }
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-articles__head-btn', { y: 20, opacity: 0 })
		gsap.set('.home-articles__item', { y: 40, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-articles__head-btn', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.home-articles__item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.35')
	})
})
</script>

<template>
	<section ref="rootRef" class="home-articles offset">
		<div class="container">
			<div class="home-articles__head">
				<p ref="titleRef" class="home-articles__title h2">{{ articlePreviewsUnit.title }}</p>

				<UIButton
					class="home-articles__head-btn"
					as="NuxtLink"
					:to="articlePreviewsUnit.link.url"
					variant="secondary"
					color="dark"
					:label="articlePreviewsUnit.link.label"
					show-icon
				/>
			</div>

			<ul class="home-articles__list">
				<li v-for="article in articlePreviewsUnit.items" :key="article.id" class="home-articles__item">
					<NuxtLink class="home-articles__card hover-scale" :to="article.link.url">
						<span class="home-articles__card-media hover-scale-img-wrapper">
							<NuxtImg
								class="home-articles__card-img"
								:src="article.img.url"
								:alt="article.img.alt"
								loading="lazy"
								sizes="xs:100vw sm:50vw md:50vw lg:25vw xl:25vw xxl:25vw"
							/>
						</span>

						<span class="home-articles__card-body">
							<span class="home-articles__card-meta card-subtitle">
								{{ article.category }} · {{ article.readingTime }}
							</span>
							<span class="home-articles__card-title title-18">{{ article.title }}</span>
							<span class="home-articles__card-text text-s">{{ article.description }}</span>
							<span class="home-articles__card-date text-xs">{{ formatDateRu(article.date) }}</span>
						</span>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-articles {
	&__head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 32px;

		@media (min-width: variables.$tablet-big) {
			flex-direction: row;
			gap: 32px;
			align-items: flex-end;
			justify-content: space-between;
		}
	}

	&__title {
		max-width: 680px;
		margin: 0;
	}

	&__list {
		display: grid;
		gap: 20px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__card {
		display: flex;
		flex-direction: column;
		gap: 16px;
		height: 100%;
	}

	&__card-media {
		display: block;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-m;
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
		gap: 8px;
	}

	&__card-text {
		color: variables.$color-ink-soft;
	}

	&__card-date {
		padding-top: 8px;
		margin-top: auto;
		color: variables.$color-ink-soft;
	}
}
</style>
