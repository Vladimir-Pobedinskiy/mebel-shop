<script setup lang="ts">
import type { IImg } from '~~/interfaces/IImg'
import { useGLightbox } from '@/composables/useGLightbox'
import { useAssetUrl } from '@/composables/useAssetUrl'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	gallery: IImg[]
	title: string
}>()

const { assetUrl } = useAssetUrl()

useGLightbox()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.portfolio-gallery__item', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<ul v-if="gallery?.length" ref="rootRef" class="portfolio-gallery">
		<li v-for="(img, index) in gallery" :key="img.url" class="portfolio-gallery__item">
			<a
				class="portfolio-gallery__link glightbox hover-scale"
				:href="assetUrl(img.url)"
				:data-gallery="`portfolio-${title}`"
				:aria-label="`Открыть фото: ${img.alt}`"
			>
				<span class="portfolio-gallery__media hover-scale-img-wrapper">
					<NuxtImg
						class="portfolio-gallery__img"
						:src="img.url"
						:alt="img.alt"
						:loading="index === 0 ? 'eager' : 'lazy'"
						format="webp"
						sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw"
					/>
				</span>
			</a>
		</li>
	</ul>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.portfolio-gallery {
	display: grid;
	gap: 16px;

	@media (min-width: variables.$tablet) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: variables.$desktop) {
		gap: 24px;
	}

	&__item {
		display: flex;

		// Первый кадр — на всю ширину: он же обложка проекта
		&:first-child {
			@media (min-width: variables.$tablet) {
				grid-column: 1 / -1;
			}
		}
	}

	&__link {
		display: block;
		width: 100%;
		overflow: hidden;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-m;
	}

	&__media {
		display: block;
		overflow: hidden;
	}

	&__img {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}
}
</style>
