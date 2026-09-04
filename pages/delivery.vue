<script setup lang="ts">
import type { IDeliveryPage } from '@/interfaces/content/IContentPages'

const { data, error, status } = await useAsyncData('delivery-page', async () =>
	$fetch<IDeliveryPage>('/api/delivery/')
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
</script>

<template>
	<div class="delivery-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					text="Возим своей службой по Москве и области, по России — транспортными компаниями. Сборку делают штатные бригады."
					subtitle="Покупателям"
				/>

				<DeliveryOptions
					v-if="data.deliveryOptions?.length"
					class="delivery-page__section"
					:options="data.deliveryOptions"
					title="Стоимость и сроки доставки"
					text="Точную сумму менеджер называет при подтверждении заказа — она зависит от адреса и габаритов."
				/>

				<ContentCards
					v-if="data.assembly?.length"
					class="delivery-page__section"
					:items="data.assembly"
					title="Подъём и сборка"
					text="Заносим, собираем и убираем упаковку — отдельной уборки после нас не потребуется."
					:columns="3"
				/>

				<ContentCards
					v-if="data.paymentOptions?.length"
					class="delivery-page__section"
					:items="data.paymentOptions"
					title="Способы оплаты"
					variant="flat"
					:columns="4"
				/>

				<ContentCards
					v-if="data.steps?.length"
					class="delivery-page__section"
					:items="data.steps"
					title="Как проходит доставка"
					variant="numbered"
					:columns="4"
				/>

				<ContentFaq v-if="data.faq?.length" class="delivery-page__section" :items="data.faq" />
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.delivery-page {
	&__section {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}
}
</style>
