<script setup>
import { computed, watch, ref, onMounted } from 'vue'
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

const currentTime = ref(DateTime.fromJSDate(store.currentTime).setZone(props.clock.tz ? props.clock.tz : 'default'))
const analogHourRotation = ref('300deg')
const analogMinuteRotation = ref('60deg')
const analogSecondRotation = ref('210deg')
let timeout = null

onMounted(() => {
  // timeUpdate()
})

watch(
  () => store.currentTime,
  () => {
    // If smooth seconds, use CSS animation, but seconds will need to be synced up
    // every minute to ensure animation doesn't cause time to drift.
    // if (props.clock.sec.ss) {
    //   if (timeout) {
    //     clearTimeout(timeout)
    //   }
    //   timeout = setTimeout(() => {
    //     timeUpdate()
    //   }, 60000)
    // } else {
    //   timeUpdate()
    // }
  }
)

const timeUpdate = () => {
  // currentTime.value = DateTime.fromJSDate(store.currentTime).setZone(props.clock.tz ? props.clock.tz : 'default')
  // setAnalogTime()
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.clock, store.config.global)
})

const segmentStyles = (type, lsUsesMargin = false) => {
  return setWidgetSegmentStyles(props.clock, type, lsUsesMargin)
}

// const fontSize = computed(() => {
//   return props.clock.sz ? `${props.clock.sz * 10}px` : '0'
// })

// const getRelativeTime = computed(() => {
//   let zone = props.clock.tz ? props.clock.tz : 'default'
//   let here = DateTime.fromJSDate(store.currentTime).offset
//   let there = DateTime.fromJSDate(store.currentTime).setZone(zone).offset
//   let offset = (there - here) / 60
//   let diff
//   if (offset === 1) {
//     diff = `+${offset} hour`
//   } else if (offset === -1) {
//     diff = `${offset} hour`
//   } else if (offset < -1) {
//     diff = `${offset} hours`
//   } else {
//     diff = `+${offset} hours`
//   }
//   return diff
// })

// Analog time should be set every .5 seconds. Exception being if the seconds
// is set to be smooth, than only the seconds is not updated and instead uses
// CSS animation to keep time which is then synced every 5 min to prevent drift.
// const setAnalogTime = () => {
//   analogHourRotation.value = getAnalogHour()
//   analogMinuteRotation.value = getAnalogMinute()
//   setAnalogSeconds()
// }

// const setAnalogSeconds = () => {
//   analogSecondRotation.value = getAnalogSecond()
// }

// const getAnalogSecond = () => {
//   let second = currentTime.value.second * 6
//   return second + 'deg'
// }

// const getAnalogMinute = () => {
//   let second = currentTime.value.second * 6
//   let minute = currentTime.value.minute * 6 + second / 60
//   return minute + 'deg'
// }

// const getAnalogHour = () => {
//   let second = currentTime.value.second * 6
//   let minute = currentTime.value.minute * 6 + second / 60
//   let hour = ((currentTime.value.hour % 12) / 12) * 360 + minute / 12
//   return hour + 'deg'
// }
</script>

<template>
  <div class="clock widget" :class="[props.clock.w.a, `container-${props.clock.w.ca}`]" :style="containerStyles">
    <!-- <FontLink v-if="props.clock.w.orf" :widget="props.clock"></FontLink>
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
      <div v-if="props.clock.lb.on" class="labelWrapper" :style="segmentStyles('lb')">
        {{ props.clock.lb.lb }}
      </div>
      <div v-if="props.clock.rt.on" class="relativeTimeWrapper" :style="segmentStyles('rt')">
        {{ getRelativeTime }}
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
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
