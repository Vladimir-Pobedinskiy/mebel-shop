<script setup lang="ts">
import { useScreenHandler } from '@/composables/useScreenHandler'
import { screens } from '@/utils/utils'

withDefaults(
	defineProps<{
		/** 'dark' | 'white' | 'accent' */
		color?: string
	}>(),
	{
		color: 'dark',
	}
)

const route = useRoute()
const { isMatchedScreen } = useScreenHandler(screens.tablet)

// На главной логотип не ссылка — вести с главной на главную незачем
const currentRouteNameComputed = computed(() => route.name)
</script>

<template>
	<template v-if="currentRouteNameComputed === 'index'">
		<span class="logo">
			<span class="visually-hidden">Логотип «Мебель Шоп»</span>
			<template v-if="!isMatchedScreen">
				<NuxtIcon :class="['logo__icon-mobile', `logo__icon-mobile_${color}`]" name="icon-logo-mobile" filled />
			</template>
			<template v-else>
				<NuxtIcon :class="['logo__icon', `logo__icon_${color}`]" name="icon-logo" filled />
			</template>
		</span>
	</template>
	<template v-else>
		<NuxtLink class="logo" to="/" aria-label="Перейти на главную страницу">
			<span class="visually-hidden">Логотип «Мебель Шоп»</span>
			<template v-if="!isMatchedScreen">
				<NuxtIcon :class="['logo__icon-mobile', `logo__icon-mobile_${color}`]" name="icon-logo-mobile" filled />
			</template>
			<template v-else>
				<NuxtIcon :class="['logo__icon', `logo__icon_${color}`]" name="icon-logo" filled />
			</template>
		</NuxtLink>
	</template>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.logo {
	display: inline-block;
	flex-shrink: 0;
	z-index: 999;

	&__icon-mobile {
		width: 40px;
		height: 40px;
	}

	&__icon {
		width: 160px;
		height: 29px;

		@media (min-width: variables.$desktop) {
			width: 200px;
			height: 36px;
		}
	}

	&__icon-mobile,
	&__icon {
		transition: color 0.3s ease-out;

		&_dark {
			color: variables.$color-ink;
		}

		&_white {
			color: variables.$color-white;
		}

		&_accent {
			color: variables.$color-accent;
		}
	}
}
</style>
