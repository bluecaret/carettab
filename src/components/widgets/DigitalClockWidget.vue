<script setup>
import { computed, watch, ref } from 'vue'
import { useSettingsStore } from '@/store.js'
import { DateTime } from 'luxon'
import { setWidgetContainerStyles, setWidgetSegmentStyles } from '@/helpers/widgets.js'

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
  return setWidgetContainerStyles(props.clock, store.config.global)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.clock, type, lsUsesMargin)
}

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

const fontItalic = computed(() => {
  const config = props.clock.w.orf ? props.clock.w : store.config.global
  return config.fi ? config.fi : 'normal'
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
    <FontLink v-if="props.clock.w.orf" :widget="props.clock"></FontLink>
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
            :style="segmentStyles('hr', true)"
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
            :style="segmentStyles('dl', true)"
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
            :style="segmentStyles('min', true)"
            >{{ min }}</span
          >
        </div>
        <div v-if="props.clock.dl.on && props.clock.min.on && props.clock.sec.on" class="clockPart delimiter">
          <span
            v-for="(dl, index) in props.clock.dl.sym2.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles('dl', true)"
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
            :style="segmentStyles('sec', true)"
            >{{ sec }}</span
          >
        </div>
        <div v-if="props.clock.dl.on && props.clock.dl.sym3 && props.clock.sec.on" class="clockPart delimiter">
          <span
            v-for="(dl, index) in props.clock.dl.sym3.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles('dl', true)"
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
            :style="segmentStyles('md', true)"
            >{{ md }}</span
          >
        </div>
      </div>
      <div v-if="props.clock.lb.on" class="labelWrapper" :style="segmentStyles('lb')">
        {{ props.clock.lb.lb }}
      </div>
      <div v-if="props.clock.rt.on" class="relativeTimeWrapper" :style="segmentStyles('rt')">
        {{ getRelativeTime }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  font-style: v-bind(fontItalic);
  white-space: pre;
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
