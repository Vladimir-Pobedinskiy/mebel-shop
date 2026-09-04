/**
	Статусы заказа:
		1. Новый: new
		2. Подтверждён: confirmed
		3. В производстве: in-production
		4. В доставке: in-delivery
		5. Выполнен: completed
		6. Отменён: cancelled
 */
export interface IStatus {
	value: string
	label: string
}
