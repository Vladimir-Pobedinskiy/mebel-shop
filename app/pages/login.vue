<script setup lang="ts">
import type { IAuthPage } from '~~/interfaces/auth/IAuthPage'

const { data, error, status } = await useAsyncData('login-page', async () => $fetch<IAuthPage>('/api/login/'))
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
	<div class="login-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<AuthShell :breadcrumbs="data.breadcrumbs" :title="data.seo.h1" :text="data.text" :note="data.note">
					<AuthLoginForm />
				</AuthShell>
			</div>
		</template>
	</div>
</template>
