import type { IPageBase } from '@/interfaces/IPageBase'
import type { ILink } from '@/interfaces/ILink'

export interface IMapCity {
	name: string
	coords: [number, number]
	zoom: number
}

export interface IMapMarker {
	id: number
	title: string
	address: string
	operatingMode: string
	phone: ILink
	coords: [number, number]
}

export interface IMapPage extends IPageBase {
	cities: IMapCity[]
	markers: IMapMarker[]
}
