<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'

const storeGeneral = useGeneralStore()
const footer = computed(() => storeGeneral.footer)
const socials = computed(() => storeGeneral.socials)
</script>

<template>
	<footer v-if="footer" class="footer">
		<div v-if="footer.marqueeUnit" class="footer__marquee">
			<UIMarquee :duration="30" :pause-on-hover="false">
				<template #content>
					<span
						v-for="(item, index) in footer.marqueeUnit.marqueeContent"
						:key="index"
						class="footer__marquee-item running-line-typo"
					>
						{{ item }}
						<span class="footer__marquee-decor">✦</span>
					</span>
				</template>
			</UIMarquee>
			<span class="visually-hidden">{{ footer.marqueeUnit.title }}</span>
		</div>

		<div class="container footer__inner">
			<div class="footer__about">
				<AppLogo class="footer__logo" color="dark" />
				<p class="footer__about-text text-s">{{ footer.about }}</p>
				<AppSocialsLinks v-if="socials.length" class="footer__socials" :links="socials" color="dark" />
			</div>

			<div v-for="column in footer.columns" :key="column.title" class="footer__column">
				<p class="footer__column-title title-14">{{ column.title }}</p>
				<ul class="footer__links">
					<li v-for="link in column.links" :key="link.url">
						<NuxtLink class="text-s hover-link" :to="link.url">{{ link.label }}</NuxtLink>
					</li>
				</ul>
			</div>

			<div class="footer__contacts">
				<p class="footer__column-title title-14">Салоны</p>
				<ul class="footer__addresses">
					<li v-for="address in footer.addresses" :key="address.address" class="footer__address">
						<p class="footer__address-title text-s">{{ address.title }}</p>
						<p class="footer__address-text text-s">{{ address.address }}</p>
						<p class="footer__address-text text-xs">{{ address.operatingMode }}</p>

						<ul class="footer__phones">
							<li v-for="phone in address.phones" :key="phone.url">
								<a class="footer__phone text-s hover-link" :href="`tel:${phone.url}`" :title="phone.title">
									{{ phone.label }}
								</a>
							</li>
						</ul>

						<a class="footer__email text-s hover-link" :href="`mailto:${address.email.url}`">
							{{ address.email.label }}
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="container footer__payments">
			<span class="footer__payments-title text-xs">Способы оплаты:</span>
			<ul class="footer__payments-list">
				<li v-for="payment in footer.payments" :key="payment">
					<UITag :label="payment" color="outline" />
				</li>
			</ul>
		</div>

		<div class="container footer__bottom">
			<p class="text-xs">{{ footer.copyright }}</p>
			<ul class="footer__legal">
				<li v-for="link in footer.legal" :key="link.url">
					<NuxtLink class="text-xs hover-link" :to="link.url">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</div>
	</footer>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.footer {
	padding-bottom: 24px;
	border-top: 1px solid variables.$color-line;
	background-color: variables.$color-surface;

	&__marquee {
		padding: 24px 0;
		overflow: hidden;
		border-bottom: 1px solid variables.$color-line;
		color: variables.$color-ink;

		@media (min-width: variables.$desktop) {
			padding: 32px 0;
		}
	}

	&__marquee-item {
		display: inline-flex;
		align-items: center;
		gap: 24px;
		padding-right: 24px;
		white-space: nowrap;
	}

	&__marquee-decor {
		color: variables.$color-accent;
		font-size: 0.4em;
	}

	&__inner {
		padding-top: 48px;
		display: grid;
		gap: 32px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop-small) {
			gap: 40px;
			grid-template-columns: 1.4fr repeat(3, 1fr) 1.2fr;
		}
	}

	&__about-text {
		margin-top: 20px;
		color: variables.$color-ink-soft;
	}

	&__socials {
		margin-top: 20px;
	}

	&__column-title {
		margin-bottom: 16px;
		color: variables.$color-ink-soft;
	}

	&__links,
	&__addresses,
	&__phones {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__address-text {
		margin-top: 6px;
		color: variables.$color-ink-soft;
	}

	&__phones {
		margin-top: 12px;
		gap: 6px;
	}

	&__email {
		margin-top: 10px;
		display: inline-block;
	}

	&__payments {
		margin-top: 40px;
		padding-top: 24px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		border-top: 1px solid variables.$color-line;
		color: variables.$color-ink-soft;
	}

	&__payments-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__bottom {
		margin-top: 20px;
		padding-top: 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 12px 24px;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid variables.$color-line;
		color: variables.$color-ink-soft;
	}

	&__legal {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}
}
</style>
