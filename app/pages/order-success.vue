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
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 720px;
		padding: 40px 24px;
		margin: 0 auto;
		text-align: center;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;
		box-shadow: variables.$shadow-soft;

		@media (min-width: variables.$desktop) {
			padding: 64px 48px;
		}
	}

	&__icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		margin-bottom: 24px;
		color: variables.$color-white;
		background-color: variables.$color-accent-2;
		border-radius: 50%;
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
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: center;
		padding: 12px 24px;
		margin: 0 0 24px;
		background-color: variables.$color-accent-soft;
		border-radius: variables.$radius-m;
	}

	&__number-label {
		color: variables.$color-ink-soft;
	}

	&__number-value {
		color: variables.$color-accent;
	}

	&__text {
		max-width: 520px;
		margin: 0 0 32px;
		color: variables.$color-ink-soft;
	}

	&__steps {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin: 0 0 32px;
		text-align: left;
	}

	&__step {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	&__step-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		min-width: 28px;
		height: 28px;
		font-family: variables.$font;
		font-size: 13px;
		font-weight: 600;
		color: variables.$color-accent;
		background-color: variables.$color-muted;
		border-radius: 50%;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
	}
}
</style>
