import type { IPageBase } from '~~/interfaces/IPageBase'

/* Страницы входа, регистрации, восстановления и смены пароля.
   Различаются только текстами, поэтому форма данных на все одна */
export interface IAuthPage extends IPageBase {
	title: string
	text: string
	/* Пояснение под формой: тестовый доступ на входе, судьба кода при регистрации */
	note?: string
}

/* Ответ форм авторизации. regToken приходит только с проверки кода:
   им подписывается второй шаг регистрации */
export interface IAuthFormResponse {
	success: boolean
	message: string
	regToken?: string
}
