<script setup lang="ts">
import type { IProjectPreview } from '~~/interfaces/portfolio/IPortfolioPage'

const props = defineProps<{
	projects: IProjectPreview[]
	categories: { slug: string; label: string }[]
}>()

const route = useRoute()
const router = useRouter()

/* Активный тип объекта живёт в query — ссылку на отфильтрованную подборку можно переслать */
const activeCategory = computed(() => String(route.query.type || 'all'))

const setCategory = (slug: string) => {
	const query = Object.assign({}, route.query, { type: slug })
	if (slug === 'all') delete query.type

	router.push({ query })
}

const visibleProjects = computed(() => {
	if (activeCategory.value === 'all') return props.projects

	return props.projects.filter(project => project.category === activeCategory.value)
})

const categoryCount = (slug: string) => {
	if (slug === 'all') return props.projects.length

	return props.projects.filter(project => project.category === slug).length
}
</script>

<template>
	<div class="portfolio-grid">
		<div class="portfolio-grid__filters">
			<button
				v-for="category in categories"
				:key="category.slug"
				:class="['portfolio-grid__filter', { 'portfolio-grid__filter_active': activeCategory === category.slug }]"
				type="button"
				:aria-pressed="activeCategory === category.slug"
				@click="setCategory(category.slug)"
			>
				<span class="button-typo">{{ category.label }}</span>
				<span class="portfolio-grid__filter-count text-xs">{{ categoryCount(category.slug) }}</span>
			</button>
		</div>

		<ul v-if="visibleProjects.length" v-auto-animate class="portfolio-grid__list">
			<li v-for="project in visibleProjects" :key="project.slug" class="portfolio-grid__item">
				<PortfolioCard :project="project" />
			</li>
		</ul>

		<UIEmptyState
			v-else
			class="portfolio-grid__empty"
			title="В этой категории пока пусто"
			text="Покажем проекты других типов — там тоже есть на что посмотреть."
			icon="icon-search"
			link-url="/portfolio/"
			link-label="Все проекты"
		/>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.portfolio-grid {
	&__filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 28px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__filter {
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

	&__filter-count {
		opacity: 0.6;
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

	&__empty {
		margin: 40px 0;
	}
}
</style>
