<script setup lang="ts">
import type { Component } from 'vue'
import { NuxtLink } from '#components'
import { useScreenHandler } from '@/composables/useScreenHandler'
import { screens } from '@/utils/utils'

const { isMatchedScreen } = useScreenHandler(screens.desktop)

const props = withDefaults(
	defineProps<{
		as: 'button' | 'NuxtLink' | 'a' | 'span' | Component
		/** для <NuxtLink> */
		to?: string
		/** для <a> */
		href?: string
		target?: string
		/** для <button> */
		type?: 'button' | 'submit'
		/** вариант отображения */
		variant?: 'primary' | 'secondary'
		/** 'accent' | 'green' | 'dark' | 'white' | 'transparent' */
		color?: string
		/** размер */
		size?: 'small' | 'big'
		/** для отображения на всю ширину */
		full?: boolean
		/** aria-label */
		ariaLabel?: string
		/** строковый контент */
		label?: string
		hiddenLabel?: boolean
		showIcon?: boolean
		/** имя иконки из assets/icons */
		icon?: string
		download?: boolean
		disabled?: boolean
	}>(),
	{
		type: 'button',
		to: undefined,
		href: undefined,
		target: undefined,
		variant: 'primary',
		color: 'accent',
		size: 'big',
		full: false,
		ariaLabel: '',
		label: '',
		hiddenLabel: false,
		showIcon: false,
		icon: 'icon-arrow-right',
		download: false,
		disabled: false,
	}
)
const emits = defineEmits<{
	(e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
	if (props.as !== 'button') return

	if (props.disabled) {
		event.preventDefault()
	} else {
		emits('click', event)
	}
}

// Схлопывающаяся подпись: раскрывается по наведению, только на десктопе
const isShowLabel = ref<boolean>(false)
if (props.hiddenLabel) isShowLabel.value = false
const show = () => {
	isShowLabel.value = true
}
const hidden = () => {
	isShowLabel.value = false
}
</script>

<template>
	<Component
		:is="as === 'NuxtLink' ? NuxtLink : as"
		:class="[`btn-${variant}`, `btn-${variant}_${color}`, `${size}`, { full: full }, { disabled: disabled }]"
		:to="as === 'NuxtLink' ? to : undefined"
		:href="as === 'a' ? href : undefined"
		:target="as === 'a' && target ? target : undefined"
		:type="as === 'button' ? type : undefined"
		:aria-label="ariaLabel ? ariaLabel : undefined"
		:download="as === 'a' && download ? download : undefined"
		:disabled="as !== 'span' ? disabled : undefined"
		@click="onClick"
		@mouseenter="hiddenLabel && isMatchedScreen && show()"
		@mouseleave="hiddenLabel && isMatchedScreen && hidden()"
	>
		<span v-if="label" :class="['label button-typo', { hidden: hiddenLabel && !isShowLabel }]">{{ label }}</span>
		<template v-if="$slots.content">
			<slot name="content" />
		</template>
		<template v-else>
			<NuxtIcon
				v-if="showIcon"
				:style="{ marginLeft: label && !(hiddenLabel && !isShowLabel) ? '10px' : '0px' }"
				class="btn-icon"
				:name="icon"
				filled
			/>
		</template>
	</Component>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.btn-primary,
.btn-secondary {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	text-align: center;
	pointer-events: all;
	border: 1px solid transparent;
	border-radius: 999px;
	transition: all 0.4s ease-in-out;
	will-change: transform;

	@media (min-width: variables.$tablet) {
		width: fit-content;
	}

	&.big {
		height: 48px;
		padding: 12px 22px;

		@media (min-width: variables.$desktop) {
			height: 52px;
			padding: 14px 28px;
		}
	}

	&.small {
		height: 40px;
		padding: 8px 16px;
	}

	&.full {
		width: 100%;
	}

	.label {
		display: block;
		width: fit-content;
		max-width: 100%;
		white-space: nowrap;
		transition: all 0.4s ease-in-out;
		will-change: max-width;

		&.hidden {
			max-width: 0;
			opacity: 0;
			transition: all 0.4s ease-in-out;
		}
	}

	.btn-icon {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}
}

/* Заливка */
.btn-primary {
	color: variables.$color-white;
	background-color: variables.$color-accent;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			cursor: pointer;
			background-color: variables.$color-accent-hover;
			box-shadow: variables.$shadow-soft;
			transform: translateY(-2px);
		}
	}

	&:active {
		transform: translateY(0);
	}

	&_green {
		background-color: variables.$color-accent-2;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-accent-2-hover;
			}
		}
	}

	&_dark {
		background-color: variables.$color-ink;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-accent;
			}
		}
	}

	&_white {
		color: variables.$color-ink;
		background-color: variables.$color-surface;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-accent;
			}
		}
	}

	&_transparent {
		color: variables.$color-ink;
		background-color: transparent;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-ink;
				background-color: variables.$color-muted;
			}
		}
	}
}

/* Обводка */
.btn-secondary {
	color: variables.$color-ink;
	background-color: transparent;
	border-color: variables.$color-line-strong;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			color: variables.$color-accent;
			cursor: pointer;
			border-color: variables.$color-accent;
		}
	}

	&_accent {
		color: variables.$color-accent;
		border-color: variables.$color-accent;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-accent;
			}
		}
	}

	&_green {
		color: variables.$color-accent-2;
		border-color: variables.$color-accent-2;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-accent-2;
			}
		}
	}

	&_dark {
		color: variables.$color-ink;
		border-color: variables.$color-ink;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-ink;
			}
		}
	}

	&_white {
		color: variables.$color-white;
		border-color: variables.$color-white;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-ink;
				background-color: variables.$color-white;
			}
		}
	}

	&_transparent {
		color: variables.$color-ink;
		border-color: transparent;
	}
}

/* Отключённое состояние — в конце, чтобы не нарушать порядок специфичности */
.btn-primary.disabled,
.btn-primary:disabled,
.btn-secondary.disabled,
.btn-secondary:disabled {
	pointer-events: none;
	cursor: default;
	opacity: 0.45;
}
</style>
