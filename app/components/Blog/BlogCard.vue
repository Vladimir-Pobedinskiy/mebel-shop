<script setup lang="ts">
import type { IArticlePreview } from '~~/interfaces/article/IArticlePreview'
import { formatDateRu } from '@/utils/utils'

withDefaults(
	defineProps<{
		article: IArticlePreview
		/** крупная карточка — первая в списке */
		isFeatured?: boolean
	}>(),
	{
		isFeatured: false,
	}
)
</script>

<template>
	<article :class="['blog-card', { 'blog-card_featured': isFeatured }]">
		<NuxtLink class="blog-card__link hover-scale" :to="article.link.url" :title="article.title">
			<span class="blog-card__media hover-scale-img-wrapper">
				<NuxtImg
					class="blog-card__img"
					:src="article.img.url"
					:alt="article.img.alt"
					loading="lazy"
					format="webp"
					sizes="xs:100vw sm:100vw md:50vw lg:33vw xl:33vw xxl:33vw"
				/>
			</span>

			<span class="blog-card__body">
				<span class="blog-card__meta card-subtitle">{{ article.category }} · {{ article.readingTime }}</span>

				<span :class="['blog-card__title', isFeatured ? 'h3' : 'title-18']">{{ article.title }}</span>

				<span class="blog-card__text text-s">{{ article.description }}</span>

				<span class="blog-card__date text-xs">{{ formatDateRu(article.date) }}</span>
			</span>
		</NuxtLink>
	</article>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.blog-card {
	display: flex;
	height: 100%;

	&__link {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
	}

	&__media {
		display: block;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		background-color: variables.$color-muted;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 20px;

		@media (min-width: variables.$desktop) {
			padding: 24px;
		}
	}

	&__meta {
		display: block;
		margin-bottom: 10px;
		color: variables.$color-accent;
	}

	&__title {
		display: block;
		margin-bottom: 10px;
	}

	&__text {
		display: block;
		margin-bottom: 16px;
		color: variables.$color-ink-soft;
	}

	&__date {
		display: block;
		margin-top: auto;
		color: variables.$color-ink-soft;
	}

	&_featured {
		.blog-card__link {
			@media (min-width: variables.$tablet-big) {
				flex-direction: row;
			}
		}

		.blog-card__media {
			@media (min-width: variables.$tablet-big) {
				flex: 0 0 55%;
				width: 55%;
				aspect-ratio: auto;
			}
		}

		.blog-card__body {
			@media (min-width: variables.$desktop) {
				justify-content: center;
				padding: 40px;
			}
		}

		.blog-card__text {
			@media (min-width: variables.$tablet-big) {
				font-size: 16px;
			}
		}
	}
}
</style>
