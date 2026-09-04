export default defineNuxtRouteMiddleware(to => {
	const { status } = useAuth()
	if (to.path.startsWith('/personal-account/') && status.value === 'unauthenticated') {
		return navigateTo('/login/')
	}
})
