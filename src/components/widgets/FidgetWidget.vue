<script setup>
import { ref, computed, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles, getDynamicSize } from '@/helpers/widgets.js'
import FidgetBubblewrap from '@/components/widgets/FidgetBubblewrap.vue'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const isDynamicScaling = computed(() => {
  return props.widget.base.container.override
    ? props.widget.base.container.dynamicScaling
    : store.config.global.container.dynamicScaling
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const containerRef = ref(null)
</script>

<template>
  <div
    ref="containerRef"
    class="fidget widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <FidgetBubblewrap v-if="props.widget.type === 'bubblewrap'" :widget="props.widget" :container-ref="containerRef" />
  </div>
</template>

<style lang="scss" scoped>
.fidget {
  max-width: 100%;
  grid-template-columns: 1fr;
}
</style>
