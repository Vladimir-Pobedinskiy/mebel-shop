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

/* Габариты в миллиметрах — по ним работает фильтр по размеру */
export interface IProductDimensions {
	width: number
	depth: number
	height: number
}

export type IProductAvailabilityType = 'in-stock' | 'made-to-order'

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
	/* Коммерческие поля: заполнены у товаров корпусной мебели, у остальных отсутствуют */
	style?: string
	constructionType?: string
	bodyMaterial?: string
	facadeMaterial?: string
	purpose?: string
	dimensions?: IProductDimensions
	availabilityType?: IProductAvailabilityType
	productionDays?: number | null
	/** true → цена выводится как «от 118 700 ₽»: итог зависит от конфигурации */
	priceFrom?: boolean
}

export interface IProductFinish {
	label: string
	colorHex?: string
	img?: IImg
	priceDiff: number
}

export interface IProductHardware {
	brand: string
	description: string
}

/* Вариант конфигурации: фото и объяснение, что меняет цену */
export interface IProductConfiguration {
	title: string
	img: IImg
	description: string
	priceDiff: string
}

export interface IProductPriceFactor {
	title: string
	text: string
}

export interface IProductWarranty {
	term: string
	text: string
}

export interface IProductOrderStep {
	step: number
	title: string
	text: string
}

export interface IProductFile {
	title: string
	url: string
	size: string
	type: 'pdf' | 'dwg' | '3d'
}

export interface IProductVideo {
	url: string
	preview: IImg
}

/* Развёрнутая карточка модели: показывается только на странице товара.
   Поля опциональны — заполнены у эталонной модели, у остальных товаров блоки не рендерятся */
export interface IProductDetails extends IProduct {
	setContents?: IProductCharacteristic[]
	filling?: IProductCharacteristic[]
	hardware?: IProductHardware[]
	finishes?: IProductFinish[]
	modifications?: string[]
	configurations?: IProductConfiguration[]
	priceFactors?: IProductPriceFactor[]
	productionTerm?: string
	warranty?: IProductWarranty
	deliveryPrice?: { title: string; value: string }[]
	liftingTerms?: string
	orderSteps?: IProductOrderStep[]
	files?: IProductFile[]
	video?: IProductVideo | null
}
