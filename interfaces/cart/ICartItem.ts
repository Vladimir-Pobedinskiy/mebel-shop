import type { IImg } from '~~/interfaces/IImg'

export interface ICartItem {
	id: number
	slug: string
	title: string
	price: number
	oldPrice: number | null
	quantity: number
	variant: string | null
	img: IImg
	url: string
}
