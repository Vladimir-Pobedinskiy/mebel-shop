<script setup lang="ts">
import type { IFaqItem } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'

withDefaults(
	defineProps<{
		items: IFaqItem[]
		title?: string
		text?: string
	}>(),
	{
		title: 'Частые вопросы',
		text: '',
	}
)

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.content-faq__item', { stagger: 0.06, y: 24 })
})
</script>

<template>
	<section ref="rootRef" class="content-faq">
		<div class="content-faq__inner">
			<div class="content-faq__head">
				<h2 class="content-faq__title h2">{{ title }}</h2>
				<p v-if="text" class="content-faq__text text-m">{{ text }}</p>
			</div>

			<div class="content-faq__list">
				<div v-for="item in items" :key="item.question" class="content-faq__item">
					<UIAccordion :title="item.question">
						<template #content>
							<p class="content-faq__answer text-m">{{ item.answer }}</p>
						</template>
					</UIAccordion>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.content-faq {
	&__inner {
		display: grid;
		gap: 24px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
			gap: 48px;
		}
	}

	&__head {
		@media (min-width: variables.$desktop-small) {
			position: sticky;
			top: 120px;
		}
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		border-top: 1px solid variables.$color-line;
	}

	&__answer {
		max-width: 780px;
		margin: 0 0 20px;
		color: variables.$color-ink-soft;
	}
}
</style>
