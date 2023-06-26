<script setup>
import { computed, inject } from 'vue'
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

const getBinaryTime = computed(() => {
  let tz = 'default'
  if (props.widget.timezone) {
    tz = props.widget.timezone !== 'local' ? props.widget.timezone : 'default'
  }
  const currentTime = DateTime.fromJSDate(store.currentTime).setZone(tz)
  let hour = currentTime.toFormat('HH')
  let minute = currentTime.toFormat('mm')
  let second = currentTime.toFormat('ss')
  let binaryHour = parseInt(hour).toString(2).padStart(8, '0').split('')
  let binaryMinute = parseInt(minute).toString(2).padStart(8, '0').split('')
  let binarySecond = parseInt(second).toString(2).padStart(8, '0').split('')

  return {
    hour: binaryHour,
    minute: binaryMinute,
    second: binarySecond,
  }
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

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, lsUsesMargin)
}

const gridGap = computed(() => {
  return props.widget.indicator.padding ? `${props.widget.indicator.padding}px` : '0'
})

const dotSize = computed(() => {
  return props.widget.indicator.size ? `${props.widget.indicator.size}px` : '0'
})

const getColors = (type, status) => {
  let color
  if (props.widget.indicator.overrideColors) {
    color = props.widget.indicator[`${type}${status === '1' ? 'OnColor' : 'OffColor'}`]
  } else {
    color = status === '1' ? store.config.global.element.primaryColor : store.config.global.element.secondaryColor
  }
  let elShadow = shadow(
    props.widget.indicator.overrideColors ? props.widget.indicator.shadow : store.config.global.element.shadow
  )
  return `
    background-color: ${props.widget.indicator.dot ? hsl(color) : 'transparent'};
    color: ${!props.widget.indicator.dot ? hsl(color) : 'transparent'};
    text-shadow: ${!props.widget.indicator.dot ? elShadow : 'none'};
    box-shadow: ${props.widget.indicator.dot ? elShadow : 'none'};
  `
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
      <div class="binary" :class="{ noSeconds: !props.widget.indicator.seconds }">
        <div class="hour">
          <template v-for="(digit, index) in getBinaryTime.hour" :key="index">
            <div
              v-if="(!props.widget.indicator.extras && ![0, 2].includes(index)) || props.widget.indicator.extras"
              class="digit"
              :class="{ on: digit === '1' }"
              :style="getColors('hour', digit)"
            >
              {{
                props.widget.indicator.dot
                  ? ''
                  : digit === '1'
                  ? props.widget.indicator.onLabel
                  : props.widget.indicator.offLabel
              }}
            </div>
            <div v-else></div>
          </template>
        </div>
        <div class="minute">
          <template v-for="(digit, index) in getBinaryTime.minute" :key="index">
            <div
              v-if="(!props.widget.indicator.extras && ![0].includes(index)) || props.widget.indicator.extras"
              class="digit"
              :class="{ on: digit === '1' }"
              :style="getColors('min', digit)"
            >
              {{
                props.widget.indicator.dot
                  ? ''
                  : digit === '1'
                  ? props.widget.indicator.onLabel
                  : props.widget.indicator.offLabel
              }}
            </div>
            <div v-else></div>
          </template>
        </div>
        <div v-if="props.widget.indicator.seconds" class="second">
          <template v-for="(digit, index) in getBinaryTime.second" :key="index">
            <div
              v-if="(!props.widget.indicator.extras && ![0].includes(index)) || props.widget.indicator.extras"
              class="digit"
              :class="{ on: digit === '1' }"
              :style="getColors('sec', digit)"
            >
              {{
                props.widget.indicator.dot
                  ? ''
                  : digit === '1'
                  ? props.widget.indicator.onLabel
                  : props.widget.indicator.offLabel
              }}
            </div>
            <div v-else></div>
          </template>
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
.binary {
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: v-bind(gridGap);
  &.noSeconds {
    grid-template-columns: 1fr 1fr;
  }
}

.hour,
.minute,
.second {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  place-items: center;
  gap: v-bind(gridGap);
  .digit {
    display: grid;
    place-items: center;
    background-color: transparent;
    color: transparent;
    border-radius: 50%;
    font-size: v-bind(dotSize);
    line-height: v-bind(dotSize);
    width: v-bind(dotSize);
    height: v-bind(dotSize);
    &.on {
      background-color: var(--b1);
      color: var(--cText);
    }
  }
}

.relativeTimeWrapper {
  display: block;
}

.labelWrapper {
  display: block;
}
</style>
