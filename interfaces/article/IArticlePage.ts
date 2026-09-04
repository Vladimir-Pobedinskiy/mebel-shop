import type { IPageBase } from '@/interfaces/IPageBase'
import type { IArticlePreview } from '@/interfaces/article/IArticlePreview'

export interface IArticle extends IArticlePreview {
	/** html-контент статьи из db.json */
	content: string
}

export interface IArticlePage extends IPageBase {
	article: IArticle
	related: IArticlePreview[]
}
