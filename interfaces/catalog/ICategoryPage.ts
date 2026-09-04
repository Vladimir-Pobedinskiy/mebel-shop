import type { IPageBase } from '@/interfaces/IPageBase'
import type { ICategory } from '@/interfaces/catalog/ICategory'
import type { IFilter } from '@/interfaces/catalog/IFilter'
import type { IProduct } from '@/interfaces/product/IProduct'
import type { IPagination } from '@/interfaces/IPagination'
import type { ISelect } from '@/interfaces/ISelect'

/* Страница категории каталога: /catalog/<slug>/ и /catalog/<slug>/<collection>/ */
export interface ICategoryPage extends IPageBase {
	category: ICategory
	/** Коммерческое вступление раздела — есть только у корпусной мебели */
	intro?: string
	filters: IFilter[]
	sortOptions: ISelect[]
	products: IProduct[]
	pagination: IPagination
}
