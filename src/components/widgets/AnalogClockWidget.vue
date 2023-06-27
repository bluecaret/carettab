<script setup>
import { computed, watch, ref, onMounted, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { DateTime } from 'luxon'
import { setWidgetContainerStyles, setWidgetSegmentStyles, hsl, shadow } from '@/helpers/widgets.js'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const currentTime = ref(
  DateTime.fromJSDate(store.currentTime).setZone(props.widget.timezone ? props.widget.timezone : 'default')
)
const analogHourRotation = ref('300deg')
const analogMinuteRotation = ref('60deg')
const analogSecondRotation = ref('210deg')
let timeout = null

onMounted(() => {
  timeUpdate()
})

watch(
  () => store.currentTime,
  () => {
    // If smooth seconds, use CSS animation, but seconds will need to be synced up
    // every minute to ensure animation doesn't cause time to drift.
    if (props.widget.sec.smoothSeconds) {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        timeUpdate()
      }, 60000)
    } else {
      timeUpdate()
    }
  }
)

const timeUpdate = () => {
  let tz = 'default'
  if (props.widget.timezone) {
    tz = props.widget.timezone !== 'local' ? props.widget.timezone : 'default'
  }
  currentTime.value = DateTime.fromJSDate(store.currentTime).setZone(tz)
  setAnalogTime()
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, store.config.global, lsUsesMargin)
}

const fontSize = computed(() => {
  return props.widget.size ? `${props.widget.size * 10}px` : '0'
})

const faceStyle = computed(() => {
  if (props.widget.face.override) {
    return `
      --analogBorderSize: ${props.widget.face.borderSize * 0.1}em;
      --analogBorderColor: ${hsl(props.widget.face.borderColor)};
      --analogQuarterMarkColor: ${hsl(props.widget.face.quarterColor)};
      --analogHourMarkColor: ${hsl(props.widget.face.hourColor)};
      --analogMinuteMarkColor: ${hsl(props.widget.face.minuteColor)};
      --faceShadow: ${shadow(props.widget.face.shadow)};
    `
  }
  return `
    --analogBorderSize: ${props.widget.face.borderSize * 0.1}em;
    --analogBorderColor: ${hsl(store.config.global.element.primaryColor)};
    --analogQuarterMarkColor: ${hsl(store.config.global.element.primaryColor)};
    --analogHourMarkColor: ${hsl(store.config.global.element.primaryColor)};
    --analogMinuteMarkColor: ${hsl(store.config.global.element.primaryColor)};
    --faceShadow: ${shadow(store.config.global.element.shadow)};
  `
})

const getRelativeTime = computed(() => {
  let zone = props.widget.timezone ? props.widget.timezone : 'default'
  let here = DateTime.fromJSDate(store.currentTime).offset
  let there = DateTime.fromJSDate(store.currentTime).setZone(zone).offset
  let offset = (there - here) / 60
  let diff
  if (offset === 1) {
    diff = `+${offset} hour`
  } else if (offset === -1) {
    diff = `${offset} hour`
  } else if (offset < -1) {
    diff = `${offset} hours`
  } else {
    diff = `+${offset} hours`
  }
  return diff
})

// Analog time should be set every .5 seconds. Exception being if the seconds
// is set to be smooth, than only the seconds is not updated and instead uses
// CSS animation to keep time which is then synced every 5 min to prevent drift.
const setAnalogTime = () => {
  analogHourRotation.value = getAnalogHour()
  analogMinuteRotation.value = getAnalogMinute()
  setAnalogSeconds()
}

const setAnalogSeconds = () => {
  analogSecondRotation.value = getAnalogSecond()
}

const getAnalogSecond = () => {
  let second = currentTime.value.second * 6
  return second + 'deg'
}

const getAnalogMinute = () => {
  let second = currentTime.value.second * 6
  let minute = currentTime.value.minute * 6 + second / 60
  return minute + 'deg'
}

const getAnalogHour = () => {
  let second = currentTime.value.second * 6
  let minute = currentTime.value.minute * 6 + second / 60
  let hour = ((currentTime.value.hour % 12) / 12) * 360 + minute / 12
  return hour + 'deg'
}
</script>

<template>
  <div
    class="clock widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <FontLink
      v-if="['romanDashQuarter', 'romanDashHour'].includes(props.widget.face.style)"
      :widget="{ id: props.widget.id, base: { font: { bold: 400, family: 'EB Garamond' } } }"
    ></FontLink>
    <FontLink
      v-if="['arabicDashQuarter', 'arabicDashHour'].includes(props.widget.face.style)"
      :widget="{ id: props.widget.id, base: { font: { bold: 400, family: 'Quicksand' } } }"
    ></FontLink>
    <div class="widgetInner">
      <div class="analog">
        <div class="analogFace" :class="`faceStyle_${props.widget.face.style}`" :style="faceStyle">
          <div
            v-for="(indicator, i) in Array(60)"
            :key="i"
            class="analogIndicator"
            :class="
              (i + 1) % 15 === 0
                ? 'analogIndicatorQuarter'
                : (i + 1) % 5 === 0
                ? 'analogIndicatorHour'
                : 'analogIndicatorMinute'
            "
          ></div>
        </div>
        <div
          class="analogHands"
          :class="`handStyle_${props.widget.hand.style}`"
          :style="`
            --handShadow: 
              ${shadow(props.widget.hand.override ? props.widget.hand.shadow : store.config.global.element.shadow)};
          `"
        >
          <div
            v-if="props.widget.hour.on"
            class="analogHour"
            :style="`
            --analogCurrentHour: ${analogHourRotation};
            --analogHourColor:
              ${hsl(props.widget.hand.override ? props.widget.hour.color : store.config.global.element.secondaryColor)};
              `"
          ></div>
          <div
            v-if="props.widget.min.on"
            class="analogMinute"
            :style="`
            --analogCurrentMinute: ${analogMinuteRotation};
            --analogMinuteColor:
              ${hsl(props.widget.hand.override ? props.widget.min.color : store.config.global.element.secondaryColor)};
              `"
          ></div>
          <div
            v-if="props.widget.sec.on"
            class="analogSecond"
            :class="{ smooth: props.widget.sec.smoothSeconds }"
            :style="`
            --analogCurrentSecond: ${analogSecondRotation};
            --analogSecondColor:
              ${hsl(props.widget.hand.override ? props.widget.sec.color : store.config.global.element.tertiaryColor)};
              `"
          ></div>
          <div
            v-if="props.widget.center.on"
            class="analogCenter"
            :style="`
            --analogCenterColor:
              ${hsl(
                props.widget.hand.override ? props.widget.center.color : store.config.global.element.tertiaryColor
              )};
            `"
          ></div>
        </div>
      </div>
      <div v-if="props.widget.label.on" class="labelWrapper" :style="segmentStyles('label')">
        {{ props.widget.label.label }}
      </div>
      <div v-if="props.widget.relative.on" class="relativeTimeWrapper" :style="segmentStyles('relative')">
        {{ getRelativeTime }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './AnalogClockWidget';

.analog {
  font-size: v-bind(fontSize);
}

.relativeTimeWrapper {
  display: block;
}

.labelWrapper {
  display: block;
}
</style>
