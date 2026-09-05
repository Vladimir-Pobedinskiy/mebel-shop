<script setup lang="ts">
import type { IDealerDiscountsUnit } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	discountsUnit: IDealerDiscountsUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-discounts__row', { stagger: 0.06, y: 20 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-discounts">
		<div class="dealer-discounts__head">
			<h2 class="dealer-discounts__title h2">{{ discountsUnit.title }}</h2>
			<p class="dealer-discounts__text text-m">{{ discountsUnit.text }}</p>
		</div>

		<!-- Сетка скидок: на десктопе таблица, на мобиле — карточки с подписями полей -->
		<div class="dealer-discounts__table-wrapper custom-scrollbar">
			<table class="dealer-discounts__table">
				<caption class="visually-hidden">
					{{
						discountsUnit.title
					}}
				</caption>

				<thead class="dealer-discounts__thead">
					<tr>
						<th v-for="column in discountsUnit.columns" :key="column" class="dealer-discounts__th text-xs" scope="col">
							{{ column }}
						</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="row in discountsUnit.rows" :key="row.level" class="dealer-discounts__row">
						<td class="dealer-discounts__td" :data-label="discountsUnit.columns[0]">
							<span class="dealer-discounts__level title-14">{{ row.level }}</span>
						</td>
						<td class="dealer-discounts__td text-s" :data-label="discountsUnit.columns[1]">{{ row.volume }}</td>
						<td class="dealer-discounts__td" :data-label="discountsUnit.columns[2]">
							<span class="dealer-discounts__discount title-18">{{ row.discount }}</span>
						</td>
						<td class="dealer-discounts__td text-s" :data-label="discountsUnit.columns[3]">{{ row.deferment }}</td>
						<td class="dealer-discounts__td text-s" :data-label="discountsUnit.columns[4]">{{ row.bonus }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p v-if="discountsUnit.note" class="dealer-discounts__note text-xs">{{ discountsUnit.note }}</p>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-discounts {
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

	&__table-wrapper {
		@media (min-width: variables.$tablet) {
			overflow-x: auto;
		}
	}

	&__table {
		width: 100%;
		border-collapse: collapse;

		@media (min-width: variables.$tablet) {
			min-width: 760px;
		}
	}

	&__thead {
		display: none;

		@media (min-width: variables.$tablet) {
			display: table-header-group;
		}
	}

	&__th {
		padding: 0 16px 12px;
		color: variables.$color-ink-soft;
		text-align: left;
	}

	&__row {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
		margin-bottom: 12px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$tablet) {
			display: table-row;
			padding: 0;
			margin-bottom: 0;
			background-color: transparent;
			border: 0;
			border-radius: 0;
		}
	}

	&__td {
		display: flex;
		gap: 16px;
		align-items: baseline;
		justify-content: space-between;

		&::before {
			font-size: 12px;
			color: variables.$color-ink-soft;
			content: attr(data-label);
		}

		@media (min-width: variables.$tablet) {
			display: table-cell;
			padding: 18px 16px;
			vertical-align: top;
			border-bottom: 1px solid variables.$color-line;

			&::before {
				content: none;
			}
		}
	}

	&__discount {
		color: variables.$color-accent;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}
}
</style>
