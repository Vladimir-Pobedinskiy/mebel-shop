<script setup lang="ts">
import type { IDealerWholesaleUnit } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	wholesaleUnit: IDealerWholesaleUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-wholesale__item', { stagger: 0.06, y: 24 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-wholesale">
		<div class="dealer-wholesale__head">
			<h2 class="dealer-wholesale__title h2">{{ wholesaleUnit.title }}</h2>
			<p class="dealer-wholesale__text text-m">{{ wholesaleUnit.text }}</p>
		</div>

		<ul class="dealer-wholesale__list">
			<li v-for="item in wholesaleUnit.items" :key="item.title" class="dealer-wholesale__item surface">
				<h3 class="dealer-wholesale__item-title title-18">{{ item.title }}</h3>
				<p class="dealer-wholesale__item-text text-s">{{ item.text }}</p>
			</li>
		</ul>

		<div v-if="wholesaleUnit.minOrder" class="dealer-wholesale__min-order">
			<div class="dealer-wholesale__min-order-body">
				<h3 class="dealer-wholesale__min-order-title h3">{{ wholesaleUnit.minOrder.title }}</h3>
				<p class="dealer-wholesale__min-order-text text-m">{{ wholesaleUnit.minOrder.text }}</p>
				<p v-if="wholesaleUnit.minOrder.note" class="dealer-wholesale__note text-xs">
					{{ wholesaleUnit.minOrder.note }}
				</p>
			</div>

			<ul class="dealer-wholesale__min-order-list">
				<li v-for="item in wholesaleUnit.minOrder.items" :key="item.label" class="dealer-wholesale__min-order-item">
					<span class="dealer-wholesale__min-order-label text-xs">{{ item.label }}</span>
					<span class="dealer-wholesale__min-order-value title-18">{{ item.value }}</span>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-wholesale {
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

	&__list {
		display: grid;
		gap: 16px;
		grid-template-columns: 1fr;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		padding: 24px 20px;
	}

	&__item-title {
		margin: 0 0 10px;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__min-order {
		display: grid;
		margin-top: 24px;
		padding: 28px 20px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;
		gap: 24px;

		@media (min-width: variables.$desktop) {
			padding: 40px;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
			gap: 48px;
		}
	}

	&__min-order-title {
		margin: 0 0 12px;
	}

	&__min-order-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}

	&__min-order-list {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(2, 1fr);

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__min-order-item {
		display: flex;
		flex-direction: column;
		padding: 16px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
		gap: 6px;
	}

	&__min-order-label {
		color: variables.$color-ink-soft;
	}

	&__min-order-value {
		color: variables.$color-accent;
	}
}
</style>
