<script setup lang="ts">
import type { IProjectPage } from '~~/interfaces/portfolio/IPortfolioPage'
import { useGsapReveal } from '@/composables/useGsapReveal'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error, status } = await useAsyncData(
	() => `portfolio-project-${slug.value}`,
	async () => $fetch<IProjectPage>(`/api/portfolio/${slug.value}/`),
	{ watch: [slug] }
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Проект не найден',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const factsRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(factsRef.value, '.project-facts__item', { stagger: 0.06, y: 24 })
})
</script>

<template>
	<div class="project-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.project.title"
					:text="data.project.description"
					:subtitle="data.project.categoryLabel"
				>
					<template #content>
						<dl v-if="data.project.facts?.length" ref="factsRef" class="project-facts">
							<div v-for="fact in data.project.facts" :key="fact.label" class="project-facts__item">
								<dt class="project-facts__label text-xs">{{ fact.label }}</dt>
								<dd class="project-facts__value text-m">{{ fact.value }}</dd>
							</div>
						</dl>
					</template>
				</ContentIntro>

				<PortfolioGallery
					class="project-page__gallery"
					:gallery="data.project.gallery"
					:title="data.project.title"
				/>

				<div class="project-page__body">
					<section v-if="data.project.tasks?.length" class="project-tasks">
						<h2 class="project-tasks__title h3">Задача</h2>

						<ul class="project-tasks__list">
							<li v-for="task in data.project.tasks" :key="task" class="project-tasks__item text-m">{{ task }}</li>
						</ul>
					</section>

					<section class="project-solution">
						<h2 class="project-solution__title h3">Решение</h2>

						<div class="project-solution__content user-content text-m" v-html="data.project.solution" />
					</section>
				</div>

				<section v-if="data.related?.length" class="project-page__related">
					<div class="project-page__related-head">
						<h2 class="project-page__related-title h2">Другие проекты</h2>

						<UIButton as="NuxtLink" to="/portfolio/" variant="secondary" color="dark" size="small" label="Все работы" />
					</div>

					<ul class="project-page__related-list">
						<li v-for="project in data.related" :key="project.slug" class="project-page__related-item">
							<PortfolioCard :project="project" />
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.project-page {
	&__gallery {
		margin-top: 32px;

		@media (min-width: variables.$desktop) {
			margin-top: 48px;
		}
	}

	&__body {
		display: grid;
		gap: 32px;
		margin-top: 48px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: 1fr 1.6fr;
			gap: 48px;
			align-items: start;
		}

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}

	&__related {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}

	&__related-head {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;
	}

	&__related-title {
		margin: 0;
	}

	&__related-list {
		display: grid;
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: repeat(3, 1fr);
			gap: 20px;
		}
	}
}

.project-facts {
	display: grid;
	gap: 16px;
	margin: 0;

	@media (min-width: variables.$mobile-big) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: variables.$desktop-small) {
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	&__item {
		padding-top: 14px;
		border-top: 1px solid variables.$color-line;
	}

	&__label {
		margin: 0 0 4px;
		color: variables.$color-ink-soft;
	}

	&__value {
		margin: 0;
	}
}

.project-tasks {
	padding: 24px;
	border-radius: variables.$radius-m;
	background-color: variables.$color-muted;

	&__title {
		margin: 0 0 16px;
	}

	&__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	&__item {
		position: relative;
		padding-left: 22px;
		color: variables.$color-ink-soft;

		&::before {
			content: '';
			position: absolute;
			top: 10px;
			left: 0;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: variables.$color-accent;
		}

		& + & {
			margin-top: 12px;
		}
	}
}

.project-solution {
	&__title {
		margin: 0 0 16px;
	}

	&__content {
		max-width: 760px;
	}
}
</style>
