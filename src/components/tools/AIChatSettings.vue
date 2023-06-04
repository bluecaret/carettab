<script setup>
import { reactive } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'

const store = useSettingsStore()
const tool = reactive(store.config.toolbar.tools.find((t) => t.id === 'aiChat'))
let timer = null

const saveKey = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    setStorage({ ['toolbar']: store.config.toolbar }, 'sync')
  }, 2000)
}
</script>

<template>
  <div class="blockContainer">
    <div class="block">
      <div class="group fill">
        <div class="label mra">
          <label for="apiKey">OpenAI API Key</label>
          <div class="desc">
            <a href="https://platform.openai.com/account/api-keys" target="_blank">Get an API Key</a>
          </div>
        </div>
        <input id="apiKey" v-model="tool.apiKey" type="text" class="input w43" @blur="saveKey()" @paste="saveKey()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
