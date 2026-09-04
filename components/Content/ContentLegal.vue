<script setup lang="ts">
import { formatDateRu } from '@/utils/utils'

/* Общая обёртка правовых документов: политика конфиденциальности и пользовательское соглашение */
defineProps<{
	content: string
	updatedAt: string
}>()
</script>

<template>
	<section class="content-legal">
		<div class="content-legal__doc user-content text-m" v-html="content" />

		<p v-if="updatedAt" class="content-legal__date text-s">Редакция от {{ formatDateRu(updatedAt) }}</p>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.content-legal {
	max-width: 860px;
	margin-top: 32px;

	@media (min-width: variables.$desktop) {
		margin-top: 48px;
	}

	&__date {
		margin: 32px 0 0;
		padding-top: 20px;
		border-top: 1px solid variables.$color-line;
		color: variables.$color-ink-soft;
	}
}
</style>
