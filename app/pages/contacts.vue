<script setup lang="ts">
import type { IContactsPage } from '~~/interfaces/contacts/IContactsPage'
import { useGsapReveal } from '@/composables/useGsapReveal'

const { data, error, status } = await useAsyncData('contacts-page', async () => $fetch<IContactsPage>('/api/contacts/'))
const pending = computed(() => status.value === 'pending')

if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Страница не найдена',
		fatal: true,
	})
}

usePageSeo(computed(() => data.value))

const departmentsRef = ref<HTMLElement | null>(null)
const showroomsRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(departmentsRef.value, '.contacts-departments__item', { stagger: 0.08, y: 28 })
	revealOnScroll(showroomsRef.value, '.contacts-showrooms__item', { stagger: 0.08, y: 32 })
})
</script>

<template>
	<div class="contacts-page offset-page">
		<AppLoading v-if="pending" :is-loading-local="true" />

		<template v-if="data">
			<div class="container">
				<ContentIntro
					:breadcrumbs="data.breadcrumbs"
					:title="data.seo.h1"
					text="Позвоните, напишите или приезжайте в салон — покажем материалы вживую и посчитаем заказ на месте."
					subtitle="Связаться с нами"
				>
					<template #content>
						<ul v-if="data.info" class="contacts-info">
							<li v-for="phone in data.info.phones" :key="phone.url" class="contacts-info__item">
								<p class="contacts-info__label text-xs">{{ phone.title }}</p>
								<a class="contacts-info__value h4 hover-link" :href="`tel:${phone.url}`">{{ phone.label }}</a>
							</li>

							<li class="contacts-info__item">
								<p class="contacts-info__label text-xs">Почта для покупателей</p>

								<a class="contacts-info__value title-18 hover-link" :href="`mailto:${data.info.email.url}`">
									{{ data.info.email.label }}
								</a>
							</li>

							<li class="contacts-info__item">
								<p class="contacts-info__label text-xs">Режим работы</p>
								<p class="contacts-info__value title-18">{{ data.info.operatingMode }}</p>
							</li>
						</ul>
					</template>
				</ContentIntro>

				<section v-if="data.departments?.length" ref="departmentsRef" class="contacts-page__section">
					<h2 class="contacts-page__title h2">Отделы</h2>

					<ul class="contacts-departments">
						<li v-for="department in data.departments" :key="department.title" class="contacts-departments__item">
							<p class="contacts-departments__name title-18">{{ department.title }}</p>
							<p class="contacts-departments__text text-s">{{ department.text }}</p>

							<a class="contacts-departments__link text-m hover-link" :href="`tel:${department.phone.url}`">
								{{ department.phone.label }}
							</a>

							<a class="contacts-departments__link text-s hover-link" :href="`mailto:${department.email.url}`">
								{{ department.email.label }}
							</a>
						</li>
					</ul>
				</section>

				<section v-if="data.showrooms?.length" ref="showroomsRef" class="contacts-page__section">
					<div class="contacts-page__head">
						<h2 class="contacts-page__title h2">Салоны</h2>

						<UIButton
							as="NuxtLink"
							to="/map/"
							variant="secondary"
							color="dark"
							size="small"
							label="Смотреть на карте"
						/>
					</div>

					<ul class="contacts-showrooms">
						<li v-for="showroom in data.showrooms" :key="showroom.title" class="contacts-showrooms__item">
							<div class="contacts-showrooms__media">
								<NuxtImg
									class="contacts-showrooms__img"
									:src="showroom.img.url"
									:alt="showroom.img.alt"
									loading="lazy"
									format="webp"
									sizes="xs:100vw sm:100vw md:50vw lg:33vw xl:33vw xxl:33vw"
								/>
							</div>

							<div class="contacts-showrooms__body">
								<p class="contacts-showrooms__name title-18">{{ showroom.title }}</p>
								<p class="contacts-showrooms__address text-s">{{ showroom.address }}</p>
								<p class="contacts-showrooms__mode text-xs">{{ showroom.operatingMode }}</p>

								<a class="contacts-showrooms__phone text-m hover-link" :href="`tel:${showroom.phone.url}`">
									{{ showroom.phone.label }}
								</a>
							</div>
						</li>
					</ul>
				</section>

				<section class="contacts-page__section contacts-page__bottom">
					<ContactsForm
						class="contacts-page__form"
						text="Опишите задачу — подберём модели и пришлём расчёт."
						:note="data.formNote"
					/>

					<div v-if="data.requisites?.length" class="contacts-requisites">
						<h2 class="contacts-requisites__title h3">Реквизиты</h2>

						<dl class="contacts-requisites__list">
							<div v-for="item in data.requisites" :key="item.label" class="contacts-requisites__row">
								<dt class="contacts-requisites__label text-xs">{{ item.label }}</dt>
								<dd class="contacts-requisites__value text-s">{{ item.value }}</dd>
							</div>
						</dl>
					</div>
				</section>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.contacts-page {
	&__section {
		margin-top: 48px;

		@media (min-width: variables.$desktop) {
			margin-top: 88px;
		}
	}

	&__head {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;
	}

	&__title {
		margin: 0 0 28px;

		.contacts-page__head & {
			margin-bottom: 0;
		}
	}

	&__bottom {
		display: grid;
		gap: 32px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: 1.4fr 1fr;
			gap: 40px;
			align-items: start;
		}
	}
}

.contacts-info {
	display: grid;
	gap: 20px;
	margin: 0;
	padding: 0;
	list-style: none;

	@media (min-width: variables.$mobile-big) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: variables.$desktop-small) {
		grid-template-columns: repeat(4, 1fr);
	}

	&__label {
		margin: 0 0 6px;
		color: variables.$color-ink-soft;
	}

	&__value {
		display: inline-block;
		margin: 0;
		color: variables.$color-ink;
		text-decoration: none;
	}
}

.contacts-departments {
	display: grid;
	gap: 16px;
	margin: 0;
	padding: 0;
	list-style: none;

	@media (min-width: variables.$mobile-big) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: variables.$desktop-small) {
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 24px;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
		box-shadow: variables.$shadow-soft;
	}

	&__name {
		margin: 0 0 8px;
	}

	&__text {
		margin: 0 0 16px;
		color: variables.$color-ink-soft;
	}

	&__link {
		color: variables.$color-ink;
		text-decoration: none;

		& + & {
			margin-top: 6px;
			color: variables.$color-ink-soft;
		}
	}
}

.contacts-showrooms {
	display: grid;
	gap: 16px;
	margin: 0;
	padding: 0;
	list-style: none;

	@media (min-width: variables.$mobile-big) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: variables.$desktop-small) {
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	&__item {
		overflow: hidden;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
		box-shadow: variables.$shadow-soft;
	}

	&__media {
		background-color: variables.$color-muted;
	}

	&__img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	&__body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 20px;
	}

	&__name {
		margin: 0 0 6px;
	}

	&__address {
		margin: 0 0 4px;
		color: variables.$color-ink-soft;
	}

	&__mode {
		margin: 0 0 12px;
		color: variables.$color-ink-soft;
	}

	&__phone {
		color: variables.$color-ink;
		text-decoration: none;
	}
}

.contacts-requisites {
	padding: 24px;
	border-radius: variables.$radius-m;
	background-color: variables.$color-muted;

	&__title {
		margin: 0 0 20px;
	}

	&__list {
		margin: 0;
	}

	&__row {
		& + & {
			margin-top: 14px;
			padding-top: 14px;
			border-top: 1px solid variables.$color-line;
		}
	}

	&__label {
		margin: 0 0 4px;
		color: variables.$color-ink-soft;
	}

	&__value {
		margin: 0;
	}
}
</style>
