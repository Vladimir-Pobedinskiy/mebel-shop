<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		phrase: string
		result?: any
		isLoading?: boolean
		minPhraseLength?: number
		maxLengthPhrase?: number
	}>(),
	{
		result: null,
		isLoading: false,
		minPhraseLength: 2,
		maxLengthPhrase: 40,
	}
)
const emits = defineEmits<{
	(e: 'onSuggestBtnClick', value: any): void
}>()

const isOpenSuggest = ref<boolean>(true)

const isTooShort = computed(() => props.phrase.length > 0 && props.phrase.length < props.minPhraseLength)
const isTooLong = computed(() => props.phrase.length > props.maxLengthPhrase)
const isValidPhrase = computed(() => !isTooShort.value && !isTooLong.value && props.phrase.length > 0)
const hasResult = computed(() => Boolean(props.result && props.result.length))

const isActive = computed(() => isOpenSuggest.value && props.phrase.length > 0)

const handleSuggestBtnClick = (item: any) => {
	emits('onSuggestBtnClick', item)
	isOpenSuggest.value = false
}

// Подсказки снова раскрываются, как только фраза меняется после выбора
watch(
	() => [props.phrase, isOpenSuggest.value],
	([newPhrase], [oldPhrase, oldIsOpenSuggest]) => {
		if (oldIsOpenSuggest === false && newPhrase !== oldPhrase) {
			isOpenSuggest.value = true
		}
	},
	{
		deep: true,
	}
)
</script>

<template>
	<div :class="['suggest', { active: isActive }]">
		<div class="suggest__inner">
			<p v-if="isLoading" class="suggest__message text-s">Ищем совпадения…</p>
			<p v-else-if="isTooShort" class="suggest__message text-s">Введите минимум {{ minPhraseLength }} символа</p>
			<p v-else-if="isTooLong" class="suggest__message text-s">
				Максимальное количество символов: {{ maxLengthPhrase }}
			</p>
			<p v-else-if="isValidPhrase && !hasResult" class="suggest__message text-s">Совпадений не найдено…</p>

			<div v-else-if="isValidPhrase && hasResult" class="suggest__btns custom-scrollbar">
				<button
					v-for="item in result"
					:key="item.id"
					class="suggest__btn text-s"
					type="button"
					@click="handleSuggestBtnClick(item)"
				>
					{{ item.label }}
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.suggest {
	position: absolute;
	left: 0;
	top: calc(100% + 8px);
	z-index: 20;
	width: 100%;
	overflow: hidden;
	max-height: 0;
	opacity: 0;
	border-radius: variables.$radius-m;
	background-color: variables.$color-surface;
	box-shadow: variables.$shadow-soft;
	pointer-events: none;
	transition:
		max-height 0.4s ease-in-out,
		opacity 0.3s ease-in-out;

	&.active {
		max-height: 340px;
		opacity: 1;
		pointer-events: all;
	}

	&__inner {
		padding: 12px;
	}

	&__message {
		padding: 8px;
		color: variables.$color-ink-soft;
	}

	&__btns {
		overflow-y: auto;
		max-height: 300px;
		display: flex;
		flex-direction: column;
	}

	&__btn {
		padding: 10px 12px;
		width: 100%;
		display: block;
		border-radius: variables.$radius-s;
		background-color: transparent;
		color: variables.$color-ink;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-muted;
				color: variables.$color-accent;
			}
		}
	}
}
</style>
