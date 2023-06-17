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
  <div class="premiumLabelWrap" :style="wrapStyles">
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
        <fa icon="fa-gem"></fa>
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

  .svg-inline--fa {
    font-size: 1.6rem;
  }

  &.premiumLabelPaid {
    color: var(--cGrey4);
    .svg-inline--fa {
      font-size: 1.2rem;
      line-height: 1;
    }
  }
}
</style>
