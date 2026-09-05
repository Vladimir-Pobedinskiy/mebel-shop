<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'

/* Плавающие кнопки связи: мессенджеры и онлайн-консультация.
   Ссылки берём из general → contacts в db.json, поэтому номер и аккаунты
   не расходятся с шапкой и подвалом. */
const route = useRoute()

const storeGeneral = useGeneralStore()
const contacts = computed(() => storeGeneral.contacts)
const messengers = computed(() => contacts.value?.messengers || [])

const isOpen = ref<boolean>(false)

/* Модалки монтируем по первому клику — на большинстве сессий они не открываются */
const isConsultUsed = ref<boolean>(false)
const isConsultOpen = ref<boolean>(false)

const toggle = () => {
	isOpen.value = !isOpen.value
}

const openConsult = () => {
	isOpen.value = false
	isConsultUsed.value = true

	nextTick(() => {
		isConsultOpen.value = true
	})
}

// Переход между страницами схлопывает панель, чтобы она не перекрывала контент
watch(
	() => route.fullPath,
	() => {
		isOpen.value = false
	}
)
</script>

<template>
	<div v-if="contacts" class="floating-actions">
		<Transition name="floating-actions-list">
			<ul v-if="isOpen" class="floating-actions__list">
				<li v-for="messenger in messengers" :key="messenger.name" class="floating-actions__item">
					<a
						:class="['floating-actions__link', `floating-actions__link_${messenger.name}`]"
						:href="messenger.url"
						target="_blank"
						rel="noopener nofollow"
					>
						<NuxtIcon class="floating-actions__icon" :name="`icon-${messenger.name}`" filled />
						<span class="floating-actions__body">
							<span class="floating-actions__label title-14">{{ messenger.label }}</span>
							<span class="floating-actions__text text-xs">{{ messenger.text }}</span>
						</span>
					</a>
				</li>

				<li class="floating-actions__item">
					<button class="floating-actions__link floating-actions__link_consult" type="button" @click="openConsult">
						<NuxtIcon class="floating-actions__icon" name="icon-email" filled />
						<span class="floating-actions__body">
							<span class="floating-actions__label title-14">{{ contacts.consult.title }}</span>
							<span class="floating-actions__text text-xs">{{ contacts.consult.text }}</span>
						</span>
					</button>
				</li>

				<li v-if="contacts.phone" class="floating-actions__item">
					<a class="floating-actions__link floating-actions__link_phone" :href="`tel:${contacts.phone.url}`">
						<NuxtIcon class="floating-actions__icon" name="icon-phone" filled />
						<span class="floating-actions__body">
							<span class="floating-actions__label title-14">{{ contacts.phone.label }}</span>
							<span class="floating-actions__text text-xs">{{ contacts.workingHours }}</span>
						</span>
					</a>
				</li>
			</ul>
		</Transition>

		<button
			:class="['floating-actions__toggle', { active: isOpen }]"
			type="button"
			:aria-expanded="isOpen"
			:aria-label="isOpen ? 'Закрыть способы связи' : 'Связаться с нами'"
			@click="toggle"
		>
			<NuxtIcon class="floating-actions__toggle-icon" :name="isOpen ? 'icon-close' : 'icon-phone'" filled />
			<span v-if="!isOpen" class="floating-actions__pulse"></span>
		</button>

		<ModalConsult v-if="isConsultUsed" v-model="isConsultOpen" :subject="contacts.consult.title" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.floating-actions {
	position: fixed;
	right: 16px;
	bottom: 16px;
	z-index: 400;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 12px;

	@media (min-width: variables.$desktop) {
		right: 28px;
		bottom: 28px;
	}

	&__list {
		display: flex;
		max-width: calc(100vw - 32px);
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
	}

	&__icon {
		width: 22px;
		height: 22px;
		flex: 0 0 auto;
	}

	&__link {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
		box-shadow: variables.$shadow-soft;
		color: variables.$color-ink;
		cursor: pointer;
		gap: 12px;
		text-align: left;
		transition:
			border-color 0.3s ease-in-out,
			box-shadow 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: transparent;
				box-shadow: variables.$shadow-hover;
			}
		}

		&_whatsapp .floating-actions__icon {
			color: variables.$color-whatsapp;
		}

		&_telegram .floating-actions__icon {
			color: variables.$color-telegram;
		}

		&_consult .floating-actions__icon,
		&_phone .floating-actions__icon {
			color: variables.$color-accent;
		}
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__text {
		color: variables.$color-ink-soft;
	}

	&__toggle {
		position: relative;
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: variables.$color-accent;
		box-shadow: variables.$shadow-hover;
		color: variables.$color-white;
		cursor: pointer;
		transition: background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-accent-hover;
			}
		}

		&.active {
			background-color: variables.$color-ink;
		}
	}

	&__toggle-icon {
		position: relative;
		z-index: 1;
		width: 22px;
		height: 22px;
	}

	// Пульс подсказывает, что кнопка кликабельна; при reduced-motion не запускается
	&__pulse {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: variables.$color-accent;
		animation: floating-actions-pulse 2.4s ease-out infinite;
	}
}

@keyframes floating-actions-pulse {
	0% {
		opacity: 0.5;
		transform: scale(1);
	}

	70%,
	100% {
		opacity: 0;
		transform: scale(1.6);
	}
}

.floating-actions-list-enter-active,
.floating-actions-list-leave-active {
	transition:
		opacity 0.3s ease-in-out,
		transform 0.3s ease-in-out;
}

.floating-actions-list-enter-from,
.floating-actions-list-leave-to {
	opacity: 0;
	transform: translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
	.floating-actions__pulse {
		animation: none;
	}

	.floating-actions-list-enter-active,
	.floating-actions-list-leave-active {
		transition: none;
	}
}
</style>
