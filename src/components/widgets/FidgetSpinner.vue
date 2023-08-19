<script setup>
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/store.js'
import { hsl, shadow } from '@/helpers/widgets.js'

const store = useSettingsStore()

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

const rotation = ref(0)
const isDragging = ref(false)
const lastX = ref(0)
const deltaX = ref(0)
const friction = 0.98 // Determines the rate of slowdown
let startAngle = 0

watch(isDragging, (newValue) => {
  if (!newValue) {
    requestAnimationFrame(animate)
  }
})

const spinnerStyle = computed(() => {
  return `
      --spinnerBg: ${hsl(
        props.widget.overrideColors ? props.widget.primaryColor : store.config.global.element.primaryColor
      )};
      --spinnerShadow: ${shadow(
        props.widget.overrideColors ? props.widget.shadow : store.config.global.element.shadow
      )};
    `
})

const animate = () => {
  if (isDragging.value || Math.abs(deltaX.value) < 0.1) return

  rotation.value = (rotation.value + deltaX.value) % 360

  // Slow down the spinner over time
  deltaX.value *= friction

  requestAnimationFrame(animate)
}

const getAngleFromEvent = (event) => {
  const rect = props.containerRef.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return Math.atan2(event.clientY - centerY, event.clientX - centerX)
}

const startDrag = (event) => {
  isDragging.value = true
  startAngle = rotation.value * (Math.PI / 180) - getAngleFromEvent(event)

  // Add global listeners
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

const drag = (event) => {
  if (!isDragging.value) return

  const currentAngle = getAngleFromEvent(event)
  const deltaAngle = currentAngle + startAngle
  rotation.value = deltaAngle * (180 / Math.PI)

  const currentX = event.clientX
  deltaX.value = (currentX - lastX.value) * 0.5
  lastX.value = currentX
}

const stopDrag = () => {
  isDragging.value = false

  // Remove global listeners
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
  <div class="fidgetSpinnerContainer" :style="spinnerStyle">
    <div class="fidgetSpinner" :style="{ transform: `rotate(${rotation}deg)` }">
      <svg
        version="1.1"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="10" fill="black" />
        <circle
          v-for="angle in [0, 120, 240]"
          :key="angle"
          class="fidgetSpinnerCircle"
          :cx="50 + 30 * Math.cos((angle * Math.PI) / 180)"
          :cy="50 + 30 * Math.sin((angle * Math.PI) / 180)"
          r="15"
          fill="black"
          @mousedown="startDrag"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fidgetSpinnerContainer {
  display: grid;
  place-items: center;
  width: inherit;
  height: inherit;
}

.fidgetSpinner {
  width: inherit;
  height: inherit;
  pointer-events: none;
}
.fidgetSpinner svg {
  width: 100%;
  height: 100%;
  * {
    fill: var(--spinnerBg);
    filter: drop-shadow(var(--spinnerShadow));
  }
  .fidgetSpinnerCircle {
    pointer-events: all;
    cursor: pointer;
  }
}
</style>
