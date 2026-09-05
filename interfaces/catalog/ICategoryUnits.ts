import type { IImg } from '@/interfaces/IImg'
import type { ILink } from '@/interfaces/ILink'
import type { IAdvantage } from '@/interfaces/IAdvantage'
import type { ITextItem, IFaqItem, IDeliveryOption } from '@/interfaces/content/IContentPages'

/* Коммерческие блоки категорийной страницы. Все поля опциональны в ICategoryPage:
   они есть только у разделов с продающим контентом, остальные категории рендерятся как раньше. */

export interface ICategoryStat {
	value: string
	label: string
}

export interface ICategorySubcategory {
	title: string
	text: string
	url: string
	img: IImg
	productsCount: number
}

export interface ICategorySubcategoriesUnit {
	title: string
	text: string
	items: ICategorySubcategory[]
}

export interface ICategoryCalcUnit {
	title: string
	text: string
	note: string
	benefits: string[]
}

export interface ICategoryAdvantagesUnit {
	title: string
	text: string
	items: IAdvantage[]
}

export interface ICategoryMaterialGroup {
	title: string
	text: string
	items: { label: string; value: string }[]
}

export interface ICategoryMaterialsUnit {
	title: string
	text: string
	groups: ICategoryMaterialGroup[]
	hardware: { brand: string; description: string }[]
}

export interface ICategoryStage extends ITextItem {
	step: number
	term: string
}

export interface ICategoryStagesUnit {
	title: string
	text: string
	items: ICategoryStage[]
}

export interface ICategoryDeliveryUnit {
	title: string
	text: string
	options: IDeliveryOption[]
	note: string
	link?: ILink
}

export interface ICategoryWarrantyUnit {
	title: string
	text: string
	items: ITextItem[]
	note: string
	link?: ILink
}

export interface ICategoryProjectsUnit {
	title: string
	text: string
	gallery: IImg[]
	link?: ILink
}

export interface ICategoryFaqUnit {
	title: string
	text: string
	items: IFaqItem[]
}

export interface ICategoryLinksUnit {
	title: string
	text: string
	groups: { title: string; links: ILink[] }[]
}
