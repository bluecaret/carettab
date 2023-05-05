<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles } from '@/helpers/widgets.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})
</script>

<template>
  <div class="searchBar widget" :class="[props.widget.w.a, `container-${props.widget.w.ca}`]" :style="containerStyles">
    <FontLink v-if="props.widget.w.orf" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div class="searchBarWrapper">Search</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchBarWrapper {
  display: inline-flex;
}
</style>
