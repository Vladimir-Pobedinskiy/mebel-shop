export default defineNuxtRouteMiddleware(to => {
	if (to.path !== '/' && !to.path.endsWith('/')) {
		const { path, query, hash } = to
		const nextRoute = { path: path + '/', query, hash }
		return navigateTo(nextRoute, { redirectCode: 301 })
	}
})
