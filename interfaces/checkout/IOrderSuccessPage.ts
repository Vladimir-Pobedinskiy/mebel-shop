import type { IPageBase } from '~~/interfaces/IPageBase'
import type { ILink } from '~~/interfaces/ILink'

export interface IOrderSuccessPage extends IPageBase {
	title: string
	text: string
	number: string
	nextSteps: string[]
	link: ILink
}
