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
    currentWallpaper: JSON.parse(JSON.stringify(currentWallpaper.currentWallpaper)),
    nextWallpaper: JSON.parse(JSON.stringify(nextWallpaper.nextWallpaper)),
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
          if (
            confirm(
              'Settings are from an older version of CaretTab. We will do our best to import them, but some settings may not be compatible. Do you want to continue?'
            )
          ) {
            store.isLoading = false
            mergeV3Settings(settings)
            return
          } else {
            store.isLoading = false
            return
          }
        }

        if (!settings.config.global.schema || settings.config.global.schema !== store.config.global.schema) {
          alert(
            'Settings are from an older version of CaretTab and are not compatible with the current version. We recommend you reset your settings and start fresh.'
          )
          store.isLoading = false
          return
        }

        store.$patch({ config: settings.config })
        await setStorage({ currentWallpaper: settings.currentWallpaper }, 'local')
        await setStorage({ nextWallpaper: settings.nextWallpaper }, 'local')
        await store.save()
        store.isLoading = false
        alert(
          'Import successful! The page will now be reloaded. If you have any issues, please contact us at bluecaret@outlook.com'
        )
        window.location.reload()
      }
      reader.readAsText(input.files[0])
    }
  })
  input.click()
}
</script>

<template>
  <PageHeading title="Advanced Settings" back-page="dashboard"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">Export/Import settings</label>
            <div class="desc">
              Export all CaretTab settings to a file. Clicking the button will download a file to your computer. Do not
              edit this file to ensure no errors when you re-import. When importing CaretTab settings, ensure you use
              the 'carettab-settings.json' file that was downloaded when you clicked export.
            </div>
          </div>
          <div class="btnGroup">
            <button type="button" class="btn" @click="exportSettings()">Export</button>
            <button type="button" class="btn" @click="importSettings()">Import</button>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">Reset to default</label>
            <div class="desc">
              <strong>This will remove all of your information and settings.</strong>
              If you are signed into Premium Access, you will remain signed in.
            </div>
          </div>
          <div class="fit">
            <button type="button" class="btn fit" style="border-color: orange; color: orange" @click="store.reset()">
              Reset to default
            </button>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">Reset back to fresh install</label>
            <div class="desc">
              <strong>This will remove EVERYTHING.</strong>
              This option essentially resets CaretTab to the state it was in when you first installed it. Use this
              option only as a last resort if you are experiencing issues with CaretTab.
            </div>
          </div>
          <div class="fit">
            <button
              type="button"
              class="btn fit"
              style="border-color: orangered; color: orangered"
              @click="store.resetAll()"
            >
              Reset all!
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
