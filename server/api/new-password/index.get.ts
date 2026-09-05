export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const response: any = await $fetch(`${config.public.baseUrl}/api/new-password/`)

	return response
})
