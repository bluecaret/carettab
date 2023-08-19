<script setup>
import { ref, computed, inject, nextTick, onMounted, watch } from 'vue'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles, hsl, shadow, getDynamicSize } from '@/helpers/widgets.js'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const bubbles = ref([])

const isDynamicScaling = computed(() => {
  return props.widget.base.container.override
    ? props.widget.base.container.dynamicScaling
    : store.config.global.container.dynamicScaling
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const bubbleStyle = computed(() => {
  return `
      --bubbleSize: ${props.widget.bubblewrap.size}%;
      --bubbleBg: ${hsl(props.widget.bubblewrap.bubble)};
      --bubbleShadow: ${shadow(props.widget.bubblewrap.shadow)};
    `
})

const containerRef = ref(null)
const containerSize = ref({ width: 0, height: 0 })

const computeContainerSize = async () => {
  await nextTick()
  containerSize.value.width = containerRef.value.offsetWidth
  containerSize.value.height = containerRef.value.offsetHeight
  console.log('computeContainerSize', containerSize.value.width, containerSize.value.height)

  updateBubbles()
}

const updateBubbles = () => {
  const effectiveBubbleSize = containerSize.value.width * (props.widget.bubblewrap.size * 0.01)
  const bubblesPerRow = Math.floor(containerSize.value.width / effectiveBubbleSize)
  const bubblesPerColumn = Math.floor(containerSize.value.height / effectiveBubbleSize)
  console.log('updateBubbles', bubblesPerColumn, bubblesPerRow)
  let totalBubbles = bubblesPerColumn * bubblesPerRow
  if (totalBubbles > 1000) totalBubbles = 1000

  bubbles.value = [...Array(totalBubbles)].map((_, i) => ({ id: i, popped: false }))
}

const popBubble = (id) => {
  const bubble = bubbles.value.find((b) => b.id === id)
  if (bubble && !bubble.popped) {
    bubble.popped = true

    if (bubbles.value.every((b) => b.popped)) {
      setTimeout(resetBubbles, 1000)
    }
  }
}

const resetBubbles = () => {
  bubbles.value.forEach((b) => (b.popped = false))
}

const clickToPop = (id) => {
  if (!props.widget.bubblewrap.popOnHover) popBubble(id)
}

const hoverToPop = (id) => {
  if (props.widget.bubblewrap.popOnHover) popBubble(id)
}

onMounted(computeContainerSize)

watch([props.widget], computeContainerSize)
</script>

<template>
  <div
    ref="containerRef"
    class="fidget widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="bubblewrap" :style="bubbleStyle">
      <div v-for="bubble in bubbles" :key="bubble.id" class="bubbleContainer" :class="{ popped: bubble.popped }">
        <div class="bubble" @click="clickToPop(bubble.id)" @mouseover="hoverToPop(bubble.id)"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fidget {
  max-width: 100%;
  grid-template-columns: 1fr;
}
.bubblewrap {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}

.bubbleContainer {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--bubbleSize);
  aspect-ratio: 1 / 1;
  transition: background-color 0.2s;
  overflow: hidden;
}

.bubble {
  display: block;
  border-radius: 50%;
  width: 90%;
  height: 90%;
  background-color: var(--bubbleBg);
  box-shadow: var(--bubbleShadow);
  cursor: crosshair;
}

.bubbleContainer.popped {
  animation: explodeAnimation 0.17s forwards;
  .bubble {
    cursor: default;
  }
}

@keyframes explodeAnimation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  90% {
    transform: scale(1.7);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
