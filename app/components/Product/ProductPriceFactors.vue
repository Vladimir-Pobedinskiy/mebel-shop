<script setup lang="ts">
import type { IProductPriceFactor } from '~~/interfaces/product/IProduct'
import { useGsapReveal } from '@/composables/useGsapReveal'
import { priceFormatter } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		priceFactors: IProductPriceFactor[]
		/** базовая цена: от неё считаются все доплаты */
		basePrice?: number | null
	}>(),
	{
		basePrice: null,
	}
)
const emits = defineEmits<{
	(e: 'request'): void
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

const baseLabel = computed(() => (props.basePrice ? `от ${priceFormatter(props.basePrice)}` : ''))

onMounted(() => {
	revealOnScroll(rootRef.value, '.product-price-factors__item', { stagger: 0.08, y: 28 })
})
</script>

<template>
	<section v-if="priceFactors.length" ref="rootRef" class="product-price-factors">
		<div class="product-price-factors__head">
			<div class="product-price-factors__head-body">
				<h2 class="product-price-factors__title h3">Из чего складывается цена</h2>
				<p class="product-price-factors__text text-m">
					В карточке указана цена базовой конфигурации<template v-if="baseLabel"> — {{ baseLabel }}</template
					>. Точную сумму считаем после замера: ниже — всё, что на неё влияет.
				</p>
			</div>

			<UIButton
				class="product-price-factors__btn"
				as="button"
				type="button"
				label="Рассчитать стоимость"
				show-icon
				@click="emits('request')"
			/>
		</div>

		<ul class="product-price-factors__list">
			<li v-for="item in priceFactors" :key="item.title" class="product-price-factors__item">
				<h3 class="product-price-factors__item-title title-18">{{ item.title }}</h3>
				<p class="product-price-factors__item-text text-s">{{ item.text }}</p>
			</li>
		</ul>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-price-factors {
	padding: 28px 20px;
	border-radius: variables.$radius-l;
	background-color: variables.$color-muted;

	@media (min-width: variables.$desktop-small) {
		padding: 40px;
	}

	&__head {
		display: flex;
		flex-direction: column;
		margin-bottom: 24px;
		gap: 20px;

		@media (min-width: variables.$desktop-small) {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
		}
	}

	&__head-body {
		max-width: 760px;
	}

	&__title {
		margin: 0 0 10px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__btn {
		flex: 0 0 auto;
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 20px;
		}
	}

	&__item {
		padding: 20px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__item-title {
		margin: 0 0 8px;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
