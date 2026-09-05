<script setup lang="ts">
import type { IAuthPage } from '~~/interfaces/auth/IAuthPage'

const { data, error, status } = await useAsyncData('password-recovery-page', async () =>
	$fetch<IAuthPage>('/api/password-recovery/')
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
	<div class="password-recovery-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<AuthShell :breadcrumbs="data.breadcrumbs" :title="data.seo.h1" :text="data.text" :note="data.note">
					<AuthPasswordRecoveryForm />
				</AuthShell>
			</div>
		</template>
	</div>
</template>
