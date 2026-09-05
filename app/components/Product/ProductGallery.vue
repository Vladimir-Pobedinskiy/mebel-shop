<script setup lang="ts">
import type { IImg } from '~~/interfaces/IImg'
import type { IProductBadge, IProductVideo } from '~~/interfaces/product/IProduct'
import { useGLightbox } from '@/composables/useGLightbox'
import { useAssetUrl } from '@/composables/useAssetUrl'

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

const { assetUrl } = useAssetUrl()

useGLightbox()

/* Слайды: если у модели заполнено видео, первым кадром идёт превью ролика,
   дальше — обычные фото. Товары без видео получают прежний набор кадров */
const slides = computed<IGallerySlide[]>(() => {
	const photos = (props.gallery || []).map(img => ({ url: img.url, img, isVideo: false }))
	if (!props.video) return photos

	return [{ url: props.video.url, img: props.video.preview, isVideo: true }, ...photos]
})

const activeIndex = ref<number>(0)

/* Разметка галереи рендерится только при непустом slides (v-if в шаблоне),
   поэтому первый слайд здесь всегда есть */
const activeSlide = computed(() => slides.value[activeIndex.value] ?? slides.value[0]!)

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
				:href="assetUrl(activeSlide.url)"
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
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-l;
	}

	&__badges {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 2;
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
		top: 50%;
		left: 50%;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		color: variables.$color-accent;
		background-color: variables.$color-surface;
		border-radius: 50%;
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
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 0;
		overflow: hidden;
		cursor: pointer;
		background-color: variables.$color-muted;
		border: 2px solid transparent;
		border-radius: variables.$radius-s;
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
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		color: variables.$color-accent;
		background-color: variables.$color-surface;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	&__thumb-play-icon {
		width: 16px;
		height: 16px;
	}
}
</style>
