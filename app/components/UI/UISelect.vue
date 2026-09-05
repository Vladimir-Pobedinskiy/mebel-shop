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
	font-family: variables.$font;
	color: variables.$color-ink;

	&__tags {
		min-height: 52px;
		padding: 15px 40px 0 16px;
		font-size: 14px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
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
			background-color: variables.$color-surface;
			border-color: variables.$color-line;
		}
	}

	&.secondary {
		.multiselect__tags {
			background-color: variables.$color-muted;
			border-color: transparent;
		}
	}

	&__placeholder,
	&__single,
	&__input {
		padding-left: 0;
		margin-bottom: 8px;
		font-size: 14px;
		line-height: 1.4;
		color: variables.$color-ink;
		background-color: transparent;
	}

	&__placeholder {
		color: variables.$color-ink-soft;
	}

	&__content-wrapper {
		margin-top: 6px;
		overflow-x: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-s;
		box-shadow: variables.$shadow-soft;
	}

	&__option {
		min-height: 44px;
		padding: 12px 16px;
		font-size: 14px;
		white-space: normal;

		&--highlight {
			color: variables.$color-ink;
			background-color: variables.$color-muted;

			&::after {
				display: none;
			}
		}

		&--selected {
			font-weight: 600;
			color: variables.$color-accent;
			background-color: variables.$color-accent-soft;

			&::after {
				display: none;
			}
		}
	}

	&--disabled {
		pointer-events: none;
		background-color: transparent;
		opacity: 0.6;
	}
}

.select-caret-icon {
	position: absolute;
	top: 50%;
	right: 14px;
	width: 16px;
	height: 16px;
	color: variables.$color-ink-soft;
	pointer-events: none;
	transform: translateY(-50%);
	transition: transform 0.3s ease-in-out;
}

.multiselect--active .select-caret-icon {
	transform: translateY(-50%) rotate(180deg);
}
</style>
