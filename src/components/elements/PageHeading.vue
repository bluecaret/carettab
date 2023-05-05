<script setup>
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  widgetId: String,
  backPage: String,
})
</script>

<template>
  <h2 class="title">
    <button
      class="back"
      aria-label="Go back to previous page"
      title="Go back to previous page"
      @click="store.goTo(props.backPage || 'dashboard')"
    >
      <fa icon="fa-circle-left" fixed-width></fa>
    </button>
    {{ props.title }} <span v-if="widgetId" class="widgetId">({{ widgetId }})</span>
  </h2>
</template>

<style lang="scss">
.widgetId {
  font-size: 0.7em;
  opacity: 0.7;
}
</style>
