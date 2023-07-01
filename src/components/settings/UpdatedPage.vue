<script setup>
import { ref } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'

const store = useSettingsStore()
const page = ref(1)
const readyBtnDisabled = ref(true)

const handleNext = () => {
  page.value = 2
  setTimeout(() => {
    readyBtnDisabled.value = false
  }, 3000)
}

const handleFinish = () => {
  store.status = 'installed'
  setStorage({ status: 'installed' }, 'local')
}
</script>

<template>
  <div class="updatedWrapper">
    <div class="updated">
      <h1>
        <svg :alt="$t('settings.logoAlt')" class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
          <rect x="24" y="80" width="16" height="16" />
          <rect x="40" y="64" width="16" height="16" />
          <rect x="72" y="64" width="16" height="16" />
          <rect x="56" y="48" width="16" height="16" />
          <rect x="88" y="80" width="16" height="16" />
          <path
            d="M123 20V0H88v20h-9V0H44v20h-9V10 0H25 10 0v10 10 10 20 78h128V20H123zM118 118H10V10h15v20h19 35 9 30V118z"
          />
        </svg>
        CaretTab
      </h1>
      <div class="slogan">{{ $t('common.slogan') }}</div>
      <hr />
      <div v-if="page === 1">
        <h2>
          <strong>{{ $t('updates.v400.carettabHasBeenUpdatedToVersion_4') }}</strong>
          <span>{{ $t('updates.v400.aGameChangingUpdate') }}</span>
        </h2>
        <p>
          {{ $t('updates.v400.imExcitedToAnnounce') }}
        </p>
        <p>
          {{ store.tSplit($t('updates.v400.imExcitedForYouToDiveInto'))[0] }}
          <a href="https://github.com/bluecaret/carettab/discussions" target="_blank">{{
            store.tSplit($t('updates.v400.imExcitedForYouToDiveInto'))[1]
          }}</a>
          {{ store.tSplit($t('updates.v400.imExcitedForYouToDiveInto'))[2] }}
          <a href="mailto:bluecaret@outlook.com">bluecaret@outlook.com</a>
          {{ store.tSplit($t('updates.v400.imExcitedForYouToDiveInto'))[3] }}
        </p>
        <div class="group fill">
          <button class="btn mla" type="button" @click="handleNext()">{{ $t('updates.v400.awesomeLetsGo') }}</button>
        </div>
      </div>
      <div v-if="page === 2">
        <p class="note">
          <strong>{{ $t('updates.v400.important') }}</strong
          ><br />
          {{ $t('updates.v400.thisSubstantialUpdateHas') }}<br /><br />
          {{ $t('updates.v400.theUpcomingScreenWillGuide') }}
        </p>
        <div class="group fill">
          <button ref="readyBtn" class="btn mla" type="button" :disabled="readyBtnDisabled" @click="handleFinish()">
            {{ readyBtnDisabled ? $t('updates.v400.pleaseReadAbove') : $t('updates.v400.gotItImReady') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.updatedWrapper {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 55;
  color: var(--cText);
  background-image: url('/img/juniper.jpg');
  background-position: center;
  background-size: cover;
}
.updated {
  width: 70rem;
  backdrop-filter: blur(30px) brightness(1.1);
  padding: var(--s8);
  border-radius: 2rem;
  box-shadow: 0 0 5rem 0 hsl(0 0 0 / 0.6);
  h1 {
    display: flex;
    gap: 0.3em;
    justify-content: center;
    align-items: center;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 5.4rem;
    font-weight: 100;
    margin: 0 0 var(--s4) 0;
    color: var(--b2);
  }
  .logo {
    display: block;
    width: 1em;
    height: auto;
    * {
      fill: var(--b2);
    }
  }
  .slogan {
    font-size: 2.2rem;
    font-weight: 300;
    margin: var(--s1) 0 0;
    color: var(--b2);
    text-align: center;
    text-wrap: balance;
  }
  hr {
    border: 0;
    height: 4px;
    margin: var(--s8) 0;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--g2), rgba(0, 0, 0, 0));
  }
  h2 {
    font-size: 2.6rem;
    font-weight: 300;
    margin: var(--s6) 0;
    color: var(--cText);
    text-align: center;
    text-wrap: balance;
    strong {
      display: block;
    }
    span {
      font-size: 2.2rem;
    }
  }
  p {
    font-size: 1.6rem;
    font-weight: 300;
    margin: var(--s4) 0;
    color: var(--cText);
    text-align: left;
    &.note {
      margin-block: var(--s6);
      background: var(--g4);
      padding: var(--s5);
      border-radius: 1rem;
    }
  }
}
</style>
