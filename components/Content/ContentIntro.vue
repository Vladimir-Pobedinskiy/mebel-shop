<script setup lang="ts">
import type { IBreadcrumb } from '@/interfaces/IBreadcrumb'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

withDefaults(
	defineProps<{
		breadcrumbs: IBreadcrumb[]
		title: string
		text?: string
		/** мелкая подпись над заголовком */
		subtitle?: string
	}>(),
	{
		text: '',
		subtitle: '',
	}
)

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.content-intro__text', { y: 20, opacity: 0 })

		const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.05 })

		timeline.to('.content-intro__text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
	})
})
</script>

<template>
	<div ref="rootRef" class="content-intro">
		<UIBreadcrumbs v-if="breadcrumbs?.length" class="content-intro__breadcrumbs" :breadcrumbs="breadcrumbs" />

		<p v-if="subtitle" class="content-intro__subtitle card-subtitle">{{ subtitle }}</p>

		<h1 ref="titleRef" class="content-intro__title h1">{{ title }}</h1>

		<p v-if="text" class="content-intro__text text-l">{{ text }}</p>

		<div v-if="$slots.content" class="content-intro__slot">
			<slot name="content" />
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.content-intro {
	margin-bottom: 32px;

	@media (min-width: variables.$desktop) {
		margin-bottom: 56px;
	}

	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__subtitle {
		margin: 0 0 10px;
		color: variables.$color-accent;
	}

	&__title {
		max-width: 900px;
		margin: 0;
	}

	&__text {
		max-width: 760px;
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}

	&__slot {
		margin-top: 24px;
	}
}
</style>
