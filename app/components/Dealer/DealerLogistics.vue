<script setup lang="ts">
import type { IDealerLogisticsUnit } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	logisticsUnit: IDealerLogisticsUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-logistics__group', { stagger: 0.08, y: 28 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-logistics">
		<div class="dealer-logistics__head">
			<h2 class="dealer-logistics__title h2">{{ logisticsUnit.title }}</h2>
			<p class="dealer-logistics__text text-m">{{ logisticsUnit.text }}</p>
		</div>

		<ul class="dealer-logistics__list">
			<li v-for="group in logisticsUnit.groups" :key="group.title" class="dealer-logistics__group surface">
				<h3 class="dealer-logistics__group-title title-18">{{ group.title }}</h3>
				<p class="dealer-logistics__group-text text-s">{{ group.text }}</p>

				<ul class="dealer-logistics__params">
					<li v-for="item in group.items" :key="item.label" class="dealer-logistics__param">
						<span class="dealer-logistics__param-label text-xs">{{ item.label }}</span>
						<span class="dealer-logistics__param-value text-s">{{ item.value }}</span>
					</li>
				</ul>
			</li>
		</ul>

		<p v-if="logisticsUnit.note" class="dealer-logistics__note text-xs">{{ logisticsUnit.note }}</p>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-logistics {
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
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__group {
		padding: 24px 20px;
	}

	&__group-title {
		margin: 0 0 10px;
	}

	&__group-text {
		margin: 0 0 16px;
		color: variables.$color-ink-soft;
	}

	&__params {
		display: grid;
		gap: 10px;
	}

	&__param {
		display: flex;
		flex-direction: column;
		padding-top: 10px;
		border-top: 1px solid variables.$color-line;
		gap: 2px;
	}

	&__param-label {
		color: variables.$color-ink-soft;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}
}
</style>
