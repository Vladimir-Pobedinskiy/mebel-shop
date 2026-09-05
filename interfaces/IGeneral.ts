import type { ILink } from '@/interfaces/ILink'
import type { ILinkWithTitle } from '@/interfaces/ILinkWithTitle'
import type { IImg } from '@/interfaces/IImg'

export interface IMenuCategory {
	url: string
	label: string
	img: IImg
	children: ILink[]
}

export interface IHeader {
	phone: ILink
	topLine: string
	navigation: ILink[]
	megaMenu: {
		title: string
		categories: IMenuCategory[]
		promo: {
			title: string
			text: string
			img: IImg
			link: ILink
		}
	}
	burgerNav: {
		navCategory: ILink[]
		navigation: ILink[]
	}
}

export interface IFooterAddress {
	title: string
	address: string
	operatingMode: string
	phones: ILinkWithTitle[]
	email: ILink
}

export interface IFooterColumn {
	title: string
	links: ILink[]
}

export interface IFooter {
	about: string
	addresses: IFooterAddress[]
	columns: IFooterColumn[]
	payments: string[]
	legal: ILink[]
	copyright: string
	marqueeUnit: {
		title: string
		marqueeContent: string[]
	}
}

export interface ISocialLink {
	url: string
	label: string
	name: string
}

/* Мессенджер в плавающих кнопках: name — имя иконки без префикса icon- */
export interface IMessengerLink {
	name: string
	url: string
	label: string
	text: string
}

/* Сквозные коммерческие контакты: телефон, мессенджеры и файл каталога */
export interface IContacts {
	phone: ILink
	email: ILink
	workingHours: string
	replyTime: string
	messengers: IMessengerLink[]
	consult: { title: string; text: string }
	catalogFile: { url: string; label: string; title: string; size: string }
}

export interface ITrustCertificate {
	title: string
	text: string
	img: IImg
}

export interface ITrustReview {
	id: number
	author: string
	/** 'client' — покупатель, 'dealer' — партнёр */
	role: 'client' | 'dealer'
	company: string
	rating: number
	text: string
}

/* Блок доверия: сертификаты, фото производства, счётчики и отзывы */
export interface ITrustUnit {
	title: string
	text: string
	certificates: { title: string; text: string; items: ITrustCertificate[] }
	production: { title: string; text: string; gallery: IImg[]; link?: ILink }
	counters: { value: number; suffix: string; label: string }[]
	reviews: { title: string; text: string; items: ITrustReview[] }
}
