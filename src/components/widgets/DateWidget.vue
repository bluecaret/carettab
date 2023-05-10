<script setup>
import { computed } from 'vue'
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

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.widget, type, lsUsesMargin)
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

const getFormattedDate = computed(() => {
  return DateTime.fromJSDate(store.currentTime).setZone(props.widget.timezone ? props.widget.timezone : 'default')
})

const getDateParts = computed(() => {
  let dow = '',
    yr = '',
    mh = '',
    dy = ''

  if (props.widget.dayOfWeek.on) {
    if (props.widget.dayOfWeek.abbreviated) {
      dow = getFormattedDate.value.toFormat('ccc') // Mon
    } else {
      dow = getFormattedDate.value.toFormat('cccc') // Monday
    }
  } else {
    dow = ''
  }

  if (props.widget.year.on) {
    if (props.widget.year.twoDigit) {
      yr = getFormattedDate.value.toFormat('yy') // 23
    } else {
      yr = getFormattedDate.value.toFormat('y') // 2023
    }
  } else {
    yr = ''
  }

  if (props.widget.month.on) {
    if (props.widget.short) {
      if (props.widget.month.twoDigit) {
        mh = getFormattedDate.value.toFormat('LL') // 08
      } else {
        mh = getFormattedDate.value.toFormat('L') // 8
      }
    } else {
      if (props.widget.month.abbreviated) {
        mh = getFormattedDate.value.toFormat('LLL') // Aug
      } else {
        mh = getFormattedDate.value.toFormat('LLLL') // August
      }
    }
  } else {
    mh = ''
  }

  if (props.widget.day.on) {
    if (props.widget.day.twoDigit) {
      dy = getFormattedDate.value.toFormat('dd') // 06
    } else {
      dy = getFormattedDate.value.toFormat('d') // 6
    }
  } else {
    dy = ''
  }

  if (props.widget.format === 'little') {
    return [
      { type: 'dayOfWeek', value: dow },
      { type: 'day', value: dy },
      { type: 'month', value: mh },
      { type: 'year', value: yr },
    ]
  }
  if (props.widget.format === 'middle') {
    return [
      { type: 'dayOfWeek', value: dow },
      { type: 'month', value: mh },
      { type: 'day', value: dy },
      { type: 'year', value: yr },
    ]
  }
  if (props.widget.format === 'big') {
    return [
      { type: 'dayOfWeek', value: dow },
      { type: 'year', value: yr },
      { type: 'month', value: mh },
      { type: 'day', value: dy },
    ]
  }

  return [dow, yr, mh, dy]
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
          <div
            v-if="props.widget[part.type].on"
            :class="`datePart datePart-${part.type}`"
            :style="segmentStyles(part.type)"
          >
            {{ part.value }}
          </div>
          <div
            v-if="props.widget[part.type].on && props.widget.delimiter.on"
            :class="`datePart delimiter-${index + 2}`"
            :style="segmentStyles('delimiter')"
          >
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
