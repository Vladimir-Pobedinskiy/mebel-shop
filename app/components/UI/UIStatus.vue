<script setup lang="ts">
import type { IStatus } from '~~/interfaces/IStatus'

/**
	Все флаги:
		1. Новый: new
		2. Подтверждён: confirmed
		3. В производстве: in-production
		4. В доставке: in-delivery
		5. Выполнен: completed
		6. Отменён: cancelled
 */
defineProps<{
	status: IStatus
}>()
</script>

<template>
	<div :class="['status', `status_${status.value}`]">
		<span class="status__decor">
			<span class="visually-hidden">Декоративный элемент статуса</span>
		</span>
		<span class="status__title text-xs">{{ status.label }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.status {
	display: inline-flex;
	gap: 8px;
	align-items: center;
	width: fit-content;
	padding: 6px 12px;
	color: variables.$color-ink;
	background-color: variables.$color-muted;
	border-radius: 999px;

	&__decor {
		width: 8px;
		min-width: 8px;
		height: 8px;
		background-color: variables.$color-ink-soft;
		border-radius: 50%;
	}

	&_new .status__decor,
	&_confirmed .status__decor {
		background-color: variables.$color-accent;
	}

	&_in-production .status__decor,
	&_in-delivery .status__decor {
		background-color: variables.$color-warning;
	}

	&_completed .status__decor {
		background-color: variables.$color-success;
	}

	&_cancelled .status__decor {
		background-color: variables.$color-error;
	}
}
</style>
