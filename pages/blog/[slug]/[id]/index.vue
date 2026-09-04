<script setup lang="ts">
import type { IArticlePage } from '@/interfaces/article/IArticlePage'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const id = computed(() => String(route.params.id))

const { data, error, status } = await useAsyncData(
	() => `blog-article-${slug.value}-${id.value}`,
	async () => $fetch<IArticlePage>(`/api/blog/${slug.value}/${id.value}/`),
	{ watch: [slug, id] }
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Статья не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value), { type: 'article' })
</script>

<template>
	<div class="article-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro :breadcrumbs="data.breadcrumbs" :title="data.seo.h1" subtitle="Блог" />

				<BlogArticle class="article-page__article" :article="data.article" />

				<section v-if="data.related?.length" class="article-page__related">
					<div class="article-page__related-head">
						<h2 class="article-page__related-title h2">Читайте также</h2>

						<UIButton as="NuxtLink" to="/blog/" variant="secondary" color="dark" size="small" label="Все статьи" />
					</div>

					<ul class="article-page__related-list">
						<li v-for="article in data.related" :key="article.slug" class="article-page__related-item">
							<BlogCard :article="article" />
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.article-page {
	&__article {
		margin-top: 28px;

		@media (min-width: variables.$desktop) {
			margin-top: 40px;
		}
	}

	&__related {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}

	&__related-head {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;
	}

	&__related-title {
		margin: 0;
	}

	&__related-list {
		display: grid;
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 20px;
		}
	}
}
</style>
