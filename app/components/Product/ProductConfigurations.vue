<script setup lang="ts">
import type { IProductConfiguration } from '~~/interfaces/product/IProduct'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	configurations: IProductConfiguration[]
	/** подпись под заголовком: что именно двигает цену */
	text?: string
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.product-configurations__item', { stagger: 0.1, y: 32 })
})
</script>

<template>
	<section v-if="configurations.length" ref="rootRef" class="product-configurations">
		<div class="product-configurations__head">
			<h2 class="product-configurations__title h3">Варианты конфигурации</h2>
			<p class="product-configurations__text text-m">
				{{ text || 'Модель собирается под ваш проём: от набора секций и материала фасадов зависит итоговая цена.' }}
			</p>
		</div>

		<ul class="product-configurations__list">
			<li v-for="item in configurations" :key="item.title" class="product-configurations__item">
				<div class="product-configurations__media">
					<NuxtImg
						class="product-configurations__img"
						:src="item.img.url"
						:alt="item.img.alt"
						loading="lazy"
						format="webp"
						sizes="xs:90vw sm:90vw md:45vw lg:33vw xl:33vw"
					/>
				</div>

				<div class="product-configurations__body">
					<h3 class="product-configurations__item-title title-18">{{ item.title }}</h3>
					<p class="product-configurations__item-text text-s">{{ item.description }}</p>
					<p class="product-configurations__diff tag-typo">{{ item.priceDiff }}</p>
				</div>
			</li>
		</ul>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-configurations {
	&__head {
		max-width: 760px;
		margin-bottom: 24px;
	}

	&__title {
		margin: 0 0 10px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		display: flex;
		overflow: hidden;
		flex-direction: column;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__media {
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background-color: variables.$color-muted;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 20px;
		gap: 8px;
	}

	&__item-title {
		margin: 0;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__diff {
		display: inline-flex;
		width: fit-content;
		padding: 6px 12px;
		border-radius: 999px;
		margin: auto 0 0;
		background-color: variables.$color-accent-soft;
		color: variables.$color-accent;
	}
}
</style>
