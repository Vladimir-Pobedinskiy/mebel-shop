<script setup lang="ts">
import type { ILink } from '~~/interfaces/ILink'

withDefaults(
	defineProps<{
		breadcrumbs: ILink[]
		isDark?: boolean
		isCentered?: boolean
	}>(),
	{
		isDark: false,
		isCentered: false,
	}
)
</script>

<template>
	<ul
		:class="['breadcrumbs', { breadcrumbs_dark: isDark }, { breadcrumbs_centered: isCentered }]"
		itemscope
		itemtype="https://schema.org/BreadcrumbList"
		aria-label="Хлебные крошки"
	>
		<li
			v-for="(item, index) in breadcrumbs"
			:key="index"
			class="breadcrumbs__item"
			itemprop="itemListElement"
			itemscope
			itemtype="https://schema.org/ListItem"
		>
			<NuxtLink
				v-if="index !== breadcrumbs.length - 1"
				class="breadcrumbs__link text-s hover-link"
				:to="`${item.url}`"
				:title="item.label"
				itemprop="item"
			>
				<meta itemprop="position" :content="String(index)" />
				<span itemprop="name">{{ item.label }}</span>
			</NuxtLink>
			<span v-else class="breadcrumbs__link text-s" :title="item.label" itemprop="item" aria-current="page">
				<meta itemprop="position" :content="String(index)" />
				<span itemprop="name">{{ item.label }}</span>
			</span>
		</li>
	</ul>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.breadcrumbs {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	color: variables.$color-ink-soft;

	&_centered {
		justify-content: center;
	}

	&_dark {
		color: rgb(255 255 255 / 70%);
	}

	&__item:not(:last-of-type) {
		position: relative;
		margin-right: 20px;
	}

	li:not(:last-of-type) {
		&::after {
			position: absolute;
			top: 50%;
			margin-left: 7px;
			content: '/';
			opacity: 0.6;
			transform: translateY(-50%);
		}
	}

	&__link {
		display: inline-block;
	}

	&__item:last-of-type .breadcrumbs__link {
		color: variables.$color-ink;
	}

	&_dark &__item:last-of-type &__link {
		color: variables.$color-white;
	}
}
</style>
