export default defineNuxtRouteMiddleware(to => {
	if (to.path === '/personal-account/') {
		return navigateTo('/personal-account/active-orders/', {
			redirectCode: 301, // Указываем redirectCode: 301 для SEO-оптимизации (постоянный редирект)
		})
	}
})
