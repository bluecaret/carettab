<script setup>
import { ref } from 'vue'

const props = defineProps({
  subtle: {
    type: Boolean,
    default: false,
  },
})

const show = ref(false)
const modalBtnEl = ref(null)

const getReviewLink = () => {
  if (navigator.userAgent.match(/edg/i)) {
    return 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe'
  }
  return 'https://chromewebstore.google.com/detail/carettab-new-tab-dashboar/cojpndognjdcakkimaloeealehpkljna/reviews'
}
</script>

<template>
  <ModalWindow
    window-class="buyMeACoffeeModal"
    :show="show"
    :button-ref="modalBtnEl"
    size="600px"
    @close="show = false"
  >
    <template #button>
      <button
        ref="modalBtnEl"
        type="button"
        class="supportTheDeveloper"
        :class="{ subtle: props.subtle }"
        @click.stop="show = true"
      >
        <div v-if="!props.subtle" class="sparkles">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 100">
            <path
              d="m50 0 10.08 24.936A27.127 27.127 0 0 0 75.064 39.92L100 50 75.096 60.067a27.21 27.21 0 0 0-15.029 15.029L50 100 39.933 75.096a27.21 27.21 0 0 0-15.029-15.029L0 50l24.904-10.067a27.21 27.21 0 0 0 15.029-15.029L50 0Z"
            />
          </svg>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 100">
            <path
              d="m50 0 10.08 24.936A27.127 27.127 0 0 0 75.064 39.92L100 50 75.096 60.067a27.21 27.21 0 0 0-15.029 15.029L50 100 39.933 75.096a27.21 27.21 0 0 0-15.029-15.029L0 50l24.904-10.067a27.21 27.21 0 0 0 15.029-15.029L50 0Z"
            />
          </svg>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 100">
            <path
              d="m50 0 10.08 24.936A27.127 27.127 0 0 0 75.064 39.92L100 50 75.096 60.067a27.21 27.21 0 0 0-15.029 15.029L50 100 39.933 75.096a27.21 27.21 0 0 0-15.029-15.029L0 50l24.904-10.067a27.21 27.21 0 0 0 15.029-15.029L50 0Z"
            />
          </svg>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 100">
            <path
              d="m50 0 10.08 24.936A27.127 27.127 0 0 0 75.064 39.92L100 50 75.096 60.067a27.21 27.21 0 0 0-15.029 15.029L50 100 39.933 75.096a27.21 27.21 0 0 0-15.029-15.029L0 50l24.904-10.067a27.21 27.21 0 0 0 15.029-15.029L50 0Z"
            />
          </svg>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 100">
            <path
              d="m50 0 10.08 24.936A27.127 27.127 0 0 0 75.064 39.92L100 50 75.096 60.067a27.21 27.21 0 0 0-15.029 15.029L50 100 39.933 75.096a27.21 27.21 0 0 0-15.029-15.029L0 50l24.904-10.067a27.21 27.21 0 0 0 15.029-15.029L50 0Z"
            />
          </svg>
        </div>
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="coffee" viewBox="0 0 100 100">
          <path
            class="mug"
            d="M75 89v1.016A9.983 9.983 0 0 1 65.016 100H14.992A9.993 9.993 0 0 1 5 90.01v-51.01h70C88.8 39 95 50.203 95 64 95 77.797 88.8 89 75 89Zm0-40v30c8.28 0 10-6.721 10-15s-1.72-15-10-15Z"
          />
          <path
            class="steam"
            d="M26.502 35.183a1.69 1.69 0 0 1-2.894-1.746l1.906-3.158a7.474 7.474 0 0 0-1.559-9.557l-.041-.035A10.789 10.789 0 0 1 21.658 6.9l1.931-3.21a1.69 1.69 0 0 1 2.895 1.744l-1.931 3.209a7.408 7.408 0 0 0 1.549 9.468l.041.035a10.854 10.854 0 0 1 2.265 13.877l-1.906 3.159Z"
          />
          <path
            class="steam"
            d="M41.502 35.183a1.69 1.69 0 0 1-2.894-1.746l1.906-3.158a7.474 7.474 0 0 0-1.559-9.557l-.041-.035A10.789 10.789 0 0 1 36.658 6.9l1.931-3.21a1.69 1.69 0 0 1 2.895 1.744l-1.931 3.209a7.408 7.408 0 0 0 1.549 9.468l.041.035a10.854 10.854 0 0 1 2.265 13.877l-1.906 3.159Z"
          />
          <path
            class="steam"
            d="M56.502 35.183a1.69 1.69 0 0 1-2.894-1.746l1.906-3.158a7.474 7.474 0 0 0-1.559-9.557l-.041-.035A10.789 10.789 0 0 1 51.658 6.9l1.931-3.21a1.69 1.69 0 0 1 2.895 1.744l-1.931 3.209a7.408 7.408 0 0 0 1.549 9.468l.041.035a10.854 10.854 0 0 1 2.265 13.877l-1.906 3.159Z"
          />
        </svg>
        <div>{{ $t('settings.supportTheExtension') }}</div>
      </button>
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <!-- <h1 class="modalTitle"></h1> -->
          <h1 class="supportHeader">{{ $t('settings.supportCarettabAndTheDeveloperByBuyingACoffee') }}</h1>
          <button
            ref="modalCloseEl"
            class="modalClose"
            type="button"
            :aria-label="$t('common.close')"
            @click="show = false"
          >
            <fa icon="fa-xmark" />
          </button>
        </header>
        <div class="suportTheExtension modalContent">
          <p class="supportDesc">
            {{ $t('settings.supportCarettabAndHelpItGrow') }}
          </p>
          <p>{{ $t('settings.warmRegards') }}<br />John Hancock (BlueCaret), Creator of CaretTab</p>
          <div class="group">
            <a href="https://www.buymeacoffee.com/bluecaret" target="_blank" class="btn mla">{{
              $t('settings.buyMeACoffee')
            }}</a>
            <a :href="getReviewLink()" target="_blank" class="btn mra">{{ $t('settings.leaveAReview') }}</a>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.supportHeader {
  font-size: 2rem;
  font-weight: 700;
  margin-block: 0;
  line-height: 1.3;
}
.suportTheExtension p {
  font-size: 1.8rem;
  line-height: 1.5;
  font-weight: 300;
}
.suportTheExtension .group {
  margin-block: var(--s7);
  .btn {
    padding: var(--s4) var(--s5);
    font-size: 2rem;
  }
}
.supportTheDeveloper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 1px solid var(--b2);
  color: var(--cText);
  border-radius: var(--s4);
  padding: var(--s4) var(--s5);
  cursor: pointer;
  gap: var(--s5);
  text-decoration: none;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 0 0.5rem 0 var(--cBtnShadow);
  }
  .coffee {
    font-size: 2.4rem;
    fill: currentColor;
    width: 1em;
    height: 1em;

    .steam {
      animation: steamRise 3s ease-in-out infinite;
    }
  }
  > div {
    display: flex;
    flex-direction: column;
  }
  h3 {
    display: block;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 600;
    font-size: 1.6rem;
    margin: 0;
  }
  p {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 400;
  }
  .sparkles {
    position: absolute;
    inset: 0;
    svg {
      position: absolute;
      width: 0.5em;
      fill: darkgoldenrod;
      transform-origin: center;
      animation: sparkle 3s ease-in-out infinite;
      &:nth-child(1) {
        width: 0.3em;
        top: 0.1em;
        left: 1.8em;
      }
      &:nth-child(2) {
        width: 0.6em;
        top: 0.7em;
        left: -0.1em;
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        bottom: 0.2em;
        left: 2.4em;
        animation-delay: 0.4s;
      }
      &:nth-child(4) {
        top: 0.2em;
        right: -0.4em;
        animation-delay: 0.3s;
      }
      &:nth-child(5) {
        width: 0.3em;
        bottom: 0.4em;
        right: 0.2em;
        animation-delay: 0.1s;
      }
    }
  }
  &.subtle {
    border: 0;
    margin-inline-start: auto;
    gap: var(--s4);
    color: var(--b2);
    .coffee {
      fill: var(--b2);
    }
  }
}

@keyframes sparkle {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  20% {
    transform: scale(2);
    opacity: 1;
  }
  40% {
    transform: scale(0);
    opacity: 1;
  }
  41% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes steamRise {
  0% {
    transform: translateY(0.3em) translateX(0.1em);
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-0.2em) translateX(-0.1em);
    opacity: 0;
  }
}
</style>
