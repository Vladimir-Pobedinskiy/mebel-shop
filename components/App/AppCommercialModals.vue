<script setup lang="ts">
import { useCommercialModals } from '@/composables/useCommercialModals'

/* Единая точка монтирования коммерческих модалок. Каждое окно появляется в DOM
   только после первого открытия — на большинстве сессий их не открывают вовсе. */
const { state } = useCommercialModals()

const isCallbackUsed = ref<boolean>(false)
const isCalcPriceUsed = ref<boolean>(false)
const isPriceRequestUsed = ref<boolean>(false)

const isCallbackOpen = computed({
	get: () => state.value.isCallbackOpen,
	set: value => (state.value.isCallbackOpen = value),
})
const isCalcPriceOpen = computed({
	get: () => state.value.isCalcPriceOpen,
	set: value => (state.value.isCalcPriceOpen = value),
})
const isPriceRequestOpen = computed({
	get: () => state.value.isPriceRequestOpen,
	set: value => (state.value.isPriceRequestOpen = value),
})

watch(
	() => state.value.isCallbackOpen,
	value => {
		if (value) isCallbackUsed.value = true
	},
	{ immediate: true }
)

watch(
	() => state.value.isCalcPriceOpen,
	value => {
		if (value) isCalcPriceUsed.value = true
	},
	{ immediate: true }
)

watch(
	() => state.value.isPriceRequestOpen,
	value => {
		if (value) isPriceRequestUsed.value = true
	},
	{ immediate: true }
)
</script>

<template>
	<div class="commercial-modals">
		<ModalCallback v-if="isCallbackUsed" v-model="isCallbackOpen" />
		<ModalCalcPrice v-if="isCalcPriceUsed" v-model="isCalcPriceOpen" :subject="state.subject" />
		<ModalPriceRequest v-if="isPriceRequestUsed" v-model="isPriceRequestOpen" :note="state.priceNote" />
	</div>
</template>
