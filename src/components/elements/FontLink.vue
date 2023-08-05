<script setup>
import { computed } from 'vue'
import { fontList } from '@/assets/lists'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const props = defineProps({
  global: {
    type: Boolean,
    default: false,
  },
  widget: {
    type: Object,
  },
})

const isFontOffline = computed(() => {
  const family = props.global ? store.config.global.font.family : props.widget.base.font.family
  if (family) {
    const fontCheck = fontList.find((f) => f.label === family)
    if (fontCheck && fontCheck.offline === false) {
      return false
    }
    return true
  }
  return true
})

const setFontLink = computed(() => {
  const base = 'https://fonts.googleapis.com/css2?family='
  const post = '&display=swap'
  const family = props.global ? store.config.global.font.family : props.widget.base.font.family
  const bold = props.global ? store.config.global.font.bold : props.widget.base.font.bold

  let wght = '400'
  if (bold < 400) {
    wght = `${bold};400`
  } else if (bold > 400) {
    wght = `400;${bold}`
  }

  return `${base}${family.replace(/ /g, '+')}:wght@${wght}${post}`
})
</script>

<template>
  <link
    v-if="isFontOffline === false"
    :id="`google-font-link-${global ? 'global' : props.widget.id}`"
    rel="stylesheet"
    :href="setFontLink"
  />
</template>
