export interface ISeoMeta {
	name: string
	content: string
}

export interface ISeo {
	h1: string
	title: string
	meta: ISeoMeta[]
	canonical: string
}
