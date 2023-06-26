<script setup>
import { inject, computed, ref } from 'vue'
import PremiumModal from '@/components/elements/PremiumModal.vue'

const props = defineProps({ right: Boolean, left: Boolean })

const user = inject('user')
const showPremiumModal = ref(false)

const wrapStyles = computed(() => {
  let styles = ''
  if (props.right) styles += 'margin-inline-end: .6rem; '
  if (props.left) styles += 'margin-inline-start: .6rem; '
  return styles
})
</script>

<template>
  <div v-if="!user.paid" class="premiumLabelWrap" :style="wrapStyles">
    <PremiumModal :show="showPremiumModal" @close="showPremiumModal = false">
      <button
        type="button"
        class="premiumLabel"
        :class="{ premiumLabelPaid: user.paid }"
        :title="
          user.paid
            ? 'Thank you for subscribing to Premium. Enjoy the benefits!'
            : 'Sign up for Premium to access this feature'
        "
        @click.stop="showPremiumModal = true"
      >
        <svg class="gem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
      </button>
    </PremiumModal>
  </div>
</template>

<style lang="scss" scoped>
.premiumLabelWrap {
  display: inline-flex;
  align-items: center;
  vertical-align: bottom;
}

.premiumLabel {
  color: var(--cPremium);
  display: inline-flex;
  align-items: center;
  border: 0;
  background-color: transparent;
  padding: 0;
  cursor: pointer;

  .gem {
    height: 1.6rem;
    // color: white;
    // background: linear-gradient(to top left, var(--cPremium) 0%, var(--cPremium2) 90%);
  }

  &.premiumLabelPaid {
    color: var(--cPremium);
    .gem {
      height: 1.2rem;
    }
  }
}
</style>
