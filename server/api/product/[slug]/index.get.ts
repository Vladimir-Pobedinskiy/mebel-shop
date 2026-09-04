export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const slug = getRouterParam(event, 'slug')

	const response: any = await $fetch(`${config.public.baseUrl}/api/product/${slug}/`)

	return response
})
