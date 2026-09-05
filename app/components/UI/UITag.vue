<script setup lang="ts">
withDefaults(
	defineProps<{
		label: string
		/** 'light' | 'accent' | 'green' | 'outline' */
		color?: string
		removable?: boolean
	}>(),
	{
		color: 'light',
		removable: false,
	}
)
const emits = defineEmits<{
	(e: 'remove'): void
}>()
</script>

<template>
	<div :class="['tag', `tag_${color}`]">
		<span class="tag__label tag-typo">{{ label }}</span>

		<button
			v-if="removable"
			class="tag__remove"
			type="button"
			:aria-label="`Убрать «${label}»`"
			@click="emits('remove')"
		>
			<NuxtIcon class="tag__remove-icon" name="icon-close" filled />
		</button>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.tag {
	display: flex;
	gap: 6px;
	align-items: center;
	width: fit-content;
	padding: 6px 12px;
	text-align: center;
	border: 1px solid transparent;
	border-radius: 999px;

	&_light {
		color: variables.$color-ink;
		background-color: variables.$color-muted;
	}

	&_accent {
		color: variables.$color-white;
		background-color: variables.$color-accent;
	}

	&_green {
		color: variables.$color-white;
		background-color: variables.$color-accent-2;
	}

	&_outline {
		color: variables.$color-ink-soft;
		border-color: variables.$color-line-strong;
	}

	&__remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		color: inherit;
		cursor: pointer;
		background-color: transparent;
		opacity: 0.6;
		transition: opacity 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				opacity: 1;
			}
		}
	}

	&__remove-icon {
		width: 10px;
		height: 10px;
	}
}
</style>
