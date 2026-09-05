import type { IImg } from '~~/interfaces/IImg'

export interface IReview {
	id: number
	author: string
	city: string
	date: string
	rating: number
	text: string
	avatar: IImg | null
	productTitle: string
}
