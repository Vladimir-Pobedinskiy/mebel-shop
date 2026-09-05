<script setup lang="ts">
import type { IProductFile } from '~~/interfaces/product/IProduct'
import { useAssetUrl } from '@/composables/useAssetUrl'

defineProps<{
	files: IProductFile[]
}>()

const { assetUrl } = useAssetUrl()

/* Иконка по типу файла: отдельная иконка есть только у PDF,
   чертежи и 3D-модели получают общую иконку загрузки */
const fileIcon = (type: IProductFile['type']) => (type === 'pdf' ? 'icon-pdf' : 'icon-download')

const fileTypeLabel = (type: IProductFile['type']) => {
	if (type === 'pdf') return 'PDF'
	if (type === 'dwg') return 'DWG'
	return 'ZIP'
}
</script>

<template>
	<section v-if="files.length" class="product-files">
		<div class="product-files__head">
			<h2 class="product-files__title h3">Документы и модели</h2>
			<p class="product-files__text text-m">
				Спецификация, чертёж с габаритами и 3D-модель — для проектировщиков и дилеров.
			</p>
		</div>

		<ul class="product-files__list">
			<li v-for="file in files" :key="file.url" class="product-files__item">
				<a class="product-files__link" :href="assetUrl(file.url)" download target="_blank" rel="noopener">
					<NuxtIcon class="product-files__icon" :name="fileIcon(file.type)" filled />

					<span class="product-files__body">
						<span class="product-files__name title-14">{{ file.title }}</span>
						<span class="product-files__meta text-xs">{{ fileTypeLabel(file.type) }} · {{ file.size }}</span>
					</span>

					<NuxtIcon class="product-files__download" name="icon-download" filled />
				</a>
			</li>
		</ul>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.product-files {
	&__head {
		max-width: 760px;
		margin-bottom: 20px;
	}

	&__title {
		margin: 0 0 10px;
	}

	&__text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		display: flex;
	}

	&__link {
		display: flex;
		width: 100%;
		align-items: center;
		padding: 18px 20px;
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
		gap: 4px;
	}

	&__meta {
		color: variables.$color-ink-soft;
	}

	&__download {
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
		color: variables.$color-ink-soft;
	}
}
</style>
