<script setup lang="ts">
import type { IDeliveryOption } from '@/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	options: IDeliveryOption[]
	title: string
	text?: string
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.delivery-options__item', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="delivery-options">
		<div class="delivery-options__head">
			<h2 class="delivery-options__title h2">{{ title }}</h2>
			<p v-if="text" class="delivery-options__text text-m">{{ text }}</p>
		</div>

		<ul class="delivery-options__list">
			<li v-for="option in options" :key="option.title" class="delivery-options__item">
				<div class="delivery-options__item-main">
					<h3 class="delivery-options__item-title title-18">{{ option.title }}</h3>
					<p class="delivery-options__item-text text-s">{{ option.text }}</p>
				</div>

				<dl class="delivery-options__params">
					<div class="delivery-options__param">
						<dt class="delivery-options__param-label text-xs">Стоимость</dt>
						<dd class="delivery-options__param-value title-14">{{ option.price }}</dd>
					</div>

					<div class="delivery-options__param">
						<dt class="delivery-options__param-label text-xs">Срок</dt>
						<dd class="delivery-options__param-value title-14">{{ option.term }}</dd>
					</div>
				</dl>
			</li>
		</ul>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.delivery-options {
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
		gap: 12px;
	}

	&__item {
		display: grid;
		gap: 16px;
		padding: 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
			align-items: center;
			gap: 32px;
			padding: 28px;
		}
	}

	&__item-title {
		margin: 0 0 8px;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__params {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		margin: 0;
	}

	&__param-label {
		margin: 0 0 6px;
		color: variables.$color-ink-soft;
	}

	&__param-value {
		margin: 0;
	}
}
</style>
