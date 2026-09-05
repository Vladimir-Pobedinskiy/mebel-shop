import type { ComputedRef } from 'vue'
import type { ISeo } from '~~/interfaces/seo/ISeo'
import type { ISchemaOrg, ISchemaOrgNode } from '~~/interfaces/seo/ISchemaOrg'
import type { IBreadcrumb } from '~~/interfaces/IBreadcrumb'

interface ISeoPageData {
	seo: ISeo
	schemaOrg?: ISchemaOrg
	breadcrumbs?: IBreadcrumb[]
}

interface IPageSeoOptions {
	/** og:image страницы, если нужен свой (по умолчанию — обложка сайта) */
	image?: string
	/** og:type: website для разделов, article для статей блога */
	type?: 'website' | 'article' | 'product'
}

const DEFAULT_OG_IMAGE = '/img/og-cover.png'

/* Единая точка SEO для страницы: title, description, canonical, Open Graph,
   Twitter-карточка и микроразметка. Данные приходят из db.json (ключ seo),
   BreadcrumbList собирается автоматически из хлебных крошек страницы. */
export const usePageSeo = (data: ComputedRef<ISeoPageData | null | undefined>, options: IPageSeoOptions = {}) => {
	const route = useRoute()
	const config = useRuntimeConfig()
	const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')

	// Абсолютный URL — og:url, canonical и микроразметка требуют полного адреса
	const absoluteUrl = (path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`)

	const description = computed(() => data.value?.seo?.meta?.find(item => item.name === 'description')?.content || '')
	const canonical = computed(() => absoluteUrl(data.value?.seo?.canonical || route.path))
	const ogImage = computed(() => absoluteUrl(options.image || DEFAULT_OG_IMAGE))

	const metaComputed = computed(() => {
		if (!data.value?.seo) return []

		return [
			...(data.value.seo.meta || []),
			{ property: 'og:type', content: options.type || 'website' },
			{ property: 'og:site_name', content: 'Мебель Шоп' },
			{ property: 'og:locale', content: 'ru_RU' },
			{ property: 'og:title', content: data.value.seo.title },
			{ property: 'og:description', content: description.value },
			{ property: 'og:url', content: canonical.value },
			{ property: 'og:image', content: ogImage.value },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: data.value.seo.title },
			{ name: 'twitter:description', content: description.value },
			{ name: 'twitter:image', content: ogImage.value },
		]
	})

	if (data.value?.seo) {
		useHead({
			title: data.value.seo.title,
			link: [{ rel: 'canonical', href: canonical.value }],
			meta: metaComputed.value,
		})
	}

	// BreadcrumbList отдаём только для вложенных страниц: на главной крошка одна
	const breadcrumbsSchema = (): ISchemaOrgNode[] => {
		const breadcrumbs = data.value?.breadcrumbs || []
		if (breadcrumbs.length < 2) return []

		return [
			{
				'@type': 'BreadcrumbList',
				itemListElement: breadcrumbs.map((breadcrumb, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: breadcrumb.label,
					item: absoluteUrl(breadcrumb.url),
				})),
			},
		]
	}

	if (data.value) useSchemaOrg([...(data.value.schemaOrg || []), ...breadcrumbsSchema()])
}
