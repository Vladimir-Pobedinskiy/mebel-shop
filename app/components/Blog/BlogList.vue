<script setup lang="ts">
import type { IArticlePreview } from '~~/interfaces/article/IArticlePreview'

const props = withDefaults(
	defineProps<{
		articles: IArticlePreview[]
		perPage?: number
		/** выделять первую статью крупной карточкой */
		withFeatured?: boolean
	}>(),
	{
		perPage: 6,
		withFeatured: true,
	}
)

const route = useRoute()

const currentPage = computed(() => Number(route.query.page || '1'))
const totalPages = computed(() => Math.ceil(props.articles.length / props.perPage))

const visibleArticles = computed(() => {
	const start = (currentPage.value - 1) * props.perPage

	return props.articles.slice(start, start + props.perPage)
})

// Крупная карточка уместна только в начале списка — на второй странице все карточки равные
const isFeatured = (index: number) => props.withFeatured && currentPage.value === 1 && index === 0

const listRef = ref<HTMLElement | null>(null)

watch(currentPage, () => {
	if (!import.meta.client || !listRef.value) return

	const top = listRef.value.getBoundingClientRect().top + window.scrollY - 140
	window.scrollTo({ top, behavior: 'smooth' })
})
</script>

<template>
	<div ref="listRef" class="blog-list">
		<ul v-if="visibleArticles.length" v-auto-animate class="blog-list__grid">
			<li
				v-for="(article, index) in visibleArticles"
				:key="article.slug"
				:class="['blog-list__item', { 'blog-list__item_featured': isFeatured(index) }]"
			>
				<BlogCard :article="article" :is-featured="isFeatured(index)" />
			</li>
		</ul>

		<UIEmptyState
			v-else
			class="blog-list__empty"
			title="Статей пока нет"
			text="Мы готовим материалы для этого раздела — загляните в другие."
			icon="icon-search"
			link-url="/blog/"
			link-label="Все статьи"
		/>

		<UIPagination v-if="totalPages > 1" class="blog-list__pagination" :page-total="totalPages" :show-more="false" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.blog-list {
	&__grid {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	&__item {
		display: flex;

		&_featured {
			@media (min-width: variables.$mobile-big) {
				grid-column: 1 / -1;
			}
		}
	}

	&__empty {
		margin: 40px 0;
	}

	&__pagination {
		margin-top: 32px;

		@media (min-width: variables.$desktop) {
			margin-top: 48px;
		}
	}
}
</style>
