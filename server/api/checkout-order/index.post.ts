export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const body = await readBody(event)

	if (!body?.items?.length) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Корзина пуста',
		})
	}

	/* Ответ читаем GET-запросом из ключа-заглушки: json-server на singular-ресурсе
	   перезаписывает ключ db.json телом POST-запроса и теряет заглушку. */
	const response: any = await $fetch(`${config.public.baseUrl}/api/checkout-order/`)

	return response
})
