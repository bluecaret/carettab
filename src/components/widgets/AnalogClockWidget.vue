<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { useSettingsStore } from '@/store.js'
import { DateTime } from 'luxon'
import { setWidgetContainerStyles, setWidgetSegmentStyles } from '@/helpers/widgets.js'

const store = useSettingsStore()

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
  currentTime.value = DateTime.fromJSDate(store.currentTime).setZone(
    props.widget.timezone ? props.widget.timezone : 'default'
  )
  setAnalogTime()
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, lsUsesMargin)
}

const fontSize = computed(() => {
  return props.widget.size ? `${props.widget.size * 10}px` : '0'
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
    <div class="widgetInner">
      <div class="analog">
        <div
          class="analogFace"
          :class="`faceStyle_${props.widget.face.style}`"
          :style="`
            --analogBorderSize: ${props.widget.face.borderSize * 0.1}em;
            --analogBorderColor: 
              hsl(${props.widget.face.borderColor[0]}deg ${props.widget.face.borderColor[1]}% ${
            props.widget.face.borderColor[2]
          }% 
              / ${props.widget.face.borderColor[3]});
            --analogQuarterMarkColor: 
              hsl(${props.widget.face.quarterColor[0]}deg ${props.widget.face.quarterColor[1]}% ${
            props.widget.face.quarterColor[2]
          }% 
              / ${props.widget.face.quarterColor[3]});
            --analogHourMarkColor: 
              hsl(${props.widget.face.hourColor[0]}deg ${props.widget.face.hourColor[1]}% ${
            props.widget.face.hourColor[2]
          }% 
              / ${props.widget.face.hourColor[3]});
            --analogMinuteMarkColor: 
              hsl(${props.widget.face.minuteColor[0]}deg ${props.widget.face.minuteColor[1]}% ${
            props.widget.face.minuteColor[2]
          }% 
              / ${props.widget.face.minuteColor[3]});
            --faceShadow: 
              ${
                props.widget.face.shadow[0]
                  ? props.widget.face.shadow[1] +
                    'px ' +
                    props.widget.face.shadow[2] +
                    'px ' +
                    props.widget.face.shadow[3] +
                    'px hsl(' +
                    props.widget.face.shadow[4] +
                    'deg ' +
                    props.widget.face.shadow[5] +
                    '% ' +
                    props.widget.face.shadow[6] +
                    '% / ' +
                    props.widget.face.shadow[7] +
                    ')'
                  : 'none'
              };
          `"
        >
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
              ${
                props.widget.hand.shadow[0]
                  ? props.widget.hand.shadow[1] +
                    'px ' +
                    props.widget.hand.shadow[2] +
                    'px ' +
                    props.widget.hand.shadow[3] +
                    'px hsl(' +
                    props.widget.hand.shadow[4] +
                    'deg ' +
                    props.widget.hand.shadow[5] +
                    '% ' +
                    props.widget.hand.shadow[6] +
                    '% / ' +
                    props.widget.hand.shadow[7] +
                    ')'
                  : 'none'
              };
          `"
        >
          <div
            v-if="props.widget.hour.on"
            class="analogHour"
            :style="`
            --analogCurrentHour: ${analogHourRotation};
            --analogHourColor:
              hsl(${props.widget.hour.color[0]}deg ${props.widget.hour.color[1]}% ${props.widget.hour.color[2]}% 
              / ${props.widget.hour.color[3]});
            `"
          ></div>
          <div
            v-if="props.widget.min.on"
            class="analogMinute"
            :style="`
            --analogCurrentMinute: ${analogMinuteRotation};
            --analogMinuteColor:
              hsl(${props.widget.min.color[0]}deg ${props.widget.min.color[1]}% ${props.widget.min.color[2]}% 
              / ${props.widget.min.color[3]});
            `"
          ></div>
          <div
            v-if="props.widget.sec.on"
            class="analogSecond"
            :class="{ smooth: props.widget.sec.smoothSeconds }"
            :style="`
            --analogCurrentSecond: ${analogSecondRotation};
            --analogSecondColor:
              hsl(${props.widget.sec.color[0]}deg ${props.widget.sec.color[1]}% ${props.widget.sec.color[2]}% 
              / ${props.widget.sec.color[3]});
            `"
          ></div>
          <div
            v-if="props.widget.center.on"
            class="analogCenter"
            :style="`
            --analogCenterColor:
              hsl(${props.widget.center.color[0]}deg ${props.widget.center.color[1]}% ${props.widget.center.color[2]}% 
              / ${props.widget.center.color[3]});
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
