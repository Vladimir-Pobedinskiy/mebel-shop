<script setup lang="ts">
import type { NuxtError } from '#app'

interface IError {
	statusCode: number
	statusMessage: string
	message: string
}

const props = withDefaults(
	defineProps<{
		error?: IError | NuxtError
	}>(),
	{
		error: () => ({ statusCode: 404, statusMessage: 'Запрашиваемая страница не найдена', message: '' }),
	}
)

// Страницы ошибок из индекса исключаем, но заголовок всё равно осмысленный
useHead({
	title: computed(() => (props.error?.statusCode === 404 ? 'Страница не найдена — Мебель Шоп' : 'Ошибка — Мебель Шоп')),
	meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const handleError = () => clearError({ redirect: '/' })

onMounted(() => {
	window.scrollTo(0, 0)
})
</script>

<template>
	<div class="body-inner">
		<AppHeader />

		<NuxtLayout name="error-layout">
			<div class="error-page">
				<div class="container error-page__inner">
					<span class="error-page__code">{{ error?.statusCode }}</span>

					<h1 class="error-page__title h3">
						<template v-if="error?.statusCode === 404">Запрашиваемая страница не найдена</template>
						<template v-else>{{ error?.statusMessage || error?.message || 'Произошла ошибка' }}</template>
					</h1>

					<p v-if="error?.statusCode === 404" class="error-page__text text-m">
						Возможно, страница была удалена или в адресной строке допущена опечатка. Загляните в каталог — там более 2
						400 моделей мебели.
					</p>

					<div class="error-page__actions">
						<button class="error-page__btn button-typo" type="button" @click="handleError">На главную</button>
						<NuxtLink class="error-page__link button-typo hover-link" to="/catalog/">В каталог</NuxtLink>
					</div>
				</div>
			</div>
		</NuxtLayout>

		<AppFooter />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.error-page {
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	padding: 80px 0;

	@media (min-width: variables.$desktop) {
		padding: 140px 0;
	}

	&__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	&__code {
		font-family: variables.$font-secondary;
		font-size: clamp(90px, 18vw, 240px);
		font-weight: 600;
		line-height: 1;
		color: variables.$color-accent;
		letter-spacing: -0.04em;
	}

	&__title {
		margin-bottom: 16px;
	}

	&__text {
		max-width: 560px;
		margin-bottom: 32px;
		color: variables.$color-ink-soft;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
	}

	&__btn {
		padding: 16px 32px;
		color: variables.$color-white;
		background-color: variables.$color-accent;
		border-radius: 999px;
		transition: background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-accent-hover;
			}
		}
	}

	&__link {
		padding: 16px 32px;
		border: 1px solid variables.$color-line-strong;
		border-radius: 999px;
	}
}
</style>
