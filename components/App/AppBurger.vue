<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'
import { useMenuStore } from '@/stores/storeMenu'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useSwipeHandler } from '@/composables/useSwipeHandler'
import { useCommercialModals } from '@/composables/useCommercialModals'
import { screens } from '@/utils/utils'

withDefaults(
	defineProps<{
		/** 'dark' | 'white' */
		color?: string
	}>(),
	{
		color: 'dark',
	}
)

const route = useRoute()

const { isReducedMotion } = useReducedMotion()

const storeGeneral = useGeneralStore()
const burgerNav = computed(() => storeGeneral.header?.burgerNav)
const phone = computed(() => storeGeneral.header?.phone)
const contacts = computed(() => storeGeneral.contacts)
const socials = computed(() => storeGeneral.socials)

const { openCallback, openCalcPrice } = useCommercialModals()

const storeMenu = useMenuStore()
const menuName = computed(() => storeMenu.menuName)
const isOpen = computed(() => menuName.value === 'navigation')
const toggleState = (name: string) => storeMenu.toggleState(name)

// Меню закрывается на любом переходе между страницами
watch(
	() => route.fullPath,
	() => {
		if (isOpen.value) toggleState('navigation')
	}
)

const { $gsap } = useNuxtApp()
const animationTimeline = ref<any>(null)

// Stagger-появление колонок меню; при prefers-reduced-motion анимация не запускается
const animBurgerMenu = () => {
	const tl = $gsap.timeline()

	tl.from('.burger-nav__category-item', { duration: 0.5, opacity: 0, y: 24, stagger: 0.05 }, 0.05)
		.from('.burger-nav__nav-item', { duration: 0.5, opacity: 0, y: 16, stagger: 0.04 }, 0.2)
		.from('.burger-nav__bottom', { duration: 0.5, opacity: 0, y: 20 }, 0.4)

	return tl
}

const navigationRef = ref<HTMLElement | null>(null)

const handleBurgerClick = () => {
	toggleState('navigation')

	if (isReducedMotion.value) return

	if (isOpen.value) {
		animationTimeline.value = animBurgerMenu()
	} else if (animationTimeline.value) {
		animationTimeline.value.kill()
		animationTimeline.value = null
	}
}

useSwipeHandler(navigationRef, 'navigation', 'left', screens.desktopSmall)

onUnmounted(() => {
	if (animationTimeline.value) animationTimeline.value.kill()
})
</script>

<template>
	<div class="burger">
		<button
			:class="['burger__btn', `burger__btn_${color}`, { active: isOpen }]"
			type="button"
			:aria-label="isOpen ? 'Закрыть меню' : 'Открыть меню'"
			:aria-expanded="isOpen"
			@click="handleBurgerClick"
		>
			<span class="burger__btn-line"></span>
			<span class="burger__btn-line"></span>
			<span class="burger__btn-line"></span>
		</button>

		<Transition name="fade">
			<div v-if="isOpen" ref="navigationRef" class="burger-nav">
				<div class="container burger-nav__inner custom-scrollbar">
					<div v-if="burgerNav" class="burger-nav__columns">
						<div class="burger-nav__column">
							<p class="burger-nav__column-title title-14">Каталог</p>
							<ul class="burger-nav__category-list">
								<li v-for="link in burgerNav.navCategory" :key="link.url" class="burger-nav__category-item">
									<NuxtLink class="burger-nav__category-link h3 hover-link" :to="link.url">{{ link.label }}</NuxtLink>
								</li>
							</ul>
						</div>

						<div class="burger-nav__column">
							<p class="burger-nav__column-title title-14">Разделы</p>
							<ul class="burger-nav__nav-list">
								<li v-for="link in burgerNav.navigation" :key="link.url" class="burger-nav__nav-item">
									<NuxtLink class="burger-nav__nav-link text-l hover-link" :to="link.url">{{ link.label }}</NuxtLink>
								</li>
							</ul>
						</div>
					</div>

					<div class="burger-nav__bottom">
						<a v-if="phone" class="burger-nav__phone h4 hover-link" :href="`tel:${phone.url}`">{{ phone.label }}</a>

						<div class="burger-nav__commercial">
							<UIButton
								as="button"
								type="button"
								size="small"
								label="Рассчитать стоимость"
								@click="openCalcPrice('')"
							/>

							<UIButton
								as="button"
								type="button"
								variant="secondary"
								color="dark"
								size="small"
								label="Заказать звонок"
								@click="openCallback"
							/>

							<UIButton
								v-if="contacts?.catalogFile"
								as="a"
								:href="contacts.catalogFile.url"
								variant="secondary"
								color="dark"
								size="small"
								icon="icon-download"
								:label="contacts.catalogFile.label"
								download
								show-icon
							/>
						</div>

						<div class="burger-nav__actions">
							<UIButton
								as="NuxtLink"
								to="/favorites/"
								variant="secondary"
								color="dark"
								size="small"
								label="Избранное"
							/>
							<UIButton as="NuxtLink" to="/cart/" variant="primary" color="accent" size="small" label="Корзина" />
						</div>

						<AppSocialsLinks v-if="socials.length" class="burger-nav__socials" :links="socials" color="dark" />
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.burger-nav__commercial {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.burger {
	display: flex;
	align-items: center;

	@media (min-width: variables.$desktop-small) {
		display: none;
	}

	&__btn-line {
		width: 22px;
		height: 2px;
		border-radius: 2px;
		background-color: variables.$color-ink;
		transition:
			transform 0.35s ease-in-out,
			opacity 0.25s ease-in-out;
	}

	&__btn {
		position: relative;
		z-index: 999;
		width: 44px;
		height: 44px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		border-radius: 50%;
		background-color: transparent;
		cursor: pointer;

		&_dark .burger__btn-line {
			background-color: variables.$color-ink;
		}

		&_white .burger__btn-line {
			background-color: variables.$color-white;
		}

		&.active {
			.burger__btn-line:first-child {
				transform: translateY(7px) rotate(45deg);
			}

			.burger__btn-line:nth-child(2) {
				opacity: 0;
			}

			.burger__btn-line:last-child {
				transform: translateY(-7px) rotate(-45deg);
			}
		}
	}
}

.burger-nav {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 998;
	width: 100%;
	height: 100%;
	height: 100dvh;
	overflow: hidden;
	background-color: variables.$color-bg;

	&__inner {
		padding-top: 88px;
		padding-bottom: 32px;
		overflow-y: auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 40px;
	}

	&__columns {
		display: flex;
		flex-direction: column;
		gap: 32px;

		@media (min-width: variables.$mobile-big) {
			flex-direction: row;
			gap: 48px;
		}
	}

	&__column {
		flex: 1 1 0;
	}

	&__column-title {
		margin-bottom: 16px;
		color: variables.$color-ink-soft;
	}

	&__category-list,
	&__nav-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__bottom {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding-top: 24px;
		border-top: 1px solid variables.$color-line;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
}
</style>
