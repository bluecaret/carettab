<script setup>
import { computed } from 'vue'
import { fontList } from '@/assets/lists.js'

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const setFontLink = computed(() => {
  const base = 'https://fonts.googleapis.com/css2?family='
  const post = '&display=swap'
  let wght = '400'
  if (props.widget.base.font.bold < 400) {
    wght = `${props.widget.base.font.bold};400`
  } else if (props.widget.base.font.bold > 400) {
    wght = `400;${props.widget.base.font.bold}`
  }
  return `${base}${props.widget.base.font.family.replace(/ /g, '+')}:wght@${wght}${post}`
})
</script>

<template>
  <link :id="`google-font-link-${props.widget.id}`" rel="stylesheet" :href="setFontLink" />
</template>
