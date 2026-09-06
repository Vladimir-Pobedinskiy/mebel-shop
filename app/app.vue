<script setup lang="ts">
import { useSiteSchemaOrg } from '@/composables/useSiteSchemaOrg'

// Organization + WebSite для всех страниц сразу
useSiteSchemaOrg()
</script>

<template>
	<NuxtLoadingIndicator :color="'#b4632a'" />
	<div class="body-inner">
		<AppHeader />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>

		<AppFooter />

		<AppFloatingActions />

		<AppCursor />
		<AppToaster />
		<AppCommercialModals />
	</div>
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
	transition: all 0.5s ease-in-out;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}

/* Смена лейаута случается только на переходе к странице ошибки и обратно,
   поэтому гасим мягче и без размытия — резкий блюр там читается как сбой */
.layout-enter-active,
.layout-leave-active {
	transition: opacity 0.3s ease-in-out;
}

.layout-enter-from,
.layout-leave-to {
	opacity: 0;
}
</style>
