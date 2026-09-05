<script setup lang="ts">
import type { IDealerPolicyUnit } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	policyUnit: IDealerPolicyUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-policy__column', { stagger: 0.1, y: 28 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-policy">
		<div class="dealer-policy__head">
			<h2 class="dealer-policy__title h2">{{ policyUnit.title }}</h2>
			<p class="dealer-policy__text text-m">{{ policyUnit.text }}</p>
		</div>

		<div class="dealer-policy__columns">
			<div class="dealer-policy__column surface">
				<h3 class="dealer-policy__column-title h3">{{ policyUnit.claims.title }}</h3>
				<p class="dealer-policy__column-text text-s">{{ policyUnit.claims.text }}</p>

				<ol class="dealer-policy__steps">
					<li v-for="(step, index) in policyUnit.claims.steps" :key="step.title" class="dealer-policy__step">
						<span class="dealer-policy__step-number title-14">{{ index + 1 }}</span>

						<span class="dealer-policy__step-body">
							<span class="dealer-policy__step-title title-14">{{ step.title }}</span>
							<span class="dealer-policy__step-text text-s">{{ step.text }}</span>
						</span>
					</li>
				</ol>

				<p v-if="policyUnit.claims.note" class="dealer-policy__note text-xs">{{ policyUnit.claims.note }}</p>
			</div>

			<div class="dealer-policy__column surface">
				<h3 class="dealer-policy__column-title h3">{{ policyUnit.warranty.title }}</h3>
				<p class="dealer-policy__column-text text-s">{{ policyUnit.warranty.text }}</p>

				<ul class="dealer-policy__items">
					<li v-for="item in policyUnit.warranty.items" :key="item.title" class="dealer-policy__item">
						<NuxtIcon class="dealer-policy__item-icon" name="icon-shield" filled />

						<span class="dealer-policy__item-body">
							<span class="dealer-policy__item-title title-14">{{ item.title }}</span>
							<span class="dealer-policy__item-text text-s">{{ item.text }}</span>
						</span>
					</li>
				</ul>

				<p v-if="policyUnit.warranty.note" class="dealer-policy__note text-xs">{{ policyUnit.warranty.note }}</p>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-policy {
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

	&__columns {
		display: grid;
		gap: 16px;
		grid-template-columns: 1fr;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__column {
		padding: 28px 20px;

		@media (min-width: variables.$desktop) {
			padding: 40px;
		}
	}

	&__column-title {
		margin: 0 0 12px;
	}

	&__column-text {
		margin: 0 0 24px;
		color: variables.$color-ink-soft;
	}

	&__steps,
	&__items {
		display: grid;
		gap: 16px;
	}

	&__step,
	&__item {
		display: flex;
		gap: 14px;
	}

	&__step-number {
		display: flex;
		width: 32px;
		height: 32px;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: variables.$color-accent-soft;
		color: variables.$color-accent;
	}

	&__item-icon {
		width: 24px;
		height: 24px;
		flex: 0 0 auto;
		color: variables.$color-accent;
	}

	&__step-body,
	&__item-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__step-text,
	&__item-text {
		color: variables.$color-ink-soft;
	}

	&__note {
		margin: 24px 0 0;
		padding-top: 16px;
		border-top: 1px solid variables.$color-line;
		color: variables.$color-ink-soft;
	}
}
</style>
