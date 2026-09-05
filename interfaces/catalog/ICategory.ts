import type { IImg } from '~~/interfaces/IImg'
import type { ILink } from '~~/interfaces/ILink'

export interface ICategory {
	id: number
	slug: string
	title: string
	description: string
	img: IImg
	productsCount: number
	collections: ILink[]
	url: string
}
