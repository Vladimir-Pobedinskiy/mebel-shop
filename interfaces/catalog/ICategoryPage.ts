import type { IPageBase } from '@/interfaces/IPageBase'
import type { ICategory } from '@/interfaces/catalog/ICategory'
import type { IFilter } from '@/interfaces/catalog/IFilter'
import type { IProduct } from '@/interfaces/product/IProduct'
import type { IPagination } from '@/interfaces/IPagination'
import type { ISelect } from '@/interfaces/ISelect'
import type {
	ICategoryStat,
	ICategorySubcategoriesUnit,
	ICategoryCalcUnit,
	ICategoryAdvantagesUnit,
	ICategoryMaterialsUnit,
	ICategoryStagesUnit,
	ICategoryDeliveryUnit,
	ICategoryWarrantyUnit,
	ICategoryProjectsUnit,
	ICategoryFaqUnit,
	ICategoryLinksUnit,
} from '@/interfaces/catalog/ICategoryUnits'

/* Страница категории каталога: /catalog/<slug>/ и /catalog/<slug>/<collection>/ */
export interface ICategoryPage extends IPageBase {
	category: ICategory
	/** Коммерческое вступление раздела — есть только у корпусной мебели */
	intro?: string
	/** Заголовок вступительного блока */
	introTitle?: string
	filters: IFilter[]
	sortOptions: ISelect[]
	products: IProduct[]
	pagination: IPagination
	/* Коммерческие блоки: рендерятся по наличию поля, у обычных категорий их нет */
	introStats?: ICategoryStat[]
	subcategoriesUnit?: ICategorySubcategoriesUnit
	calcUnit?: ICategoryCalcUnit
	advantagesUnit?: ICategoryAdvantagesUnit
	materialsUnit?: ICategoryMaterialsUnit
	stagesUnit?: ICategoryStagesUnit
	deliveryUnit?: ICategoryDeliveryUnit
	warrantyUnit?: ICategoryWarrantyUnit
	projectsUnit?: ICategoryProjectsUnit
	faqUnit?: ICategoryFaqUnit
	linksUnit?: ICategoryLinksUnit
}
