<script setup lang="ts">
import type { IComparePage } from '@/interfaces/compare/IComparePage'
import { useCompareStore } from '@/stores/storeCompare'
import { productsCountLabel } from '@/utils/utils'

const { data, error, status } = await useAsyncData('compare-page', async () => $fetch<IComparePage>('/api/compare/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Страница не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const storeCompare = useCompareStore()
</script>

<template>
	<div class="compare-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="compare-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<div class="compare-page__head">
					<h1 class="compare-page__title h1">{{ data.seo.h1 }}</h1>

					<!-- Список сравнения живёт в localStorage — рендерим только на клиенте -->
					<ClientOnly>
						<p v-if="!storeCompare.isEmpty" class="compare-page__count text-m">
							{{ productsCountLabel(storeCompare.totalCount) }} из {{ storeCompare.maxItems }}
						</p>
					</ClientOnly>
				</div>

				<ClientOnly>
					<CompareTable
						v-if="!storeCompare.isEmpty"
						:products="storeCompare.items"
						:characteristic-keys="data.characteristicKeys"
					/>

					<UIEmptyState
						v-else
						class="compare-page__empty"
						:title="data.emptyState.title"
						:text="data.emptyState.text"
						icon="icon-compare"
						:link-url="data.emptyState.link.url"
						:link-label="data.emptyState.link.label"
					/>

					<template #fallback>
						<UISkeleton variant="box" height="420px" radius="16px" />
					</template>
				</ClientOnly>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.compare-page {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__head {
		margin-bottom: 28px;
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 8px 16px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__title {
		margin: 0;
	}

	&__count {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
