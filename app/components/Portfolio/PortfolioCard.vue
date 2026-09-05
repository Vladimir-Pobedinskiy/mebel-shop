<script setup lang="ts">
import type { IProjectPreview } from '~~/interfaces/portfolio/IPortfolioPage'

defineProps<{
	project: IProjectPreview
}>()
</script>

<template>
	<article class="portfolio-card">
		<NuxtLink class="portfolio-card__link hover-scale" :to="project.link.url" :title="project.title">
			<span class="portfolio-card__media hover-scale-img-wrapper">
				<NuxtImg
					class="portfolio-card__img"
					:src="project.img.url"
					:alt="project.img.alt"
					loading="lazy"
					format="webp"
					sizes="xs:100vw sm:100vw md:50vw lg:33vw xl:33vw xxl:33vw"
				/>

				<span class="portfolio-card__badge tag-typo">{{ project.categoryLabel }}</span>
			</span>

			<span class="portfolio-card__body">
				<span class="portfolio-card__title title-18">{{ project.title }}</span>
				<span class="portfolio-card__text text-s">{{ project.description }}</span>

				<span class="portfolio-card__meta text-xs">
					<span>{{ project.city }}</span>
					<span>{{ project.area }}</span>
					<span>{{ project.year }}</span>
				</span>
			</span>
		</NuxtLink>
	</article>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.portfolio-card {
	display: flex;
	height: 100%;

	&__link {
		display: flex;
		overflow: hidden;
		width: 100%;
		flex-direction: column;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__media {
		position: relative;
		display: block;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background-color: variables.$color-muted;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__badge {
		position: absolute;
		top: 12px;
		left: 12px;
		padding: 6px 12px;
		border-radius: 999px;
		color: variables.$color-ink;
		background-color: rgba(255, 255, 255, 88%);
		backdrop-filter: blur(6px);
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

	&__title {
		display: block;
		margin-bottom: 10px;
	}

	&__text {
		display: block;
		margin-bottom: 16px;
		color: variables.$color-ink-soft;
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 16px;
		margin-top: auto;
		color: variables.$color-ink-soft;
	}
}
</style>
