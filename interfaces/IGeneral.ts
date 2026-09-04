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
