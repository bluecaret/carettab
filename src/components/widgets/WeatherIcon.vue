<script setup>
import { ref } from 'vue'
import { hsl } from '@/helpers/widgets.js'
// Icons by AM Charts
// https://www.amcharts.com/free-animated-svg-weather-icons/

const props = defineProps({
  day: Number,
  code: Number,
  colors: Object,
  animated: Boolean,
})

const codes = [
  { code: 1000, iconParts: ['sun'] },
  { code: 1003, iconParts: ['sun-partial', 'cloud'] },
  { code: 1006, iconParts: ['cloud'] },
  { code: 1009, iconParts: ['cloud', 'cloud-small'] },
  { code: 1030, iconParts: ['cloud', 'fog'] },
  { code: 1135, iconParts: ['cloud', 'fog'] },
  { code: 1147, iconParts: ['cloud', 'fog'] },
  { code: 1150, iconParts: ['sun-partial', 'cloud', 'rain-light'] },
  { code: 1153, iconParts: ['sun-partial', 'rain-light'] },
  { code: 1180, iconParts: ['sun-partial', 'cloud', 'rain-moderate'] },
  { code: 1273, iconParts: ['sun-partial', 'cloud', 'rain-moderate'] },
  { code: 1183, iconParts: ['rain-moderate', 'cloud'] },
  { code: 1240, iconParts: ['sun-partial', 'cloud', 'rain-moderate'] },
  { code: 1063, iconParts: ['sun-partial', 'cloud', 'rain-moderate'] },
  { code: 1186, iconParts: ['sun-partial', 'cloud', 'rain-moderate'] },
  { code: 1243, iconParts: ['sun-partial', 'cloud', 'rain-heavy'] },
  { code: 1189, iconParts: ['rain-moderate', 'cloud'] },
  { code: 1192, iconParts: ['sun-partial', 'cloud', 'rain-heavy'] },
  { code: 1195, iconParts: ['cloud', 'rain-heavy'] },
  { code: 1246, iconParts: ['cloud', 'cloud-small', 'rain-downpour'] },
  { code: 1276, iconParts: ['cloud', 'rain-heavy', 'thunder'] },
  { code: 1072, iconParts: ['sun-partial', 'cloud', 'rain-freezing'] },
  { code: 1168, iconParts: ['cloud', 'rain-freezing'] },
  { code: 1171, iconParts: ['cloud', 'rain-freezing'] },
  { code: 1198, iconParts: ['cloud', 'rain-freezing'] },
  { code: 1201, iconParts: ['cloud', 'cloud-small', 'rain-freezing'] },
  { code: 1069, iconParts: ['sun-partial', 'cloud', 'sleet'] },
  { code: 1249, iconParts: ['sun-partial', 'cloud', 'sleet'] },
  { code: 1204, iconParts: ['cloud', 'sleet'] },
  { code: 1207, iconParts: ['cloud', 'cloud-small', 'sleet'] },
  { code: 1252, iconParts: ['sun-partial', 'cloud', 'cloud-small'] },
  { code: 1210, iconParts: ['sun-partial', 'cloud', 'snow-light'] },
  { code: 1066, iconParts: ['sun-partial', 'cloud', 'snow-light'] },
  { code: 1255, iconParts: ['sun-partial', 'cloud', 'snow-light'] },
  { code: 1279, iconParts: ['sun-partial', 'cloud', 'snow-light'] },
  { code: 1213, iconParts: ['cloud', 'snow-light'] },
  { code: 1216, iconParts: ['cloud', 'snow-moderate'] },
  { code: 1219, iconParts: ['cloud', 'snow-moderate'] },
  { code: 1258, iconParts: ['sun-partial', 'cloud', 'snow-moderate'] },
  { code: 1222, iconParts: ['cloud', 'snow-heavy'] },
  { code: 1225, iconParts: ['cloud', 'snow-heavy'] },
  { code: 1282, iconParts: ['cloud', 'snow-heavy', 'thunder'] },
  { code: 1114, iconParts: ['cloud', 'cloud-small', 'snow-heavy'] },
  { code: 1117, iconParts: ['cloud', 'cloud-small', 'snow-blizzard'] },
  { code: 1237, iconParts: ['cloud', 'rain-freezing'] },
  { code: 1261, iconParts: ['sun-partial', 'cloud', 'rain-freezing'] },
  { code: 1264, iconParts: ['sun-partial', 'cloud', 'rain-freezing'] },
  { code: 1087, iconParts: ['sun-partial', 'cloud', 'thunder'] },
]

const code = ref(codes.find((obj) => obj.code === props.code).iconParts)

const setIconStyles = () => {
  return `
    --sun: ${hsl(props.colors.sun)};
    --moon: ${hsl(props.colors.moon)};
    --cloud: ${hsl(props.colors.cloud)};
    --rain: ${hsl(props.colors.rain)};
    --snow: ${hsl(props.colors.snow)};
    --thunder: ${hsl(props.colors.thunder)};
    --stroke: ${hsl(props.colors.stroke)};
    // border: 2px solid red;
  `
}
</script>

<template>
  <!-- prettier-ignore -->
  <svg
    :style="setIconStyles()"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="-50 -40 100 80"
  >
    <g v-if="props.day === 1 && code.includes('sun')" class="sun" :class="{ animated: props.animated }">
      <g transform="translate(0,0)">
        <g class="sun-rays">
          <g>
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(45)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(90)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(135)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(180)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(225)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(270)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
          <g transform="rotate(315)">
            <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
          </g>
        </g>
        <circle cx="0" cy="0" r="16" stroke-width="2" />
      </g>
    </g>
    <g v-if="props.day === 1 && code.includes('sun-partial')" class="sun-partial" :class="{ animated: props.animated }">
      <g transform="translate(-28,-16)" style="scale: 0.8">
        <g transform="translate(0,0)">
          <g class="sun-rays">
            <g>
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(45)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(90)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(135)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(180)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(225)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(270)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
            <g transform="rotate(315)">
              <line stroke-linecap="round" stroke-width="3" transform="translate(0,22)" x1="0" x2="0" y1="0" y2="10" />
            </g>
          </g>
          <circle cx="0" cy="0" r="16" stroke-width="2" />
        </g>
      </g>
    </g>
    <g v-if="props.day !== 1 && code.includes('sun')" class="moon" :class="{ animated: props.animated }">
      <g transform="translate(-32,-31) scale(2.4)">
        <g class="star">
          <polygon points="3.3,1.5 4,2.7 5.2,3.3 4,4 3.3,5.2 2.7,4 1.5,3.3 2.7,2.7" stroke-miterlimit="10" />
        </g>
        <g class="star">
          <polygon points="3.3,1.5 4,2.7 5.2,3.3 4,4 3.3,5.2 2.7,4 1.5,3.3 2.7,2.7" stroke-miterlimit="10" transform="translate(20,10)" />
        </g>
        <g class="moon-g">
          <path d="M14.5,13.2c0-3.7,2-6.9,5-8.7   c-1.5-0.9-3.2-1.3-5-1.3c-5.5,0-10,4.5-10,10s4.5,10,10,10c1.8,0,3.5-0.5,5-1.3C16.5,20.2,14.5,16.9,14.5,13.2z" stroke-linejoin="round" stroke-width="2" />
        </g>
      </g>
    </g>
    <g v-if="props.day !== 1 && code.includes('sun-partial')" class="moon-partial" :class="{ animated: props.animated }">
      <g transform="translate(3,-38)">
        <g transform="translate(0,0), scale(1.8)">
          <g class="star">
            <polygon points="3.3,1.5 4,2.7 5.2,3.3 4,4 3.3,5.2 2.7,4 1.5,3.3 2.7,2.7" stroke-miterlimit="10" />
          </g>
          <g class="star">
            <polygon points="3.3,1.5 4,2.7 5.2,3.3 4,4 3.3,5.2 2.7,4 1.5,3.3 2.7,2.7" stroke-miterlimit="10" transform="translate(20,10)" />
          </g>
          <g class="moon-g">
            <path d="M14.5,13.2c0-3.7,2-6.9,5-8.7   c-1.5-0.9-3.2-1.3-5-1.3c-5.5,0-10,4.5-10,10s4.5,10,10,10c1.8,0,3.5-0.5,5-1.3C16.5,20.2,14.5,16.9,14.5,13.2z" stroke-linejoin="round" stroke-width="2" />
          </g>
        </g>
      </g>
    </g>
    <g v-if="code.includes('cloud-small')" class="cloud-small" :class="{ animated: props.animated }" transform="translate(0,0)">
      <g>
        <path d="M47.7,35.4     c0-4.6-3.7-8.2-8.2-8.2c-1,0-1.9,0.2-2.8,0.5c-0.3-3.4-3.1-6.2-6.6-6.2c-3.7,0-6.7,3-6.7,6.7c0,0.8,0.2,1.6,0.4,2.3     c-0.3-0.1-0.7-0.1-1-0.1c-3.7,0-6.7,3-6.7,6.7c0,3.6,2.9,6.6,6.5,6.7l17.2,0C44.2,43.3,47.7,39.8,47.7,35.4z" stroke-linejoin="round" stroke-width="1.2" transform="translate(-18,-58), scale(1.3)" />
      </g>
    </g>
    <g v-if="code.includes('cloud')" class="cloud" :class="{ animated: props.animated }" transform="translate(-12,-22)" style="scale: 2">
      <g>
        <path class="cloud" d="M47.7,35.4     c0-4.6-3.7-8.2-8.2-8.2c-1,0-1.9,0.2-2.8,0.5c-0.3-3.4-3.1-6.2-6.6-6.2c-3.7,0-6.7,3-6.7,6.7c0,0.8,0.2,1.6,0.4,2.3     c-0.3-0.1-0.7-0.1-1-0.1c-3.7,0-6.7,3-6.7,6.7c0,3.6,2.9,6.6,6.5,6.7l17.2,0C44.2,43.3,47.7,39.8,47.7,35.4z" stroke-linejoin="round" stroke-width="1.2" transform="translate(-20,-11)" />
      </g>
    </g>
    <g v-if="code.includes('rain-light')" class="rain-light" :class="{ animated: props.animated }">
      <g transform="translate(0,26), rotate(10)">
        <line stroke-dasharray="4,7" stroke-linecap="round" stroke-width="2" transform="translate(0,0)" x1="0" x2="0" y1="0" y2="11" />
      </g>
    </g>
    <g v-if="code.includes('rain-moderate')" class="rain-moderate" :class="{ animated: props.animated }">
      <g transform="translate(0,26), rotate(10)">
        <line stroke-dasharray="4,7" stroke-linecap="round" stroke-width="2" transform="translate(-4,0)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,7" stroke-linecap="round" stroke-width="2" transform="translate(4,1)" x1="0" x2="0" y1="0" y2="11" />
      </g>
    </g>
    <g v-if="code.includes('rain-heavy')" class="rain-heavy" :class="{ animated: props.animated }">
      <g transform="translate(0,26), rotate(10)">
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(-8,1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(0,-1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(8,-1)" x1="0" x2="0" y1="0" y2="11" />
      </g>
    </g>
    <g v-if="code.includes('rain-downpour')" class="rain-downpour" :class="{ animated: props.animated }">
      <g transform="translate(0,26), rotate(10)">
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(-12,1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(-6,-1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(0,-1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(6,-1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(12,-1)" x1="0" x2="0" y1="0" y2="11" />
      </g>
    </g>
    <g v-if="code.includes('rain-freezing')" class="rain-freezing" :class="{ animated: props.animated }">
      <g transform="translate(0,26), rotate(10)">
        <line stroke-dasharray="0.1,7" stroke-linecap="round" stroke-width="3" transform="translate(-8,1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="0.1,7" stroke-linecap="round" stroke-width="3" transform="translate(0,-1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="0.1,7" stroke-linecap="round" stroke-width="3" transform="translate(8,0)" x1="0" x2="0" y1="0" y2="11" />
      </g>
    </g>
    <g v-if="code.includes('fog')" class="fog" :class="{ animated: props.animated }">
      <g transform="translate(20,31), rotate(90)">
        <line stroke-dasharray="14,4" stroke-linecap="round" stroke-width="2" transform="translate(-4,1)" x1="0" x2="0" y1="0" y2="40" />
        <line stroke-dasharray="20,4" stroke-linecap="round" stroke-width="2" transform="translate(0,-1)" x1="0" x2="0" y1="0" y2="40" />
        <line stroke-dasharray="14,4" stroke-linecap="round" stroke-width="2" transform="translate(4,-1)" x1="0" x2="0" y1="0" y2="40" />
      </g>
    </g>
    <g v-if="code.includes('sleet')" class="sleet" :class="{ animated: props.animated }">
      <g class="sleet-rain" transform="translate(0,26), rotate(10)">
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(-8,1)" x1="0" x2="0" y1="0" y2="11" />
        <line stroke-dasharray="4,4" stroke-linecap="round" stroke-width="2" transform="translate(0,-1)" x1="0" x2="0" y1="0" y2="11" />
      </g>
      <g class="sleet-snow" transform="translate(10,18)">
        <g class="snow-g">
          <g transform="translate(0,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
      </g>
    </g>
    <g v-if="code.includes('snow-light')" class="snow-light" :class="{ animated: props.animated }">
      <g transform="translate(0,18)">
        <g class="snow-g">
          <g transform="translate(0,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
      </g>
    </g>
    <g v-if="code.includes('snow-moderate')" class="snow-moderate" :class="{ animated: props.animated }">
      <g transform="translate(0,18)">
        <g class="snow-g">
          <g transform="translate(-8,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(8,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
      </g>
    </g>
    <g v-if="code.includes('snow-heavy')" class="snow-heavy" :class="{ animated: props.animated }">
      <g transform="translate(0,18)">
        <g class="snow-g">
          <g transform="translate(-12,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(0,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(12,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
      </g>
    </g>
    <g v-if="code.includes('snow-blizzard')" class="snow-blizzard" :class="{ animated: props.animated }">
      <g transform="translate(0,18)">
        <g class="snow-g">
          <g transform="translate(-16,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(-8,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(0,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(8,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
        <g class="snow-g">
          <g transform="translate(16,0)">
            <line stroke-linecap="round" stroke-width="1.2" transform="translate(0,9), rotate(0)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(45)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(90)" x1="0" x2="0" y1="-2.5" y2="2.5" />
            <line stroke-linecap="round" stroke-width="1" transform="translate(0,9), rotate(135)" x1="0" x2="0" y1="-2.5" y2="2.5" />
          </g>
        </g>
      </g>
    </g>
    <g v-if="code.includes('thunder')" class="thunder" :class="{ animated: props.animated }">
      <g transform="translate(-26,6)">
        <g transform="scale(1.8)">
          <polygon stroke-width="1" points="14.3,-2.9 20.5,-2.9 16.4,4.3 20.3,4.3 11.5,14.6 14.9,6.9 11.1,6.9" />
        </g>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
@keyframes cloud-small {
  0% {
    transform: translate(2px, 0);
  }
  50% {
    transform: translate(-45px, 0);
  }
  100% {
    transform: translate(2px, 0);
  }
}
@keyframes cloud {
  0% {
    transform: translate(2px, 0);
  }
  50% {
    transform: translate(-2px, 0);
  }
  100% {
    transform: translate(2px, 0);
  }
}
@keyframes shock {
  0% {
    transform: translate(0, 0);
  }
  1% {
    transform: translate(0.3px, 0);
  }
  2% {
    transform: translate(0, 0);
  }
  3% {
    transform: translate(0.5px, 0.4px);
  }
  4% {
    transform: translate(0, 0);
  }
  5% {
    transform: translate(0.3px, 0);
  }
  6% {
    transform: translate(0, 0);
  }
  7% {
    transform: translate(0.3px, 0);
  }
  8% {
    transform: translate(0, 0);
  }
  9% {
    transform: translate(0.3px, 0);
  }
  10% {
    transform: translate(0, 0);
  }
  11% {
    transform: translate(1px, 0);
  }
  12% {
    transform: translate(0, 0);
  }
  13% {
    transform: translate(-1px, 0);
  }
  14% {
    transform: translate(0, 0);
  }
  30% {
    fill: var(--thunder);
    transform: translate(0, 0);
  }
  45% {
    fill: var(--thunder);
    transform: translate(-1px, 5px);
  }
  55% {
    opacity: 1;
  }
  65% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes sun-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes sun-shine {
  0% {
    stroke-dasharray: 10 20;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 5 20;
    stroke-dashoffset: 0%;
  }
  100% {
    stroke-dasharray: 10 20;
    stroke-dashoffset: 0;
  }
}
@keyframes moon {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(15deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes star {
  0% {
    opacity: 0.2;
    scale: 0.8;
  }
  100% {
    opacity: 1;
    scale: 1;
  }
}
@keyframes rain {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -100;
  }
}
@keyframes fog {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -100;
  }
}
@keyframes snow {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  33.33% {
    transform: translateX(-1.3px) translateY(3px);
  }
  66.66% {
    transform: translateX(1.6px) translateY(6px);
    opacity: 1;
  }
  100% {
    transform: translateX(-1.9px) translateY(9px);
    opacity: 0;
  }
}
@keyframes snow-reverse {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  33.33% {
    transform: translateX(1.3px) translateY(3px);
  }
  66.66% {
    transform: translateX(-1.6px) translateY(6px);
    opacity: 1;
  }
  100% {
    transform: translateX(1.9px) translateY(9px);
    opacity: 0;
  }
}

.sun.animated .sun-rays {
  animation-name: sun-spin;
  animation-duration: 9s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
.sun.animated line {
  animation-name: sun-shine;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.sun line {
  fill: none;
  stroke: var(--sun);
}
.sun circle {
  fill: var(--sun);
  stroke: var(--sun);
}

.sun-partial.animated .sun-rays {
  animation-name: sun-spin;
  animation-duration: 9s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
.sun-partial line {
  fill: none;
  stroke: var(--sun);
}
.sun-partial circle {
  fill: var(--sun);
  stroke: var(--sun);
}

.moon.animated .moon-g {
  // animation-name: moon;
  // animation-duration: 6s;
  // animation-timing-function: linear;
  // animation-iteration-count: infinite;
  transform-origin: 12.5px 15.15px 0; /* TODO FF CENTER ISSUE */
}
.moon.animated .star:nth-child(1) polygon {
  animation-name: star;
  animation-delay: 0s;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  transform-origin: 5px 4px 0; /* TODO FF CENTER ISSUE */
}
.moon.animated .star:nth-child(2) polygon {
  animation-name: star;
  animation-delay: 2s;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  transform-origin: 23px 14px 0; /* TODO FF CENTER ISSUE */
}
.moon polygon {
  fill: var(--moon);
  stroke: none;
}
.moon path {
  fill: var(--moon);
  stroke: var(--moon);
}

.moon-partial.animated .moon-g {
  animation-name: moon;
  animation-duration: 6s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transform-origin: 12.5px 15.15px 0; /* TODO FF CENTER ISSUE */
}
.moon-partial.animated .star:nth-child(1) polygon {
  animation-name: star;
  animation-delay: 0s;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  transform-origin: 5px 4px 0; /* TODO FF CENTER ISSUE */
}
.moon-partial.animated .star:nth-child(2) polygon {
  animation-name: star;
  animation-delay: 2s;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  transform-origin: 23px 14px 0; /* TODO FF CENTER ISSUE */
}
.moon-partial polygon {
  fill: var(--moon);
  stroke: none;
}
.moon-partial path {
  fill: var(--moon);
  stroke: var(--moon);
}

.cloud-small.animated > g {
  animation-name: cloud-small;
  animation-duration: 12s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.cloud-small path {
  opacity: 0.8;
  fill: var(--cloud);
  stroke: var(--stroke);
}

.cloud.animated > g {
  animation-name: cloud;
  animation-duration: 6s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.cloud path {
  fill: var(--cloud);
  stroke: var(--stroke);
}

.rain-light.animated line {
  animation-name: rain;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-light line {
  fill: none;
  stroke: var(--rain);
}

.rain-moderate.animated line:nth-child(1) {
  animation-name: rain;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-moderate.animated line:nth-child(2) {
  animation-name: rain;
  animation-delay: 0.25s;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-moderate line {
  fill: none;
  stroke: var(--rain);
}

.rain-heavy.animated line:nth-child(1),
.rain-heavy.animated line:nth-child(3) {
  animation-name: rain;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-heavy.animated line:nth-child(2) {
  animation-name: rain;
  animation-delay: 0.25s;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-heavy line {
  fill: none;
  stroke: var(--rain);
}

.rain-downpour.animated line:nth-child(1),
.rain-downpour.animated line:nth-child(3),
.rain-downpour.animated line:nth-child(5) {
  animation-name: rain;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-downpour.animated line:nth-child(2),
.rain-downpour.animated line:nth-child(4) {
  animation-name: rain;
  animation-delay: 0.25s;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-downpour line {
  fill: none;
  stroke: var(--rain);
}

.rain-freezing.animated line:nth-child(1),
.rain-freezing.animated line:nth-child(3) {
  animation-name: rain;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-freezing.animated line:nth-child(2) {
  animation-name: rain;
  animation-delay: 0.25s;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.rain-freezing line {
  fill: none;
  stroke: var(--rain);
}

.fog.animated line:nth-child(1),
.fog.animated line:nth-child(3) {
  animation-name: fog;
  animation-duration: 30s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.fog.animated line:nth-child(2) {
  animation-name: fog;
  animation-delay: 0s;
  animation-duration: 20s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.fog line {
  fill: none;
  stroke: var(--cloud);
}

.sleet.animated .sleet-rain line:nth-child(1) {
  animation-name: rain;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.sleet.animated .sleet-rain line:nth-child(2) {
  animation-name: rain;
  animation-delay: 0.25s;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.sleet.animated .sleet-snow .snow-g {
  animation-name: snow;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.sleet .sleet-rain line {
  fill: none;
  stroke: var(--rain);
}
.sleet .sleet-snow line {
  fill: none;
  stroke: var(--snow);
}

.snow-light.animated .snow-g {
  animation-name: snow;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-light line {
  fill: none;
  stroke: var(--snow);
}

.snow-moderate.animated .snow-g:nth-child(1) {
  animation-name: snow;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-moderate.animated .snow-g:nth-child(2) {
  animation-name: snow;
  animation-delay: 1.2s;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-moderate line {
  fill: none;
  stroke: var(--snow);
}

.snow-heavy.animated .snow-g:nth-child(1) {
  animation-name: snow;
  animation-duration: 1.7s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-heavy.animated .snow-g:nth-child(2) {
  animation-name: snow;
  animation-delay: 0.8s;
  animation-duration: 1.7s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-heavy.animated .snow-g:nth-child(3) {
  animation-name: snow-reverse;
  animation-delay: 0.4s;
  animation-duration: 1.7s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-heavy line {
  fill: none;
  stroke: var(--snow);
}

.snow-blizzard.animated .snow-g:nth-child(1) {
  animation-name: snow;
  animation-delay: 0s;
  animation-duration: 1.4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-blizzard.animated .snow-g:nth-child(2) {
  animation-name: snow-reverse;
  animation-delay: 0.9s;
  animation-duration: 1.4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-blizzard.animated .snow-g:nth-child(3) {
  animation-name: snow;
  animation-delay: 0.3s;
  animation-duration: 1.4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-blizzard.animated .snow-g:nth-child(4) {
  animation-name: snow-reverse;
  animation-delay: 1.2s;
  animation-duration: 1.4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-blizzard.animated .snow-g:nth-child(5) {
  animation-name: snow;
  animation-delay: 0.6s;
  animation-duration: 1.4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}
.snow-blizzard line {
  fill: none;
  stroke: var(--snow);
}

.thunder.animated polygon {
  animation-name: shock;
  animation-duration: 1.11s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.thunder polygon {
  fill: var(--thunder);
  stroke: var(--stroke);
}
</style>
