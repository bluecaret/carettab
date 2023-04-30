<script setup>
import { inject, ref } from 'vue'
import { ExtPay } from '@/assets/ExtPay.js'
import { getStorage, setStorage } from '@/store.js'

const extpay = ExtPay('carettab')

const props = defineProps({
  show: {
    type: Boolean,
  },
})
const emit = defineEmits(['close'])

const user = inject('user')
const access = inject('access')
const isJustSubscribed = ref(false)
const privacyLink = 'https://www.bluecaret.com/privacy/'

const handleReload = () => {
  window.location.reload()
}

const handleSubscribe = () => {
  extpay.openPaymentPage()
}

const handleLicenseKey = async () => {
  let cachedAccess = await getStorage(['userLicense'], 'local')
  let prompt = window.prompt('Enter your license key.', cachedAccess.userLicense ? cachedAccess.userLicense : '')
  if (access.license !== '' && access.license === prompt) {
    await window.alert(
      "IT'S DANGEROUS TO GO ALONE! TAKE THIS.\n\nThank you for being a loyal user of CaretTab! Enjoy the extra access!\n\n*Please do not share this license key*"
    )
    await setStorage({ userLicense: prompt }, 'local')
    location.reload()
  } else {
    window.alert('These are not the droids you are looking for.')
  }
}
</script>

<template>
  <ModalWindow :show="props.show">
    <template #button>
      <slot></slot>
    </template>
    <template #window>
      <div class="premiumModalContent">
        <button
          class="premiumModalClose"
          type="button"
          aria-label="{{'options.common.close' | translate}}"
          @click="emit('close')"
        >
          <fa icon="fa-close" />
        </button>
        <fa icon="fa-gem" class="premiumModalIcon" />

        <div v-if="!user.paid && !isJustSubscribed">
          <h2 class="premiumModalHeading">Premium Access</h2>
          <p class="premiumModalSubheading">
            Support the development of CaretTab with a Premium subscription. Here&apos;s what you get:
          </p>
          <ul class="premiumModalFeatures">
            <li>
              <span><fa icon="fa-images" /></span>
              <div>
                Unsplash photos
                <div>Display a single or daily random wallpaper from Unsplash.com.</div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-circle-half-stroke" /></span>
              <div>
                Background effects
                <div>Change the size, contrast, saturation and blur of the wallpaper.</div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-font" /></span>
              <div>
                More fonts
                <div>Choose from even more fonts provided by Google Fonts.</div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-clock" /></span>
              <div>
                Analog clock styles
                <div>Choose from different clock face and clock hand styles for the analog clock.</div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-note-sticky" /></span>
              <div>
                Notepad
                <div>Take quick notes or keep track of your grocery list with the Notepad widget.</div>
              </div>
            </li>
            <li>
              <span><fa icon="fa-gem" /></span>
              <div>
                And more!
                <div>Even more premium features available now and planned for the future!</div>
              </div>
            </li>
          </ul>
          <div class="premiumModalFooter">
            <div class="premiumModalPrice">Only <span>$2</span> USD per month!</div>
            <button class="premiumModalBtn premiumModalSubscribeBtn" type="button" @click="handleSubscribe()">
              Subscribe now
            </button>
          </div>
        </div>

        <div v-if="user.paid && !isJustSubscribed">
          <h2 class="premiumModalHeading">
            <span class="premiumModalSubscribedHeading">Thank you for your support by subscribing to</span
            ><span>Premium Access</span>
          </h2>
          <p class="premiumModalSubheading">
            By paying for Premium Access you receive many benefits within CaretTab including random background images,
            background effects, and more. Paying for Premium Access helps support the development of CaretTab. If you
            would like to cancel or manage your subscription you can click the button below.
          </p>
          <div class="premiumModalFooter">
            <button class="premiumModalBtn premiumModalSubscribeBtn" type="button" @click="handleSubscribe()">
              Manage or cancel subscription
            </button>
          </div>
        </div>

        <div v-if="isJustSubscribed">
          <h2 class="premiumModalHeading">
            <span class="premiumModalSubscribedHeading">Thank you! You are now subscribed to</span
            ><span>Premium Access</span>
          </h2>
          <p class="premiumModalSubheading">
            In order for premium features to be fully enabled, it is recommended to reload your tab.
          </p>
          <div class="premiumModalFooter">
            <button class="premiumModalBtn premiumModalSubscribeBtn" type="button" @click="handleReload()">
              Reload tab and enjoy!
            </button>
          </div>
        </div>

        <div class="premiumModalDisclaimer">
          Subscription billed on a monthly recurring basis. Cancel at any time for any reason.
          <br />Payments processed via Stripe through ExtensionPay. View the
          <a :href="privacyLink" rel="noreferrer" target="_blank">privacy policy</a>.
          <div v-if="!user.paid">
            <button type="button" class="license" tabindex="-1" @click="handleLicenseKey">Enter a license key</button>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.premiumModalContent {
  --getPremiumModalBg: hsla(205, 100%, 18%, 1);
  --getPremiumModalBg2: hsla(205, 100%, 30%, 1);
  --getPremiumModalColor: hsla(205, 100%, 90%, 1);

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
    margin: 0 0 var(--s3);
    text-transform: uppercase;
    text-align: center;
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
  background-color: transparent;
  padding: 1rem;
  border: 0;
  cursor: pointer;
  span {
    font-size: 2.4rem;
    color: var(--getPremiumModalColor);
  }
}

.premiumModalIcon {
  display: block;
  font-size: 5.4rem;
  margin: var(--s5) auto;
  text-align: center;
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
  gap: var(--s6) var(--s8);
  li {
    display: flex;
    align-items: center;
    gap: var(--s5);
    padding: 0;
    span {
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      font-size: 3rem;
      background-color: var(--getPremiumModalBg2);
      color: var(--getPremiumModalColor);
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      .svg-inline--fa {
        font-size: 3rem;
      }
    }
    > div {
      font-size: 1.8rem;
      font-weight: 600;
      > div {
        font-size: 1.4rem;
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
  background-color: var(--getPremiumModalBg2);
  color: var(--getPremiumModalColor);
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
