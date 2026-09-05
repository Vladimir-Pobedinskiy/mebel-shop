<script setup lang="ts">
import type { IBreadcrumb } from '~~/interfaces/IBreadcrumb'

/* Общая рамка всех страниц авторизации: крошки, заголовок, текст и карточка
   с формой. Держим её отдельно, чтобы пять страниц остались в три строки
   и не разъехались по вёрстке */
withDefaults(
	defineProps<{
		breadcrumbs: IBreadcrumb[]
		title: string
		text?: string
		note?: string
	}>(),
	{
		text: '',
		note: '',
	}
)
</script>

<template>
	<div class="auth-shell">
		<UIBreadcrumbs v-if="breadcrumbs?.length" class="auth-shell__breadcrumbs" :breadcrumbs="breadcrumbs" />

		<div class="auth-shell__inner">
			<div class="auth-shell__head">
				<h1 class="auth-shell__title h2">{{ title }}</h1>
				<p v-if="text" class="auth-shell__text text-m">{{ text }}</p>
			</div>

			<div class="auth-shell__card">
				<slot />
			</div>

			<p v-if="note" class="auth-shell__note text-xs">{{ note }}</p>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.auth-shell {
	&__inner {
		max-width: 520px;
		margin: 0 auto;
	}

	&__head {
		margin-bottom: 24px;
		text-align: center;

		@media (min-width: variables.$desktop) {
			margin-bottom: 32px;
		}
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__card {
		padding: 24px;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;

		@media (min-width: variables.$desktop) {
			padding: 32px;
		}
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
		text-align: center;
	}
}
</style>
