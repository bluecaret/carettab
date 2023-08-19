<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { hsl, shadow } from '@/helpers/widgets.js'

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
  containerRef: {
    type: [Object, null],
    required: true,
  },
})

const bubbles = ref([])

const bubbleStyle = computed(() => {
  return `
      --bubbleSize: ${props.widget.bubblewrap.size}%;
      --bubbleBg: ${hsl(props.widget.bubblewrap.bubble)};
      --bubbleShadow: ${shadow(props.widget.bubblewrap.shadow)};
    `
})

const containerSize = ref({ width: 0, height: 0 })

const computeContainerSize = async () => {
  await nextTick()
  if (props.containerRef) {
    containerSize.value.width = props.containerRef.offsetWidth
    containerSize.value.height = props.containerRef.offsetHeight
    updateBubbles()
  }
}

const updateBubbles = () => {
  const effectiveBubbleSize = containerSize.value.width * (props.widget.bubblewrap.size * 0.01)
  const bubblesPerRow = Math.floor(containerSize.value.width / effectiveBubbleSize)
  const bubblesPerColumn = Math.floor(containerSize.value.height / effectiveBubbleSize)
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
  <div class="bubblewrap" :style="bubbleStyle">
    <div v-for="bubble in bubbles" :key="bubble.id" class="bubbleContainer" :class="{ popped: bubble.popped }">
      <div class="bubble" @click="clickToPop(bubble.id)" @mouseover="hoverToPop(bubble.id)"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  pointer-events: none;
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
