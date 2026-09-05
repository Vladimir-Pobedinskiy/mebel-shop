<script setup lang="ts">
import { useToaster } from '@/composables/useToaster'

/* Единая точка вывода тостов: состояние живёт в useToaster, разметка — в UIToast */
const { toast, hideToast } = useToaster()

const isShown = computed({
	get: () => toast.value.isShown,
	set: value => {
		if (!value) hideToast()
	},
})
</script>

<template>
	<UIToast v-model="isShown" :type="toast.type" :title="toast.title" :text="toast.text" />
</template>
