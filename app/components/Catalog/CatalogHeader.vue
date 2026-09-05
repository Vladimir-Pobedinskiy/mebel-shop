<script setup lang="ts">
import type { IBreadcrumb } from '~~/interfaces/IBreadcrumb'
import type { ILink } from '~~/interfaces/ILink'

withDefaults(
	defineProps<{
		breadcrumbs: IBreadcrumb[]
		title: string
		description?: string
		collections?: ILink[]
		/** url текущей коллекции — подсвечивается в списке ссылок */
		activeUrl?: string
	}>(),
	{
		description: '',
		collections: () => [],
		activeUrl: '',
	}
)
</script>

<template>
	<div class="catalog-header">
		<UIBreadcrumbs v-if="breadcrumbs?.length" class="catalog-header__breadcrumbs" :breadcrumbs="breadcrumbs" />

		<h1 class="catalog-header__title h1">{{ title }}</h1>

		<p v-if="description" class="catalog-header__text text-m">{{ description }}</p>

		<ul v-if="collections?.length" class="catalog-header__collections">
			<li v-for="collection in collections" :key="collection.url">
				<NuxtLink
					:class="['catalog-header__collection text-s', { 'catalog-header__collection_active': collection.url === activeUrl }]"
					:to="collection.url"
				>
					{{ collection.label }}
				</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.catalog-header {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__breadcrumbs {
		margin-bottom: 4px;
	}

	&__title {
		margin: 0;
	}

	&__text {
		max-width: 760px;
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__collections {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__collection {
		display: inline-flex;
		padding: 8px 16px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		background-color: variables.$color-surface;
		color: variables.$color-ink-soft;
		transition:
			border-color 0.3s ease-in-out,
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		&_active {
			border-color: variables.$color-accent;
			background-color: variables.$color-accent;
			color: variables.$color-white;
		}

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: variables.$color-accent;
				color: variables.$color-accent;
			}

			&_active:hover {
				color: variables.$color-white;
			}
		}
	}
}
</style>
