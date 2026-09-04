<script setup lang="ts">
import type { IImg } from '@/interfaces/IImg'
import type { IProductBadge } from '@/interfaces/product/IProduct'
import { useGLightbox } from '@/composables/useGLightbox'

const props = withDefaults(
	defineProps<{
		gallery: IImg[]
		title: string
		badges?: IProductBadge[]
	}>(),
	{
		badges: () => [],
	}
)

useGLightbox()

const activeIndex = ref<number>(0)

const activeImg = computed(() => props.gallery[activeIndex.value] || props.gallery[0])

const setActive = (index: number) => {
	activeIndex.value = index
}

// При переходе на другой товар галерея должна показывать первый кадр, а не прошлый индекс
watch(
	() => props.gallery,
	() => {
		activeIndex.value = 0
	}
)
</script>

<template>
	<div v-if="gallery?.length" class="product-gallery">
		<div class="product-gallery__main">
			<ul v-if="badges?.length" class="product-gallery__badges">
				<li v-for="badge in badges" :key="badge.name">
					<UIBadge :badge="badge" />
				</li>
			</ul>

			<a
				class="product-gallery__zoom glightbox"
				:href="activeImg.url"
				:data-gallery="`product-${title}`"
				:aria-label="`Открыть фото: ${activeImg.alt}`"
			>
				<NuxtImg
					class="product-gallery__img"
					:src="activeImg.url"
					:alt="activeImg.alt"
					format="webp"
					sizes="xs:100vw sm:100vw md:60vw lg:50vw xl:50vw"
				/>
			</a>
		</div>

		<ul v-if="gallery.length > 1" class="product-gallery__thumbs">
			<li v-for="(img, index) in gallery" :key="img.url">
				<button
					:class="['product-gallery__thumb', { 'product-gallery__thumb_active': index === activeIndex }]"
					type="button"
					:aria-label="img.alt"
					:aria-pressed="index === activeIndex"
					@click="setActive(index)"
				>
					<NuxtImg
						class="product-gallery__thumb-img"
						:src="img.url"
						:alt="img.alt"
						loading="lazy"
						format="webp"
						sizes="xs:25vw sm:20vw md:15vw lg:10vw"
					/>
				</button>
			</li>
		</ul>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-gallery {
	display: flex;
	flex-direction: column;
	gap: 12px;

	&__main {
		position: relative;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;
	}

	&__badges {
		position: absolute;
		z-index: 2;
		top: 16px;
		left: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__zoom {
		display: block;
		width: 100%;
		height: 100%;
		cursor: zoom-in;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease-out;
	}

	@media (min-width: variables.$desktop-small) {
		&__zoom:hover .product-gallery__img {
			transform: scale(1.04);
		}
	}

	&__thumbs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
	}

	&__thumb {
		display: block;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 0;
		border: 2px solid transparent;
		border-radius: variables.$radius-s;
		background-color: variables.$color-muted;
		cursor: pointer;
		transition: border-color 0.3s ease-in-out;

		&_active {
			border-color: variables.$color-accent;
		}

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: variables.$color-line-strong;
			}

			&_active:hover {
				border-color: variables.$color-accent;
			}
		}
	}

	&__thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
</style>
