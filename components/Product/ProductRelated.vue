<script setup lang="ts">
import type { IProduct } from '@/interfaces/product/IProduct'
import { useGsapReveal } from '@/composables/useGsapReveal'

withDefaults(
	defineProps<{
		products: IProduct[]
		title?: string
	}>(),
	{
		title: 'Похожие товары',
	}
)

const rootRef = ref<HTMLElement | null>(null)
const { revealOnScroll } = useGsapReveal()

const swiperOptions = {
	slidesPerView: 1.15,
	spaceBetween: 16,
	speed: 600,
	keyboard: { enabled: true },
	navigation: {
		prevEl: '.product-related__nav-btn_prev',
		nextEl: '.product-related__nav-btn_next',
	},
	breakpoints: {
		576: { slidesPerView: 2.1, spaceBetween: 16 },
		768: { slidesPerView: 2.4, spaceBetween: 20 },
		1024: { slidesPerView: 3.2, spaceBetween: 24 },
		1400: { slidesPerView: 4, spaceBetween: 24 },
	},
}

onMounted(() => {
	revealOnScroll(rootRef.value, '.product-related__head, .product-related__slider', { stagger: 0.12 })
})
</script>

<template>
	<section v-if="products?.length" ref="rootRef" class="product-related">
		<div class="product-related__head">
			<h2 class="product-related__title h3">{{ title }}</h2>

			<div class="product-related__nav">
				<button
					class="product-related__nav-btn product-related__nav-btn_prev slider-nav-btn"
					type="button"
					aria-label="Предыдущие товары"
				>
					<NuxtIcon class="product-related__nav-icon" name="icon-arrow-left" filled />
				</button>
				<button
					class="product-related__nav-btn product-related__nav-btn_next slider-nav-btn"
					type="button"
					aria-label="Следующие товары"
				>
					<NuxtIcon class="product-related__nav-icon" name="icon-arrow-right" filled />
				</button>
			</div>
		</div>

		<UISlider class="product-related__slider" :swiper-options="swiperOptions" :slides="products">
			<template #content="{ slide }">
				<ProductCard :product="slide as IProduct" />
			</template>
		</UISlider>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-related {
	overflow: hidden;

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
		gap: 20px;
	}

	&__title {
		margin: 0;
	}

	&__nav {
		display: none;
		gap: 8px;

		@media (min-width: variables.$tablet-big) {
			display: flex;
		}
	}

	&__nav-icon {
		width: 18px;
		height: 18px;
	}

	&__slider {
		overflow: visible;
	}
}
</style>
