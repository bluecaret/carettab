<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { mergeV3Settings } from '@/helpers/mergeOldSettings.js'

const store = useSettingsStore()

const exportSettings = async () => {
  let currentWallpaper = await getStorage('currentWallpaper', 'local')
  let nextWallpaper = await getStorage('nextWallpaper', 'local')
  const settings = {
    config: JSON.parse(JSON.stringify(store.config)),
    currentWallpaper: currentWallpaper.currentWallpaper
      ? JSON.parse(JSON.stringify(currentWallpaper.currentWallpaper))
      : {},
    nextWallpaper: nextWallpaper.nextWallpaper ? JSON.parse(JSON.stringify(nextWallpaper.nextWallpaper)) : {},
  }
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings))
  const dlAnchorElem = document.createElement('a')
  dlAnchorElem.setAttribute('href', dataStr)
  dlAnchorElem.setAttribute('download', 'carettab-settings.json')
  dlAnchorElem.click()
}

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      store.isLoading = true
      const reader = new FileReader()
      reader.onload = async (e) => {
        const settings = JSON.parse(e.target.result)

        // handle settings imported from v3
        if (settings.misc && settings.misc.schema === '1.1') {
          if (confirm($t('advanced.importOldVersionWarning'))) {
            store.isLoading = false
            mergeV3Settings(settings)
            return
          } else {
            store.isLoading = false
            return
          }
        }

        if (!settings.config.global.schema || settings.config.global.schema !== store.config.global.schema) {
          alert($t('advanced.importNotCompatible'))
          store.isLoading = false
          return
        }

        store.$patch({ config: settings.config })
        await setStorage({ currentWallpaper: settings.currentWallpaper }, 'local')
        await setStorage({ nextWallpaper: settings.nextWallpaper }, 'local')
        await store.save()
        store.isLoading = false
        alert($t('advanced.importSuccessful', ['bluecaret@outlook.com']))
        window.location.reload()
      }
      reader.readAsText(input.files[0])
    }
  })
  input.click()
}
</script>

<template>
  <PageHeading :title="$t('advanced.advancedSettings')" back-page="dashboard"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">{{ $t('advanced.exportImportSettings') }}</label>
            <div class="desc">
              {{ $t('advanced.exportImportSettingsDescription') }}
            </div>
          </div>
          <div class="btnGroup">
            <button type="button" class="btn" @click="exportSettings()">{{ $t('advanced.export') }}</button>
            <button type="button" class="btn" @click="importSettings()">{{ $t('advanced.import') }}</button>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">{{ $t('advanced.resetToDefault') }}</label>
            <div class="desc">
              <strong>{{ $t('advanced.resetToDefaultDescription') }}</strong>
              {{ $t('advanced.resetToDefaultDescription2') }}
            </div>
          </div>
          <div class="fit">
            <button type="button" class="btn fit" style="border-color: orange; color: orange" @click="store.reset()">
              {{ $t('advanced.resetToDefault') }}
            </button>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">{{ $t('advanced.resetBackToFreshInstall') }}</label>
            <div class="desc">
              <strong>{{ $t('advanced.thisWillRemoveEverything') }}</strong>
              {{ $t('advanced.resetBackToFreshDescription') }}
            </div>
          </div>
          <div class="fit">
            <button
              type="button"
              class="btn fit"
              style="border-color: orangered; color: orangered"
              @click="store.resetAll()"
            >
              {{ $t('advanced.resetAll') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file {
  display: none;
}
</style>