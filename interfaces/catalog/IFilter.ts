export interface IFilterOption {
	value: string
	label: string
	count: number
	colorHex?: string
}

export interface IFilter {
	name: string
	label: string
	type: 'checkbox' | 'range' | 'color' | 'toggle'
	options?: IFilterOption[]
	min?: number
	max?: number
}
