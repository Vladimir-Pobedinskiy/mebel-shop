<script setup lang="ts">
import type { IMapCity, IMapMarker } from '~~/interfaces/contacts/IMapPage'

const props = defineProps<{
	cities: IMapCity[]
	markers: IMapMarker[]
}>()

const config = useRuntimeConfig()

// Без ключа Яндекс.Карт модуль не подключается — страница остаётся рабочей и без карты
const isMapEnabled = computed(() => Boolean(config.public.yandexMapsEnabled))

const activeCityName = ref<string>(props.cities[0]?.name || '')
const activeMarkerId = ref<number | null>(null)

const activeCity = computed(() => props.cities.find(city => city.name === activeCityName.value) || props.cities[0])

const cityMarkers = computed(() => props.markers.filter(marker => marker.title.startsWith(activeCityName.value)))

const setCity = (name: string) => {
	activeCityName.value = name
	activeMarkerId.value = null
}

const setMarker = (id: number) => {
	activeMarkerId.value = activeMarkerId.value === id ? null : id
}
</script>

<template>
	<div class="map-showrooms">
		<div class="map-showrooms__cities">
			<button
				v-for="city in cities"
				:key="city.name"
				:class="['map-showrooms__city', { 'map-showrooms__city_active': city.name === activeCityName }]"
				type="button"
				:aria-pressed="city.name === activeCityName"
				@click="setCity(city.name)"
			>
				<span class="button-typo">{{ city.name }}</span>
			</button>
		</div>

		<div class="map-showrooms__inner">
			<ul v-auto-animate class="map-showrooms__list">
				<li v-for="marker in cityMarkers" :key="marker.id" class="map-showrooms__item">
					<button
						:class="['map-showrooms__card', { 'map-showrooms__card_active': marker.id === activeMarkerId }]"
						type="button"
						:aria-pressed="marker.id === activeMarkerId"
						@click="setMarker(marker.id)"
					>
						<span class="map-showrooms__card-title title-18">{{ marker.title }}</span>

						<span class="map-showrooms__card-line text-s">
							<NuxtIcon class="map-showrooms__card-icon" name="icon-location" filled />
							{{ marker.address }}
						</span>

						<span class="map-showrooms__card-line text-s">
							<NuxtIcon class="map-showrooms__card-icon" name="icon-check" filled />
							{{ marker.operatingMode }}
						</span>
					</button>

					<a class="map-showrooms__phone title-18 hover-link" :href="`tel:${marker.phone.url}`">
						{{ marker.phone.label }}
					</a>
				</li>
			</ul>

			<div class="map-showrooms__map">
				<ClientOnly>
					<MapYandex
						v-if="isMapEnabled && activeCity"
						:markers="cityMarkers"
						:center="activeCity.coords"
						:zoom="activeCity.zoom"
						:active-id="activeMarkerId"
						@select="setMarker"
					/>

					<div v-else class="map-showrooms__fallback">
						<NuxtIcon class="map-showrooms__fallback-icon" name="icon-location" filled />
						<p class="map-showrooms__fallback-title title-18">Карта подключается ключом Яндекс.Карт</p>
						<p class="map-showrooms__fallback-text text-s">
							Адреса и режим работы салонов — в списке слева. Построить маршрут поможет менеджер по телефону.
						</p>
					</div>

					<template #fallback>
						<UISkeleton variant="box" height="100%" radius="16px" />
					</template>
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.map-showrooms {
	&__cities {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 24px;
	}

	&__city {
		padding: 10px 18px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		background-color: variables.$color-surface;
		transition:
			color 0.3s ease-in-out,
			border-color 0.3s ease-in-out,
			background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				border-color: variables.$color-accent;
				color: variables.$color-accent;
			}
		}

		&_active {
			border-color: variables.$color-ink;
			color: variables.$color-white;
			background-color: variables.$color-ink;
		}
	}

	&__inner {
		display: grid;
		gap: 20px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
			gap: 24px;
		}
	}

	&__list {
		display: grid;
		gap: 12px;
		align-content: start;
	}

	&__item {
		padding: 20px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__card {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 8px;
		text-align: left;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;
		}
	}

	&__card-title {
		transition: color 0.3s ease-in-out;

		.map-showrooms__card_active & {
			color: variables.$color-accent;
		}
	}

	&__card-line {
		display: flex;
		align-items: center;
		gap: 8px;
		color: variables.$color-ink-soft;
	}

	&__card-icon {
		display: flex;
		flex: 0 0 auto;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	&__phone {
		display: inline-flex;
		margin-top: 12px;
	}

	&__map {
		overflow: hidden;
		min-height: 360px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;

		@media (min-width: variables.$desktop-small) {
			min-height: 560px;
		}
	}

	&__fallback {
		display: flex;
		height: 100%;
		min-height: 360px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 32px;
		text-align: center;
	}

	&__fallback-icon {
		display: flex;

		svg {
			width: 32px;
			height: 32px;
		}
	}

	&__fallback-title {
		margin: 0;
	}

	&__fallback-text {
		max-width: 420px;
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
