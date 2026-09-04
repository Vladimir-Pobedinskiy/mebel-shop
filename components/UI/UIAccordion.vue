<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		title: string
		/** открыт ли пункт при монтировании */
		defaultOpen?: boolean
		/** компактный вид — для фильтров каталога */
		isCompact?: boolean
		disabled?: boolean
	}>(),
	{
		defaultOpen: false,
		isCompact: false,
		disabled: false,
	}
)
const emits = defineEmits<{
	(e: 'toggle', value: boolean): void
}>()

const isOpen = ref<boolean>(props.defaultOpen)
const bodyRef = ref<HTMLElement | null>(null)

// Высота считается по контенту — так работает плавное раскрытие без фиксированных значений
const bodyHeight = computed(() => (isOpen.value ? `${bodyRef.value?.scrollHeight ?? 0}px` : '0px'))

const toggle = () => {
	if (props.disabled) return
	isOpen.value = !isOpen.value
	emits('toggle', isOpen.value)
}
</script>

<template>
	<div :class="['accordion', { accordion_open: isOpen }, { accordion_compact: isCompact }]">
		<button class="accordion__head" type="button" :aria-expanded="isOpen" :disabled="disabled" @click="toggle">
			<span :class="['accordion__title', isCompact ? 'title-14' : 'h4']">{{ title }}</span>
			<span class="accordion__icon-wrapper">
				<NuxtIcon class="accordion__icon" name="icon-caret" filled />
			</span>
		</button>

		<div class="accordion__body" :style="{ height: bodyHeight }">
			<div ref="bodyRef" class="accordion__body-inner">
				<slot name="content" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.accordion {
	border-bottom: 1px solid variables.$color-line;

	&__head {
		padding: 20px 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		background-color: transparent;
		color: variables.$color-ink;
		text-align: left;
		cursor: pointer;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
			pointer-events: none;
		}
	}

	&__icon-wrapper {
		width: 32px;
		min-width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid variables.$color-line;
		border-radius: 50%;
		transition: transform 0.4s ease-in-out;
	}

	&__icon {
		width: 12px;
		height: 12px;
	}

	&__body {
		overflow: hidden;
		height: 0;
		transition: height 0.4s ease-in-out;
	}

	&__body-inner {
		padding-bottom: 20px;
		color: variables.$color-ink-soft;
	}

	&_open {
		.accordion__icon-wrapper {
			transform: rotate(180deg);
			border-color: variables.$color-accent;
			color: variables.$color-accent;
		}
	}

	&_compact {
		.accordion__head {
			padding: 14px 0;
		}

		.accordion__icon-wrapper {
			width: 24px;
			min-width: 24px;
			height: 24px;
			border-color: transparent;
		}
	}
}
</style>
