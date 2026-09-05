<script setup lang="ts">
import type { ILink } from '~~/interfaces/ILink'

withDefaults(
	defineProps<{
		breadcrumbs: ILink[]
		h1: string
		text?: string | null
		/** тёмная «премиальная» подложка вместо песочной */
		isDark?: boolean
		/** выравнивание по центру — для контентных страниц */
		isCentered?: boolean
	}>(),
	{
		text: null,
		isDark: false,
		isCentered: false,
	}
)
</script>

<template>
	<div :class="['intro', { intro_dark: isDark }, { intro_centered: isCentered }]">
		<div class="container">
			<div class="intro__inner">
				<div v-if="breadcrumbs" class="intro__breadcrumbs">
					<UIBreadcrumbs :breadcrumbs="breadcrumbs" :is-dark="isDark" :is-centered="isCentered" />
				</div>

				<h1 v-if="h1" class="intro__title h1">{{ h1 }}</h1>

				<p v-if="text" class="intro__text text-l">{{ text }}</p>

				<slot name="content" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.intro {
	padding: 24px 0 32px;
	background-color: variables.$color-bg;

	@media (min-width: variables.$desktop) {
		padding: 32px 0 56px;
	}

	&__inner {
		display: flex;
		flex-direction: column;
	}

	&__breadcrumbs {
		margin-bottom: 24px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__text {
		width: 100%;
		max-width: 760px;
		margin-top: 20px;
		color: variables.$color-ink-soft;
	}

	&_centered {
		.intro__inner {
			align-items: center;
			text-align: center;
		}
	}

	&_dark {
		background-color: variables.$color-accent-2;

		.intro__title {
			color: variables.$color-white;
		}

		.intro__text {
			color: rgb(255 255 255 / 75%);
		}
	}
}
</style>
