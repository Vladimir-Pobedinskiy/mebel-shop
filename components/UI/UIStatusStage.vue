<script setup lang="ts">
import type { IStatusStage } from '@/interfaces/IStatusStage'

defineProps<{
	statusStage: IStatusStage
}>()
</script>

<template>
	<div
		:class="[
			'status-stage',
			{ 'status-stage_completed': statusStage.completed },
			{ 'status-stage_not-completed': !statusStage.completed },
			{ 'status-stage_cancelled': statusStage.status === 'cancelled' },
			{ 'status-stage_disabled': statusStage.disabled },
		]"
	>
		<span class="status-stage__icon-wrapper">
			<template v-if="statusStage.completed">
				<NuxtIcon class="status-stage__icon" name="icon-check" filled />
			</template>
			<template v-else>
				<NuxtIcon class="status-stage__icon-not-completed" name="icon-checkbox-not-completed" filled />
			</template>
		</span>

		<span class="status-stage__label text-s">{{ statusStage.label }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.status-stage {
	display: flex;
	align-items: center;
	gap: 12px;

	&__icon-wrapper {
		width: 28px;
		min-width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid variables.$color-line-strong;
		border-radius: 50%;
		background-color: variables.$color-surface;
		color: variables.$color-white;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	&__icon {
		width: 12px;
		height: 12px;
	}

	&__icon-not-completed {
		width: 8px;
		height: 8px;
		color: variables.$color-line-strong;
	}

	&_completed {
		.status-stage__icon-wrapper {
			background-color: variables.$color-accent-2;
			border-color: variables.$color-accent-2;
		}
	}

	&_cancelled {
		.status-stage__icon-wrapper {
			background-color: variables.$color-error;
			border-color: variables.$color-error;
		}

		.status-stage__label {
			color: variables.$color-error;
		}
	}

	&_not-completed {
		.status-stage__label {
			color: variables.$color-ink-soft;
		}
	}

	&_disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}
</style>
