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
  store.status = 'highlightSettings'
  setStorage({ status: 'highlightSettings' }, 'local')
}
</script>

<template>
  <div class="welcomeWrapper">
    <div class="welcome">
      <h1>
        <svg :alt="$t('settings.logoAlt')" class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 369">
          <path
            d="M20 332 201 18h99l181 314-10 19H334l-83-145-84 145H31l-11-19Zm32-7h101l87-150h21l87 150h101L286 43h-70L52 325Z"
          />
          <circle cx="208.3" cy="30.1" r="30.1" />
          <circle cx="292.7" cy="30.1" r="30.1" />
          <circle cx="250.6" cy="184" r="30.1" />
          <circle cx="470.5" cy="338" r="30.1" />
          <circle cx="340.8" cy="338.4" r="30.1" />
          <circle cx="160.2" cy="338.4" r="30.1" />
          <circle cx="30.7" cy="338" r="30.1" />
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
  box-shadow: 0 0 5rem 0 hsl(0deg 0% 0% / 0.6);
  h1 {
    display: flex;
    gap: 0.3em;
    justify-content: center;
    align-items: center;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 5.4rem;
    font-weight: 100;
    margin: 0 0 var(--s4) 0;
    color: var(--b2);
  }
  .logo {
    display: block;
    width: 1.4em;
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
