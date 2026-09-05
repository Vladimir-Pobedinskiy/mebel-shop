<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { IImg } from '~~/interfaces/IImg'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'
import { useMagneticHover } from '@/composables/useMagneticHover'
import { useFormSubmit } from '@/composables/useFormSubmit'

defineProps<{
	ctaUnit: { title: string; text: string; img: IImg; note: string }
}>()

const rootRef = ref<HTMLElement | null>(null)

const { submitForm } = useFormSubmit()
const titleRef = ref<HTMLElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

useMagneticHover(rootRef, '.home-cta__submit')

/* Заявка на дизайн-проект: vee-validate + yup, маска телефона — внутри UIInput */
const validationSchema = yup.object({
	name: yup.string().required('Укажите, как к вам обращаться').min(2, 'Слишком короткое имя'),
	phone: yup
		.string()
		.required('Укажите телефон для связи')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Телефон в формате +7 (999) 123-45-67'),
	comment: yup.string().max(1000, 'Не больше 1000 символов'),
	agreement: yup.boolean().oneOf([true], 'Нужно согласие на обработку данных'),
})

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	initialValues: { name: '', phone: '', comment: '', agreement: false },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: comment, errorMessage: commentError } = useField<string>('comment')
const { value: agreement, errorMessage: agreementError } = useField<boolean>('agreement')

const isSending = ref<boolean>(false)
const isToastShown = ref<boolean>(false)
const toastType = ref<'success' | 'error'>('success')
const toastTitle = ref<string>('')
const toastText = ref<string>('')

const onSubmit = handleSubmit(async values => {
	isSending.value = true

	try {
		await submitForm('/api/calculate-project/', values, { success: true, message: 'Заявка на дизайн-проект принята.' })

		toastType.value = 'success'
		toastTitle.value = 'Заявка отправлена'
		toastText.value = 'Дизайнер свяжется с вами в течение рабочего дня'
		resetForm()
	} catch {
		toastType.value = 'error'
		toastTitle.value = 'Не удалось отправить заявку'
		toastText.value = 'Попробуйте ещё раз или позвоните нам'
	} finally {
		isSending.value = false
		isToastShown.value = true
	}
})

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-cta__text', { y: 24, opacity: 0 })
		gsap.set('.home-cta__field', { y: 24, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-cta__text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
			.to('.home-cta__field', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.35')

		gsap.to(mediaRef.value, {
			yPercent: 10,
			ease: 'none',
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top bottom', end: 'bottom top', scrub: true },
		})
	})
})
</script>

<template>
	<section ref="rootRef" class="home-cta offset">
		<div class="container">
			<div class="home-cta__inner">
				<div class="home-cta__media-wrapper">
					<div ref="mediaRef" class="home-cta__media">
						<NuxtImg
							class="home-cta__img"
							:src="ctaUnit.img.url"
							:alt="ctaUnit.img.alt"
							loading="lazy"
							sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw"
						/>
					</div>
				</div>

				<div class="home-cta__body">
					<p ref="titleRef" class="home-cta__title h2">{{ ctaUnit.title }}</p>
					<p class="home-cta__text text-m">{{ ctaUnit.text }}</p>

					<form class="home-cta__form" novalidate @submit="onSubmit">
						<div class="home-cta__field">
							<UIInput v-model:value="name" name="name" placeholder="Ваше имя" :error-value="nameError" />
						</div>

						<div class="home-cta__field">
							<UIInput
								v-model:value="phone"
								name="phone"
								type="tel"
								placeholder="Телефон"
								autocomplete="tel"
								:error-value="phoneError"
							/>
						</div>

						<div class="home-cta__field home-cta__field_full">
							<UITextarea
								v-model:value="comment"
								name="comment"
								placeholder="Комментарий: комната, размеры, сроки"
								:rows="3"
								:error-value="commentError"
							/>
						</div>

						<div class="home-cta__field home-cta__field_full">
							<UICheckbox v-model="agreement" name="agreement" :error-value="agreementError">
								<template #content>
									<span class="home-cta__note text-xs">{{ ctaUnit.note }}</span>
								</template>
							</UICheckbox>
						</div>

						<div class="home-cta__field home-cta__field_full">
							<UIButton
								class="home-cta__submit"
								as="button"
								type="submit"
								:label="isSending ? 'Отправляем…' : 'Отправить заявку'"
								:disabled="isSending"
								show-icon
							/>
						</div>
					</form>
				</div>
			</div>
		</div>

		<UIToast v-model="isToastShown" :type="toastType" :title="toastTitle" :text="toastText" />
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-cta {
	&__inner {
		display: grid;
		overflow: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-l;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: 1fr 1fr;
		}
	}

	&__media-wrapper {
		position: relative;
		min-height: 240px;
		overflow: hidden;
		background-color: variables.$color-muted;

		@media (min-width: variables.$tablet-big) {
			min-height: 100%;
		}
	}

	&__media {
		position: absolute;
		inset: -6% 0;
		will-change: transform;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__body {
		padding: 32px 24px;

		@media (min-width: variables.$desktop) {
			padding: 56px 48px;
		}
	}

	&__title {
		margin: 0 0 16px;
	}

	&__text {
		margin: 0 0 28px;
		color: variables.$color-ink-soft;
	}

	&__form {
		display: grid;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
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
