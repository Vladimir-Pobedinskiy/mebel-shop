<script setup lang="ts">
import type { ICartItem } from '~~/interfaces/cart/ICartItem'
import { priceFormatter } from '@/utils/utils'

const props = defineProps<{
	item: ICartItem
}>()

const emits = defineEmits<{
	(e: 'update-qty', quantity: number): void
	(e: 'remove'): void
}>()

const quantity = computed({
	get: () => props.item.quantity,
	set: (value: number) => emits('update-qty', value),
})

const sum = computed(() => props.item.price * props.item.quantity)
const oldSum = computed(() => (props.item.oldPrice ? props.item.oldPrice * props.item.quantity : null))
</script>

<template>
	<article class="cart-item">
		<NuxtLink class="cart-item__media" :to="item.url" :aria-label="item.title">
			<NuxtImg
				class="cart-item__img"
				:src="item.img.url"
				:alt="item.img.alt"
				loading="lazy"
				format="webp"
				sizes="xs:30vw sm:25vw md:20vw lg:160px xl:160px xxl:160px"
			/>
		</NuxtLink>

		<div class="cart-item__body">
			<h2 class="cart-item__title title-18">
				<NuxtLink class="cart-item__title-link hover-link" :to="item.url">{{ item.title }}</NuxtLink>
			</h2>

			<p v-if="item.variant" class="cart-item__variant text-xs">Исполнение: {{ item.variant }}</p>

			<p class="cart-item__unit-price text-xs">{{ priceFormatter(item.price) }} за штуку</p>
		</div>

		<div class="cart-item__controls">
			<UIQuantity v-model="quantity" class="cart-item__quantity" :min="1" :max="99" size="small" />

			<UIPrice class="cart-item__price" :price="sum" :old-price="oldSum" size="small" :show-discount="false" />

			<button class="cart-item__remove" type="button" aria-label="Удалить из корзины" @click="emits('remove')">
				<NuxtIcon class="cart-item__remove-icon" name="icon-trash" filled />
			</button>
		</div>
	</article>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.cart-item {
	position: relative;
	display: grid;
	grid-template-columns: 88px 1fr;
	gap: 16px;
	align-items: start;
	padding: 16px;
	background-color: variables.$color-surface;
	border: 1px solid variables.$color-line;
	border-radius: variables.$radius-m;
	transition: border-color 0.3s ease-in-out;

	@media (min-width: variables.$tablet) {
		grid-template-columns: 140px 1fr auto;
		gap: 24px;
		align-items: center;
		padding: 20px;
	}

	@media (min-width: variables.$desktop-small) {
		&:hover {
			border-color: variables.$color-line-strong;
		}
	}

	&__media {
		display: block;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: variables.$color-muted;
		border-radius: variables.$radius-s;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease-out;

		@media (min-width: variables.$desktop-small) {
			.cart-item:hover & {
				transform: scale(1.04);
			}
		}
	}

	&__body {
		min-width: 0;
	}

	&__title {
		margin: 0 0 8px;
	}

	&__variant,
	&__unit-price {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__variant {
		margin-bottom: 4px;
	}

	&__controls {
		display: flex;
		grid-column: 1 / -1;
		gap: 16px;
		align-items: center;
		justify-content: space-between;

		@media (min-width: variables.$tablet) {
			grid-column: auto;
			gap: 24px;
			justify-content: flex-end;
		}
	}

	&__price {
		flex-direction: column;
		gap: 2px;
		align-items: flex-end;

		@media (min-width: variables.$tablet) {
			min-width: 130px;
		}
	}

	&__remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		min-width: 40px;
		height: 40px;
		color: variables.$color-ink-soft;
		background-color: variables.$color-muted;
		border-radius: 50%;
		transition:
			color 0.3s ease-in-out,
			background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-error;
			}
		}
	}

	&__remove-icon {
		display: flex;

		svg {
			width: 18px;
			height: 18px;
		}
	}
}
</style>
