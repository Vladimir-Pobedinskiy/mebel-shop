import type { IPageBase } from '~~/interfaces/IPageBase'
import type { ILink } from '~~/interfaces/ILink'

export interface ITextItem {
	title: string
	text: string
}

export interface IFaqItem {
	question: string
	answer: string
}

/* /guarantees/ — гарантия и сервис */
export interface IGuaranteesPage extends IPageBase {
	items: ITextItem[]
	steps: ITextItem[]
	documents: ITextItem[]
	faq: IFaqItem[]
}

/* /delivery/ — доставка и оплата */
export interface IDeliveryOption {
	title: string
	price: string
	term: string
	text: string
}

export interface IDeliveryPage extends IPageBase {
	deliveryOptions: IDeliveryOption[]
	assembly: ITextItem[]
	paymentOptions: ITextItem[]
	steps: ITextItem[]
	faq: IFaqItem[]
}

/* /become-dealer/ — оптовая работа и дилерство. B2B-блоки опциональны:
   страница без них рендерится ровно так же, как раньше */
export interface IDealerLabelValue {
	label: string
	value: string
}

export interface IDealerWholesaleUnit {
	title: string
	text: string
	items: ITextItem[]
	minOrder: { title: string; text: string; items: IDealerLabelValue[]; note: string }
}

export interface IDealerDiscountRow {
	level: string
	volume: string
	discount: string
	deferment: string
	bonus: string
}

export interface IDealerDiscountsUnit {
	title: string
	text: string
	columns: string[]
	rows: IDealerDiscountRow[]
	note: string
}

export interface IDealerLogisticsUnit {
	title: string
	text: string
	groups: { title: string; text: string; items: IDealerLabelValue[] }[]
	note: string
}

export interface IDealerPolicyUnit {
	title: string
	text: string
	claims: { title: string; text: string; steps: ITextItem[]; note: string }
	warranty: { title: string; text: string; items: ITextItem[]; note: string }
}

export interface IDealerFile {
	title: string
	text: string
	url: string
	size: string
	format: string
	/** '3d' | 'dwg' | 'photo' | 'pdf' — от типа зависит иконка */
	type: string
}

export interface IDealerAssetsUnit {
	title: string
	text: string
	files: IDealerFile[]
	note: string
}

export interface IDealerReview {
	id: number
	author: string
	company: string
	city: string
	since: string
	rating: number
	text: string
}

export interface IDealerReviewsUnit {
	title: string
	text: string
	items: IDealerReview[]
}

export interface IDealerPriceUnit {
	title: string
	text: string
	updatedAt: string
	file: { title: string; label: string; url: string; size: string; format: string }
	benefits: string[]
	formTitle: string
	formNote: string
}

export interface IBecomeDealerPage extends IPageBase {
	slogan: { title: string; text: string }
	counters: { value: number; suffix: string; label: string }[]
	audience: ITextItem[]
	terms: ITextItem[]
	steps: ITextItem[]
	formNote: string
	wholesaleUnit?: IDealerWholesaleUnit
	discountsUnit?: IDealerDiscountsUnit
	logisticsUnit?: IDealerLogisticsUnit
	policyUnit?: IDealerPolicyUnit
	assetsUnit?: IDealerAssetsUnit
	reviewsUnit?: IDealerReviewsUnit
	priceUnit?: IDealerPriceUnit
}

/* Правовые страницы: единый html-документ */
export interface ILegalPage extends IPageBase {
	content: string
	updatedAt: string
}

/* /catalogs/ — PDF-каталоги и лукбуки */
export interface ICatalogsPage extends IPageBase {
	items: { id: number; title: string; size: string; pages: number; link: ILink }[]
}
