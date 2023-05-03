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
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.fu ? 'underline' : 'none'
})

const fontCase = computed(() => {
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.tt ? config.tt : 'none'
})

const fontItalic = computed(() => {
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.fi ? config.fi : 'normal'
})

const getFormattedDate = computed(() => {
  return DateTime.fromJSDate(store.currentTime).setZone(props.widget.tz ? props.widget.tz : 'default')
})

const getDateParts = computed(() => {
  let dow = '',
    yr = '',
    mh = '',
    dy = ''

  if (props.widget.dow.on) {
    if (props.widget.dow.ab) {
      dow = getFormattedDate.value.toFormat('ccc') // Mon
    } else {
      dow = getFormattedDate.value.toFormat('cccc') // Monday
    }
  } else {
    dow = ''
  }

  if (props.widget.yr.on) {
    if (props.widget.yr.td) {
      yr = getFormattedDate.value.toFormat('yy') // 23
    } else {
      yr = getFormattedDate.value.toFormat('y') // 2023
    }
  } else {
    yr = ''
  }

  if (props.widget.mh.on) {
    if (props.widget.sd) {
      if (props.widget.mh.td) {
        mh = getFormattedDate.value.toFormat('LL') // 08
      } else {
        mh = getFormattedDate.value.toFormat('L') // 8
      }
    } else {
      if (props.widget.mh.ab) {
        mh = getFormattedDate.value.toFormat('LLL') // Aug
      } else {
        mh = getFormattedDate.value.toFormat('LLLL') // August
      }
    }
  } else {
    mh = ''
  }

  if (props.widget.dy.on) {
    if (props.widget.dy.td) {
      dy = getFormattedDate.value.toFormat('dd') // 06
    } else {
      dy = getFormattedDate.value.toFormat('d') // 6
    }
  } else {
    dy = ''
  }

  if (props.widget.ft === 'little') {
    return [
      { type: 'dow', value: dow },
      { type: 'dy', value: dy },
      { type: 'mh', value: mh },
      { type: 'yr', value: yr },
    ]
  }
  if (props.widget.ft === 'middle') {
    return [
      { type: 'dow', value: dow },
      { type: 'mh', value: mh },
      { type: 'dy', value: dy },
      { type: 'yr', value: yr },
    ]
  }
  if (props.widget.ft === 'big') {
    return [
      { type: 'dow', value: dow },
      { type: 'yr', value: yr },
      { type: 'mh', value: mh },
      { type: 'dy', value: dy },
    ]
  }

  return [dow, yr, mh, dy]
})

// Function that offsets the date's quarter by the user's preference
const getQuarterOffset = () => {
  const offset = props.widget.qr.st
  const date = getFormattedDate.value
  const month = date.month
  const offsetMonth = month - offset
  const offsetDate = date.set({ month: offsetMonth })
  return offsetDate.toFormat('q')
}
</script>

<template>
  <div class="date widget" :class="[props.widget.w.a, `container-${props.widget.w.ca}`]" :style="containerStyles">
    <FontLink v-if="props.widget.w.orf" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div class="dateWrapper">
        <!-- eslint-disable-next-line max-len -->
        <div v-if="props.widget.dl.on" :class="`datePart delimiter-1`" :style="segmentStyles('dl')">
          <span>{{ props.widget.sd ? props.widget.dl[`ss1`] : props.widget.dl[`ls1`] }}</span>
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
            v-if="props.widget[part.type].on && props.widget.dl.on"
            :class="`datePart delimiter-${index + 2}`"
            :style="segmentStyles('dl')"
          >
            <span>{{ props.widget.sd ? props.widget.dl[`ss${index + 2}`] : props.widget.dl[`ls${index + 2}`] }}</span>
          </div>
        </template>
      </div>
      <div v-if="props.widget.doy.on" class="textWrapper" :style="segmentStyles('doy')">
        {{ props.widget.doy.lbp }}{{ getFormattedDate.toFormat(props.widget.doy.td ? 'ooo' : 'o')
        }}{{ props.widget.doy.lbs }}
      </div>
      <div v-if="props.widget.wk.on" class="textWrapper" :style="segmentStyles('wk')">
        {{ props.widget.wk.lbp }}{{ getFormattedDate.toFormat(props.widget.doy.td ? 'WW' : 'W')
        }}{{ props.widget.wk.lbs }}
      </div>
      <div v-if="props.widget.qr.on" class="textWrapper" :style="segmentStyles('qr')">
        {{ props.widget.qr.lbp }}{{ getQuarterOffset() }}{{ props.widget.qr.lbs }}
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
