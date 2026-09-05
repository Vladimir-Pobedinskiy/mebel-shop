/* Единая отправка форм.

   На статической витрине (GitHub Pages) бэкенда нет: POST в /api/ вернул бы 404,
   и каждая форма упиралась бы в ошибку. В этом режиме запрос не уходит вовсе —
   форма отдаёт заранее заданный ответ, тот же, что присылает json-server.
   Режим включает переменная STATIC_DEMO на этапе сборки; в обычной сборке
   и в разработке формы работают как раньше. */
export const useFormSubmit = () => {
	const config = useRuntimeConfig()
	const isStaticDemo = computed(() => Boolean(config.public.staticDemo))

	const submitForm = async <T>(url: string, body: Record<string, unknown>, demoResponse: T): Promise<T> => {
		if (!isStaticDemo.value) return await $fetch<T>(url, { method: 'POST', body })

		// Пауза, чтобы состояние «Отправляем…» было заметно и отправка не выглядела фальшивой
		await new Promise(resolve => setTimeout(resolve, 600))

		return demoResponse
	}

	return { isStaticDemo, submitForm }
}
