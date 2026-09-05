<script setup lang="ts">
import type { ITextItem } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

withDefaults(
	defineProps<{
		items: ITextItem[]
		title?: string
		text?: string
		/** 'plain' — карточки, 'numbered' — пронумерованные шаги, 'flat' — список без подложки */
		variant?: 'plain' | 'numbered' | 'flat'
		/** число колонок на десктопе */
		columns?: 2 | 3 | 4
	}>(),
	{
		title: '',
		text: '',
		variant: 'plain',
		columns: 4,
	}
)

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.content-cards__item', { stagger: 0.08 })
})
</script>

<template>
	<section ref="rootRef" :class="['content-cards', `content-cards_${variant}`, `content-cards_cols-${columns}`]">
		<div v-if="title || text" class="content-cards__head">
			<h2 v-if="title" class="content-cards__title h2">{{ title }}</h2>
			<p v-if="text" class="content-cards__text text-m">{{ text }}</p>
		</div>

		<ul class="content-cards__list">
			<li v-for="(item, index) in items" :key="item.title" class="content-cards__item">
				<span v-if="variant === 'numbered'" class="content-cards__number title-14">{{ index + 1 }}</span>

				<h3 class="content-cards__item-title title-18">{{ item.title }}</h3>
				<p class="content-cards__item-text text-s">{{ item.text }}</p>
			</li>
		</ul>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.content-cards {
	&__head {
		max-width: 760px;
		margin-bottom: 28px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			gap: 20px;
		}
	}

	&_cols-3 &__list {
		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&_cols-4 &__list {
		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__item {
		position: relative;
		padding: 24px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;

		@media (min-width: variables.$desktop) {
			padding: 28px;
		}
	}

	&_flat &__item {
		padding: 0;
		border: 0;
		background-color: transparent;
	}

	&__number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		margin-bottom: 16px;
		border-radius: 50%;
		color: variables.$color-white;
		background-color: variables.$color-accent;
	}

	&__item-title {
		margin: 0 0 10px;
	}

	&__item-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}
}
</style>
