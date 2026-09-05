<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'
import { useMenuStore } from '@/stores/storeMenu'
import { useCartStore } from '@/stores/storeCart'
import { useFavoritesStore } from '@/stores/storeFavorites'
import { useCompareStore } from '@/stores/storeCompare'
import { useScreenHandler } from '@/composables/useScreenHandler'
import { useCommercialModals } from '@/composables/useCommercialModals'
import { useAssetUrl } from '@/composables/useAssetUrl'
import { screens } from '@/utils/utils'

const route = useRoute()
const router = useRouter()

const { isMatchedScreen } = useScreenHandler(screens.desktopSmall)

const storeGeneral = useGeneralStore()
const header = computed(() => storeGeneral.header)
const contacts = computed(() => storeGeneral.contacts)

/* Коммерческие кнопки шапки открывают общие модалки из AppCommercialModals */
const { openCallback, openCalcPrice } = useCommercialModals()
const { assetUrl } = useAssetUrl()

const storeMenu = useMenuStore()
const menuName = computed(() => storeMenu.menuName)
const isMegaMenuOpen = computed(() => menuName.value === 'catalog')

const storeCart = useCartStore()
const storeFavorites = useFavoritesStore()
const storeCompare = useCompareStore()

/* Счётчик корзины отскакивает на каждое изменение количества, а не пульсирует бесконечно */
const isCounterBumped = ref<boolean>(false)
let bumpTimerId: ReturnType<typeof setTimeout> | null = null

watch(
	() => storeCart.totalCount,
	(count, previousCount) => {
		if (!import.meta.client || count <= (previousCount || 0)) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		isCounterBumped.value = false

		nextTick(() => {
			isCounterBumped.value = true
			if (bumpTimerId) clearTimeout(bumpTimerId)
			bumpTimerId = setTimeout(() => (isCounterBumped.value = false), 600)
		})
	}
)

onUnmounted(() => {
	if (bumpTimerId) clearTimeout(bumpTimerId)
})

/* Поиск в шапке */
const isSearchOpen = ref<boolean>(false)
const searchPhrase = ref<string>('')

/* Прозрачная шапка на hero главной, «стеклянная» — после скролла */
const isScrolled = ref<boolean>(false)
const isHomePage = computed(() => route.name === 'index')
const isTransparent = computed(
	() => isHomePage.value && !isScrolled.value && !isMegaMenuOpen.value && !isSearchOpen.value
)
const colorScheme = computed(() => (isTransparent.value ? 'white' : 'dark'))

const onScroll = () => {
	isScrolled.value = window.scrollY > 40
}

onMounted(() => {
	onScroll()
	window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll)
})

/* Мега-меню каталога — только на десктопе */
const toggleMegaMenu = () => {
	if (!isMatchedScreen.value) return
	storeMenu.toggleState('catalog')
}

const closeMegaMenu = () => {
	if (isMegaMenuOpen.value) storeMenu.toggleState('catalog')
}

const toggleSearch = () => {
	isSearchOpen.value = !isSearchOpen.value
	closeMegaMenu()
}

const onSearchSubmit = (phrase: string) => {
	if (!phrase) return
	isSearchOpen.value = false
	router.push({ path: '/search/', query: { phrase } })
}

// Любой переход закрывает мега-меню и поиск
watch(
	() => route.fullPath,
	() => {
		closeMegaMenu()
		isSearchOpen.value = false
	}
)
</script>

<template>
	<header
		:class="[
			'header',
			{ header_transparent: isTransparent },
			{ header_solid: !isTransparent },
			{ 'header_menu-open': isMegaMenuOpen },
		]"
		@keydown.esc="closeMegaMenu"
	>
		<div v-if="header?.topLine" class="header__top-line">
			<div class="container header__top-line-inner">
				<p class="header__top-line-text text-xs">{{ header.topLine }}</p>

				<div class="header__top-line-actions">
					<a
						v-if="contacts?.catalogFile"
						class="header__top-line-link text-xs hover-link"
						:href="assetUrl(contacts.catalogFile.url)"
						:title="`${contacts.catalogFile.title}, ${contacts.catalogFile.size}`"
						download
					>
						<NuxtIcon class="header__top-line-icon" name="icon-download" filled />
						<span>{{ contacts.catalogFile.label }}</span>
					</a>

					<button class="header__top-line-link text-xs hover-link" type="button" @click="openCallback">
						<NuxtIcon class="header__top-line-icon" name="icon-phone" filled />
						<span>Заказать звонок</span>
					</button>

					<a v-if="header.phone" class="header__top-line-phone text-xs hover-link" :href="`tel:${header.phone.url}`">
						{{ header.phone.label }}
					</a>

					<button class="header__top-line-btn button-typo" type="button" @click="openCalcPrice('')">
						Рассчитать стоимость
					</button>
				</div>
			</div>
		</div>

		<div class="header__main">
			<div class="container header__inner">
				<AppBurger :color="colorScheme" />

				<AppLogo class="header__logo" :color="colorScheme" />

				<nav v-if="header" class="header__nav" aria-label="Основная навигация">
					<button
						class="header__nav-link header__nav-btn menu"
						type="button"
						:aria-expanded="isMegaMenuOpen"
						@click="toggleMegaMenu"
					>
						<span>{{ header.megaMenu.title }}</span>
						<NuxtIcon :class="['header__nav-caret', { active: isMegaMenuOpen }]" name="icon-caret" filled />
					</button>

					<NuxtLink
						v-for="link in header.navigation.filter(item => item.url !== '/catalog/')"
						:key="link.url"
						class="header__nav-link menu hover-link"
						:to="link.url"
					>
						{{ link.label }}
					</NuxtLink>
				</nav>

				<div class="header__actions">
					<button
						class="header__action"
						type="button"
						:aria-label="isSearchOpen ? 'Закрыть поиск' : 'Открыть поиск'"
						@click="toggleSearch"
					>
						<NuxtIcon class="header__action-icon" :name="isSearchOpen ? 'icon-close' : 'icon-search'" filled />
					</button>

					<NuxtLink class="header__action header__action_hide-mobile" to="/compare/" aria-label="Сравнение товаров">
						<NuxtIcon class="header__action-icon" name="icon-compare" filled />
						<ClientOnly>
							<span v-if="storeCompare.totalCount" class="header__counter">{{ storeCompare.totalCount }}</span>
						</ClientOnly>
					</NuxtLink>

					<NuxtLink class="header__action" to="/favorites/" aria-label="Избранное">
						<NuxtIcon class="header__action-icon" name="icon-heart" filled />
						<ClientOnly>
							<span v-if="storeFavorites.totalCount" class="header__counter">{{ storeFavorites.totalCount }}</span>
						</ClientOnly>
					</NuxtLink>

					<NuxtLink
						class="header__action header__action_hide-mobile"
						to="/personal-account/orders/"
						aria-label="Личный кабинет"
					>
						<NuxtIcon class="header__action-icon" name="icon-user" filled />
					</NuxtLink>

					<NuxtLink class="header__action header__action_cart" to="/cart/" aria-label="Корзина" data-cart-target>
						<NuxtIcon class="header__action-icon" name="icon-cart" filled />
						<ClientOnly>
							<span v-if="storeCart.totalCount" :class="['header__counter', { header__counter_bump: isCounterBumped }]">
								{{ storeCart.totalCount }}
							</span>
						</ClientOnly>
					</NuxtLink>
				</div>
			</div>
		</div>

		<Transition name="blur-in">
			<div v-if="isSearchOpen" class="header__search">
				<div class="container header__search-inner">
					<UISearchInput
						v-model="searchPhrase"
						placeholder="Что ищете? Например, диван Milano"
						@submit="onSearchSubmit"
					/>
				</div>
			</div>
		</Transition>

		<Transition name="blur-in">
			<div v-if="isMegaMenuOpen && header" class="header__mega-menu">
				<div class="container header__mega-menu-inner">
					<ul class="header__mega-menu-categories">
						<li v-for="category in header.megaMenu.categories" :key="category.url" class="header__mega-menu-category">
							<NuxtLink class="header__mega-menu-category-link title-18 hover-link" :to="category.url">
								{{ category.label }}
							</NuxtLink>
							<ul class="header__mega-menu-children">
								<li v-for="child in category.children" :key="child.url">
									<NuxtLink class="header__mega-menu-child text-s hover-link" :to="child.url">
										{{ child.label }}
									</NuxtLink>
								</li>
							</ul>
						</li>
					</ul>

					<div class="header__mega-menu-promo surface">
						<p class="header__mega-menu-promo-title h4">{{ header.megaMenu.promo.title }}</p>
						<p class="header__mega-menu-promo-text text-s">{{ header.megaMenu.promo.text }}</p>
						<UIButton
							class="header__mega-menu-promo-btn"
							as="NuxtLink"
							:to="header.megaMenu.promo.link.url"
							variant="primary"
							color="accent"
							size="small"
							:label="header.megaMenu.promo.link.label"
							show-icon
						/>
					</div>
				</div>
			</div>
		</Transition>

		<button
			v-if="isMegaMenuOpen"
			class="header__overlay"
			type="button"
			aria-label="Закрыть меню каталога"
			@click="closeMegaMenu"
		></button>
	</header>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.header {
	position: sticky;
	top: 0;
	z-index: 500;
	width: 100%;
	transition:
		background-color 0.4s ease-in-out,
		border-color 0.4s ease-in-out,
		color 0.4s ease-in-out;

	&_solid {
		color: variables.$color-ink;
		background-color: rgb(247 244 239 / 80%);
		border-bottom: 1px solid variables.$color-line;
		backdrop-filter: blur(16px);
	}

	&_transparent {
		color: variables.$color-white;
		background-color: transparent;
		border-bottom: 1px solid transparent;
	}

	&__top-line {
		display: none;
		border-bottom: 1px solid currentcolor;

		@media (min-width: variables.$desktop-small) {
			display: block;
			border-color: rgb(107 99 87 / 15%);
		}
	}

	&__top-line-inner {
		display: flex;
		gap: 24px;
		align-items: center;
		justify-content: space-between;
		padding-top: 8px;
		padding-bottom: 8px;
	}

	// При нехватке ширины ужимается промо-строка, а не контакты справа
	&__top-line-text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__top-line-actions {
		display: flex;
		flex-shrink: 0;
		gap: 16px;
		align-items: center;

		@media (min-width: variables.$desktop) {
			gap: 20px;
		}
	}

	&__top-line-link {
		display: flex;
		gap: 6px;
		align-items: center;
		color: inherit;
		white-space: nowrap;
		cursor: pointer;
		background-color: transparent;
	}

	&__top-line-icon {
		width: 14px;
		height: 14px;
	}

	&__top-line-phone {
		font-weight: 600;
		white-space: nowrap;
	}

	// Компактный CTA: обычная кнопка в 40px распирает строку контактов
	&__top-line-btn {
		display: flex;
		align-items: center;
		height: 30px;
		padding: 0 16px;
		color: variables.$color-white;
		white-space: nowrap;
		cursor: pointer;
		background-color: variables.$color-accent;
		border-radius: 999px;
		transition: background-color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				background-color: variables.$color-accent-hover;
			}
		}
	}

	&__inner {
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		min-height: 64px;

		@media (min-width: variables.$desktop) {
			gap: 32px;
			min-height: 80px;
		}
	}

	&__nav {
		display: none;

		@media (min-width: variables.$desktop-small) {
			display: flex;
			gap: 20px;
			align-items: center;
			margin-right: auto;
		}

		@media (min-width: variables.$desktop-big) {
			gap: 28px;
		}
	}

	&__nav-link {
		color: inherit;
		white-space: nowrap;
	}

	&__nav-btn {
		display: flex;
		gap: 8px;
		align-items: center;
		color: inherit;
		cursor: pointer;
		background-color: transparent;
		transition: color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-accent;
			}
		}
	}

	&__nav-caret {
		width: 10px;
		height: 10px;
		transition: transform 0.3s ease-in-out;

		&.active {
			transform: rotate(180deg);
		}
	}

	&__actions {
		display: flex;
		gap: 2px;
		align-items: center;

		@media (min-width: variables.$desktop) {
			gap: 4px;
		}
	}

	&__action {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: inherit;
		cursor: pointer;
		background-color: transparent;
		border-radius: 50%;
		transition:
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-white;
				background-color: variables.$color-accent;
			}
		}

		&_hide-mobile {
			display: none;

			@media (min-width: variables.$tablet) {
				display: flex;
			}
		}
	}

	&__action-icon {
		width: 20px;
		height: 20px;
	}

	&__counter {
		position: absolute;
		top: 4px;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		font-size: 11px;
		font-weight: 600;
		color: variables.$color-white;
		background-color: variables.$color-accent;
		border-radius: 999px;
	}

	&__counter_bump {
		animation: counter-bump 0.6s ease-in-out;
	}

	&__logo {
		@media (min-width: variables.$desktop-small) {
			margin-right: 8px;
		}
	}

	&__search {
		background-color: variables.$color-surface;
		border-top: 1px solid variables.$color-line;
	}

	&__search-inner {
		padding-top: 16px;
		padding-bottom: 16px;
	}

	&__mega-menu {
		display: none;
		background-color: variables.$color-bg;
		border-top: 1px solid variables.$color-line;

		@media (min-width: variables.$desktop-small) {
			display: block;
		}
	}

	&__mega-menu-inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
		padding-top: 32px;
		padding-bottom: 40px;

		@media (min-width: variables.$desktop) {
			grid-template-columns: 1fr 300px;
		}
	}

	&__mega-menu-categories {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 28px 24px;

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	&__mega-menu-children {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 12px;
	}

	&__mega-menu-child {
		color: variables.$color-ink-soft;
	}

	&__mega-menu-promo {
		display: flex;
		flex-direction: column;
		gap: 12px;
		align-items: flex-start;
		padding: 24px;
	}

	&__mega-menu-promo-text {
		color: variables.$color-ink-soft;
	}

	&__mega-menu-promo-btn {
		margin-top: 8px;
	}

	&__overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100vh;
		cursor: default;
		background-color: rgb(28 26 23 / 35%);
		border: 0;
	}
}
</style>
