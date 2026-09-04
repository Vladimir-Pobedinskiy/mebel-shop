import type { IPageBase } from '@/interfaces/IPageBase'

export interface ICheckoutStep {
	name: string
	label: string
}

export interface ICheckoutDeliveryType {
	value: string
	label: string
	price: number
	term: string
}

export interface ICheckoutPaymentType {
	value: string
	label: string
}

export interface ICheckoutPage extends IPageBase {
	steps: ICheckoutStep[]
	deliveryTypes: ICheckoutDeliveryType[]
	paymentTypes: ICheckoutPaymentType[]
	/* Сумма заказа, с которой доставка бесплатна */
	freeDeliveryFrom: number
	note: string
}
