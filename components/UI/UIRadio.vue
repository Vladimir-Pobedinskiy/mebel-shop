<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string
		/** значение этой радиокнопки */
		value: string
		label?: string
		disabled?: boolean
	}>(),
	{
		label: '',
		disabled: false,
	}
)

const modelValue = defineModel<string>('modelValue')
</script>

<template>
	<label :class="['label-radio', { 'label-radio_disabled': disabled }]">
		<input
			v-model="modelValue"
			class="label-radio__input visually-hidden"
			type="radio"
			:name="name"
			:value="value"
			:disabled="disabled"
		/>

		<span class="label-radio__decor">
			<span class="label-radio__decor-inner"></span>
		</span>

		<span v-if="label" class="label-radio__title text-s">{{ label }}</span>

		<slot name="content" />
	</label>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.label-radio {
	&_disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	&__input:checked ~ .label-radio__title {
		color: variables.$color-ink;
	}
}
</style>
