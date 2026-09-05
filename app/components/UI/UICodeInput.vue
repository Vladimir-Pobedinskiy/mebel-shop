<script setup lang="ts">
/* Поле разового кода: отдельная ячейка на символ, с переходом вперёд по вводу
   и назад по Backspace. Написано своими силами — готовые пакеты тянут за собой
   зависимость ради полусотни строк. */
const props = withDefaults(
	defineProps<{
		length?: number
		errorValue?: string
		disabled?: boolean
	}>(),
	{
		length: 4,
		errorValue: '',
		disabled: false,
	}
)

const value = defineModel<string>('value', { default: '' })

const inputs = ref<HTMLInputElement[]>([])

// Ячейки читаются из общей строки: она и есть источник истины
const cells = computed(() => Array.from({ length: props.length }, (_, index) => value.value[index] ?? ''))

const focusCell = (index: number) => {
	const target = inputs.value[Math.min(Math.max(index, 0), props.length - 1)]
	target?.focus()
	target?.select()
}

const writeCell = (index: number, char: string) => {
	const next = cells.value.slice()
	next[index] = char
	value.value = next.join('').trimEnd()
}

const onInput = (index: number, event: Event) => {
	const target = event.target as HTMLInputElement
	// Из вставки или быстрого набора берём только цифры
	const digits = target.value.replace(/\D/g, '')

	if (!digits) {
		target.value = ''
		writeCell(index, '')
		return
	}

	// Вставили сразу весь код — раскладываем по ячейкам от текущей
	if (digits.length > 1) {
		const next = cells.value.slice()
		digits.split('').forEach((char, offset) => {
			if (index + offset < props.length) next[index + offset] = char
		})
		value.value = next.join('').trimEnd()
		focusCell(index + digits.length)
		return
	}

	writeCell(index, digits)
	target.value = digits
	focusCell(index + 1)
}

const onKeydown = (index: number, event: KeyboardEvent) => {
	if (event.key === 'Backspace' && !cells.value[index]) {
		event.preventDefault()
		writeCell(index - 1, '')
		focusCell(index - 1)
		return
	}

	if (event.key === 'ArrowLeft') {
		event.preventDefault()
		focusCell(index - 1)
	}

	if (event.key === 'ArrowRight') {
		event.preventDefault()
		focusCell(index + 1)
	}
}

const focus = () => focusCell(0)

defineExpose({ focus })
</script>

<template>
	<div :class="['code-input', { 'code-input_error': errorValue }]">
		<div class="code-input__cells">
			<input
				v-for="(cell, index) in cells"
				:key="index"
				ref="inputs"
				:value="cell"
				class="code-input__cell"
				type="text"
				inputmode="numeric"
				autocomplete="one-time-code"
				maxlength="1"
				:aria-label="`Символ кода ${index + 1}`"
				:disabled="disabled"
				@input="onInput(index, $event)"
				@keydown="onKeydown(index, $event)"
				@focus="($event.target as HTMLInputElement).select()"
			/>
		</div>

		<span v-if="errorValue" class="code-input__error text-xs">{{ errorValue }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.code-input {
	&__cells {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	&__cell {
		width: 56px;
		height: 64px;
		padding: 0;
		font-family: variables.$font-secondary;
		font-size: 28px;
		color: variables.$color-ink;
		text-align: center;
		outline: none;
		background-color: variables.$color-bg;
		border: 1px solid variables.$color-line-strong;
		border-radius: variables.$radius-m;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;

		&:focus {
			border-color: variables.$color-accent;
			box-shadow: 0 0 0 3px variables.$color-accent-soft;
		}

		&:disabled {
			opacity: 0.5;
		}
	}

	&_error {
		.code-input__cell {
			border-color: variables.$color-error;
		}
	}

	&__error {
		display: block;
		margin-top: 8px;
		color: variables.$color-error;
		text-align: center;
	}
}
</style>
