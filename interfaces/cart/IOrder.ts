import type { ICartItem } from '@/interfaces/cart/ICartItem'

export interface IOrderCustomer {
	name: string
	phone: string
	email: string
}

export interface IOrderDelivery {
	type: string
	city: string
	address: string
	date: string
	price: number
}

export interface IOrder {
	number: string
	createdAt: string
	status: string
	customer: IOrderCustomer
	delivery: IOrderDelivery
	payment: string
	comment: string
	items: ICartItem[]
	total: number
	discount: number
}
