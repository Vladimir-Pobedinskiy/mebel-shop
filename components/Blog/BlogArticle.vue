<script setup lang="ts">
import type { IArticle } from '@/interfaces/article/IArticlePage'
import { useGsapReveal } from '@/composables/useGsapReveal'
import { formatDateRu } from '@/utils/utils'

const props = defineProps<{
	article: IArticle
}>()

const rootRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

/* Оглавление собирается из h2 самого контента: в db.json дублировать его незачем */
const headings = ref<{ id: string; label: string }[]>([])

const buildHeadings = () => {
	if (!contentRef.value) return

	headings.value = Array.from(contentRef.value.querySelectorAll('h2')).map((heading, index) => {
		const id = `section-${index + 1}`
		heading.id = id

		return { id, label: heading.textContent || '' }
	})
}

onMounted(() => {
	buildHeadings()
	revealOnScroll(rootRef.value, '.blog-article__media', { y: 32 })
})

watch(
	() => props.article.slug,
	async () => {
		await nextTick()
		buildHeadings()
	}
)
</script>

<template>
	<article ref="rootRef" class="blog-article">
		<div class="blog-article__head">
			<p class="blog-article__meta card-subtitle">
				{{ article.category }} · {{ formatDateRu(article.date) }} · {{ article.readingTime }}
			</p>

			<p class="blog-article__lead text-l">{{ article.description }}</p>
		</div>

		<div class="blog-article__media">
			<NuxtImg
				class="blog-article__img"
				:src="article.img.url"
				:alt="article.img.alt"
				format="webp"
				sizes="xs:100vw sm:100vw md:100vw lg:80vw xl:70vw xxl:70vw"
			/>
		</div>

		<div class="blog-article__body">
			<aside v-if="headings.length" class="blog-article__toc">
				<p class="blog-article__toc-title title-14">Содержание</p>

				<ul class="blog-article__toc-list">
					<li v-for="heading in headings" :key="heading.id" class="blog-article__toc-item">
						<a class="blog-article__toc-link text-s hover-link" :href="`#${heading.id}`">{{ heading.label }}</a>
					</li>
				</ul>
			</aside>

			<div ref="contentRef" class="blog-article__content user-content text-m" v-html="article.content" />
		</div>
	</article>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.blog-article {
	&__head {
		max-width: 760px;
		margin-bottom: 24px;
	}

	&__meta {
		margin: 0 0 12px;
		color: variables.$color-accent;
	}

	&__lead {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__media {
		overflow: hidden;
		margin-bottom: 32px;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;

		@media (min-width: variables.$desktop) {
			margin-bottom: 56px;
		}
	}

	&__img {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	&__body {
		display: grid;
		gap: 32px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
			gap: 56px;
		}
	}

	&__toc {
		padding: 20px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;

		@media (min-width: variables.$desktop-small) {
			position: sticky;
			top: 120px;
			align-self: start;
		}
	}

	&__toc-title {
		margin: 0 0 12px;
	}

	&__toc-item {
		margin-bottom: 8px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__toc-link {
		color: variables.$color-ink-soft;
	}

	&__content {
		max-width: 780px;

		h2 {
			margin: 32px 0 16px;
			font-family: variables.$font-secondary;
			font-size: 24px;
			font-weight: 600;
			line-height: 1.3;
			letter-spacing: -0.02em;
			scroll-margin-top: 120px;

			@media (min-width: variables.$desktop) {
				margin-top: 48px;
				font-size: 30px;
			}

			&:first-child {
				margin-top: 0;
			}
		}
	}
}
</style>
