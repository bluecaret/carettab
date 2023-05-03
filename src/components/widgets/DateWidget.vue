<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store.js'
import { DateTime } from 'luxon'
import { fontList } from '@/assets/lists.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const containerStyles = computed(() => {
  const box = props.widget.w.cor ? props.widget.w : store.config.global
  const font = props.widget.w.orf ? props.widget.w : store.config.global

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
  const segment = s.or ? s : props.widget.w

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
  if (props.widget.w.fb < 400) {
    wght = `${props.widget.w.fb};400`
  } else if (props.widget.w.fb > 400) {
    wght = `400;${props.widget.w.fb}`
  }
  return `${base}${props.widget.w.ff}:wght@${wght}${post}`
})

const offset = computed(() => {
  return `${props.widget.w.x}px ${-props.widget.w.y}px`
})

const width = computed(() => {
  return props.widget.w.as ? 'max-content' : `${props.widget.w.w}px`
})

const height = computed(() => {
  return props.widget.w.as ? 'max-content' : `${props.widget.w.h}px`
})

const fontSize = computed(() => {
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.fs ? `${config.fs}px` : '0'
})

const fontUnderline = computed(() => {
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.fu ? 'underline' : 'none'
})

const fontCase = computed(() => {
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.tt ? config.tt : 'none'
})

const letterSpacing = computed(() => {
  const config = props.widget.w.orf ? props.widget.w : store.config.global
  return config.ls ? `${config.ls * 0.01}em` : '0'
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

  // moment.locale(this.settings.config.i18n.lang)
  // let format = this.settings.config.date.quarter.format
  // return moment(this.currentDate)
  //   .subtract(this.settings.config.date.quarter.start ? this.settings.config.date.quarter.start : 0, 'months')
  //   .tz(this.getZone(this.settings.config.date.timezone))
  //   .format(format)
}
</script>

<template>
  <div class="date widget" :class="[props.widget.w.a, `container-${props.widget.w.ca}`]" :style="containerStyles">
    <link
      v-if="props.widget.w.orf"
      :id="`google-font-link-${props.widget.id}`"
      rel="stylesheet"
      :href="buildFontLink"
    />
    <div class="widgetInner">
      <div class="dateWrapper">
        <div v-if="props.widget.dl.on" :class="`datePart delimiter-1`">
          <span :style="segmentStyles(props.widget.dl, false)">{{
            props.widget.sd ? props.widget.dl[`ss1`] : props.widget.dl[`ls1`]
          }}</span>
        </div>
        <template v-for="(part, index) in getDateParts" :key="part.type">
          <div v-if="props.widget[part.type].on" :class="`datePart datePart-${part.type}`">
            <span class="dateDigit" :style="segmentStyles(props.widget[part.type], false)">{{ part.value }}</span>
          </div>
          <div v-if="props.widget[part.type].on && props.widget.dl.on" :class="`datePart delimiter-${index + 2}`">
            <span :style="segmentStyles(props.widget.dl, false)">{{
              props.widget.sd ? props.widget.dl[`ss${index + 2}`] : props.widget.dl[`ls${index + 2}`]
            }}</span>
          </div>
        </template>
      </div>
      <div v-if="props.widget.doy.on" class="textWrapper" :style="segmentStyles(props.widget.doy)">
        {{ props.widget.doy.lbp }}{{ getFormattedDate.toFormat(props.widget.doy.td ? 'ooo' : 'o')
        }}{{ props.widget.doy.lbs }}
      </div>
      <div v-if="props.widget.wk.on" class="textWrapper" :style="segmentStyles(props.widget.wk)">
        {{ props.widget.wk.lbp }}{{ getFormattedDate.toFormat(props.widget.doy.td ? 'WW' : 'W')
        }}{{ props.widget.wk.lbs }}
      </div>
      <div v-if="props.widget.qr.on" class="textWrapper" :style="segmentStyles(props.widget.qr)">
        {{ props.widget.qr.lbp }}{{ getQuarterOffset() }}{{ props.widget.qr.lbs }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date {
  width: v-bind(width);
  height: v-bind(height);
  translate: v-bind(offset);
}

.dateWrapper {
  display: inline-flex;
}

.datePart {
  display: inline-flex;
  font-size: v-bind(fontSize);
  text-align: center;
  text-decoration: v-bind(fontUnderline);
  text-transform: v-bind(fontCase);
  white-space: pre;
}

.dateDigit {
  display: inline-block;
  text-align: center;
  margin-inline: v-bind(letterSpacing);
}

.textWrapper {
  display: block;
  white-space: pre;
}
</style>
