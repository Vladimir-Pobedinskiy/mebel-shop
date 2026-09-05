<script setup lang="ts">
import type { IImg } from '@/interfaces/IImg'
import type { IProductBadge, IProductVideo } from '@/interfaces/product/IProduct'
import { useGLightbox } from '@/composables/useGLightbox'

interface IGallerySlide {
	url: string
	img: IImg
	isVideo: boolean
}

const props = withDefaults(
	defineProps<{
		gallery: IImg[]
		title: string
		badges?: IProductBadge[]
		/** ролик о модели: идёт первым слайдом и открывается в том же лайтбоксе */
		video?: IProductVideo | null
	}>(),
	{
		badges: () => [],
		video: null,
	}
)

useGLightbox()

/* Слайды: если у модели заполнено видео, первым кадром идёт превью ролика,
   дальше — обычные фото. Товары без видео получают прежний набор кадров */
const slides = computed<IGallerySlide[]>(() => {
	const photos = (props.gallery || []).map(img => ({ url: img.url, img, isVideo: false }))
	if (!props.video) return photos

	return [{ url: props.video.url, img: props.video.preview, isVideo: true }, ...photos]
})

const activeIndex = ref<number>(0)

const activeSlide = computed(() => slides.value[activeIndex.value] || slides.value[0])

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
	<div v-if="slides.length" class="product-gallery">
		<div class="product-gallery__main">
			<ul v-if="badges?.length" class="product-gallery__badges">
				<li v-for="badge in badges" :key="badge.name">
					<UIBadge :badge="badge" />
				</li>
			</ul>

			<a
				:class="['product-gallery__zoom glightbox', { 'product-gallery__zoom_video': activeSlide.isVideo }]"
				:href="activeSlide.url"
				:data-type="activeSlide.isVideo ? 'video' : undefined"
				:data-gallery="`product-${title}`"
				:aria-label="activeSlide.isVideo ? `Смотреть видео: ${title}` : `Открыть фото: ${activeSlide.img.alt}`"
			>
				<NuxtImg
					class="product-gallery__img"
					:src="activeSlide.img.url"
					:alt="activeSlide.img.alt"
					format="webp"
					sizes="xs:100vw sm:100vw md:60vw lg:50vw xl:50vw"
				/>

				<span v-if="activeSlide.isVideo" class="product-gallery__play">
					<NuxtIcon class="product-gallery__play-icon" name="icon-play" filled />
				</span>
			</a>
		</div>

		<ul v-if="slides.length > 1" class="product-gallery__thumbs">
			<li v-for="(slide, index) in slides" :key="slide.url">
				<button
					:class="['product-gallery__thumb', { 'product-gallery__thumb_active': index === activeIndex }]"
					type="button"
					:aria-label="slide.isVideo ? `Видео: ${title}` : slide.img.alt"
					:aria-pressed="index === activeIndex"
					@click="setActive(index)"
				>
					<NuxtImg
						class="product-gallery__thumb-img"
						:src="slide.img.url"
						:alt="slide.img.alt"
						loading="lazy"
						format="webp"
						sizes="xs:25vw sm:20vw md:15vw lg:10vw"
					/>

					<span v-if="slide.isVideo" class="product-gallery__thumb-play">
						<NuxtIcon class="product-gallery__thumb-play-icon" name="icon-play" filled />
					</span>
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

		&_video {
			cursor: pointer;
		}
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease-out;
	}

	&__play {
		position: absolute;
		z-index: 2;
		top: 50%;
		left: 50%;
		display: flex;
		width: 72px;
		height: 72px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: variables.$color-surface;
		color: variables.$color-accent;
		transform: translate(-50%, -50%);
		transition: transform 0.3s ease-in-out;
	}

	&__play-icon {
		width: 32px;
		height: 32px;
	}

	@media (min-width: variables.$desktop-small) {
		&__zoom:hover .product-gallery__img {
			transform: scale(1.04);
		}

		&__zoom:hover .product-gallery__play {
			transform: translate(-50%, -50%) scale(1.08);
		}
	}

	&__thumbs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
		gap: 12px;
	}

	&__thumb {
		position: relative;
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

	&__thumb-play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: flex;
		width: 28px;
		height: 28px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: variables.$color-surface;
		color: variables.$color-accent;
		transform: translate(-50%, -50%);
	}

	&__thumb-play-icon {
		width: 16px;
		height: 16px;
	}
}
</style>
