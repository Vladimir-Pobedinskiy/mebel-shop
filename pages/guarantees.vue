<script setup lang="ts">
import type { IGuaranteesPage } from '@/interfaces/content/IContentPages'

const { data, error, status } = await useAsyncData('guarantees-page', async () =>
	$fetch<IGuaranteesPage>('/api/guarantees/')
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
	<div class="guarantees-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					text="Отвечаем за мебель после того, как она уехала со склада: 24 месяца гарантии, свой сервис и понятный порядок обращения."
					subtitle="Сервис"
				/>

				<ContentCards v-if="data.items?.length" class="guarantees-page__section" :items="data.items" :columns="4" />

				<ContentCards
					v-if="data.steps?.length"
					class="guarantees-page__section"
					:items="data.steps"
					title="Как работает обращение"
					text="Четыре шага от заявки до замены — без платных экспертиз и лишней переписки."
					variant="numbered"
					:columns="4"
				/>

				<ContentCards
					v-if="data.documents?.length"
					class="guarantees-page__section"
					:items="data.documents"
					title="Документы на изделие"
					text="Их стоит сохранить: по ним считается срок гарантии и подтверждается комплектация."
					variant="flat"
					:columns="3"
				/>

				<ContentFaq v-if="data.faq?.length" class="guarantees-page__section" :items="data.faq" />
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.guarantees-page {
	&__section {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}
}
</style>
