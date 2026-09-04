import type { IPageBase } from '@/interfaces/IPageBase'
import type { ICategory } from '@/interfaces/catalog/ICategory'
import type { IFilter } from '@/interfaces/catalog/IFilter'
import type { IProduct } from '@/interfaces/product/IProduct'
import type { IPagination } from '@/interfaces/IPagination'
import type { ISelect } from '@/interfaces/ISelect'

export interface ICatalogPage extends IPageBase {
	categories: ICategory[]
	products?: IProduct[]
	filters?: IFilter[]
	sortOptions?: ISelect[]
	pagination?: IPagination
}
