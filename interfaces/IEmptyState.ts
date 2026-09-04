import type { ILink } from '@/interfaces/ILink'

/* Заглушка для пустых списков: корзина, избранное, сравнение */
export interface IEmptyState {
	title: string
	text: string
	link: ILink
}
