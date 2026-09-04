export default defineEventHandler(async event => {
	const config = useRuntimeConfig()

	// Тело запроса вычитываем, но дальше не передаём: json-server на singular-ресурсе
	// перезаписал бы ключ-заглушку в db.json телом POST-запроса.
	await readBody(event)

	const response: any = await $fetch(`${config.public.baseUrl}/api/auth-login/`)

	return response
})
