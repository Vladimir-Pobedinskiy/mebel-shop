import type { IImg } from '@/interfaces/IImg'

export interface IProductVariant {
	name: string
	label: string
	color: string
	img?: IImg
	priceDiff: number
}

export interface IProductCharacteristic {
	label: string
	value: string
}

export interface IProductBadge {
	name: 'hit' | 'new' | 'sale'
	label: string
}

/* Товар в каталоге и в карточке товара */
export interface IProduct {
	id: number
	slug: string
	title: string
	category: string
	categorySlug: string
	collection: string
	brand: string
	price: number
	oldPrice: number | null
	currency: string
	badges: IProductBadge[]
	rating: number
	reviewsCount: number
	inStock: boolean
	availability: string
	deliveryDays: number
	material: string
	color: string
	colorHex: string
	sizes: string
	img: IImg
	imgHover: IImg
	gallery: IImg[]
	shortDescription: string
	description: string
	characteristics: IProductCharacteristic[]
	variants: IProductVariant[]
	url: string
}
