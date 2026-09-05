<script setup lang="ts">
import type { IMapMarker } from '~~/interfaces/contacts/IMapPage'

/* Обёртка над vue-yandex-maps. Рендерится только когда модуль подключён
   (см. YANDEX_MAPS_KEY в nuxt.config) — иначе показывается список салонов. */
const props = defineProps<{
	markers: IMapMarker[]
	center: [number, number]
	zoom: number
	activeId: number | null
}>()

const emits = defineEmits<{
	(e: 'select', value: number): void
}>()

// В db.json координаты записаны как [широта, долгота], карта ждёт обратный порядок
const toLngLat = (coords: [number, number]): [number, number] => [coords[1], coords[0]]

const mapSettings = computed(() => ({
	location: { center: toLngLat(props.center), zoom: props.zoom },
}))
</script>

<template>
	<YandexMap class="map-yandex" :settings="mapSettings" width="100%" height="100%">
		<YandexMapDefaultSchemeLayer />
		<YandexMapDefaultFeaturesLayer />

		<YandexMapMarker v-for="marker in markers" :key="marker.id" :settings="{ coordinates: toLngLat(marker.coords) }">
			<button
				:class="['map-yandex__pin', { 'map-yandex__pin_active': marker.id === activeId }]"
				type="button"
				:aria-label="marker.title"
				@click="emits('select', marker.id)"
			>
				<NuxtIcon class="map-yandex__pin-icon" name="icon-location" filled />
				<span class="map-yandex__pin-label text-xs">{{ marker.title }}</span>
			</button>
		</YandexMapMarker>
	</YandexMap>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.map-yandex {
	&__pin {
		display: flex;
		gap: 6px;
		align-items: center;
		padding: 8px 12px;
		color: variables.$color-white;
		background-color: variables.$color-ink;
		border-radius: 999px;
		box-shadow: variables.$shadow-soft;
		transform: translate(-50%, -100%);
		transition: background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;
		}

		&_active {
			background-color: variables.$color-accent;
		}
	}

	&__pin-icon {
		display: flex;

		svg {
			width: 14px;
			height: 14px;
		}
	}
}
</style>
