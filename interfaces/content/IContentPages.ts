import type { IPageBase } from '@/interfaces/IPageBase'
import type { ILink } from '@/interfaces/ILink'

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

/* /become-dealer/ — сотрудничество */
export interface IBecomeDealerPage extends IPageBase {
	slogan: { title: string; text: string }
	counters: { value: number; suffix: string; label: string }[]
	audience: ITextItem[]
	terms: ITextItem[]
	steps: ITextItem[]
	formNote: string
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
