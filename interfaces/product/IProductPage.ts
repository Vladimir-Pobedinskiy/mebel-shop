import type { IPageBase } from '@/interfaces/IPageBase'
import type { IProduct } from '@/interfaces/product/IProduct'
import type { IReview } from '@/interfaces/IReview'

export interface IProductPage extends IPageBase {
	product: IProduct
	related: IProduct[]
	reviews: IReview[]
}
