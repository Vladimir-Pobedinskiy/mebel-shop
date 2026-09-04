import { storeToRefs } from 'pinia'
import { useGeneralStore } from '@/stores/storeGeneral'

/* Глобальная микроразметка сайта: Organization + WebSite + WebPage.
   Данные — те же, что в шапке и подвале (db.json → general), чтобы телефон и адрес
   не расходились с интерфейсом. Вызывается один раз в app.vue;
   страничные узлы (Product, Article, BreadcrumbList) добавляет usePageSeo. */
export const useSiteSchemaOrg = () => {
	const generalStore = useGeneralStore()
	const { header, footer } = storeToRefs(generalStore)

	const salon = computed(() => footer.value?.addresses?.[0])
	// «Москва, ул. Тверская, 18, стр. 1» → город + улица
	const addressParts = computed(() => {
		const [locality, ...street] = (salon.value?.address || '').split(',')

		return { locality: locality?.trim() || '', street: street.join(',').trim() }
	})

	useSchemaOrg([
		defineOrganization({
			name: 'Мебель Шоп',
			description: footer.value?.about,
			logo: '/favicon/android-chrome-512x512.png',
			telephone: header.value?.phone?.label,
			email: salon.value?.email?.url,
			address: {
				'@type': 'PostalAddress',
				addressCountry: 'RU',
				addressLocality: addressParts.value.locality,
				streetAddress: addressParts.value.street,
			},
		}),
		defineWebSite({
			name: 'Мебель Шоп',
			inLanguage: 'ru-RU',
		}),
		defineWebPage(),
	])
}
