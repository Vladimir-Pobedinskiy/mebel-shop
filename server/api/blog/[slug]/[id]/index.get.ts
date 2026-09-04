export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const slug = getRouterParam(event, 'slug')
	const id = getRouterParam(event, 'id')

	const response: any = await $fetch(`${config.public.baseUrl}/api/blog/${slug}/${id}/`)

	return response
})
