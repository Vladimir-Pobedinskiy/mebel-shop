<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string
		text?: string
		/** имя иконки из assets/icons */
		icon?: string
		/** ссылка кнопки-действия */
		linkUrl?: string
		linkLabel?: string
	}>(),
	{
		text: '',
		icon: 'icon-cart',
		linkUrl: '',
		linkLabel: '',
	}
)
</script>

<template>
	<div class="empty-state">
		<span class="empty-state__icon-wrapper">
			<NuxtIcon class="empty-state__icon" :name="icon" filled />
		</span>

		<p class="empty-state__title h3">{{ title }}</p>
		<p v-if="text" class="empty-state__text text-m">{{ text }}</p>

		<UIButton
			v-if="linkUrl && linkLabel"
			class="empty-state__btn"
			as="NuxtLink"
			:to="linkUrl"
			variant="primary"
			color="accent"
			size="big"
			:label="linkLabel"
			show-icon
		/>

		<slot name="content" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 48px 24px;
	text-align: center;
	background-color: variables.$color-surface;
	border-radius: variables.$radius-l;

	@media (min-width: variables.$desktop) {
		padding: 80px 40px;
	}

	&__icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		margin-bottom: 24px;
		color: variables.$color-accent;
		background-color: variables.$color-muted;
		border-radius: 50%;
	}

	&__icon {
		width: 28px;
		height: 28px;
	}

	&__text {
		max-width: 520px;
		margin-top: 12px;
		color: variables.$color-ink-soft;
	}

	&__btn {
		margin-top: 28px;
	}
}
</style>
