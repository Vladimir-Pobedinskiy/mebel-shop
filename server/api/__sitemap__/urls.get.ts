import type { ICatalogPage } from '@/interfaces/catalog/ICatalogPage'
import type { ICategoryPage } from '@/interfaces/catalog/ICategoryPage'
import type { IBlogPage } from '@/interfaces/article/IBlogPage'
import type { IPortfolioPage } from '@/interfaces/portfolio/IPortfolioPage'

interface ISitemapUrl {
	loc: string
	priority: number
	changefreq: string
}

/* Источник динамических URL для @nuxtjs/sitemap: категории, коллекции, товары,
   разделы блога, статьи и проекты портфолио. Данные берутся из того же json-server,
   что и страницы, поэтому карта сайта не расходится с каталогом.
   Статические роуты модуль собирает сам из pages/. */
export default defineEventHandler(async (): Promise<ISitemapUrl[]> => {
	const config = useRuntimeConfig()
	const baseUrl = config.public.baseUrl
	const urls: ISitemapUrl[] = []
	const add = (loc: string | undefined, priority: number, changefreq = 'weekly') => {
		if (!loc || urls.some(url => url.loc === loc)) return

		urls.push({ loc, priority, changefreq })
	}

	try {
		const catalog = await $fetch<ICatalogPage>(`${baseUrl}/api/catalog/`)

		for (const category of catalog.categories || []) {
			add(category.url, 0.9)

			for (const collection of category.collections || []) add(collection.url, 0.7)

			// Товары лежат в разделе категории — один запрос на категорию
			const categoryPage = await $fetch<ICategoryPage>(`${baseUrl}/api/catalog/${category.slug}/`)

			for (const product of categoryPage.products || []) add(product.url, 0.8)
		}
	} catch {
		// json-server недоступен — отдаём то, что успели собрать, не роняя сборку
	}

	try {
		const blog = await $fetch<IBlogPage>(`${baseUrl}/api/blog/`)

		for (const section of blog.sections || []) add(section.link?.url, 0.6)
		for (const article of blog.articles || []) add(article.link?.url, 0.6, 'monthly')
	} catch {
		// см. выше
	}

	try {
		const portfolio = await $fetch<IPortfolioPage>(`${baseUrl}/api/portfolio/`)

		for (const project of portfolio.projects || []) add(project.link?.url, 0.6, 'monthly')
	} catch {
		// см. выше
	}

	return urls
})
