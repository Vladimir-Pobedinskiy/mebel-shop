import type { IPageBase } from '@/interfaces/IPageBase'
import type { IEmptyState } from '@/interfaces/IEmptyState'
import type { IProduct } from '@/interfaces/product/IProduct'

export interface ICartPage extends IPageBase {
	emptyState: IEmptyState
	recommended: IProduct[]
	promoNote: string
}
