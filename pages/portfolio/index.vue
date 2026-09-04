<script setup lang="ts">
import type { IPortfolioPage } from '@/interfaces/portfolio/IPortfolioPage'

const { data, error, status } = await useAsyncData('portfolio-page', async () =>
	$fetch<IPortfolioPage>('/api/portfolio/')
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
	<div class="portfolio-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					:text="data.description"
					subtitle="Портфолио"
				>
					<template #content>
						<ContentCounters v-if="data.counters?.length" :items="data.counters" />
					</template>
				</ContentIntro>

				<PortfolioGrid class="portfolio-page__grid" :projects="data.projects" :categories="data.categories" />

				<section class="portfolio-page__cta">
					<div class="portfolio-page__cta-body">
						<h2 class="portfolio-page__cta-title h3">Хотите такой же проект?</h2>

						<p class="portfolio-page__cta-text text-m">
							Приезжайте с планировкой — дизайнер посчитает комплект и сроки за один визит.
						</p>
					</div>

					<UIButton as="NuxtLink" to="/contacts/" label="Записаться на замер" show-icon />
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.portfolio-page {
	&__grid {
		margin-top: 40px;

		@media (min-width: variables.$desktop) {
			margin-top: 56px;
		}
	}

	&__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		align-items: center;
		justify-content: space-between;
		margin-top: 48px;
		padding: 28px;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
			padding: 40px;
		}
	}

	&__cta-body {
		max-width: 620px;
	}

	&__cta-title {
		margin: 0 0 10px;
	}

	&__cta-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
