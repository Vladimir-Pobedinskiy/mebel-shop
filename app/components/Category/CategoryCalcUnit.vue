<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { ICategoryCalcUnit } from '~~/interfaces/catalog/ICategoryUnits'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { useToaster } from '@/composables/useToaster'
import { useFormSubmit } from '@/composables/useFormSubmit'

const props = withDefaults(
	defineProps<{
		calcUnit: ICategoryCalcUnit
		/** раздел, из которого пришла заявка — уходит в тело запроса */
		subject?: string
	}>(),
	{
		subject: '',
	}
)

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()
const { showToast } = useToaster()

const { submitForm } = useFormSubmit()

/* Быстрый расчёт: те же правила, что в форме дизайн-проекта на главной,
   плюс размеры проёма — без них считать нечего */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	size: yup.string().required('Укажите размеры проёма').max(120, 'Не больше 120 символов'),
	comment: yup.string().max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', size: '', comment: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: size, errorMessage: sizeError } = useField<string>('size')
const { value: comment, errorMessage: commentError } = useField<string>('comment')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm(
			'/api/calculate-project/',
			{ ...values, subject: props.subject },
			{ success: true, message: 'Заявка на дизайн-проект принята.' }
		)

		showToast({ title: 'Заявка на расчёт принята', text: 'Пришлём смету в течение рабочего дня' })
		resetForm()
	} catch {
		showToast({ title: 'Не удалось отправить заявку', text: 'Попробуйте ещё раз или позвоните нам', type: 'error' })
	} finally {
		isSending.value = false
	}
})

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.category-calc__text', { y: 24, opacity: 0 })
		gsap.set('.category-calc__benefit', { y: 20, opacity: 0 })
		gsap.set('.category-calc__field', { y: 24, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.category-calc__text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.category-calc__benefit', { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.35')
			.to('.category-calc__field', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.4')
	})
})
</script>

<template>
	<section ref="rootRef" class="category-calc">
		<div class="container">
			<div class="category-calc__inner">
				<div class="category-calc__body">
					<p ref="titleRef" class="category-calc__title h2">{{ calcUnit.title }}</p>
					<p class="category-calc__text text-m">{{ calcUnit.text }}</p>

					<ul v-if="calcUnit.benefits?.length" class="category-calc__benefits">
						<li v-for="benefit in calcUnit.benefits" :key="benefit" class="category-calc__benefit text-s">
							<NuxtIcon class="category-calc__benefit-icon" name="icon-check" filled />
							<span>{{ benefit }}</span>
						</li>
					</ul>
				</div>

				<form class="category-calc__form" novalidate @submit="onSubmit">
					<div class="category-calc__field">
						<UIInput
							v-model:value="name"
							name="name"
							placeholder="Ваше имя"
							autocomplete="name"
							:error-value="nameError"
						/>
					</div>

					<div class="category-calc__field">
						<UIInput
							v-model:value="phone"
							name="phone"
							type="tel"
							placeholder="Телефон"
							autocomplete="tel"
							:error-value="phoneError"
						/>
					</div>

					<div class="category-calc__field category-calc__field_full">
						<UIInput
							v-model:value="size"
							name="size"
							placeholder="Размеры проёма: ширина × высота × глубина, мм"
							:error-value="sizeError"
						/>
					</div>

					<div class="category-calc__field category-calc__field_full">
						<UITextarea
							v-model:value="comment"
							name="comment"
							placeholder="Что нужно: тип изделия, наполнение, желаемые материалы"
							:rows="3"
							:error-value="commentError"
						/>
					</div>

					<div class="category-calc__field category-calc__field_full">
						<UICheckbox v-model="agreement" name="agreement" :error-value="agreementError">
							<template #content>
								<span class="category-calc__note text-xs">{{ calcUnit.note }}</span>
							</template>
						</UICheckbox>
					</div>

					<div class="category-calc__field category-calc__field_full">
						<UIButton
							as="button"
							type="submit"
							:label="isSending ? 'Отправляем…' : 'Получить расчёт'"
							:disabled="isSending"
							show-icon
							full
						/>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.category-calc {
	&__inner {
		display: grid;
		overflow: hidden;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;
		background-color: variables.$color-surface;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: 1fr 1fr;
		}
	}

	&__body {
		padding: 32px 24px;
		background-color: variables.$color-muted;

		@media (min-width: variables.$desktop) {
			padding: 56px 48px;
		}
	}

	&__title {
		margin: 0 0 16px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__benefits {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 28px;
	}

	&__benefit {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		color: variables.$color-ink;
	}

	&__benefit-icon {
		width: 16px;
		height: 16px;
		flex: 0 0 auto;
		margin-top: 4px;
		color: variables.$color-accent;
	}

	&__form {
		display: grid;
		gap: 16px;
		padding: 32px 24px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			padding: 56px 48px;
		}
	}

	&__field_full {
		@media (min-width: variables.$mobile-big) {
			grid-column: 1 / -1;
		}
	}

	&__note {
		color: variables.$color-ink-soft;
	}
}
</style>
