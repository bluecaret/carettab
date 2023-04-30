<script setup>
import { defineProps, computed, watch, ref, onMounted } from 'vue'
import { useSettingsStore } from '@/store.js'
import { DateTime } from 'luxon'
import { fontList } from '@/assets/lists.js'

const store = useSettingsStore()

const props = defineProps({
  clock: {
    type: Object,
    required: true,
  },
})

const currentTime = ref(DateTime.fromJSDate(store.currentTime).setZone(props.clock.tz ? props.clock.tz : 'default'))
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
    if (props.clock.sec.ss) {
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
  currentTime.value = DateTime.fromJSDate(store.currentTime).setZone(props.clock.tz ? props.clock.tz : 'default')
  setAnalogTime()
}

const containerStyles = computed(() => {
  const box = props.clock.w.cor ? props.clock.w : store.config.global
  const font = props.clock.w.orf ? props.clock.w : store.config.global

  let fontFamilyLabel = 'Source Sans Pro'
  let ff = fontList.find((f) => f.id === font.ff)
  if (font.ff && ff) {
    fontFamilyLabel = `'${ff.label}'`
  }

  // Font styles
  const fontFamily = `font-family: ${fontFamilyLabel}; `
  const fontWeight = `font-weight: ${font.fb}; `
  const color = `color: hsl(${font.cl[0]}deg ${font.cl[1]}% ${font.cl[2]}% / ${font.cl[3]}); `
  const textShadow = font.ts[0]
    ? `text-shadow: ${font.ts[1]}px ${font.ts[2]}px ${font.ts[3]}px hsl(${font.ts[4]}deg ${font.ts[5]}% ${font.ts[6]}% / ${font.ts[7]}); `
    : 'text-shadow: none;'
  const fontItalic = font.fi ? 'font-style: italic; ' : ''
  const fontUnderline = font.fu ? 'text-decoration: underline; ' : ''
  const fontCase = font.tt ? `text-transform: ${font.tt}; ` : ''
  const letterSpacing = `letter-spacing: ${font.ls * 0.01}em; `

  // Container box styles
  const radius = `border-radius: ${box.crd}px; `
  const borderColor = `hsl(${box.cbc[0]}deg ${box.cbc[1]}% ${box.cbc[2]}% / ${box.cbc[3]})`
  const border = `border: ${box.cbs}px solid ${borderColor}; `
  const backgroundColor = `background-color: hsl(${box.cbg[0]}deg ${box.cbg[1]}% ${box.cbg[2]}% / ${box.cbg[3]}); `
  const padding = `padding: ${box.cpd}px; `
  const shadow = box.csh[0]
    ? `box-shadow: ${box.csh[1]}px ${box.csh[2]}px ${box.csh[3]}px 0px hsl(${box.csh[4]}deg ${box.csh[5]}% ${box.csh[6]}% / ${box.csh[7]}); `
    : ''

  let styles = `${fontFamily}${fontWeight}${color}${fontUnderline}${letterSpacing}${fontCase}${textShadow}${fontItalic}${radius}${border}${backgroundColor}${padding}${shadow}`

  return styles
})

const segmentStyles = (s, lsUsesMargin = false) => {
  const segment = s.or ? s : props.clock.w

  // Font styles
  const fontSize = `font-size: ${segment.fs}px; `
  const letterSpacing = lsUsesMargin ? `margin-inline: ${segment.ls}px; ` : `letter-spacing: ${segment.ls}px; `
  const translate = `translate: ${segment.oy * -1}px ${segment.ox * -1}px; `
  const color = `color: hsl(${segment.cl[0]}deg ${segment.cl[1]}% ${segment.cl[2]}% / ${segment.cl[3]}); `
  const textShadow = segment.ts[0]
    ? `text-shadow: ${segment.ts[1]}px ${segment.ts[2]}px ${segment.ts[3]}px hsl(${segment.ts[4]}deg ${segment.ts[5]}% ${segment.ts[6]}% / ${segment.ts[7]}); `
    : 'text-shadow: none;'

  let styles = `${fontSize}${letterSpacing}${color}${textShadow}${translate}`

  return styles
}

const buildFontLink = computed(() => {
  const base = 'https://fonts.googleapis.com/css2?family='
  const post = '&display=swap'
  let wght = '400'
  if (props.clock.w.fb < 400) {
    wght = `${props.clock.w.fb};400`
  } else if (props.clock.w.fb > 400) {
    wght = `400;${props.clock.w.fb}`
  }
  return `${base}${props.clock.w.ff}:wght@${wght}${post}`
})

const offset = computed(() => {
  return `${props.clock.w.x}px ${-props.clock.w.y}px`
})

const width = computed(() => {
  return props.clock.w.as ? 'max-content' : `${props.clock.w.w}px`
})

const height = computed(() => {
  return props.clock.w.as ? 'max-content' : `${props.clock.w.h}px`
})

const fontSize = computed(() => {
  return props.clock.sz ? `${props.clock.sz * 10}px` : '0'
})

const getRelativeTime = computed(() => {
  let zone = props.clock.tz ? props.clock.tz : 'default'
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
  <div class="clock widget" :class="[props.clock.w.a, `container-${props.clock.w.ca}`]" :style="containerStyles">
    <link v-if="props.clock.w.orf" id="google-font-link-props.clock.id" rel="stylesheet" :href="buildFontLink" />
    <div class="widgetInner">
      <div class="analog">
        <div
          class="analogFace"
          :class="`faceStyle_${props.clock.face.st}`"
          :style="`
            --analogBorderSize: ${props.clock.face.bs * 0.1}em;
            --analogBorderColor: 
              hsl(${props.clock.face.bc[0]}deg ${props.clock.face.bc[1]}% ${props.clock.face.bc[2]}% 
              / ${props.clock.face.bc[3]});
            --analogQuarterMarkColor: 
              hsl(${props.clock.face.qmc[0]}deg ${props.clock.face.qmc[1]}% ${props.clock.face.qmc[2]}% 
              / ${props.clock.face.qmc[3]});
            --analogHourMarkColor: 
              hsl(${props.clock.face.hmc[0]}deg ${props.clock.face.hmc[1]}% ${props.clock.face.hmc[2]}% 
              / ${props.clock.face.hmc[3]});
            --analogMinuteMarkColor: 
              hsl(${props.clock.face.mmc[0]}deg ${props.clock.face.mmc[1]}% ${props.clock.face.mmc[2]}% 
              / ${props.clock.face.mmc[3]});
            --faceShadow: 
              ${
                props.clock.face.sh[0]
                  ? props.clock.face.sh[1] +
                    'px ' +
                    props.clock.face.sh[2] +
                    'px ' +
                    props.clock.face.sh[3] +
                    'px hsl(' +
                    props.clock.face.sh[4] +
                    'deg ' +
                    props.clock.face.sh[5] +
                    '% ' +
                    props.clock.face.sh[6] +
                    '% / ' +
                    props.clock.face.sh[7] +
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
          :class="`handStyle_${props.clock.hand.st}`"
          :style="`
            --handShadow: 
              ${
                props.clock.hand.sh[0]
                  ? props.clock.hand.sh[1] +
                    'px ' +
                    props.clock.hand.sh[2] +
                    'px ' +
                    props.clock.hand.sh[3] +
                    'px hsl(' +
                    props.clock.hand.sh[4] +
                    'deg ' +
                    props.clock.hand.sh[5] +
                    '% ' +
                    props.clock.hand.sh[6] +
                    '% / ' +
                    props.clock.hand.sh[7] +
                    ')'
                  : 'none'
              };
          `"
        >
          <div
            v-if="props.clock.hr.on"
            class="analogHour"
            :style="`
            --analogCurrentHour: ${analogHourRotation};
            --analogHourColor:
              hsl(${props.clock.hr.cl[0]}deg ${props.clock.hr.cl[1]}% ${props.clock.hr.cl[2]}% 
              / ${props.clock.hr.cl[3]});
            `"
          ></div>
          <div
            v-if="props.clock.min.on"
            class="analogMinute"
            :style="`
            --analogCurrentMinute: ${analogMinuteRotation};
            --analogMinuteColor:
              hsl(${props.clock.min.cl[0]}deg ${props.clock.min.cl[1]}% ${props.clock.min.cl[2]}% 
              / ${props.clock.min.cl[3]});
            `"
          ></div>
          <div
            v-if="props.clock.sec.on"
            class="analogSecond"
            :class="{ smooth: props.clock.sec.ss }"
            :style="`
            --analogCurrentSecond: ${analogSecondRotation};
            --analogSecondColor:
              hsl(${props.clock.sec.cl[0]}deg ${props.clock.sec.cl[1]}% ${props.clock.sec.cl[2]}% 
              / ${props.clock.sec.cl[3]});
            `"
          ></div>
          <div
            v-if="props.clock.cr.on"
            class="analogCenter"
            :style="`
            --analogCenterColor:
              hsl(${props.clock.cr.cl[0]}deg ${props.clock.cr.cl[1]}% ${props.clock.cr.cl[2]}% 
              / ${props.clock.cr.cl[3]});
            `"
          ></div>
        </div>
      </div>
      <div v-if="props.clock.lb.on" class="labelWrapper" :style="segmentStyles(props.clock.lb)">
        {{ props.clock.lb.lb }}
      </div>
      <div v-if="props.clock.rt.on" class="relativeTimeWrapper" :style="segmentStyles(props.clock.rt)">
        {{ getRelativeTime }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './AnalogClockWidget';

.clock {
  width: v-bind(width);
  height: v-bind(height);
  translate: v-bind(offset);
}

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
