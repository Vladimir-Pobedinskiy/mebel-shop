<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

withDefaults(
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
</script>

<template>
	<!-- Раскрытие держит Disclosure: состояние и aria-атрибуты его, высоту тела анимирует
	     auto-animate. Своей высоты не считаем — замер ломался, когда контент менял размер
	     или когда группа рендерилась в ещё не разложенной модалке фильтров. -->
	<Disclosure
		v-slot="{ open }"
		as="div"
		:default-open="defaultOpen"
		:class="['accordion', { accordion_open: open, accordion_compact: isCompact }]"
	>
		<div v-auto-animate="{ duration: 300 }" class="accordion__inner">
			<DisclosureButton class="accordion__head" :disabled="disabled" @click="emits('toggle', !open)">
				<span :class="['accordion__title', isCompact ? 'title-14' : 'h4']">{{ title }}</span>
				<span class="accordion__icon-wrapper">
					<NuxtIcon class="accordion__icon" name="icon-caret" filled />
				</span>
			</DisclosureButton>

			<DisclosurePanel as="div" class="accordion__body">
				<div class="accordion__body-inner">
					<slot name="content" />
				</div>
			</DisclosurePanel>
		</div>
	</Disclosure>
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
