<script setup lang="ts">
import type { ILegalPage } from '@/interfaces/content/IContentPages'

const { data, error, status } = await useAsyncData('user-agreement-page', async () =>
	$fetch<ILegalPage>('/api/user-agreement/')
)
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
	<div class="legal-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro :breadcrumbs="data.breadcrumbs" :title="data.seo.h1" subtitle="Правовая информация" />

				<ContentLegal :content="data.content" :updated-at="data.updatedAt" />
			</div>
		</template>
	</div>
</template>
