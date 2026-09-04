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
	padding: 6px 12px;
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 6px;
	text-align: center;
	border: 1px solid transparent;
	border-radius: 999px;

	&_light {
		background-color: variables.$color-muted;
		color: variables.$color-ink;
	}

	&_accent {
		background-color: variables.$color-accent;
		color: variables.$color-white;
	}

	&_green {
		background-color: variables.$color-accent-2;
		color: variables.$color-white;
	}

	&_outline {
		border-color: variables.$color-line-strong;
		color: variables.$color-ink-soft;
	}

	&__remove {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		color: inherit;
		cursor: pointer;
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
