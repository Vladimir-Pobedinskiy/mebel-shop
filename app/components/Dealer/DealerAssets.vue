<script setup lang="ts">
import type { IDealerAssetsUnit, IDealerFile } from '~~/interfaces/content/IContentPages'
import { useGsapReveal } from '@/composables/useGsapReveal'
import { useAssetUrl } from '@/composables/useAssetUrl'

defineProps<{
	assetsUnit: IDealerAssetsUnit
}>()

const { assetUrl } = useAssetUrl()

/* Своя иконка есть только у PDF, остальным типам — общая иконка загрузки */
const fileIcon = (type: IDealerFile['type']) => (type === 'pdf' ? 'icon-pdf' : 'icon-download')

const rootRef = ref<HTMLElement | null>(null)

const { revealOnScroll } = useGsapReveal()

onMounted(() => {
	revealOnScroll(rootRef.value, '.dealer-assets__item', { stagger: 0.06, y: 24 })
})
</script>

<template>
	<section ref="rootRef" class="dealer-assets">
		<div class="dealer-assets__head">
			<h2 class="dealer-assets__title h2">{{ assetsUnit.title }}</h2>
			<p class="dealer-assets__text text-m">{{ assetsUnit.text }}</p>
		</div>

		<ul class="dealer-assets__list">
			<li v-for="file in assetsUnit.files" :key="file.url" class="dealer-assets__item">
				<a class="dealer-assets__link" :href="assetUrl(file.url)" download>
					<NuxtIcon class="dealer-assets__icon" :name="fileIcon(file.type)" filled />

					<span class="dealer-assets__body">
						<span class="dealer-assets__name title-14">{{ file.title }}</span>
						<span class="dealer-assets__description text-s">{{ file.text }}</span>
						<span class="dealer-assets__meta text-xs">{{ file.format }} · {{ file.size }}</span>
					</span>

					<NuxtIcon class="dealer-assets__download" name="icon-download" filled />
				</a>
			</li>
		</ul>

		<p v-if="assetsUnit.note" class="dealer-assets__note text-xs">{{ assetsUnit.note }}</p>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.dealer-assets {
	&__head {
		max-width: 760px;
		margin-bottom: 28px;
	}

	&__title {
		margin: 0 0 12px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		gap: 12px;
		grid-template-columns: 1fr;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		display: flex;
	}

	&__link {
		display: flex;
		width: 100%;
		align-items: flex-start;
		padding: 20px;
		border: 1px solid variables.$color-line;
		border-radius: variables.$radius-m;
		background-color: variables.$color-surface;
		color: variables.$color-ink;
		gap: 14px;
		transition:
			border-color 0.3s ease-in-out,
			box-shadow 0.3s ease-in-out;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				border-color: transparent;
				box-shadow: variables.$shadow-hover;
			}
		}
	}

	&__icon {
		width: 28px;
		height: 28px;
		flex: 0 0 auto;
		color: variables.$color-accent;
	}

	&__body {
		display: flex;
		min-width: 0;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 6px;
	}

	&__description,
	&__meta {
		color: variables.$color-ink-soft;
	}

	&__download {
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
		color: variables.$color-ink-soft;
	}

	&__note {
		margin: 16px 0 0;
		color: variables.$color-ink-soft;
	}
}
</style>
