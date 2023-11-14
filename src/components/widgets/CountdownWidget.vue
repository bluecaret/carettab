<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles, setWidgetSegmentStyles } from '@/helpers/widgets.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

let timeLeft = ref(null)
let intervalId = ref(null)
let POSSIBLE_UNITS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']

const activeUnits = computed(() => {
  return POSSIBLE_UNITS.filter((unit) => props.widget[unit]?.on)
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, store.config.global, lsUsesMargin)
}

const getUnitSpacing = computed(() => {
  let sb = props.widget.spaceBetween ? props.widget.spaceBetween : 0
  return `${sb}em`
})

const getAutoColumns = computed(() => {
  return props.widget.equalWidth ? '1fr' : 'auto'
})

const calculateTimeLeft = () => {
  if (activeUnits.value.length > 0) {
    const now = DateTime.now().setZone(props.widget.timezone)
    const target = DateTime.fromISO(props.widget.target).setZone(props.widget.timezone)
    const diff = target.diff(now, activeUnits.value).toObject()

    // Ensure all units are whole numbers
    for (const unit in diff) {
      diff[unit] = Math.floor(diff[unit])
    }
    // console.log(now, target, diff)

    timeLeft.value = diff

    if (now >= target) {
      clearInterval(intervalId.value)
      timeLeft.value = null
    }
  } else {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      timeLeft.value = null
    }
  }
}

const startCountdown = () => {
  calculateTimeLeft()
  intervalId.value = setInterval(calculateTimeLeft, 500)
}

watch(
  () => props.widget,
  () => {
    calculateTimeLeft()
  }
)

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<template>
  <div
    class="countdown widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div
      class="widgetInner"
      :class="[
        { widgetInnerInline: props.widget.label.position === 'inline' },
        { widgetInnerTop: props.widget.label.position === 'top' },
        { widgetInnerBottom: props.widget.label.position === 'bottom' },
      ]"
    >
      <div v-if="props.widget.label.on" class="countdownLabel" :style="segmentStyles('label', false)">
        {{ props.widget.label.label }}
      </div>
      <div
        class="unitList"
        :class="[
          { unitListInline: props.widget.units.position === 'inline' },
          { unitListTop: props.widget.units.position === 'top' },
          { unitListBottom: props.widget.units.position === 'bottom' },
          { unitListMono: props.widget.monospace },
        ]"
      >
        <div v-if="props.widget.years.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.years.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.years" class="unitDigit">
            <span v-for="d in timeLeft.years.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.years" class="unitDigit">
            {{ timeLeft.years }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
        <div v-if="props.widget.months.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.months.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.months" class="unitDigit">
            <span v-for="d in timeLeft.months.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.months" class="unitDigit">
            {{ timeLeft.months }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
        <div v-if="props.widget.weeks.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.weeks.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.weeks" class="unitDigit">
            <span v-for="d in timeLeft.weeks.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.weeks" class="unitDigit">
            {{ timeLeft.weeks }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
        <div v-if="props.widget.days.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.days.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.days" class="unitDigit">
            <span v-for="d in timeLeft.days.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.days" class="unitDigit">
            {{ timeLeft.days }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
        <div v-if="props.widget.hours.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.hours.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.hours" class="unitDigit">
            <span v-for="d in timeLeft.hours.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.hours" class="unitDigit">
            {{ timeLeft.hours }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
        <div v-if="props.widget.minutes.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.minutes.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.minutes" class="unitDigit">
            <span v-for="d in timeLeft.minutes.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.minutes" class="unitDigit">
            {{ timeLeft.minutes }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
        <div v-if="props.widget.seconds.on" class="unit">
          <div v-if="props.widget.units.on" class="unitLabel" :style="segmentStyles('units', false)">
            {{ props.widget.seconds.label }}
          </div>
          <div v-if="props.widget.monospace && timeLeft && timeLeft.seconds" class="unitDigit">
            <span v-for="d in timeLeft.seconds.toString().split('')" :key="d">
              {{ d }}
            </span>
          </div>
          <div v-else-if="timeLeft && timeLeft.seconds" class="unitDigit">
            {{ timeLeft.seconds }}
          </div>
          <div v-else class="unitDigit"><span>0</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.widgetInner {
  display: flex;
  gap: 0.75em;
  justify-content: center;
  align-items: center;
  .container-nw & {
    justify-content: start;
    align-items: start;
  }
  .container-n & {
    justify-content: center;
    align-items: start;
  }
  .container-ne & {
    justify-content: end;
    align-items: start;
  }
  .container-w & {
    justify-content: start;
    align-items: center;
  }
  .container-e & {
    justify-content: end;
    align-items: center;
  }
  .container-sw & {
    justify-content: start;
    align-items: end;
  }
  .container-s & {
    justify-content: center;
    align-items: end;
  }
  .container-se & {
    justify-content: end;
    align-items: end;
  }
  &.widgetInnerTop,
  &.widgetInnerBottom {
    flex-direction: column;
    gap: 0.1em;
    .container-n & {
      justify-content: start;
      align-items: center;
    }
    .container-ne & {
      justify-content: start;
      align-items: end;
    }
    .container-w & {
      justify-content: center;
      align-items: start;
    }
    .container-e & {
      justify-content: center;
      align-items: end;
    }
    .container-sw & {
      justify-content: end;
      align-items: start;
    }
    .container-s & {
      justify-content: end;
      align-items: center;
    }
  }
  &.widgetInnerBottom {
    .countdownLabel {
      order: +1;
    }
  }
}
.countdownLabel {
}
.unitList {
  display: grid;
  gap: v-bind(getUnitSpacing);
  grid-auto-flow: column;
  grid-auto-columns: v-bind(getAutoColumns);
  .unit {
    display: flex;
  }
  &.unitListInline {
    .unit {
      justify-content: center;
      align-items: center;
      gap: 0.35em;
      .container-nw & {
        justify-content: start;
        align-items: start;
      }
      .container-n & {
        justify-content: center;
        align-items: start;
      }
      .container-ne & {
        justify-content: end;
        align-items: start;
      }
      .container-w & {
        justify-content: start;
        align-items: center;
      }
      .container-e & {
        justify-content: end;
        align-items: center;
      }
      .container-sw & {
        justify-content: start;
        align-items: end;
      }
      .container-s & {
        justify-content: center;
        align-items: end;
      }
      .container-se & {
        justify-content: end;
        align-items: end;
      }
    }
  }
  &.unitListTop,
  &.unitListBottom {
    .unit {
      flex-direction: column;
    }
  }
  &.unitListBottom {
    .unit > .unitLabel {
      order: +1;
    }
  }
  &.unitListMono {
    .unitDigit {
      span {
        display: inline-block;
        width: 1ch;
        text-align: center;
      }
    }
  }
}
</style>
