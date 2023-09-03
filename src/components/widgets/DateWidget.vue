<script setup>
import { computed, inject } from 'vue'
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

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, store.config.global, lsUsesMargin)
}

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

const toSentenceCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getFormattedDate = computed(() => {
  return DateTime.fromJSDate(store.currentTime)
    .setLocale(store.config.global.lang)
    .setZone(props.widget.timezone ? props.widget.timezone : 'default')
})

const getDateParts = computed(() => {
  const parts = []

  if (props.widget.dayOfWeek.on) {
    if (props.widget.dayOfWeek.abbreviated) {
      let dayOfWeek = toSentenceCase(getFormattedDate.value.toFormat('ccc')) // Mon
      parts.push({ type: 'dayOfWeek', value: dayOfWeek })
    } else {
      let dayOfWeek = toSentenceCase(getFormattedDate.value.toFormat('cccc')) // Monday
      parts.push({ type: 'dayOfWeek', value: dayOfWeek })
    }
  }

  if (props.widget.year.on) {
    if (props.widget.year.twoDigit) {
      parts.push({ type: 'year', value: getFormattedDate.value.toFormat('yy') }) // 23
    } else {
      parts.push({ type: 'year', value: getFormattedDate.value.toFormat('y') }) // 2023
    }
  }

  if (props.widget.month.on) {
    if (props.widget.short) {
      if (props.widget.month.twoDigit) {
        parts.push({ type: 'month', value: getFormattedDate.value.toFormat('LL') }) // 08
      } else {
        parts.push({ type: 'month', value: getFormattedDate.value.toFormat('L') }) // 8
      }
    } else {
      if (props.widget.month.abbreviated) {
        let month = toSentenceCase(getFormattedDate.value.toFormat('LLL')) // Aug
        parts.push({ type: 'month', value: month }) // Aug
      } else {
        let month = toSentenceCase(getFormattedDate.value.toFormat('LLLL')) // August
        parts.push({ type: 'month', value: month }) // August
      }
    }
  }

  if (props.widget.day.on) {
    if (props.widget.day.twoDigit) {
      parts.push({ type: 'day', value: getFormattedDate.value.toFormat('dd') }) // 06
    } else {
      parts.push({ type: 'day', value: getFormattedDate.value.toFormat('d') }) // 6
    }
  }

  const lastIndex = parts.length - 1
  const format = props.widget.format || 'default'
  const formatOrder = {
    default: ['dayOfWeek', 'month', 'day', 'year'],
    little: ['dayOfWeek', 'day', 'month', 'year'],
    middle: ['dayOfWeek', 'month', 'day', 'year'],
    big: ['dayOfWeek', 'year', 'month', 'day'],
  }

  const orderedParts = formatOrder[format].map((type) => parts.find((p) => p.type === type)).filter(Boolean)

  let compiledParts = orderedParts.map((part, index) => {
    if (!part) return

    const isLastPart = index === lastIndex
    let shouldShowDelimiter = false
    if (!isLastPart && parts[index + 1] && props.widget[parts[index + 1].type].on) {
      shouldShowDelimiter = true
    }

    return {
      ...part,
      showDelimiter: shouldShowDelimiter,
    }
  })

  return compiledParts
})

// Function that offsets the date's quarter by the user's preference
const getQuarterOffset = () => {
  const offset = props.widget.quarter.start
  const date = getFormattedDate.value
  const month = date.month
  const offsetMonth = month - offset
  const offsetDate = date.set({ month: offsetMonth })
  return offsetDate.toFormat('q')
}
</script>

<template>
  <div
    class="date widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div class="dateWrapper">
        <!-- eslint-disable-next-line max-len -->
        <div v-if="props.widget.delimiter.on" :class="`datePart delimiter-1`" :style="segmentStyles('delimiter')">
          <span>{{
            props.widget.short ? props.widget.delimiter[`shortSymbol1`] : props.widget.delimiter[`longSymbol1`]
          }}</span>
        </div>
        <template v-for="(part, index) in getDateParts" :key="part.type">
          <div :class="`datePart datePart-${part.type}`" :style="segmentStyles(part.type)">
            {{ part.value }}
          </div>
          <div v-if="part.showDelimiter" :class="`datePart delimiter-${index + 2}`" :style="segmentStyles('delimiter')">
            <span>{{
              props.widget.short
                ? props.widget.delimiter[`shortSymbol${index + 2}`]
                : props.widget.delimiter[`longSymbol${index + 2}`]
            }}</span>
          </div>
        </template>
      </div>
      <div v-if="props.widget.dayOfYear.on" class="textWrapper" :style="segmentStyles('dayOfYear')">
        {{ props.widget.dayOfYear.prefixLabel
        }}{{ getFormattedDate.toFormat(props.widget.dayOfYear.threeDigit ? 'ooo' : 'o')
        }}{{ props.widget.dayOfYear.suffixLabel }}
      </div>
      <div v-if="props.widget.week.on" class="textWrapper" :style="segmentStyles('week')">
        {{ props.widget.week.prefixLabel }}{{ getFormattedDate.toFormat(props.widget.dayOfYear.threeDigit ? 'WW' : 'W')
        }}{{ props.widget.week.suffixLabel }}
      </div>
      <div v-if="props.widget.quarter.on" class="textWrapper" :style="segmentStyles('quarter')">
        {{ props.widget.quarter.prefixLabel }}{{ getQuarterOffset() }}{{ props.widget.quarter.suffixLabel }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dateWrapper {
  display: inline-flex;
  white-space: pre;
}

.datePart {
  display: inline-flex;
  text-align: center;
  text-decoration: v-bind(fontUnderline);
  text-transform: v-bind(fontCase);
  font-style: v-bind(fontItalic);
  white-space: pre;
}

.textWrapper {
  display: block;
  white-space: pre;
}
</style>
