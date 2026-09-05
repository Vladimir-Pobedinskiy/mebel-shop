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
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	min-width: 44px;
	height: 44px;
	background-color: transparent;
	border: 1px solid transparent;
	border-radius: 50%;
	transition:
		background-color 0.3s ease-in-out,
		color 0.3s ease-in-out,
		border-color 0.3s ease-in-out;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			color: variables.$color-white;
			background-color: variables.$color-accent;
			border-color: variables.$color-accent;
		}
	}

	&_dark {
		color: variables.$color-ink;
		border-color: variables.$color-line;
	}

	&_white {
		color: variables.$color-white;
		border-color: rgb(255 255 255 / 30%);
	}

	&__icon {
		width: 18px;
		height: 18px;
		color: inherit;
	}
}
</style>
