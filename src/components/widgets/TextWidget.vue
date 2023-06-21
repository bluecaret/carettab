<script setup>
import { computed, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles } from '@/helpers/widgets.js'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})
</script>

<template>
  <div
    class="text widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">{{ props.widget.text }}</div>
  </div>
</template>

<style lang="scss" scoped>
.quote {
  max-width: 100%;
}
</style>
