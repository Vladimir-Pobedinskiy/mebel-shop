<script setup lang="ts">
import type { IBlogSectionPage } from '~~/interfaces/article/IBlogPage'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error, status } = await useAsyncData(
	() => `blog-section-${slug.value}`,
	async () => $fetch<IBlogSectionPage>(`/api/blog/${slug.value}/`),
	{ watch: [slug] }
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Раздел блога не найден',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))
</script>

<template>
	<div class="blog-section-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					:text="data.section.description"
					subtitle="Блог"
				>
					<template #content>
						<BlogSections :sections="data.sections" :active-slug="data.section.slug" />
					</template>
				</ContentIntro>

				<BlogList :articles="data.articles" :per-page="data.pagination?.perPage || 6" :with-featured="false" />
			</div>
		</template>
	</div>
</template>
