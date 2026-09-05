<script setup lang="ts">
import type { IOrderSuccessPage } from '~~/interfaces/checkout/IOrderSuccessPage'
import { useGsapReveal } from '@/composables/useGsapReveal'

const route = useRoute()

const { data, error, status } = await useAsyncData('order-success-page', async () =>
	$fetch<IOrderSuccessPage>('/api/order-success/')
)
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Страница не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

/* Номер приходит в query после оформления; при прямом заходе — из данных страницы */
const orderNumber = computed(() => (route.query.number as string) || data.value?.number || '')

const rootRef = ref<HTMLElement | null>(null)
const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.order-success__reveal', { stagger: 0.1 })
})
</script>

<template>
	<div ref="rootRef" class="order-success offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<UIBreadcrumbs v-if="data.breadcrumbs" class="order-success__breadcrumbs" :breadcrumbs="data.breadcrumbs" />

				<h1 class="visually-hidden">{{ data.seo.h1 }}</h1>

				<div class="order-success__card">
					<span class="order-success__icon-wrapper order-success__reveal">
						<NuxtIcon class="order-success__icon" name="icon-check" filled />
					</span>

					<p class="order-success__title h2 order-success__reveal">{{ data.title }}</p>

					<p v-if="orderNumber" class="order-success__number order-success__reveal">
						<span class="order-success__number-label text-s">Номер заказа</span>
						<span class="order-success__number-value h4">{{ orderNumber }}</span>
					</p>

					<p class="order-success__text text-m order-success__reveal">{{ data.text }}</p>

					<ol v-if="data.nextSteps?.length" class="order-success__steps order-success__reveal">
						<li v-for="(step, index) in data.nextSteps" :key="step" class="order-success__step">
							<span class="order-success__step-num">{{ index + 1 }}</span>
							<span class="order-success__step-text text-s">{{ step }}</span>
						</li>
					</ol>

					<div class="order-success__actions order-success__reveal">
						<UIButton v-if="data.link" as="NuxtLink" :to="data.link.url" :label="data.link.label" show-icon />

						<UIButton as="NuxtLink" to="/" variant="secondary" color="dark" label="На главную" />
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.order-success {
	&__breadcrumbs {
		margin-bottom: 20px;
	}

	&__card {
		margin: 0 auto;
		padding: 40px 24px;
		max-width: 720px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;
		background-color: variables.$color-surface;
		box-shadow: variables.$shadow-soft;

		@media (min-width: variables.$desktop) {
			padding: 64px 48px;
		}
	}

	&__icon-wrapper {
		margin-bottom: 24px;
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: variables.$color-white;
		background-color: variables.$color-accent-2;
	}

	&__icon {
		display: flex;

		svg {
			width: 28px;
			height: 28px;
		}
	}

	&__title {
		margin: 0 0 20px;
	}

	&__number {
		margin: 0 0 24px;
		padding: 12px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-accent-soft;
	}

	&__number-label {
		color: variables.$color-ink-soft;
	}

	&__number-value {
		color: variables.$color-accent;
	}

	&__text {
		margin: 0 0 32px;
		max-width: 520px;
		color: variables.$color-ink-soft;
	}

	&__steps {
		margin: 0 0 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		text-align: left;
	}

	&__step {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	&__step-num {
		width: 28px;
		min-width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: variables.$font;
		font-size: 13px;
		font-weight: 600;
		border-radius: 50%;
		color: variables.$color-accent;
		background-color: variables.$color-muted;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
	}
}
</style>
