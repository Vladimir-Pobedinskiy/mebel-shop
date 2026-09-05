import type { IPageBase } from '~~/interfaces/IPageBase'
import type { IEmptyState } from '~~/interfaces/IEmptyState'

export interface IComparePage extends IPageBase {
	emptyState: IEmptyState
	/* Названия характеристик, которые показываем строками таблицы сравнения */
	characteristicKeys: string[]
}
