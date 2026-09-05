<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'
import { useGLightbox } from '@/composables/useGLightbox'
import { useAssetUrl } from '@/composables/useAssetUrl'
import { useGsapReveal } from '@/composables/useGsapReveal'

/* Сквозной блок доверия: сертификаты, фото производства, счётчики и отзывы.
   Данные общие для всего сайта (general → trustUnit), поэтому блок можно ставить
   на любую коммерческую страницу — раздел каталога, карточку модели, дилерам. */
const props = withDefaults(
	defineProps<{
		/** какие отзывы показывать: покупателей, дилеров или все */
		reviewsRole?: 'client' | 'dealer' | 'all'
	}>(),
	{
		reviewsRole: 'all',
	}
)

const { assetUrl } = useAssetUrl()

const storeGeneral = useGeneralStore()
const trustUnit = computed(() => storeGeneral.trustUnit)

const reviews = computed(() => {
	const items = trustUnit.value?.reviews?.items || []
	if (props.reviewsRole === 'all') return items

	return items.filter(item => item.role === props.reviewsRole)
})

// Свой селектор: на странице уже может работать галерея товара или проектов
useGLightbox('.glightbox-trust')

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.trust-unit__reveal', { stagger: 0.06, y: 28 })
})
</script>

<template>
	<section v-if="trustUnit" ref="rootRef" class="trust-unit">
		<div class="container">
			<div class="trust-unit__head trust-unit__reveal">
				<h2 class="trust-unit__title h2">{{ trustUnit.title }}</h2>
				<p class="trust-unit__text text-m">{{ trustUnit.text }}</p>
			</div>

			<ContentCounters v-if="trustUnit.counters?.length" class="trust-unit__counters" :items="trustUnit.counters" />

			<div v-if="trustUnit.certificates?.items?.length" class="trust-unit__block trust-unit__reveal">
				<div class="trust-unit__block-head">
					<h3 class="trust-unit__block-title h3">{{ trustUnit.certificates.title }}</h3>
					<p class="trust-unit__block-text text-s">{{ trustUnit.certificates.text }}</p>
				</div>

				<ul class="trust-unit__certificates">
					<li v-for="item in trustUnit.certificates.items" :key="item.title" class="trust-unit__certificate">
						<a
							class="trust-unit__certificate-media glightbox-trust"
							:href="assetUrl(item.img.url)"
							data-gallery="trust-certificates"
							:aria-label="`Открыть документ: ${item.title}`"
						>
							<NuxtImg
								class="trust-unit__certificate-img"
								:src="item.img.url"
								:alt="item.img.alt"
								loading="lazy"
								sizes="xs:45vw sm:30vw md:20vw lg:16vw"
							/>
						</a>

						<p class="trust-unit__certificate-title title-14">{{ item.title }}</p>
						<p class="trust-unit__certificate-text text-xs">{{ item.text }}</p>
					</li>
				</ul>
			</div>

			<div v-if="trustUnit.production?.gallery?.length" class="trust-unit__block trust-unit__reveal">
				<div class="trust-unit__block-head">
					<h3 class="trust-unit__block-title h3">{{ trustUnit.production.title }}</h3>
					<p class="trust-unit__block-text text-s">{{ trustUnit.production.text }}</p>

					<UIButton
						v-if="trustUnit.production.link"
						class="trust-unit__block-link"
						as="NuxtLink"
						:to="trustUnit.production.link.url"
						:label="trustUnit.production.link.label"
						variant="secondary"
						size="small"
						show-icon
					/>
				</div>

				<ul class="trust-unit__production">
					<li v-for="img in trustUnit.production.gallery" :key="img.url" class="trust-unit__production-item">
						<a
							class="trust-unit__production-media glightbox-trust"
							:href="assetUrl(img.url)"
							data-gallery="trust-production"
							:aria-label="`Открыть фото: ${img.alt}`"
						>
							<NuxtImg
								class="trust-unit__production-img"
								:src="img.url"
								:alt="img.alt"
								loading="lazy"
								format="webp"
								sizes="xs:90vw sm:45vw md:45vw lg:25vw"
							/>
						</a>
					</li>
				</ul>
			</div>

			<div v-if="reviews.length" class="trust-unit__block trust-unit__reveal">
				<div class="trust-unit__block-head">
					<h3 class="trust-unit__block-title h3">{{ trustUnit.reviews.title }}</h3>
					<p class="trust-unit__block-text text-s">{{ trustUnit.reviews.text }}</p>
				</div>

				<ul class="trust-unit__reviews">
					<li v-for="review in reviews" :key="review.id" class="trust-unit__review surface">
						<UIRating class="trust-unit__review-rating" :rating="review.rating" />
						<p class="trust-unit__review-text text-s">{{ review.text }}</p>

						<p class="trust-unit__review-author title-14">
							{{ review.author }}
							<span class="trust-unit__review-company text-xs">{{ review.company }}</span>
						</p>

						<UITag
							class="trust-unit__review-tag"
							:label="review.role === 'dealer' ? 'Дилер' : 'Покупатель'"
							:color="review.role === 'dealer' ? 'accent' : 'light'"
						/>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.trust-unit {
	&__head {
		max-width: 760px;
		margin-bottom: 28px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__counters {
		margin-bottom: 48px;
	}

	&__block {
		& + & {
			margin-top: 48px;
		}

		@media (min-width: variables.$desktop) {
			& + & {
				margin-top: 72px;
			}
		}
	}

	&__block-head {
		max-width: 760px;
		margin-bottom: 20px;
	}

	&__block-title {
		margin: 0 0 10px;
	}

	&__block-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__block-link {
		margin-top: 16px;
	}

	&__certificates {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	&__certificate-media {
		display: block;
		margin-bottom: 12px;
		overflow: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		transition: box-shadow 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				box-shadow: variables.$shadow-hover;
			}
		}
	}

	&__certificate-img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 3 / 4;
		object-fit: cover;
	}

	&__certificate-title {
		margin: 0 0 4px;
	}

	&__certificate-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__production {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__production-media {
		display: block;
		overflow: hidden;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-m;
	}

	&__production-img {
		display: block;
		width: 100%;
		height: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		transition: transform 0.5s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			.trust-unit__production-media:hover & {
				transform: scale(1.04);
			}
		}
	}

	&__reviews {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__review {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px 20px;
	}

	&__review-text {
		flex: 1 1 auto;
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__review-author {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin: 0;
	}

	&__review-company {
		font-weight: 400;
		color: variables.$color-ink-soft;
	}

	&__review-tag {
		align-self: flex-start;
	}
}

@media (prefers-reduced-motion: reduce) {
	.trust-unit__production-img {
		transition: none;
	}
}
</style>
