<script setup lang="ts">
withDefaults(
	defineProps<{
		/** глобальный оверлей на весь экран */
		isLoading?: boolean
		/** локальная заглушка внутри страницы */
		isLoadingLocal?: boolean
	}>(),
	{
		isLoading: false,
		isLoadingLocal: false,
	}
)
</script>

<template>
	<div v-if="isLoading || isLoadingLocal" :class="['loading', { 'loading-local': isLoadingLocal }]">
		<span class="loading__spinner">
			<span class="visually-hidden">Загрузка…</span>
		</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.loading {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100000;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgb(247 244 239 / 65%);
	backdrop-filter: blur(6px);

	&.loading-local {
		position: relative;
		z-index: 1;
		flex: 1 1 auto;
		width: 100%;
		height: auto;
		min-height: 60vh;
		background-color: variables.$color-bg;
		backdrop-filter: none;
	}

	&__spinner {
		width: 40px;
		height: 40px;
		border: 3px solid variables.$color-line;
		border-left-color: variables.$color-accent;
		border-radius: 50%;
		animation: progress-circular 1s infinite linear;
		will-change: transform;

		@media (min-width: variables.$desktop) {
			width: 50px;
			height: 50px;
		}
	}
}
</style>
