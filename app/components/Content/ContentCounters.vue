<script setup lang="ts">
import { useGsapReveal } from '@/composables/useGsapReveal'
import { numberFormatter } from '@/utils/utils'

defineProps<{
	items: { value: number; suffix?: string; label: string }[]
}>()

const rootRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		gsap.set('.content-counters__item', { y: 32, opacity: 0 })

		gsap.to('.content-counters__item', {
			y: 0,
			opacity: 1,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.1,
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 85%' },
		})

		// Числа набегают при появлении блока; до этого в разметке остаётся итоговое значение
		gsap.utils.toArray<HTMLElement>('.content-counters__value-number').forEach(element => {
			const target = Number(element.dataset.value || 0)
			const counter = { value: 0 }

			gsap.fromTo(
				counter,
				{ value: 0 },
				{
					value: target,
					duration: 1.6,
					ease: 'power2.out',
					immediateRender: false,
					scrollTrigger: { trigger: element, start: 'top 90%' },
					onUpdate: () => {
						element.textContent = numberFormatter(Math.round(counter.value))
					},
				}
			)
		})
	})
})
</script>

<template>
	<ul ref="rootRef" class="content-counters">
		<li v-for="item in items" :key="item.label" class="content-counters__item">
			<p class="content-counters__value">
				<span class="content-counters__value-number" :data-value="item.value">{{ numberFormatter(item.value) }}</span>
				<span v-if="item.suffix" class="content-counters__suffix">{{ item.suffix }}</span>
			</p>

			<p class="content-counters__label text-s">{{ item.label }}</p>
		</li>
	</ul>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.content-counters {
	display: grid;
	gap: 16px;

	@media (min-width: variables.$mobile-big) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: variables.$desktop-small) {
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 20px;
	}

	&__item {
		padding: 24px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;

		@media (min-width: variables.$desktop) {
			padding: 28px;
		}
	}

	&__value {
		display: flex;
		gap: 2px;
		align-items: baseline;
		margin: 0 0 8px;
		font-family: variables.$font-secondary;
		font-size: 34px;
		font-weight: 600;
		line-height: 1.1;
		color: variables.$color-accent;
		letter-spacing: -0.02em;

		@media (min-width: variables.$desktop) {
			font-size: 44px;
		}
	}

	&__label {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
