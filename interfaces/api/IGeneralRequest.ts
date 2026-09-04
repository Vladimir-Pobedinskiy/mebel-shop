import type { IHeader, IFooter, ISocialLink } from '@/interfaces/IGeneral'

export interface IGeneralRequest {
	header: IHeader
	footer: IFooter
	socials: ISocialLink[]
}
