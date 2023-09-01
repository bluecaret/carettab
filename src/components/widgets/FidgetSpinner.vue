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
        <g v-if="props.widget.type === 'spinnercircles'" class="fidgetSpinnerCircles">
          <circle cx="50" cy="50" r="10" />
          <circle
            v-for="angle in [0, 120, 240]"
            :key="angle"
            class="fidgetSpinnerHandle"
            :cx="50 + 30 * Math.cos((angle * Math.PI) / 180)"
            :cy="50 + 30 * Math.sin((angle * Math.PI) / 180)"
            r="15"
            @mousedown="startDrag"
          />
        </g>
        <g v-if="props.widget.type === 'spinnergear'" class="fidgetSpinnerGear">
          <path
            class="fidgetSpinnerHandle"
            d="M10.473,56.164l-7.973,-0.886l-0,-10.556l7.973,-0.886c0.444,-2.866 1.193,-5.631 2.212,-8.263l-6.46,-4.752l5.278,-9.142l7.358,3.224c1.793,-2.222 3.82,-4.249 6.042,-6.042l-3.224,-7.358l9.142,-5.278l4.752,6.46c2.632,-1.019 5.397,-1.768 8.263,-2.212l0.886,-7.973l10.556,-0l0.886,7.973c2.866,0.444 5.631,1.193 8.263,2.212l4.752,-6.46l9.142,5.278l-3.224,7.358c2.222,1.793 4.249,3.82 6.042,6.042l7.358,-3.224l5.278,9.142l-6.46,4.752c1.019,2.632 1.768,5.397 2.212,8.263l7.973,0.886l-0,10.556l-7.973,0.886c-0.444,2.866 -1.193,5.631 -2.212,8.263l6.46,4.752l-5.278,9.142l-7.358,-3.224c-1.793,2.222 -3.82,4.249 -6.042,6.042l3.224,7.358l-9.142,5.278l-4.752,-6.46c-2.632,1.019 -5.397,1.768 -8.263,2.212l-0.886,7.973l-10.556,-0l-0.886,-7.973c-2.866,-0.444 -5.631,-1.193 -8.263,-2.212l-4.752,6.46l-9.142,-5.278l3.224,-7.358c-2.222,-1.793 -4.249,-3.82 -6.042,-6.042l-7.358,3.224l-5.278,-9.142l6.46,-4.752c-1.019,-2.632 -1.768,-5.397 -2.212,-8.263Zm51.207,-29.395c-3.512,-1.771 -7.481,-2.769 -11.68,-2.769c-13.846,-0 -25.179,10.847 -25.957,24.5l21.186,-0c0.638,-2.028 2.534,-3.5 4.771,-3.5c0.373,-0 0.736,0.041 1.086,0.119l10.594,-18.35Zm1.503,49.064c-3.956,2.025 -8.437,3.167 -13.183,3.167c-15.502,0 -28.18,-12.19 -28.962,-27.5l-3.003,-0c0.784,16.966 14.806,30.5 31.965,30.5c5.292,0 10.286,-1.287 14.685,-3.566l-1.502,-2.601Zm4.098,1.098c8.851,-5.695 14.719,-15.633 14.719,-26.931c0,-11.298 -5.868,-21.236 -14.719,-26.931l-1.502,2.601c7.956,5.173 13.221,14.142 13.221,24.33c-0,10.188 -5.265,19.157 -13.221,24.33l1.502,2.601Zm-3.004,-5.203c7.06,-4.651 11.723,-12.649 11.723,-21.728c0,-9.079 -4.663,-17.077 -11.723,-21.728l-10.594,18.348c0.818,0.89 1.317,2.077 1.317,3.38c0,1.303 -0.499,2.49 -1.317,3.38l10.594,18.348Zm-13.191,-16.847c-0.35,0.078 -0.713,0.119 -1.086,0.119c-2.237,0 -4.133,-1.472 -4.771,-3.5l-21.186,0c0.778,13.653 12.111,24.5 25.957,24.5c4.199,0 8.168,-0.998 11.68,-2.769l-10.594,-18.35Zm13.599,-33.315c-4.399,-2.279 -9.393,-3.566 -14.685,-3.566c-17.159,0 -31.181,13.534 -31.965,30.5l3.003,0c0.782,-15.31 13.46,-27.5 28.962,-27.5c4.746,0 9.227,1.142 13.183,3.167l1.502,-2.601Z"
            @mousedown="startDrag"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fidgetSpinnerContainer {
  display: grid;
  place-items: center;
}

.fidgetSpinner {
  width: inherit;
  height: inherit;
  pointer-events: none;
  transform-origin: 50% 50%;
}
.fidgetSpinner svg {
  width: 100%;
  height: 100%;
  .fidgetSpinnerCircles {
    * {
      fill: var(--spinnerBg);
      filter: drop-shadow(var(--spinnerShadow));
    }
  }
  .fidgetSpinnerGear {
    * {
      fill: var(--spinnerBg);
      filter: drop-shadow(var(--spinnerShadow));
    }
  }
  .fidgetSpinnerHandle {
    pointer-events: all;
    cursor: pointer;
  }
}
</style>
