<script setup>
import { computed } from 'vue'
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
  if (props.widget.w.fb < 400) {
    wght = `${props.widget.w.fb};400`
  } else if (props.widget.w.fb > 400) {
    wght = `400;${props.widget.w.fb}`
  }
  return `${base}${props.widget.w.ff}:wght@${wght}${post}`
})
</script>

<template>
  <link :id="`google-font-link-${props.widget.id}`" rel="stylesheet" :href="setFontLink" />
</template>
