import type { IPageBase } from '~~/interfaces/IPageBase'
import type { IImg } from '~~/interfaces/IImg'
import type { ILink } from '~~/interfaces/ILink'
import type { IProduct } from '~~/interfaces/product/IProduct'
import type { IReview } from '~~/interfaces/IReview'
import type { IArticlePreview } from '~~/interfaces/article/IArticlePreview'
import type { IAdvantage } from '~~/interfaces/IAdvantage'

export interface IHomeHero {
	subtitle: string
	title: string
	text: string
	img: IImg
	links: ILink[]
	stats: { value: string; label: string }[]
}

export interface IHomeCategoryTab {
	name: string
	nav: { label: string }
	panel: {
		title: string
		text: string
		img: IImg
		link: ILink
		items: ILink[]
	}
}

export interface IHomeAboutUnit {
	subtitle: string
	title: string
	text: string
	img: IImg
	counters: { value: number; suffix: string; label: string }[]
	link: ILink
}

export interface IHomeCollection {
	title: string
	text: string
	img: IImg
	link: ILink
}

export interface IHomeSaleBanner {
	subtitle: string
	title: string
	text: string
	img: IImg
	endsAt: string
	link: ILink
}

export interface IHomeShowroom {
	title: string
	address: string
	operatingMode: string
	phone: ILink
	coords: [number, number]
	img: IImg
}

export interface IHomePage extends IPageBase {
	hero: IHomeHero
	categoryTabs: IHomeCategoryTab[]
	bestsellers: { title: string; text: string; link: ILink; products: IProduct[] }
	aboutUnit: IHomeAboutUnit
	collections: { title: string; text: string; items: IHomeCollection[] }
	saleBanner: IHomeSaleBanner
	marqueeUnit: { title: string; marqueeContent: string[] }
	advantagesUnit: { title: string; text: string; items: IAdvantage[] }
	showroomUnit: { title: string; text: string; items: IHomeShowroom[] }
	reviewsUnit: { title: string; text: string; rating: number; items: IReview[] }
	articlePreviewsUnit: { title: string; link: ILink; items: IArticlePreview[] }
	ctaUnit: { title: string; text: string; img: IImg; note: string }
}
