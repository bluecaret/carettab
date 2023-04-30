<script setup>
import { computed, watch, ref } from 'vue'
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

const blinkStatus = ref(false)
let timeout = null

watch(
  () => store.currentTime,
  () => {
    // If smooth seconds, use CSS animation, but seconds will need to be synced up
    // every minute to ensure animation doesn't cause time to drift.
    if (props.clock.dl.bl) {
      blinkStatus.value = true
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        blinkStatus.value = false
      }, 60000)
    }
  }
)

const blink = computed(() => {
  return blinkStatus.value ? 'digitalClockBlink 1s steps(2) infinite' : 'none'
})

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
    : ''
  const fontItalic = font.fi ? 'font-style: italic; ' : ''
  // const fontUnderline = font.fu ? 'text-decoration: underline; ' : '';

  // Container box styles
  const radius = `border-radius: ${box.crd}px; `
  const borderColor = `hsl(${box.cbc[0]}deg ${box.cbc[1]}% ${box.cbc[2]}%)`
  const border = `border: ${box.cbs}px solid ${borderColor}; `
  const backgroundColor = `background-color: hsl(${box.cbg[0]}deg ${box.cbg[1]}% ${box.cbg[2]}% / ${box.cbg[3]}); `
  const padding = `padding: ${box.cpd}px; `
  const shadow = box.csh[0]
    ? `box-shadow: ${box.csh[1]}px ${box.csh[2]}px ${box.csh[3]}px 0px hsl(${box.csh[4]}deg ${box.csh[5]}% ${box.csh[6]}% / ${box.csh[7]}); `
    : ''

  let styles = `${fontFamily}${fontWeight}${color}${textShadow}${fontItalic}${radius}${border}${backgroundColor}${padding}${shadow}`

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
    : ''

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
  const config = props.clock.w.orf ? props.clock.w : store.config.global
  return config.fs ? `${config.fs}px` : '0'
})

const fontUnderline = computed(() => {
  const config = props.clock.w.orf ? props.clock.w : store.config.global
  return config.fu ? 'underline' : 'none'
})

const fontCase = computed(() => {
  const config = props.clock.w.orf ? props.clock.w : store.config.global
  return config.tt ? config.tt : 'none'
})

const spaceBetween = computed(() => {
  let sb = props.clock.sb ? props.clock.sb / 2 : 0
  return `${sb * 0.01}em`
})

const letterSpacing = computed(() => {
  const config = props.clock.w.orf ? props.clock.w : store.config.global
  return config.ls ? `${config.ls * 0.01}em` : '0'
})

const monospace = computed(() => {
  return props.clock.ms ? '1ch' : 'auto'
})

const getFormattedTime = computed(() => {
  return DateTime.fromJSDate(store.currentTime).setZone(props.clock.tz ? props.clock.tz : 'default')
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
</script>

<template>
  <div class="clock widget" :class="[props.clock.w.a, `container-${props.clock.w.ca}`]" :style="containerStyles">
    <link v-if="props.clock.w.orf" id="google-font-link-props.clock.id" rel="stylesheet" :href="buildFontLink" />
    <div class="widgetInner">
      <div class="timeWrapper">
        <div v-if="props.clock.hr.on" class="clockPart hour">
          <span
            v-for="(hr, index) in getFormattedTime
              .toFormat(props.clock.hr.tf ? 'H' : 'h')
              .toString()
              .padStart(props.clock.hr.td ? 2 : 1, '0')
              .split('')"
            :key="index"
            class="clockDigit"
            :style="segmentStyles(props.clock.hr, true)"
            >{{ hr }}</span
          >
        </div>
        <div
          v-if="props.clock.dl.on && props.clock.hr.on && (props.clock.sec.on || props.clock.min.on)"
          class="clockPart delimiter"
        >
          <span
            v-for="(dl, index) in props.clock.dl.sym1.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles(props.clock.dl, true)"
            >{{ dl }}</span
          >
        </div>
        <div v-if="props.clock.min.on" class="clockPart minute">
          <span
            v-for="(min, index) in getFormattedTime.minute
              .toString()
              .padStart(props.clock.min.td ? 2 : 1, '0')
              .split('')"
            :key="index"
            class="clockDigit"
            :style="segmentStyles(props.clock.min, true)"
            >{{ min }}</span
          >
        </div>
        <div v-if="props.clock.dl.on && props.clock.min.on && props.clock.sec.on" class="clockPart delimiter">
          <span
            v-for="(dl, index) in props.clock.dl.sym2.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles(props.clock.dl, true)"
            >{{ dl }}</span
          >
        </div>
        <div v-if="props.clock.sec.on" class="clockPart second">
          <span
            v-for="(sec, index) in getFormattedTime.second
              .toString()
              .padStart(props.clock.sec.td ? 2 : 1, '0')
              .split('')"
            :key="index"
            class="clockDigit"
            :style="segmentStyles(props.clock.sec, true)"
            >{{ sec }}</span
          >
        </div>
        <div v-if="props.clock.dl.on && props.clock.dl.sym3 && props.clock.sec.on" class="clockPart delimiter">
          <span
            v-for="(dl, index) in props.clock.dl.sym3.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles(props.clock.dl, true)"
            >{{ dl }}</span
          >
        </div>
        <div v-if="props.clock.md.on" class="clockPart meridiem">
          <span
            v-for="(md, index) in getFormattedTime.toFormat('a') === 'AM'
              ? props.clock.md.am.split('')
              : props.clock.md.pm.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles(props.clock.md, true)"
            >{{ md }}</span
          >
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
.clock {
  width: v-bind(width);
  height: v-bind(height);
  translate: v-bind(offset);
}

.timeWrapper {
  display: inline-flex;
}

.clockPart {
  display: inline-flex;
  font-size: v-bind(fontSize);
  margin-inline: v-bind(spaceBetween);
  text-align: center;
  text-decoration: v-bind(fontUnderline);
  text-transform: v-bind(fontCase);
}

.clockDigit {
  display: inline-block;
  text-align: center;
  width: v-bind(monospace);
  margin-inline: v-bind(letterSpacing);
}

.clockCharacter {
  display: inline-block;
  text-align: center;
  margin-inline: v-bind(letterSpacing);
}

.relativeTimeWrapper {
  display: block;
}

.labelWrapper {
  display: block;
}

.delimiter {
  animation: v-bind(blink);
}
</style>

<style>
@keyframes digitalClockBlink {
  from {
    opacity: 1;
  }

  to {
    opacity: 0.3;
  }
}
</style>
