<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		/** Целиком объект select */
		select: any
		modelValue: any
		placeholder: string
		/** Название поля в объекте опции, которое будет отображаться как текст */
		label: string
		/** Уникальное поле в объекте опции для идентификации "id" или другое уникальное поле */
		trackBy: string
		/** Автоматически закрывает dropdown после выбора */
		closeOnSelect?: boolean
		/** Включает поиск по опциям */
		searchable?: boolean
		/** Очищать ли поисковый запрос после выбора */
		clearOnSelect?: boolean
		/** Разрешить множественный выбор */
		multiple?: boolean
		/** Отключает отображение меток у выбранных элементов */
		showLabels?: boolean
		/** Убирает указатель при наведении на опции */
		showPointer?: boolean
		/** Контролирует возможность сброса выбранного значения (false — скрывает иконку очистки) */
		allowEmpty?: boolean
		/** variant */
		variant?: 'primary' | 'secondary'
		isLoading?: boolean
	}>(),
	{
		closeOnSelect: true,
		clearOnSelect: false,
		searchable: false,
		multiple: false,
		showLabels: false,
		showPointer: true,
		allowEmpty: false,
		variant: 'primary',
		isLoading: false,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue', value: any): void
}>()

const modelValue = computed({
	get: () => props.modelValue,
	set: value => {
		if (value !== null) {
			emits('update:modelValue', value)
		}
	},
})
</script>

<template>
	<VueMultiselect
		v-model="modelValue"
		:options="select.options"
		:placeholder="placeholder"
		:label="label"
		:track-by="trackBy"
		:close-on-select="closeOnSelect"
		:searchable="searchable"
		:clear-on-select="clearOnSelect"
		:multiple="multiple"
		:show-labels="showLabels"
		:show-pointer="showPointer"
		:allow-empty="allowEmpty"
		:class="variant"
		:disabled="select.disabled || isLoading"
	>
		<template #caret>
			<NuxtIcon class="select-caret-icon" name="icon-caret" filled />
		</template>
		<template #noResult>
			<span class="text-s">Ничего не найдено</span>
		</template>
	</VueMultiselect>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.multiselect {
	min-height: 52px;
	color: variables.$color-ink;
	font-family: variables.$font;

	&__tags {
		padding: 15px 40px 0 16px;
		min-height: 52px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
		font-size: 14px;
		transition:
			border-color 0.4s ease-in-out,
			box-shadow 0.4s ease-in-out;
	}

	&--active .multiselect__tags {
		border-color: variables.$color-accent;
		box-shadow: 0 0 0 3px variables.$color-accent-soft;
	}

	&.primary {
		.multiselect__tags {
			border-color: variables.$color-line;
			background-color: variables.$color-surface;
		}
	}

	&.secondary {
		.multiselect__tags {
			border-color: transparent;
			background-color: variables.$color-muted;
		}
	}

	&__placeholder,
	&__single,
	&__input {
		margin-bottom: 8px;
		padding-left: 0;
		background-color: transparent;
		color: variables.$color-ink;
		font-size: 14px;
		line-height: 1.4;
	}

	&__placeholder {
		color: variables.$color-ink-soft;
	}

	&__content-wrapper {
		margin-top: 6px;
		overflow-x: hidden;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
		background-color: variables.$color-surface;
		box-shadow: variables.$shadow-soft;
	}

	&__option {
		padding: 12px 16px;
		min-height: 44px;
		font-size: 14px;
		white-space: normal;

		&--highlight {
			background-color: variables.$color-muted;
			color: variables.$color-ink;

			&::after {
				display: none;
			}
		}

		&--selected {
			background-color: variables.$color-accent-soft;
			color: variables.$color-accent;
			font-weight: 600;

			&::after {
				display: none;
			}
		}
	}

	&--disabled {
		opacity: 0.6;
		background-color: transparent;
		pointer-events: none;
	}
}

.select-caret-icon {
	position: absolute;
	right: 14px;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	color: variables.$color-ink-soft;
	pointer-events: none;
	transition: transform 0.3s ease-in-out;
}

.multiselect--active .select-caret-icon {
	transform: translateY(-50%) rotate(180deg);
}
</style>
