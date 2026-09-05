<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

// Модули регистрируются здесь один раз: секции передают только опции через swiperOptions
const modules = [Navigation, Pagination, Autoplay, Keyboard, A11y]

defineProps<{
	swiperOptions: any
	slides: any
}>()
</script>

<template>
	<Swiper
		:modules="modules"
		:slides-per-view="swiperOptions.slidesPerView"
		:space-between="swiperOptions.spaceBetween"
		:speed="swiperOptions.speed"
		:autoplay="swiperOptions.autoplay"
		:keyboard="swiperOptions.keyboard"
		:pagination="swiperOptions.pagination"
		:navigation="swiperOptions.navigation"
		:breakpoints="swiperOptions.breakpoints"
		:loop="swiperOptions.loop"
		:grab-cursor="true"
		class="slider"
	>
		<template v-if="$slots['content']">
			<SwiperSlide v-for="slide in slides" :key="slide.id" class="slider__slide">
				<slot name="content" :slide="slide" />
			</SwiperSlide>
		</template>
		<template v-if="$slots.navigation">
			<slot name="navigation" />
		</template>
		<template v-if="$slots.pagination">
			<div class="swiper-pagination-wrapper">
				<slot name="pagination" />
			</div>
		</template>
	</Swiper>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.slider {
	width: 100%;

	&__slide {
		height: auto;
		display: flex;
	}

	.swiper-slide > * {
		width: 100%;
	}
}

.slider-nav-btn {
	width: 48px;
	min-width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid variables.$color-line-strong;
	border-radius: 50%;
	background-color: variables.$color-surface;
	color: variables.$color-ink;
	cursor: pointer;
	transition:
		background-color 0.3s ease-in-out,
		border-color 0.3s ease-in-out,
		color 0.3s ease-in-out;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			background-color: variables.$color-accent;
			border-color: variables.$color-accent;
			color: variables.$color-white;
		}
	}

	&.swiper-button-disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	&__icon {
		width: 16px;
		height: 16px;
	}

	&_prev .slider-nav-btn__icon {
		transform: rotate(180deg);
	}
}

.swiper-pagination-wrapper {
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}
</style>
