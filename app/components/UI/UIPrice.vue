<script setup lang="ts">
import { priceFormatter, discountPercent } from '@/utils/utils'

const props = withDefaults(
	defineProps<{
		price: number
		oldPrice?: number | null
		/** 'big' | 'medium' | 'small' */
		size?: string
		/** показывать бейдж с процентом скидки */
		showDiscount?: boolean
		/** цена зависит от конфигурации — выводим её как «от 118 700 ₽» */
		isFrom?: boolean
		isLight?: boolean
	}>(),
	{
		oldPrice: null,
		size: 'medium',
		showDiscount: true,
		isFrom: false,
		isLight: false,
	}
)

const percent = computed(() => discountPercent(props.price, props.oldPrice))
</script>

<template>
	<div :class="['price', `price_${size}`, { price_light: isLight }]">
		<span class="price__current">
			<span v-if="isFrom" class="price__from">от </span>{{ priceFormatter(price) }}
		</span>

		<template v-if="percent">
			<span class="price__old text-s">{{ priceFormatter(oldPrice as number) }}</span>
			<span v-if="showDiscount" class="price__discount tag-typo">−{{ percent }}%</span>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.price {
	display: flex;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 8px 10px;

	&__current {
		font-family: variables.$font;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.01em;
		color: variables.$color-ink;
		white-space: nowrap;
	}

	&__from {
		color: variables.$color-ink-soft;
		font-weight: 400;
	}

	&__old {
		color: variables.$color-ink-soft;
		text-decoration: line-through;
		white-space: nowrap;
	}

	&__discount {
		padding: 3px 8px;
		border-radius: 999px;
		background-color: variables.$color-accent;
		color: variables.$color-white;
		white-space: nowrap;
	}

	&_big &__current {
		font-size: clamp(24px, 2.4vw, 34px);
	}

	&_medium &__current {
		font-size: clamp(18px, 1.8vw, 22px);
	}

	&_small &__current {
		font-size: 16px;
	}

	&_light {
		.price__current {
			color: variables.$color-white;
		}

		.price__old {
			color: rgba(255 255 255 / 70%);
		}
	}
}
</style>
