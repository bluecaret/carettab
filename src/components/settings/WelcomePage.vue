<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { languages } from '@/assets/lists.js'
import { useSettingsStore, setStorage } from '@/store.js'
import { blueprints } from '@/helpers/blueprints.js'
import merge from 'lodash/merge'
import find from 'lodash/find'
import cloneDeep from 'lodash/cloneDeep'
import isArray from 'lodash/isArray'

const store = useSettingsStore()
const { locale } = useI18n({ useScope: 'global' })
const page = ref(1)

const handleLangSelect = (event) => {
  locale.value = event.target.value
}

const handleNext = () => {
  page.value = 2
  store.save()
}

const handleBasicLayout = async () => {
  const blueprint = blueprints.find((b) => b.id === 'classic')
  store.isLoading = true

  // Clone the current config to avoid mutating the original
  let newConfig = cloneDeep(store.config)

  // Turn off any existing layers
  newConfig.layers.forEach((l) => {
    l.on = false
  })

  // Loop over the keys in the blueprint
  Object.keys(blueprint.blueprint.config).forEach((key) => {
    // Check if the property is an array
    if (isArray(blueprint.blueprint.config[key])) {
      // Handle array merging
      blueprint.blueprint.config[key].forEach((blueprintItem) => {
        // Find matching item in the config array
        const storeItem = find(newConfig[key], { id: blueprintItem.id })

        if (storeItem) {
          // Merge matching items
          merge(storeItem, blueprintItem)
        } else {
          // Push the new item into the config array if it's not found
          newConfig[key].push(blueprintItem)
        }
      })
    } else {
      // Simply replace non-array properties
      newConfig[key] = cloneDeep(blueprint.blueprint.config[key])
    }
  })

  store.$patch({ config: newConfig })

  store.save()
  await setStorage({ currentWallpaper: blueprint.blueprint.currentWallpaper }, 'local')
  await setStorage({ nextWallpaper: blueprint.blueprint.nextWallpaper }, 'local')
  setTimeout(() => {
    store.isLoading = false
    handleFinishWelcome()
  }, 300)
}

const handleFinishWelcome = () => {
  store.status = 'existing'
  setStorage({ status: 'existing' }, 'local')
}
</script>

<template>
  <div class="welcomeWrapper">
    <div class="welcome">
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
      <p class="slogan">{{ $t('common.slogan') }}</p>
      <hr />
      <div v-if="page === 1" class="langSelect">
        <label for="lang" class="label">{{ $t('welcome.selectALanguage') }}</label>
        <div class="group compact fill">
          <select
            id="lang"
            v-model="store.config.global.lang"
            class="select w25"
            name="lang"
            @change="handleLangSelect($event)"
          >
            <template v-for="lang in languages" :key="lang.id">
              <option v-if="lang.id === 'en'" :value="lang.id">
                {{ lang.name }}
              </option>
              <option v-else :value="lang.id">{{ lang.name }} &mdash; {{ lang.label }}</option>
            </template>
          </select>
          <button class="btn" type="button" @click="handleNext()">{{ $t('welcome.next') }}</button>
        </div>
      </div>
      <div v-if="page === 2" class="layoutSelect">
        <div class="label">{{ $t('welcome.getAJumpStart') }}</div>
        <div class="group fill">
          <button class="btn" type="button" @click="handleBasicLayout()">{{ $t('welcome.basicLayout') }}</button>
          <button class="btn" type="button" @click="handleFinishWelcome()">{{ $t('welcome.emptyCanvas') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcomeWrapper {
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
.welcome {
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
  .langSelect,
  .layoutSelect {
    .group {
      justify-content: center;
    }
    .label {
      margin-inline-end: 0;
      width: 100%;
      display: block;
      text-align: center;
      margin-block-end: var(--s5);
    }
  }
  .layoutSelect {
    .label {
      width: 100%;
      display: block;
      text-align: center;
      margin-block-end: var(--s5);
    }
    .btn {
      padding: 1rem 4rem;
    }
  }
}
</style>
