<script setup lang="ts">
import type { IProductBadge } from '@/interfaces/product/IProduct'

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
	padding: 5px 10px;
	width: fit-content;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	font-size: 11px;
	white-space: nowrap;

	&_hit {
		background-color: variables.$color-ink;
		color: variables.$color-white;
	}

	&_new {
		background-color: variables.$color-accent-2;
		color: variables.$color-white;
	}

	&_sale {
		background-color: variables.$color-accent;
		color: variables.$color-white;
	}
}
</style>
