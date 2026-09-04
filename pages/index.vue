<script setup lang="ts">
import type { IHomePage } from '@/interfaces/home/IHomePage'

const { data, error, status } = await useAsyncData('home-page', async () => $fetch<IHomePage>('/api/home/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 500,
		statusMessage: 'Не удалось загрузить данные главной страницы',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))
</script>

<template>
	<div class="home">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<h1 class="visually-hidden">{{ data.seo.h1 }}</h1>

			<HomeHero v-if="data.hero" :hero="data.hero" />
			<HomeCategoryTabs v-if="data.categoryTabs" :tabs="data.categoryTabs" />
			<HomeBestsellers v-if="data.bestsellers" :bestsellers="data.bestsellers" />
			<HomeAboutUnit v-if="data.aboutUnit" :about-unit="data.aboutUnit" />
			<HomeCollections v-if="data.collections" :collections="data.collections" />
			<HomeSaleBanner v-if="data.saleBanner" :sale-banner="data.saleBanner" />
			<MarqueeUnit v-if="data.marqueeUnit" :marquee-unit="data.marqueeUnit" />
			<HomeAdvantagesUnit v-if="data.advantagesUnit" :advantages-unit="data.advantagesUnit" />
			<HomeShowroomUnit v-if="data.showroomUnit" :showroom-unit="data.showroomUnit" />
			<HomeReviews v-if="data.reviewsUnit" :reviews-unit="data.reviewsUnit" />
			<HomeArticlePreviewsUnit v-if="data.articlePreviewsUnit" :article-previews-unit="data.articlePreviewsUnit" />
			<HomeCtaUnit v-if="data.ctaUnit" :cta-unit="data.ctaUnit" />
		</template>
	</div>
</template>

<style lang="scss">
.home {
	display: flex;
	flex-direction: column;
}
</style>
