export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const id = getRouterParam(event, 'id')

	const response: any = await $fetch(`${config.public.baseUrl}/api/personal-account/orders/${id}/`)

	return response
})
