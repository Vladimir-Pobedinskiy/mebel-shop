<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import type { IProductDetails } from '@/interfaces/product/IProduct'

const props = withDefaults(
	defineProps<{
		product: IProductDetails
		price: number
		oldPrice?: number | null
		isInCart?: boolean
		/** основной блок кнопок: пока он на экране, панель не нужна */
		triggerEl?: HTMLElement | null
	}>(),
	{
		oldPrice: null,
		isInCart: false,
		triggerEl: null,
	}
)
const emits = defineEmits<{
	(e: 'cart' | 'quick'): void
}>()

const triggerRef = computed(() => props.triggerEl)
const isTriggerVisible = useElementVisibility(triggerRef)

/* Панель поднимается, когда кнопки в карточке ушли за пределы экрана.
   До первого появления кнопок (SSR и первый кадр) она скрыта */
const isMounted = ref<boolean>(false)

onMounted(() => {
	isMounted.value = true
})

const isShown = computed(() => isMounted.value && Boolean(props.triggerEl) && !isTriggerVisible.value)
</script>

<template>
	<Transition name="product-sticky-bar">
		<div v-if="isShown" class="product-sticky-bar">
			<div class="product-sticky-bar__inner">
				<div class="product-sticky-bar__body">
					<p class="product-sticky-bar__title text-xs">{{ product.title }}</p>
					<UIPrice :price="price" :old-price="oldPrice" :is-from="product.priceFrom" size="small" />
				</div>

				<div class="product-sticky-bar__actions">
					<UIButton
						class="product-sticky-bar__btn"
						as="button"
						type="button"
						variant="secondary"
						size="small"
						label="В 1 клик"
						@click="emits('quick')"
					/>

					<UIButton
						class="product-sticky-bar__btn"
						as="button"
						type="button"
						size="small"
						:color="isInCart ? 'green' : 'accent'"
						:label="isInCart ? 'В корзине' : 'В корзину'"
						:disabled="!product.inStock"
						@click="emits('cart')"
					/>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-sticky-bar {
	position: fixed;
	z-index: 50;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
	border-top: 1px solid variables.$color-line;
	background-color: variables.$color-surface;
	box-shadow: variables.$shadow-hover;

	// Панель нужна только на мобиле: на десктопе кнопки карточки и так под рукой
	@media (min-width: variables.$desktop-small) {
		display: none;
	}

	&__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	&__body {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 2px;
	}

	&__title {
		overflow: hidden;
		margin: 0;
		color: variables.$color-ink-soft;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__actions {
		display: flex;
		flex: 0 0 auto;
		gap: 8px;
	}

	&__btn {
		white-space: nowrap;
	}

	&-enter-active,
	&-leave-active {
		transition:
			transform 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
		transform: translateY(100%);
	}
}
</style>
