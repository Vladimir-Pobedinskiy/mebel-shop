<script setup lang="ts">
import type { IMapPage } from '~~/interfaces/contacts/IMapPage'

const { data, error, status } = await useAsyncData('map-page', async () => $fetch<IMapPage>('/api/map/'))
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
	<div class="map-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					text="Выберите город, чтобы увидеть адреса салонов и построить маршрут. В каждом салоне есть образцы тканей и фасадов."
					subtitle="Где нас найти"
				/>

				<MapShowrooms class="map-page__map" :cities="data.cities" :markers="data.markers" />

				<div class="map-page__footer">
					<p class="map-page__note text-s">Не нашли салон в своём городе? Доставим заказ транспортной компанией.</p>

					<UIButton as="NuxtLink" to="/contacts/" variant="secondary" color="dark" size="small" label="Все контакты" />
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.map-page {
	&__map {
		margin-top: 32px;

		@media (min-width: variables.$desktop) {
			margin-top: 48px;
		}
	}

	&__footer {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		margin-top: 32px;
		padding: 24px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-muted;
	}

	&__note {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
