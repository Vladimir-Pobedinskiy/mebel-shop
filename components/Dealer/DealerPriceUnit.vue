<script setup lang="ts">
import type { IDealerPriceUnit } from '@/interfaces/content/IContentPages'
import { useCommercialModals } from '@/composables/useCommercialModals'
import { useGsapReveal } from '@/composables/useGsapReveal'

const props = defineProps<{
	priceUnit: IDealerPriceUnit
}>()

/* Прайс можно забрать двумя способами: скачать файл или получить письмом —
   форму отправки открывает общая модалка ModalPriceRequest */
const { openPriceRequest } = useCommercialModals()

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-price__reveal', { stagger: 0.08, y: 24 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-price">
		<div class="dealer-price__inner">
			<div class="dealer-price__body dealer-price__reveal">
				<h2 class="dealer-price__title h2">{{ priceUnit.title }}</h2>
				<p class="dealer-price__text text-m">{{ priceUnit.text }}</p>

				<ul v-if="priceUnit.benefits?.length" class="dealer-price__benefits">
					<li v-for="benefit in priceUnit.benefits" :key="benefit" class="dealer-price__benefit text-s">
						<NuxtIcon class="dealer-price__benefit-icon" name="icon-check" filled />
						<span>{{ benefit }}</span>
					</li>
				</ul>
			</div>

			<div class="dealer-price__card dealer-price__reveal surface">
				<NuxtIcon class="dealer-price__card-icon" name="icon-pdf" filled />

				<p class="dealer-price__card-title title-18">{{ priceUnit.file.title }}</p>
				<p class="dealer-price__card-meta text-xs">
					{{ priceUnit.file.format }} · {{ priceUnit.file.size }}
					<template v-if="priceUnit.updatedAt"> · {{ priceUnit.updatedAt }}</template>
				</p>

				<div class="dealer-price__actions">
					<UIButton
						as="a"
						:href="priceUnit.file.url"
						:label="priceUnit.file.label"
						icon="icon-download"
						download
						show-icon
						full
					/>

					<UIButton
						as="button"
						type="button"
						variant="secondary"
						color="dark"
						:label="priceUnit.formTitle"
						full
						@click="openPriceRequest(props.priceUnit.formNote)"
					/>
				</div>

				<p class="dealer-price__note text-xs">{{ priceUnit.formNote }}</p>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-price {
	&__inner {
		display: grid;
		padding: 28px 20px;
		border-radius: variables.$radius-l;
		background-color: variables.$color-muted;
		gap: 28px;

		@media (min-width: variables.$desktop-small) {
			padding: 48px;
			grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
			gap: 48px;
		}
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__benefits {
		display: grid;
		margin-top: 24px;
		gap: 10px;
	}

	&__benefit {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}

	&__benefit-icon {
		width: 16px;
		height: 16px;
		flex: 0 0 auto;
		margin-top: 3px;
		color: variables.$color-accent;
	}

	&__card {
		display: flex;
		flex-direction: column;
		padding: 28px 20px;

		@media (min-width: variables.$desktop) {
			padding: 32px;
		}
	}

	&__card-icon {
		width: 36px;
		height: 36px;
		margin-bottom: 16px;
		color: variables.$color-accent;
	}

	&__card-title {
		margin: 0 0 6px;
	}

	&__card-meta {
		margin: 0 0 24px;
		color: variables.$color-ink-soft;
	}

	&__actions {
		display: grid;
		gap: 12px;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}
}
</style>
