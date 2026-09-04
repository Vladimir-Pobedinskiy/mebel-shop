<script setup lang="ts">
import type { ICheckoutStep } from '@/interfaces/checkout/ICheckoutPage'

defineProps<{
	steps: ICheckoutStep[]
	/** индекс текущего шага, начиная с 0 */
	currentIndex: number
}>()

const emits = defineEmits<{
	(e: 'go', index: number): void
}>()
</script>

<template>
	<ol class="checkout-steps">
		<li
			v-for="(step, index) in steps"
			:key="step.name"
			:class="[
				'checkout-steps__item',
				{ 'checkout-steps__item_active': index === currentIndex },
				{ 'checkout-steps__item_done': index < currentIndex },
			]"
		>
			<!-- Вернуться можно только на пройденный шаг -->
			<component
				:is="index < currentIndex ? 'button' : 'span'"
				class="checkout-steps__btn"
				:type="index < currentIndex ? 'button' : undefined"
				:aria-current="index === currentIndex ? 'step' : undefined"
				@click="index < currentIndex && emits('go', index)"
			>
				<span class="checkout-steps__num">
					<NuxtIcon v-if="index < currentIndex" class="checkout-steps__num-icon" name="icon-check" filled />
					<template v-else>{{ index + 1 }}</template>
				</span>

				<span class="checkout-steps__label text-s">{{ step.label }}</span>
			</component>
		</li>
	</ol>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.checkout-steps {
	display: flex;
	flex-wrap: wrap;
	gap: 12px 8px;
	counter-reset: step;

	@media (min-width: variables.$tablet) {
		flex-wrap: nowrap;
		gap: 8px;
	}

	&__item {
		display: flex;
		align-items: center;
		flex-grow: 1;

		&:not(:last-child)::after {
			margin: 0 8px;
			height: 1px;
			flex-grow: 1;
			content: '';
			background-color: variables.$color-line;

			@media (max-width: variables.$tablet-for-max-width) {
				display: none;
			}
		}

		&_done::after {
			background-color: variables.$color-accent;
		}
	}

	&__btn {
		display: flex;
		align-items: center;
		gap: 10px;
		text-align: left;
		color: variables.$color-ink-soft;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			.checkout-steps__item_done &:hover {
				cursor: pointer;
				color: variables.$color-accent;
			}
		}
	}

	&__num {
		width: 32px;
		min-width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: variables.$font;
		font-size: 14px;
		font-weight: 600;
		border: 1px solid variables.$color-line;
		border-radius: 50%;
		background-color: variables.$color-surface;
		transition:
			color 0.3s ease-in-out,
			border-color 0.3s ease-in-out,
			background-color 0.3s ease-in-out;

		.checkout-steps__item_active & {
			color: variables.$color-white;
			border-color: variables.$color-accent;
			background-color: variables.$color-accent;
		}

		.checkout-steps__item_done & {
			color: variables.$color-accent;
			border-color: variables.$color-accent;
		}
	}

	&__num-icon {
		display: flex;

		svg {
			width: 12px;
			height: 12px;
		}
	}

	&__label {
		white-space: nowrap;

		.checkout-steps__item_active & {
			color: variables.$color-ink;
		}
	}
}
</style>
