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
  <div
    class="iframe widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <div class="widgetInner">
      <iframe
        :id="`${props.widget.id}-iframe`"
        :src="props.widget.url"
        frameborder="0"
        border="0"
        cellspacing="0"
        allow="encrypted-media; geolocation; microphone; camera;"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.iframe {
  max-width: 100%;
  grid-template-columns: 1fr;
  .widgetInner {
    height: 100%;
    position: relative;
    border-radius: inherit;
  }
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    vertical-align: middle;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}
</style>
