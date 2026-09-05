import type { IPageBase } from '~~/interfaces/IPageBase'
import type { IImg } from '~~/interfaces/IImg'
import type { IAdvantage } from '~~/interfaces/IAdvantage'

export interface IAboutCounter {
	value: number
	suffix: string
	label: string
}

export interface IAboutTimelineItem {
	year: string
	text: string
}

export interface IAboutProductionStage {
	title: string
	text: string
}

export interface IAboutPage extends IPageBase {
	banner: { title: string; text: string; img: IImg }
	counters: IAboutCounter[]
	advantages: IAdvantage[]
	timeline: IAboutTimelineItem[]
	production: { title: string; text: string; stages: IAboutProductionStage[]; gallery: IImg[] }
	team: { title: string; text: string; items: { value: number; label: string }[] }
}
