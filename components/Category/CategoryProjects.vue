<script setup lang="ts">
import type { ICategoryProjectsUnit } from '@/interfaces/catalog/ICategoryUnits'
import { useGLightbox } from '@/composables/useGLightbox'
import { useGsapReveal } from '@/composables/useGsapReveal'

defineProps<{
	projectsUnit: ICategoryProjectsUnit
}>()

useGLightbox()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.category-projects__item', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<section ref="rootRef" class="category-projects">
		<div class="container">
			<div class="category-projects__head">
				<div class="category-projects__head-body">
					<h2 class="category-projects__title h2">{{ projectsUnit.title }}</h2>
					<p v-if="projectsUnit.text" class="category-projects__text text-m">{{ projectsUnit.text }}</p>
				</div>

				<UIButton
					v-if="projectsUnit.link"
					class="category-projects__link"
					as="NuxtLink"
					:to="projectsUnit.link.url"
					:label="projectsUnit.link.label"
					variant="secondary"
					show-icon
				/>
			</div>

			<ul class="category-projects__list">
				<li v-for="img in projectsUnit.gallery" :key="img.url" class="category-projects__item">
					<a
						class="category-projects__media glightbox"
						:href="img.url"
						data-gallery="category-projects"
						:aria-label="`Открыть фото: ${img.alt}`"
					>
						<NuxtImg
							class="category-projects__img"
							:src="img.url"
							:alt="img.alt"
							loading="lazy"
							format="webp"
							sizes="xs:90vw sm:90vw md:45vw lg:33vw xl:33vw"
						/>
					</a>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-projects {
	&__head {
		display: flex;
		flex-direction: column;
		margin-bottom: 28px;
		gap: 20px;

		@media (min-width: variables.$tablet) {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			gap: 32px;
		}
	}

	&__head-body {
		max-width: 760px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__link {
		flex: 0 0 auto;
	}

	&__list {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	&__item {
		display: flex;
	}

	&__media {
		display: block;
		overflow: hidden;
		width: 100%;
		border-radius: variables.$radius-m;
		background-color: variables.$color-muted;
	}

	&__img {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		transition: transform 0.6s ease-in-out;
	}

	@media (min-width: variables.$desktop-small) {
		&__media:hover &__img {
			transform: scale(1.05);
		}
	}
}
</style>
