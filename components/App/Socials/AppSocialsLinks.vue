<script setup lang="ts">
import type { ISocialLink } from '@/interfaces/IGeneral'

withDefaults(
	defineProps<{
		links: ISocialLink[]
		/** 'dark' | 'white' */
		color?: 'dark' | 'white'
	}>(),
	{
		color: 'dark',
	}
)
</script>

<template>
	<div class="socials-links">
		<AppSocialsLink v-for="(link, i) in links" :key="i" :link="link" :color="color" />
	</div>
</template>

<style lang="scss">
.socials-links {
	display: flex;
	align-items: center;
	gap: 10px;
}
</style>
