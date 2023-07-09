<script setup>
import { inject, ref } from 'vue'
import { ExtPay } from '@/assets/ExtPay.js'
import { getStorage, setStorage } from '@/store.js'
import { checkLicense } from '@/helpers/data.js'
import { useSettingsStore } from '@/store.js'

const extpay = ExtPay('carettab')
const store = useSettingsStore()
const emit = defineEmits(['close'])

const user = inject('user')
const isJustSubscribed = ref(false)

const handleReload = () => {
  window.location.reload()
}

const handleSubscribe = () => {
  extpay.openPaymentPage()
}

const handleLicenseKey = async () => {
  let chromeStore = await getStorage(['userLicense'], 'local')
  let prompt = window.prompt('Enter your license key.', chromeStore.userLicense ? chromeStore.userLicense : '')
  const validLicense = await checkLicense(prompt)
  if (validLicense) {
    await window.alert('Enjoy your free access to CaretTab Premium!\n\n*Please do not share this license key*')
    await setStorage({ userLicense: prompt }, 'local')
    location.reload()
  } else {
    window.alert('These are not the droids you are looking for.')
  }
}
</script>

<template>
  <ModalWindow
    size="840px"
    :show="store.showPremiumModal"
    :button-ref="store.premiumModalBtnRef"
    no-teleport
    @close="emit('close')"
  >
    <template #window>
      <div class="premiumModalContent">
        <button
          class="modalClose premiumModalClose"
          type="button"
          :aria-label="$t('common.close')"
          @click="store.showPremiumModal = false"
        >
          <fa icon="fa-close" />
        </button>
        <svg class="premiumModalIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <defs>
            <linearGradient id="gemGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="20%" style="stop-color: var(--cPremium2)" />
              <stop offset="80%" style="stop-color: var(--cPremium)" />
            </linearGradient>
          </defs>
          <path
            style="fill: url(#gemGradient)"
            d="M116.7 33.8c4.5-6.1 11.7-9.8 19.3-9.8H376c7.6 0 14.8 3.6 19.3 9.8l112 152c6.8 9.2 6.1 21.9-1.5 30.4l-232 256c-4.5 5-11 7.9-17.8 7.9s-13.2-2.9-17.8-7.9l-232-256c-7.7-8.5-8.3-21.2-1.5-30.4l112-152zm38.5 39.8c-3.3 2.5-4.2 7-2.1 10.5l57.4 95.6L63.3 192c-4.1 .3-7.3 3.8-7.3 8s3.2 7.6 7.3 8l192 16c.4 0 .9 0 1.3 0l192-16c4.1-.3 7.3-3.8 7.3-8s-3.2-7.6-7.3-8L301.5 179.8l57.4-95.6c2.1-3.5 1.2-8.1-2.1-10.5s-7.9-2-10.7 1L256 172.2 165.9 74.6c-2.8-3-7.4-3.4-10.7-1z"
          />
        </svg>

        <div v-if="!user.paid && !isJustSubscribed">
          <h2 class="premiumModalHeading">{{ $t('settings.premiumAccess') }}</h2>
          <p class="premiumModalSubheading">
            {{ $t('settings.supportTheDevelopmentOfCarettab') }}
          </p>
          <ul class="premiumModalFeatures">
            <li>
              <span><fa icon="fa-images" /></span>
              <div>
                {{ $t('settings.dailyWallpaperAndEffects') }}
                <div>
                  {{ $t('settings.startYourDayWithFreshHighResolution') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-paint-brush" /></span>
              <div>
                {{ $t('settings.widgetPersonalization') }}
                <div>
                  {{ $t('settings.makeYourWidgetsTrulyYours') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-infinity" /></span>
              <div>
                {{ $t('settings.unlimitedWidgets') }}
                <div>
                  {{ $t('settings.breakFreeFromRestrictions') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-cloud-sun-rain" /></span>
              <div>
                {{ $t('settings.animatedWeatherIcons') }}
                <div>
                  {{ $t('settings.brightenUpYourNewTab') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-brain" /></span>
              <div>
                {{ $t('settings.aiChatAssistant') }}
                <div>
                  {{ $t('settings.experienceThePowerOfAi') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-font" /></span>
              <div>
                {{ $t('settings.individualWidgetStyles') }}
                <div>
                  {{ $t('settings.embraceDiversityOptForADifferent') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-border-style" /></span>
              <div>
                {{ $t('settings.enhancedLayoutWidgets') }}
                <div>
                  {{ $t('settings.upgradeYourNewTabAesthetics') }}
                </div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-gem" /></span>
              <div>
                {{ $t('settings.andMore') }}
                <div>
                  {{ $t('settings.discoverAnExpandingGalaxy') }}
                </div>
              </div>
            </li>
          </ul>
          <div class="premiumModalFooter">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="premiumModalPrice" v-html="$t('settings.onlyUsdPerMonth', ['$2'])"></div>
            <button class="premiumModalBtn premiumModalSubscribeBtn" type="button" @click="handleSubscribe()">
              {{ $t('settings.subscribeNow') }}
            </button>
          </div>
        </div>

        <div v-if="user.paid && !isJustSubscribed">
          <h2 class="premiumModalHeading">{{ $t('settings.thankYouForYourSupport') }}</h2>
          <p class="premiumModalSubheading">
            {{ $t('settings.byPayingForPremiumAccess') }}
          </p>
          <div class="premiumModalFooter">
            <button class="premiumModalBtn premiumModalSubscribeBtn" type="button" @click="handleSubscribe()">
              {{ $t('settings.manageOrCancelSubscription') }}
            </button>
          </div>
        </div>

        <div v-if="isJustSubscribed">
          <h2 class="premiumModalHeading" v-html="$t('settings.thankYouYouAreNowSubscribed')"></h2>
          <p class="premiumModalSubheading">
            {{ $t('settings.inOrderForPremiumFeaturesToBeFullyEnabled') }}
          </p>
          <div class="premiumModalFooter">
            <button class="premiumModalBtn premiumModalSubscribeBtn" type="button" @click="handleReload()">
              {{ $t('settings.reloadTabAndEnjoy') }}
            </button>
          </div>
        </div>

        <div class="premiumModalDisclaimer">
          <span v-html="$t('settings.subscriptionBilledOn')"></span>
          <div v-if="!user.paid">
            <button type="button" class="license" tabindex="-1" @click="handleLicenseKey">
              {{ $t('settings.enterALicenseKey') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.premiumModalContent {
  --getPremiumModalBg: hsl(var(--cPremiumH) var(--cPremiumS) calc(var(--cPremiumL) - 25%) / 1);
  --getPremiumModalBg2: hsl(var(--cPremium2H) var(--cPremium2S) calc(var(--cPremium2L) - 35%) / 1);
  --getPremiumModalColor: var(--cText);

  position: relative;
  padding: var(--s6);
  color: var(--getPremiumModalColor);
  background-color: var(--getPremiumModalBg);
  background-image: radial-gradient(100% 65% at 0% 0%, var(--getPremiumModalBg2) 0%, var(--getPremiumModalBg) 100%);
  a {
    color: var(--getPremiumModalColor);
    &:focus-visible {
      outline: 1px solid currentColor;
      outline-offset: 2px;
    }
  }
  h2 {
    font-size: 3.2rem;
    font-weight: 300;
    margin: 0 0 var(--s5);
    text-transform: uppercase;
    text-align: center;
    text-shadow: 0 0.1em 0.3em hsl(0deg 0% 0% / 0.8);
  }
  p {
    margin: 0 auto var(--s5);
    font-size: 1.5rem;
    font-weight: 300;
    text-align: center;
  }
}

.premiumModalClose {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.premiumModalIcon {
  display: block;
  width: 7rem;
  height: auto;
  margin: var(--s2) auto;
  text-align: center;
  filter: drop-shadow(0 0.2em 0.5em hsl(0deg 0% 0% / 0.6));
}

.premiumModalPrice {
  font-size: 1.8rem;
  font-weight: 300;
  text-align: center;
  span {
    font-weight: 600;
  }
}

.premiumModalFeatures {
  list-style: none;
  margin: var(--s7) 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s5) var(--s6);
  li {
    display: flex;
    gap: var(--s5);
    padding: 0;
    span {
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      font-size: 3rem;
      background-color: hsl(var(--cPremiumH) var(--cPremiumS) calc(var(--cPremiumL) - 35%) / 1);
      color: var(--getPremiumModalColor);
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      .svg-inline--fa {
        font-size: 2.8rem;
      }
    }
    > div {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.3;
      > div {
        font-size: 1.5rem;
        font-weight: 300;
      }
    }
  }
}

.premiumModalFooter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s4);
}

.premiumModalSubscribedHeading {
  display: block;
  text-transform: none;
  font-size: 0.8em;
}

.premiumModalDisclaimer {
  font-size: 1.4rem;
  font-weight: 300;
  margin: var(--s6) 0 0 0;
  text-align: center;
}

.premiumModalBtn {
  border: 0;
  background-color: var(--cPremium);
  color: var(--getPremiumModalColor);
  text-shadow: 0 0.1em 0.2em var(--cShadow);
  display: inline-flex;
  align-items: center;
  padding: 0 var(--s5);
  height: var(--s8);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--s4);
}

.premiumModalSubscribeBtn {
  font-size: 1.8rem;
  padding: 0 var(--s9);
  text-transform: uppercase;
}

.license {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0.4rem 0 0 0;
  color: currentColor;
  font-size: inherit;
  font-weight: inherit;
  opacity: 0.2;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}
</style>
