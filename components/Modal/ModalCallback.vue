<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useGeneralStore } from '@/stores/storeGeneral'
import { useToaster } from '@/composables/useToaster'
import { useFormSubmit } from '@/composables/useFormSubmit'

const isOpen = defineModel<boolean>('modelValue', { default: false })

const storeGeneral = useGeneralStore()
const contacts = computed(() => storeGeneral.contacts)

const { showToast } = useToaster()

const { submitForm } = useFormSubmit()

/* Обратный звонок: имя, телефон и удобное время — остальное менеджер уточнит сам */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	time: yup.string().max(60, 'Не больше 60 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', time: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: time, errorMessage: timeError } = useField<string>('time')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm('/api/callback/', values, {
			success: true,
			message: 'Заявка принята, менеджер перезвонит в ближайшее время.',
		})

		showToast({
			title: 'Заявка на звонок принята',
			text: contacts.value?.replyTime || 'Ответим в течение 15 минут в рабочее время',
		})
		resetForm()
		isOpen.value = false
	} catch {
		showToast({ title: 'Не удалось отправить заявку', text: 'Попробуйте ещё раз', type: 'error' })
	} finally {
		isSending.value = false
	}
})
</script>

<template>
	<UIModal v-model="isOpen" modal-id="callback" name="callback" size="small" :is-loading="isSending" lock-scroll>
		<template #header>
			<p class="modal-callback__title h4">Заказать звонок</p>
			<p class="modal-callback__subtitle text-s">
				Перезвоним и ответим на вопросы по моделям, срокам и цене.
				<template v-if="contacts?.workingHours">Работаем {{ contacts.workingHours }}.</template>
			</p>
		</template>

		<template #body>
			<form class="modal-callback__form" novalidate @submit="onSubmit">
				<UIInput v-model:value="name" name="name" placeholder="Имя" autocomplete="name" :error-value="nameError" />

				<UIInput
					v-model:value="phone"
					name="phone"
					type="tel"
					placeholder="Телефон"
					autocomplete="tel"
					:error-value="phoneError"
				/>

				<UIInput
					v-model:value="time"
					name="time"
					placeholder="Когда удобно звонить"
					autocomplete="off"
					:error-value="timeError"
				/>

				<UICheckbox v-model="agreement" name="callback-agreement" :error-value="agreementError">
					<template #content>
						<span class="modal-callback__note text-xs">Согласен на обработку персональных данных</span>
					</template>
				</UICheckbox>

				<UIButton
					as="button"
					type="submit"
					:label="isSending ? 'Отправляем…' : 'Жду звонка'"
					:disabled="isSending"
					full
					show-icon
				/>

				<p class="modal-callback__reply text-xs">
					{{ contacts?.replyTime || 'Ответим в течение 15 минут в рабочее время' }}.
				</p>

				<a v-if="contacts?.phone" class="modal-callback__phone title-14 hover-link" :href="`tel:${contacts.phone.url}`">
					Или позвоните сами: {{ contacts.phone.label }}
				</a>
			</form>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-callback {
	&__title {
		margin: 0 0 8px;
	}

	&__subtitle {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__form {
		display: grid;
		gap: 16px;
	}

	&__reply {
		margin: 0;
		color: variables.$color-ink-soft;
		text-align: center;
	}

	&__phone {
		color: variables.$color-accent;
		text-align: center;
	}
}
</style>
