<script setup>
import { computed, ref, inject, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '@/store.js'
import { DateTime } from 'luxon'
import { setWidgetContainerStyles, setWidgetSegmentStyles } from '@/helpers/widgets.js'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const blinkStatus = ref(false)
let timeout = null

onMounted(() => {
  blinkStatus.value = true
  timeout = setInterval(() => {
    blinkStatus.value = false
    nextTick(() => {
      blinkStatus.value = true
    })
  }, 3000)
})

onBeforeUnmount(() => {
  if (timeout) {
    clearInterval(timeout)
  }
})

const blink = computed(() => {
  return props.widget.delimiter.blink && blinkStatus.value ? 'digitalClockBlink 1s steps(2) infinite' : 'none'
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, store.config.global, lsUsesMargin)
}

const fontSize = computed(() => {
  const config = props.widget.base.font.override ? props.widget.base.font : store.config.global.font
  return config.size ? `${config.size}px` : '0'
})

const fontUnderline = computed(() => {
  const config = props.widget.base.font.override ? props.widget.base.font : store.config.global.font
  return config.underline ? 'underline' : 'none'
})

const fontCase = computed(() => {
  const config = props.widget.base.font.override ? props.widget.base.font : store.config.global.font
  return config.transform ? config.transform : 'none'
})

const fontItalic = computed(() => {
  const config = props.widget.base.font.override ? props.widget.base.font : store.config.global.font
  return config.italic ? config.italic : 'normal'
})

const spaceBetween = computed(() => {
  let sb = props.widget.spaceBetween ? props.widget.spaceBetween / 2 : 0
  return `${sb * 0.01}em`
})

const letterSpacing = computed(() => {
  const config = props.widget.base.font.override ? props.widget.base.font : store.config.global.font
  return config.letterSpacing ? `${config.letterSpacing * 0.01}em` : '0'
})

const monospace = computed(() => {
  return props.widget.monospace ? '1ch' : 'auto'
})

const getFormattedTime = computed(() => {
  let tz = 'default'
  if (props.widget.timezone) {
    tz = props.widget.timezone !== 'local' ? props.widget.timezone : 'default'
  }
  return DateTime.fromJSDate(store.currentTime).setLocale(store.config.global.lang).setZone(tz)
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
</script>

<template>
  <div
    class="clock widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div class="timeWrapper">
        <div v-if="props.widget.hour.on" class="clockPart hour">
          <span
            v-for="(hr, index) in getFormattedTime
              .toFormat(props.widget.hour.twentyFour ? 'H' : 'h')
              .toString()
              .padStart(props.widget.hour.twoDigit ? 2 : 1, '0')
              .split('')"
            :key="index"
            class="clockDigit"
            :style="segmentStyles('hour', true)"
            >{{ hr }}</span
          >
        </div>
        <div
          v-if="props.widget.delimiter.on && props.widget.hour.on && (props.widget.sec.on || props.widget.min.on)"
          class="clockPart delimiter"
        >
          <span
            v-for="(dl, index) in props.widget.delimiter.symbol1.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles('delimiter', true)"
            >{{ dl }}</span
          >
        </div>
        <div v-if="props.widget.min.on" class="clockPart minute">
          <span
            v-for="(min, index) in getFormattedTime.minute
              .toString()
              .padStart(props.widget.min.twoDigit ? 2 : 1, '0')
              .split('')"
            :key="index"
            class="clockDigit"
            :style="segmentStyles('min', true)"
            >{{ min }}</span
          >
        </div>
        <div v-if="props.widget.delimiter.on && props.widget.min.on && props.widget.sec.on" class="clockPart delimiter">
          <span
            v-for="(dl, index) in props.widget.delimiter.symbol2.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles('delimiter', true)"
            >{{ dl }}</span
          >
        </div>
        <div v-if="props.widget.sec.on" class="clockPart second">
          <span
            v-for="(sec, index) in getFormattedTime.second
              .toString()
              .padStart(props.widget.sec.twoDigit ? 2 : 1, '0')
              .split('')"
            :key="index"
            class="clockDigit"
            :style="segmentStyles('sec', true)"
            >{{ sec }}</span
          >
        </div>
        <div
          v-if="props.widget.delimiter.on && props.widget.delimiter.symbol3 && props.widget.sec.on"
          class="clockPart delimiter"
        >
          <span
            v-for="(dl, index) in props.widget.delimiter.symbol3.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles('delimiter', true)"
            >{{ dl }}</span
          >
        </div>
        <div
          v-if="props.widget.meridiem.on"
          class="clockPart meridiem"
          :style="props.widget.meridiem.ignoreForAlignment ? 'width: 0; margin-inline: 0;' : ''"
        >
          <span
            v-for="(md, index) in getFormattedTime.toFormat('a') === 'AM'
              ? props.widget.meridiem.am.split('')
              : props.widget.meridiem.pm.split('')"
            :key="index"
            class="clockCharacter"
            :style="segmentStyles('meridiem', true)"
            >{{ md }}</span
          >
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
.timeWrapper {
  display: inline-flex;
  vertical-align: text-top;
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
