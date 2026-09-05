<script setup lang="ts">
import type { IProductBadge } from '~~/interfaces/product/IProduct'

defineProps<{
	badge: IProductBadge
}>()
</script>

<template>
	<span :class="['badge', `badge_${badge.name}`, 'tag-typo']">{{ badge.label }}</span>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: fit-content;
	padding: 5px 10px;
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	white-space: nowrap;
	border-radius: 999px;

	&_hit {
		color: variables.$color-white;
		background-color: variables.$color-ink;
	}

	&_new {
		color: variables.$color-white;
		background-color: variables.$color-accent-2;
	}

	&_sale {
		color: variables.$color-white;
		background-color: variables.$color-accent;
	}
}
</style>
