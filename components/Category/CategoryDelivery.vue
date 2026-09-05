<script setup lang="ts">
import type { ICategoryDeliveryUnit } from '@/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	deliveryUnit: ICategoryDeliveryUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-delivery__item', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="category-delivery">
		<div class="container">
			<div class="category-delivery__head">
				<h2 class="category-delivery__title h2">{{ deliveryUnit.title }}</h2>
				<p v-if="deliveryUnit.text" class="category-delivery__text text-m">{{ deliveryUnit.text }}</p>
			</div>

			<ul class="category-delivery__list">
				<li v-for="option in deliveryUnit.options" :key="option.title" class="category-delivery__item">
					<h3 class="category-delivery__item-title title-18">{{ option.title }}</h3>

					<p class="category-delivery__price price-typo">{{ option.price }}</p>

					<p v-if="option.term" class="category-delivery__term tag-typo">Срок: {{ option.term }}</p>

					<p class="category-delivery__item-text text-s">{{ option.text }}</p>
				</li>
			</ul>

			<div class="category-delivery__footer">
				<p v-if="deliveryUnit.note" class="category-delivery__note text-s">
					<NuxtIcon class="category-delivery__note-icon" name="icon-truck" filled />
					<span>{{ deliveryUnit.note }}</span>
				</p>

				<UIButton
					v-if="deliveryUnit.link"
					as="NuxtLink"
					:to="deliveryUnit.link.url"
					:label="deliveryUnit.link.label"
					variant="secondary"
					show-icon
				/>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-delivery {
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

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
			gap: 24px;
		}
	}

	&__item {
		display: flex;
		height: 100%;
		flex-direction: column;
		gap: 10px;
		padding: 28px 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
	}

	&__item-title {
		margin: 0;
	}

	&__price {
		margin: 0;
		color: variables.$color-accent;
	}

	&__term {
		display: inline-flex;
		width: fit-content;
		margin: 0;
		padding: 4px 10px;
		border-radius: 999px;
		background-color: variables.$color-muted;
		color: variables.$color-ink-soft;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__footer {
		display: flex;
		flex-direction: column;
		margin-top: 24px;
		padding: 24px 20px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-muted;
		gap: 16px;

		@media (min-width: variables.$tablet) {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 28px 32px;
			gap: 24px;
		}
	}

	&__note {
		display: flex;
		align-items: flex-start;
		margin: 0;
		gap: 12px;
		color: variables.$color-ink-soft;
	}

	&__note-icon {
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
		margin-top: 2px;
		color: variables.$color-accent;
	}
}
</style>
