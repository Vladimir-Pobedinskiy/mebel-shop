import type { IPageBase } from '~~/interfaces/IPageBase'
import type { ILink } from '~~/interfaces/ILink'
import type { IPagination } from '~~/interfaces/IPagination'
import type { IArticlePreview } from '~~/interfaces/article/IArticlePreview'

/* Раздел блога в списке разделов (табы на списке и внутри раздела) */
export interface IBlogSection {
	slug: string
	label: string
	description: string
	count: number
	link: ILink
}

/* /blog/ — все статьи + разделы */
export interface IBlogPage extends IPageBase {
	description: string
	sections: IBlogSection[]
	articles: IArticlePreview[]
	pagination: IPagination
}

/* /blog/<section>/ — статьи одного раздела */
export interface IBlogSectionPage extends IPageBase {
	section: { slug: string; label: string; title: string; description: string }
	sections: IBlogSection[]
	articles: IArticlePreview[]
	pagination: IPagination
}
