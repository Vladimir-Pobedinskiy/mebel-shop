<script setup lang="ts">
import type { IBlogPage } from '~~/interfaces/article/IBlogPage'

const { data, error, status } = await useAsyncData('blog-page', async () => $fetch<IBlogPage>('/api/blog/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Страница не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))
</script>

<template>
	<div class="blog-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					:text="data.description"
					subtitle="Блог"
				>
					<template #content>
						<BlogSections :sections="data.sections" active-slug="all" />
					</template>
				</ContentIntro>

				<BlogList :articles="data.articles" :per-page="data.pagination?.perPage || 6" />
			</div>
		</template>
	</div>
</template>
