import type { IPageBase } from '@/interfaces/IPageBase'
import type { IProduct, IProductDetails } from '@/interfaces/product/IProduct'
import type { IReview } from '@/interfaces/IReview'

export interface IProductPage extends IPageBase {
	product: IProductDetails
	related: IProduct[]
	reviews: IReview[]
}
