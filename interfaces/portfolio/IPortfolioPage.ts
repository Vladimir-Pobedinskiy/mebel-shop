import type { IPageBase } from '@/interfaces/IPageBase'
import type { IImg } from '@/interfaces/IImg'
import type { ILink } from '@/interfaces/ILink'
import type { IPagination } from '@/interfaces/IPagination'

/* Карточка проекта в списке */
export interface IProjectPreview {
	id: number
	slug: string
	title: string
	description: string
	city: string
	year: string
	area: string
	/** слаг типа объекта: flat | house | commercial */
	category: string
	categoryLabel: string
	img: IImg
	link: ILink
}

export interface IPortfolioCounter {
	value: number
	suffix: string
	label: string
}

export interface IPortfolioPage extends IPageBase {
	description: string
	counters: IPortfolioCounter[]
	categories: { slug: string; label: string }[]
	projects: IProjectPreview[]
	pagination: IPagination
}

export interface IProject {
	id: number
	slug: string
	title: string
	description: string
	category: string
	categoryLabel: string
	facts: { label: string; value: string }[]
	tasks: string[]
	/** html-описание решения */
	solution: string
	gallery: IImg[]
}

export interface IProjectPage extends IPageBase {
	project: IProject
	related: IProjectPreview[]
}
