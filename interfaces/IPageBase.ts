import type { ISeo } from '~~/interfaces/seo/ISeo'
import type { ISchemaOrg } from '~~/interfaces/seo/ISchemaOrg'
import type { IBreadcrumb } from '~~/interfaces/IBreadcrumb'

/* Базовая обёртка любой страницы: SEO + микроразметка + хлебные крошки */
export interface IPageBase {
	seo: ISeo
	schemaOrg: ISchemaOrg
	breadcrumbs: IBreadcrumb[]
}
