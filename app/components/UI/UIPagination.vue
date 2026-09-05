<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		pageTotal: number
		/** показывать кнопку «Показать ещё» */
		showMore?: boolean
		disabled?: boolean
	}>(),
	{
		showMore: true,
		disabled: false,
	}
)
const emits = defineEmits<{
	(e: 'more', value: number): void
}>()

const route = useRoute()
const router = useRouter()
const currentPage = computed(() => Number(route.query.page || '1'))

// Список страниц с многоточиями: 1 … 4 5 6 … 20
const croppedPages = computed(() => {
	if (props.pageTotal <= 1 || props.pageTotal === undefined) return [1]

	const numbersList: number[] = []
	const numbersListWithDots: (number | string)[] = []
	const offset = 2
	const offsetNumber = currentPage.value <= offset || currentPage.value > props.pageTotal - offset ? offset : offset - 1

	numbersList.push(1)
	for (let i = currentPage.value - offsetNumber; i <= currentPage.value + offsetNumber; i++) {
		if (i < props.pageTotal && i > 1) {
			numbersList.push(i)
		}
	}
	if (props.pageTotal > 1) {
		numbersList.push(props.pageTotal)
	}

	numbersList.reduce((accumulator, currentValue) => {
		if (accumulator === 1) {
			numbersListWithDots.push(accumulator)
		}
		if (currentValue - accumulator !== 1) {
			numbersListWithDots.push('...')
		}
		numbersListWithDots.push(currentValue)

		return currentValue
	})

	return numbersListWithDots
})

const onPage = (n: number | string) => {
	if (n === '...') return

	const query = Object.assign({}, route.query, { page: n })
	if (Number(n) === 1) delete query.page

	router.push({ query })
}
const onPrevious = () => {
	if (currentPage.value <= 1) return
	onPage(currentPage.value - 1)
}
const onNext = () => {
	if (currentPage.value >= props.pageTotal) return
	onPage(currentPage.value + 1)
}
const onMore = () => {
	emits('more', currentPage.value + 1)
}
</script>

<template>
	<div v-if="pageTotal > 1" class="pagination">
		<UIButton
			v-if="showMore && currentPage < pageTotal"
			class="pagination__btn-more"
			as="button"
			type="button"
			variant="secondary"
			color="dark"
			size="big"
			label="Показать ещё"
			:disabled="disabled"
			@click="onMore"
		/>

		<nav class="pagination__pages" aria-label="Постраничная навигация">
			<button
				class="pagination__arrow"
				type="button"
				aria-label="Предыдущая страница"
				:disabled="disabled || currentPage <= 1"
				@click="onPrevious"
			>
				<NuxtIcon class="pagination__arrow-icon" name="icon-arrow-pagination" filled />
			</button>

			<ul class="pagination__list">
				<li v-for="(page, index) in croppedPages" :key="`${page}-${index}`">
					<button
						v-if="page !== '...'"
						:class="['pagination__page text-s', { active: Number(page) === currentPage }]"
						type="button"
						:aria-label="`Страница ${page}`"
						:aria-current="Number(page) === currentPage ? 'page' : undefined"
						:disabled="disabled"
						@click="onPage(page)"
					>
						{{ page }}
					</button>
					<span v-else class="pagination__dots text-s">…</span>
				</li>
			</ul>

			<button
				class="pagination__arrow pagination__arrow_next"
				type="button"
				aria-label="Следующая страница"
				:disabled="disabled || currentPage >= pageTotal"
				@click="onNext"
			>
				<NuxtIcon class="pagination__arrow-icon" name="icon-arrow-pagination" filled />
			</button>
		</nav>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.pagination {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24px;

	&__pages {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	&__list {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	&__page,
	&__arrow {
		min-width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		border-radius: 50%;
		background-color: transparent;
		color: variables.$color-ink;
		cursor: pointer;
		transition:
			background-color 0.3s ease-in-out,
			border-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-muted;
			}
		}
	}

	&__arrow-icon {
		width: 14px;
		height: 14px;
	}

	&__page {
		&.active {
			background-color: variables.$color-accent;
			color: variables.$color-white;
			pointer-events: none;
		}
	}

	&__arrow {
		border-color: variables.$color-line;

		&_next .pagination__arrow-icon {
			transform: rotate(180deg);
		}
	}

	&__dots {
		min-width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: variables.$color-ink-soft;
	}

	&__page:disabled,
	&__arrow:disabled {
		opacity: 0.35;
		cursor: default;
		pointer-events: none;
	}
}
</style>
