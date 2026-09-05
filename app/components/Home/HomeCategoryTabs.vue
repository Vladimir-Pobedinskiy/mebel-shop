<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { IHomeCategoryTab } from '~~/interfaces/home/IHomePage'
import { useGsapReveal, splitTextToSpans } from '@/composables/useGsapReveal'

defineProps<{
	tabs: IHomeCategoryTab[]
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { createAnimation } = useGsapReveal()

onMounted(() => {
	createAnimation(rootRef.value, ({ gsap }) => {
		const words = titleRef.value ? splitTextToSpans(titleRef.value, 'words') : []

		gsap.set(words, { yPercent: 110 })
		gsap.set('.home-category-tabs__lead', { y: 24, opacity: 0 })
		gsap.set('.home-category-tabs__nav-item', { y: 16, opacity: 0 })
		gsap.set('.home-category-tabs__panels', { y: 40, opacity: 0 })

		const timeline = gsap.timeline({
			defaults: { ease: 'power3.out' },
			scrollTrigger: { trigger: rootRef.value as HTMLElement, start: 'top 80%' },
		})

		if (words.length) timeline.to(words, { yPercent: 0, duration: 0.8, stagger: 0.06 })

		timeline
			.to('.home-category-tabs__lead', { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
			.to('.home-category-tabs__nav-item', { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 }, '-=0.45')
			.to('.home-category-tabs__panels', { y: 0, opacity: 1, duration: 0.8 }, '-=0.35')
	})
})
</script>

<template>
	<section id="home-categories" ref="rootRef" class="home-category-tabs offset">
		<div class="container">
			<div class="home-category-tabs__head">
				<p ref="titleRef" class="home-category-tabs__title h2">Выбирайте по категориям</p>
				<p class="home-category-tabs__lead text-m">
					Восемь разделов каталога — от диванов до освещения. Все модели с доставкой, подъёмом и сборкой.
				</p>
			</div>

			<TabGroup>
				<TabList class="home-category-tabs__nav">
					<Tab v-for="tab in tabs" :key="tab.name" v-slot="{ selected }" as="template">
						<button :class="['home-category-tabs__nav-item menu', { active: selected }]" type="button">
							{{ tab.nav.label }}
						</button>
					</Tab>
				</TabList>

				<TabPanels class="home-category-tabs__panels">
					<TabPanel v-for="tab in tabs" :key="tab.name" class="home-category-tabs__panel">
						<div class="home-category-tabs__panel-media hover-scale">
							<NuxtLink class="home-category-tabs__panel-media-link hover-scale-img-wrapper" :to="tab.panel.link.url">
								<NuxtImg
									class="home-category-tabs__panel-img"
									:src="tab.panel.img.url"
									:alt="tab.panel.img.alt"
									loading="lazy"
									sizes="xs:100vw sm:100vw md:100vw lg:60vw xl:60vw xxl:60vw"
								/>
							</NuxtLink>
						</div>

						<div class="home-category-tabs__panel-body">
							<h3 class="home-category-tabs__panel-title h3">{{ tab.panel.title }}</h3>
							<p class="home-category-tabs__panel-text text-m">{{ tab.panel.text }}</p>

							<ul class="home-category-tabs__panel-items">
								<li v-for="item in tab.panel.items" :key="item.url">
									<NuxtLink class="home-category-tabs__panel-item text-s hover-link" :to="item.url">
										{{ item.label }}
									</NuxtLink>
								</li>
							</ul>

							<UIButton
								class="home-category-tabs__panel-btn"
								as="NuxtLink"
								:to="tab.panel.link.url"
								variant="secondary"
								color="dark"
								:label="tab.panel.link.label"
								show-icon
							/>
						</div>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-category-tabs {
	&__head {
		max-width: 760px;
		margin-bottom: 32px;
	}

	&__title {
		margin: 0 0 16px;
	}

	&__lead {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__nav {
		display: flex;
		overflow-x: auto;
		flex-wrap: nowrap;
		gap: 8px;
		padding-bottom: 4px;
		margin-bottom: 28px;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		@media (min-width: variables.$desktop-small) {
			flex-wrap: wrap;
			overflow-x: visible;
		}
	}

	&__nav-item {
		padding: 10px 18px;
		border: 1px solid variables.$color-line;
		border-radius: 999px;
		background-color: transparent;
		color: variables.$color-ink-soft;
		cursor: pointer;
		white-space: nowrap;
		transition:
			background-color 0.3s ease-in-out,
			border-color 0.3s ease-in-out,
			color 0.3s ease-in-out;

		&.active {
			border-color: variables.$color-ink;
			background-color: variables.$color-ink;
			color: variables.$color-white;
		}

		@media (min-width: variables.$desktop-small) {
			&:hover:not(.active) {
				border-color: variables.$color-line-strong;
				color: variables.$color-ink;
			}
		}
	}

	&__panel {
		display: grid;
		overflow: hidden;
		gap: 24px;
		border-radius: variables.$radius-l;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: 1.35fr 1fr;
			gap: 32px;
		}
	}

	&__panel-media {
		overflow: hidden;
		border-radius: variables.$radius-l;
	}

	&__panel-media-link {
		display: block;
		aspect-ratio: 16 / 10;
		border-radius: variables.$radius-l;
	}

	&__panel-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__panel-body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	&__panel-title {
		margin: 0;
	}

	&__panel-text {
		margin: 0;
		color: variables.$color-ink-soft;
	}

	&__panel-items {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 10px;
		padding-top: 8px;
		border-top: 1px solid variables.$color-line;
	}

	&__panel-btn {
		margin-top: auto;
	}
}
</style>
