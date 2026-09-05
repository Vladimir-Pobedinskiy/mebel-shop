<script setup lang="ts">
import type { IBlogSection } from '~~/interfaces/article/IBlogPage'

withDefaults(
	defineProps<{
		sections: IBlogSection[]
		/** слаг активного раздела, 'all' — на общем списке */
		activeSlug?: string
	}>(),
	{
		activeSlug: 'all',
	}
)
</script>

<template>
	<nav class="blog-sections" aria-label="Разделы блога">
		<ul class="blog-sections__list">
			<li class="blog-sections__item">
				<NuxtLink :class="['blog-sections__link', { 'blog-sections__link_active': activeSlug === 'all' }]" to="/blog/">
					<span class="button-typo">Все статьи</span>
				</NuxtLink>
			</li>

			<li v-for="section in sections" :key="section.slug" class="blog-sections__item">
				<NuxtLink
					:class="['blog-sections__link', { 'blog-sections__link_active': activeSlug === section.slug }]"
					:to="section.link.url"
					:title="section.description"
				>
					<span class="button-typo">{{ section.label }}</span>
					<span class="blog-sections__count text-xs">{{ section.count }}</span>
				</NuxtLink>
			</li>
		</ul>
	</nav>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.blog-sections {
	&__list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		background-color: variables.$color-surface;
		transition:
			color 0.3s ease-in-out,
			border-color 0.3s ease-in-out,
			background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			cursor: pointer;

			&:hover {
				border-color: variables.$color-accent;
				color: variables.$color-accent;
			}
		}

		&_active {
			border-color: variables.$color-ink;
			color: variables.$color-white;
			background-color: variables.$color-ink;

			@media (min-width: variables.$desktop-small) {
				&:hover {
					border-color: variables.$color-ink;
					color: variables.$color-white;
				}
			}
		}
	}

	&__count {
		color: currentcolor;
		opacity: 0.6;
	}
}
</style>
