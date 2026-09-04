<script setup lang="ts">
import type { IBecomeDealerPage } from '@/interfaces/content/IContentPages'

const { data, error, status } = await useAsyncData('become-dealer-page', async () =>
	$fetch<IBecomeDealerPage>('/api/become-dealer/')
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
	<div class="dealer-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					:text="data.slogan?.text"
					subtitle="Сотрудничество"
				/>

				<ContentCounters v-if="data.counters?.length" class="dealer-page__counters" :items="data.counters" />

				<ContentCards
					v-if="data.audience?.length"
					class="dealer-page__section"
					:items="data.audience"
					title="С кем работаем"
					:columns="3"
				/>

				<ContentCards
					v-if="data.terms?.length"
					class="dealer-page__section"
					:items="data.terms"
					title="Условия партнёрства"
					text="Базовая матрица одинакова для всех, дальше скидка растёт от квартальной выборки."
					:columns="4"
				/>

				<ContentCards
					v-if="data.steps?.length"
					class="dealer-page__section"
					:items="data.steps"
					title="Как начать"
					variant="numbered"
					:columns="4"
				/>

				<section class="dealer-page__form-section">
					<DealerForm :note="data.formNote" />
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-page {
	&__counters {
		margin-top: 40px;
	}

	&__section {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}

	&__form-section {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}
}
</style>
