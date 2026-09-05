<script setup lang="ts">
import type { IProductOrderStep } from '~~/interfaces/product/IProduct'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	orderSteps: IProductOrderStep[]
	/** срок изготовления модели — показываем рядом с заголовком */
	productionTerm?: string
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.product-order-steps__item', { stagger: 0.1, y: 32 })
})
</script>

<template>
	<section v-if="orderSteps.length" ref="rootRef" class="product-order-steps">
		<div class="product-order-steps__head">
			<h2 class="product-order-steps__title h3">Как проходит заказ</h2>
			<p v-if="productionTerm" class="product-order-steps__term tag-typo">Изготовление — {{ productionTerm }}</p>
		</div>

		<ol class="product-order-steps__list">
			<li v-for="item in orderSteps" :key="item.step" class="product-order-steps__item">
				<span class="product-order-steps__step">{{ item.step }}</span>

				<span class="product-order-steps__body">
					<h3 class="product-order-steps__item-title title-18">{{ item.title }}</h3>
					<span class="product-order-steps__item-text text-s">{{ item.text }}</span>
				</span>
			</li>
		</ol>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-order-steps {
	&__head {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 16px;
		align-items: center;
		margin-bottom: 24px;
	}

	&__title {
		margin: 0;
	}

	&__term {
		display: inline-flex;
		padding: 6px 12px;
		margin: 0;
		color: variables.$color-accent;
		background-color: variables.$color-accent-soft;
		border-radius: 999px;
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(5, 1fr);
			gap: 20px;
		}
	}

	&__item {
		display: flex;
		gap: 16px;
		padding: 24px 20px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$desktop-small) {
			flex-direction: column;
		}
	}

	&__step {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		font-family: variables.$font-secondary;
		font-size: 18px;
		line-height: 1;
		color: variables.$color-accent;
		background-color: variables.$color-accent-soft;
		border-radius: 50%;
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__item-title {
		margin: 0;
	}

	&__item-text {
		color: variables.$color-ink-soft;
	}
}
</style>
