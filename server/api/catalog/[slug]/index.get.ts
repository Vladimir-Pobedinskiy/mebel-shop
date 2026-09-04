export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const slug = getRouterParam(event, 'slug')
	const query = getQuery(event)

	const response: any = await $fetch(`${config.public.baseUrl}/api/catalog/${slug}/`, { query })

	return response
})
