<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(
	defineProps<{
		modelValue: string
		placeholder: string
		isLoading?: boolean
		variant?: 'dark' | 'light'
	}>(),
	{
		variant: 'light',
		isLoading: false,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue' | 'submit', value: string): void
}>()

const debouncedModelValue = useDebounceFn((value: string) => {
	emits('update:modelValue', value)
}, 300)

const modelValue = computed({
	get: () => props.modelValue,
	set: value => {
		if (typeof value !== 'undefined') {
			debouncedModelValue(value)
		}
	},
})

const onSubmit = () => {
	if (modelValue.value && modelValue.value.length > 2) {
		emits('update:modelValue', modelValue.value)
		emits('submit', modelValue.value)
	}
}
const onClear = () => {
	emits('update:modelValue', '')
}
</script>

<template>
	<div class="search-ui">
		<label :class="['search-ui__label', { 'search-ui__label_disabled': isLoading }]">
			<span class="visually-hidden">{{ placeholder }}</span>
			<input
				v-model="modelValue"
				:placeholder="placeholder"
				:class="['search-ui__input input-text', `search-ui__input_${variant}`]"
				type="search"
				name="phrase"
				autocomplete="off"
				@keydown.enter="onSubmit"
			/>

			<template v-if="modelValue">
				<button
					class="search-ui__btn-clear"
					type="button"
					aria-label="Очистить поисковый запрос"
					:disabled="isLoading"
					@click="onClear"
				>
					<NuxtIcon class="search-ui__btn-clear-icon" name="icon-close" filled />
				</button>
			</template>
			<template v-else>
				<NuxtIcon class="search-ui__search-icon" name="icon-search" filled />
			</template>

			<slot name="suggest" />
		</label>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.search-ui {
	width: 100%;

	&__label {
		position: relative;
		display: block;
		width: 100%;

		&_disabled {
			opacity: 0.6;
			pointer-events: none;
		}
	}

	&__input {
		padding: 14px 48px 14px 20px;
		width: 100%;
		height: 52px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		transition:
			border-color 0.4s ease-in-out,
			box-shadow 0.4s ease-in-out;

		&::-webkit-search-cancel-button {
			appearance: none;
		}

		&:focus {
			outline: transparent;
			border-color: variables.$color-accent;
			box-shadow: 0 0 0 3px variables.$color-accent-soft;
		}

		&_light {
			background-color: variables.$color-surface;
			color: variables.$color-ink;
		}

		&_dark {
			border-color: rgba(255 255 255 / 25%);
			background-color: rgba(255 255 255 / 8%);
			color: variables.$color-white;

			&::placeholder {
				color: rgba(255 255 255 / 60%);
			}
		}
	}

	&__search-icon,
	&__btn-clear {
		position: absolute;
		right: 18px;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		color: variables.$color-ink-soft;
	}

	&__btn-clear {
		cursor: pointer;
	}

	&__search-icon {
		pointer-events: none;
	}

	&__btn-clear-icon {
		width: 12px;
		height: 12px;
	}
}
</style>
