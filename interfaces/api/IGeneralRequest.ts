import type { IHeader, IFooter, ISocialLink, IContacts, ITrustUnit } from '@/interfaces/IGeneral'

export interface IGeneralRequest {
	header: IHeader
	footer: IFooter
	socials: ISocialLink[]
	contacts: IContacts
	trustUnit: ITrustUnit
}
