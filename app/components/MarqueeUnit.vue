<script setup lang="ts">
import { useReducedMotion } from '@/composables/useReducedMotion'

defineProps<{
	marqueeUnit: { title: string; marqueeContent: string[] }
}>()

// При prefers-reduced-motion бегущая строка не едет — показываем статичный список преимуществ
const { isReducedMotion } = useReducedMotion()
</script>

<template>
	<section class="marquee-unit" :aria-label="marqueeUnit.title">
		<ul v-if="isReducedMotion" class="marquee-unit__static container">
			<li v-for="item in marqueeUnit.marqueeContent" :key="item" class="marquee-unit__static-item h4">
				{{ item }}
			</li>
		</ul>

		<UIMarquee v-else :duration="30">
			<template #content>
				<span v-for="item in marqueeUnit.marqueeContent" :key="item" class="marquee-unit__item running-line-typo">
					{{ item }}
					<span class="marquee-unit__separator" aria-hidden="true">•</span>
				</span>
			</template>
		</UIMarquee>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.marquee-unit {
	padding: 40px 0;
	background-color: variables.$color-muted;
	border-top: 1px solid variables.$color-line;
	border-bottom: 1px solid variables.$color-line;

	@media (min-width: variables.$desktop) {
		padding: 64px 0;
	}

	&__item {
		display: flex;
		gap: 24px;
		align-items: center;
		padding-right: 24px;
		color: variables.$color-ink;
		white-space: nowrap;
	}

	&__separator {
		color: variables.$color-accent;
	}

	&__static {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 32px;
	}

	&__static-item {
		color: variables.$color-ink;
	}
}
</style>
