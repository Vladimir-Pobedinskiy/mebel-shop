<script setup lang="ts">
import type { ICategoryFaqUnit } from '@/interfaces/catalog/ICategoryUnits'
import { useGsapReveal } from '@/composables/useGsapReveal'

const props = defineProps<{
	faqUnit: ICategoryFaqUnit
}>()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

/* FAQPage добавляется к страничным узлам, которые уже отдал usePageSeo:
   вопросы и ответы в разметке — те же, что видит пользователь */
useSchemaOrg([
	{
		'@type': 'FAQPage',
		mainEntity: props.faqUnit.items.map(item => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer },
		})),
	},
])

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-faq__item', { stagger: 0.06, y: 24 })
})
</script>

<template>
	<section ref="rootRef" class="category-faq">
		<div class="container">
			<div class="category-faq__inner">
				<div class="category-faq__head">
					<h2 class="category-faq__title h2">{{ faqUnit.title }}</h2>
					<p v-if="faqUnit.text" class="category-faq__text text-m">{{ faqUnit.text }}</p>
				</div>

				<div class="category-faq__list">
					<div v-for="item in faqUnit.items" :key="item.question" class="category-faq__item">
						<UIAccordion :title="item.question">
							<template #content>
								<p class="category-faq__answer text-m">{{ item.answer }}</p>
							</template>
						</UIAccordion>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-faq {
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
