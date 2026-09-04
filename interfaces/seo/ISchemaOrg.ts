/* Узел микроразметки из db.json: обязателен только @type, остальные поля свободные —
   Product, Article, Organization и BreadcrumbList имеют разный набор свойств */
export interface ISchemaOrgNode {
	'@type': string
	[key: string]: unknown
}

export type ISchemaOrg = ISchemaOrgNode[]
