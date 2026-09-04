<script setup lang="ts">
import type { IFavoritesPage } from '@/interfaces/favorites/IFavoritesPage'
import { useFavoritesStore } from '@/stores/storeFavorites'
import { productsCountLabel } from '@/utils/utils'

const { data, error, status } = await useAsyncData('favorites-page', async () =>
	$fetch<IFavoritesPage>('/api/favorites/')
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

const storeFavorites = useFavoritesStore()
</script>

<template>
	<div class="favorites-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="favorites-page__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<div class="favorites-page__head">
					<h1 class="favorites-page__title h1">{{ data.seo.h1 }}</h1>

					<!-- Избранное живёт в localStorage — рендерим только на клиенте -->
					<ClientOnly>
						<div v-if="!storeFavorites.isEmpty" class="favorites-page__head-meta">
							<p class="favorites-page__count text-m">{{ productsCountLabel(storeFavorites.totalCount) }}</p>

							<button class="favorites-page__clear text-s" type="button" @click="storeFavorites.clear()">
								<NuxtIcon class="favorites-page__clear-icon" name="icon-trash" filled />
								<span>Очистить избранное</span>
							</button>
						</div>
					</ClientOnly>
				</div>

				<ClientOnly>
					<ul v-if="!storeFavorites.isEmpty" v-auto-animate class="favorites-page__list">
						<li v-for="product in storeFavorites.items" :key="product.id" class="favorites-page__item">
							<ProductCard :product="product" />
						</li>
					</ul>

					<UIEmptyState
						v-else
						class="favorites-page__empty"
						:title="data.emptyState.title"
						:text="data.emptyState.text"
						icon="icon-heart"
						:link-url="data.emptyState.link.url"
						:link-label="data.emptyState.link.label"
					/>

					<template #fallback>
						<ul class="favorites-page__list">
							<li v-for="index in 4" :key="index" class="favorites-page__item">
								<UISkeleton variant="box" height="360px" radius="16px" />
							</li>
						</ul>
					</template>
				</ClientOnly>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.favorites-page {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__head {
		margin-bottom: 28px;
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px 24px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__title {
		margin: 0;
	}

	&__head-meta {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 8px 20px;
	}

	&__count {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__clear {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: variables.$color-ink-soft;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				color: variables.$color-error;
			}
		}
	}

	&__clear-icon {
		display: flex;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}

		@media (min-width: variables.$desktop-big) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__item {
		display: flex;
	}
}
</style>
