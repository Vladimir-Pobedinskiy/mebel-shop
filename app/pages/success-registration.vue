<script setup lang="ts">
import type { IAuthPage } from '~~/interfaces/auth/IAuthPage'

const { data, error, status } = await useAsyncData('success-registration-page', async () =>
	$fetch<IAuthPage>('/api/success-registration/')
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
	<div class="success-registration-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<AuthShell :breadcrumbs="data.breadcrumbs" :title="data.seo.h1" :text="data.text">
					<!-- Личного кабинета в проекте пока нет, поэтому возвращаем к покупкам -->
					<div class="success-registration-page__actions">
						<UIButton as="NuxtLink" to="/catalog/" label="Перейти в каталог" full />
						<UIButton as="NuxtLink" to="/" variant="secondary" label="На главную" full />
					</div>
				</AuthShell>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
.success-registration-page {
	&__actions {
		display: grid;
		gap: 12px;
	}
}
</style>
