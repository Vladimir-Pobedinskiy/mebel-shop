<script setup lang="ts">
import type { ISocialLink } from '~~/interfaces/IGeneral'

withDefaults(
	defineProps<{
		link: ISocialLink
		/** 'dark' | 'white' */
		color?: 'dark' | 'white'
	}>(),
	{
		color: 'dark',
	}
)
</script>

<template>
	<a
		:class="['socials-link', `socials-link_${color}`]"
		:href="link.url"
		:title="link.label"
		:aria-label="link.label"
		target="_blank"
		rel="noopener"
	>
		<NuxtIcon class="socials-link__icon" :name="`icon-${link.name}`" filled />
	</a>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.socials-link {
	width: 44px;
	min-width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid transparent;
	border-radius: 50%;
	background-color: transparent;
	transition:
		background-color 0.3s ease-in-out,
		color 0.3s ease-in-out,
		border-color 0.3s ease-in-out;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			background-color: variables.$color-accent;
			border-color: variables.$color-accent;
			color: variables.$color-white;
		}
	}

	&_dark {
		border-color: variables.$color-line;
		color: variables.$color-ink;
	}

	&_white {
		border-color: rgba(255 255 255 / 30%);
		color: variables.$color-white;
	}

	&__icon {
		width: 18px;
		height: 18px;
		color: inherit;
	}
}
</style>
