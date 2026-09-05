<script setup lang="ts">
withDefaults(
	defineProps<{
		/** 'text' | 'title' | 'box' | 'circle' */
		variant?: string
		width?: string
		height?: string
		/** количество повторов для variant="text" */
		count?: number
		radius?: string
	}>(),
	{
		variant: 'box',
		width: '100%',
		height: '',
		count: 1,
		radius: '',
	}
)
</script>

<template>
	<div class="skeleton">
		<span
			v-for="line in count"
			:key="line"
			:class="['skeleton__item', `skeleton__item_${variant}`, 'skeleton-box']"
			:style="{ width: width, height: height || undefined, borderRadius: radius || undefined }"
		>
			<span class="visually-hidden">Загрузка…</span>
		</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.skeleton {
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;

	&__item {
		display: block;
		background-color: variables.$color-muted;

		&_text {
			height: 14px;
			border-radius: 6px;
		}

		&_title {
			height: 28px;
			border-radius: 8px;
		}

		&_box {
			height: 200px;
			border-radius: variables.$radius-m;
		}

		&_circle {
			width: 48px;
			height: 48px;
			border-radius: 50%;
		}
	}
}
</style>
