import type { IImg } from '~~/interfaces/IImg'
import type { ILink } from '~~/interfaces/ILink'

export interface IArticlePreview {
	id: number
	slug: string
	/** слаг раздела блога: guide | materials | interior | care */
	section: string
	title: string
	description: string
	date: string
	category: string
	readingTime: string
	img: IImg
	link: ILink
}
