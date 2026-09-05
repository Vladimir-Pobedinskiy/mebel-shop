import type { IPageBase } from '~~/interfaces/IPageBase'
import type { IImg } from '~~/interfaces/IImg'
import type { ILink } from '~~/interfaces/ILink'

export interface IShowroom {
	title: string
	address: string
	operatingMode: string
	phone: ILink
	coords: [number, number]
	img: IImg
}

export interface IContactsDepartment {
	title: string
	text: string
	phone: ILink
	email: ILink
}

export interface IContactsPage extends IPageBase {
	info: {
		phones: (ILink & { title: string })[]
		email: ILink
		emailPartners: ILink
		operatingMode: string
		requisites: string
	}
	departments: IContactsDepartment[]
	requisites: { label: string; value: string }[]
	showrooms: IShowroom[]
	formNote: string
}
