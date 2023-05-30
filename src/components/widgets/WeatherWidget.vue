<script setup>
import { ref, computed, onMounted, inject, onBeforeUnmount } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, setStorage } from '@/store.js'
import { setWidgetContainerStyles, hsl } from '@/helpers/widgets.js'
import { getWeather } from '@/helpers/weather.js'
import {} from '@/assets/lists.js'

const access = inject('access')
const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const weatherData = ref(null)
let autoUpdate = null

onMounted(async () => {
  updateWeather()

  // update weather if chrome storage updates
  chrome.storage.onChanged.addListener((changes, area) => {
    let wKey = 'weather-' + props.widget.id
    if (area === 'local' && changes[wKey]) {
      weatherData.value = changes[wKey].newValue
    }
  })

  autoUpdate = setInterval(() => {
    updateWeather()
  }, 3600000) // 1 hour
})

onBeforeUnmount(() => {
  clearInterval(autoUpdate)
})

const updateWeather = async () => {
  let data = await getWeather(props.widget.location.url, access.items.w, store.config.global.lang)
  weatherData.value = data
  await setStorage({ ['weather-' + props.widget.id]: data }, 'local')
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const round = (num) => {
  return props.widget.precise ? num : Math.round(num)
}

const getWind = (wind) => {
  let num
  if (props.widget.unit && !props.widget.windUnit) {
    // imperial - mph >> ft/s
    num = Math.round(wind * 1.467 * 100) / 100
  } else if (!props.widget.unit && !props.widget.windUnit) {
    // metric - kph >> m/s
    num = Math.round((wind / 3.6) * 100) / 100
  } else {
    num = Math.round(wind * 100) / 100
  }
  return num
}

const getWindUnit = (wind) => {
  let res
  if (props.widget.unit) {
    // imperial - mph >> ft/s
    res = props.widget.windUnit ? round(getWind(wind)) + ' mph' : round(getWind(wind)) + ' ft/s'
  } else {
    // metric - kph >> m/s
    res = props.widget.windUnit ? round(getWind(wind)) + ' kph' : round(getWind(wind)) + ' m/s'
  }
  return res
}
</script>

<template>
  <div
    class="weather widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div v-if="weatherData" class="weatherContainer" :class="{ weatherHorz: props.widget.horizontal }">
        <div
          v-if="props.widget.current.on"
          class="current"
          :class="{ currentIconEnabled: props.widget.current.icon.on }"
        >
          <i
            v-if="props.widget.current.icon.on"
            class="currentIcon"
            :class="`w-code-${weatherData.current.condition.code}${weatherData.current.is_day === 1 ? '' : 'n'}`"
            :style="`font-size: ${props.widget.current.icon.size * 0.5}em; color: ${hsl(
              props.widget.overrideColors
                ? props.widget.current.icon.color
                : props.widget.base.font.override
                ? props.widget.base.font.color
                : store.config.global.font.color
            )}`"
          ></i>
          <div class="currentData">
            <div
              v-if="props.widget.label.on"
              class="locationName"
              :style="`color: ${hsl(
                props.widget.overrideColors
                  ? props.widget.label.color
                  : props.widget.base.font.override
                  ? props.widget.base.font.color
                  : store.config.global.font.color
              )}`"
            >
              {{ widget.location.name }}
            </div>
            <div
              v-if="props.widget.current.temperature.currently || props.widget.current.temperature.feelsLike"
              class="currentTemp"
            >
              <div
                v-if="props.widget.current.temperature.currently"
                class="currentTempDeg"
                :style="`color: ${hsl(
                  props.widget.overrideColors
                    ? props.widget.current.temperature.currentlyColor
                    : props.widget.base.font.override
                    ? props.widget.base.font.color
                    : store.config.global.font.color
                )}`"
              >
                {{ props.widget.scale ? round(weatherData.current.temp_f) : round(weatherData.current.temp_c)
                }}{{ props.widget.current.temperature.degree ? '°' : '' }}
              </div>
              <div
                v-if="props.widget.current.temperature.feelsLike"
                class="currentTempFeels"
                :style="`color: ${hsl(
                  props.widget.overrideColors
                    ? props.widget.current.temperature.feelsLikeColor
                    : props.widget.base.font.override
                    ? props.widget.base.font.color
                    : store.config.global.font.color
                )}`"
              >
                Feels like
                {{ props.widget.scale ? round(weatherData.current.feelslike_f) : round(weatherData.current.feelslike_c)
                }}{{ props.widget.current.temperature.degree ? '°' : '' }}
              </div>
            </div>
            <div v-if="props.widget.current.condition" class="currentCondition">
              {{ weatherData.current.condition.text }}
            </div>
            <div
              v-if="
                props.widget.current.wind.on || props.widget.current.humidity.on || props.widget.current.pressure.on
              "
              class="group"
            >
              <div v-if="props.widget.current.wind.on" class="currentItem currentWind">
                <i class="w-wind-deg" :class="weatherData.current.wind_dir"></i>
                {{
                  props.widget.unit
                    ? getWindUnit(weatherData.current.wind_mph)
                    : getWindUnit(weatherData.current.wind_kph)
                }}
              </div>
              <div v-if="props.widget.current.humidity.on" class="currentItem currentHumidity">
                <i class="w-humidity"></i>
                {{ round(weatherData.current.humidity) }}%
              </div>
              <div v-if="props.widget.current.pressure.on" class="currentItem currentPressure">
                <i class="w-barometer"></i>
                {{
                  props.widget.unit
                    ? round(weatherData.current.pressure_in) + ' in'
                    : round(weatherData.current.pressure_mb) + ' mb'
                }}
              </div>
            </div>
            <div v-if="props.widget.current.astro.sunrise || props.widget.current.astro.sunset" class="group">
              <div v-if="props.widget.current.astro.sunrise" class="currentItem currentSunrise">
                <i class="w-sunrise"></i>
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunrise, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
              <div v-if="props.widget.current.astro.sunset" class="currentItem currentSunset">
                <i class="w-sunset"></i>
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunset, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
            </div>
            <div v-if="props.widget.current.astro.moonPhase" class="currentItem currentMoon">
              <i
                :class="{
                  'w-moon-waxing-crescent': weatherData.forecast.forecastday[0].astro.moon_phase === 'Waxing Crescent',
                  'w-moon-first-quarter': weatherData.forecast.forecastday[0].astro.moon_phase === 'First Quarter',
                  'w-moon-waxing-gibbous': weatherData.forecast.forecastday[0].astro.moon_phase === 'Waxing Gibbous',
                  'w-moon-full': weatherData.forecast.forecastday[0].astro.moon_phase === 'Full Moon',
                  'w-moon-waning-gibbous': weatherData.forecast.forecastday[0].astro.moon_phase === 'Waning Gibbous',
                  'w-moon-third-quarter': weatherData.forecast.forecastday[0].astro.moon_phase === 'Last Quarter',
                  'w-moon-waning-crescent': weatherData.forecast.forecastday[0].astro.moon_phase === 'Waning Crescent',
                  'w-moon-new': weatherData.forecast.forecastday[0].astro.moon_phase === 'New Moon',
                }"
              ></i>
              {{ weatherData.forecast.forecastday[0].astro.moon_phase }}
            </div>
          </div>
        </div>
        <div v-if="props.widget.forecast.on" class="forecastWrap">
          <div
            v-if="props.widget.label.on && !props.widget.current.on"
            class="locationName"
            :style="`color: ${hsl(
              props.widget.overrideColors
                ? props.widget.label.color
                : props.widget.base.font.override
                ? props.widget.base.font.color
                : store.config.global.font.color
            )}`"
          >
            {{ widget.location.name }}
          </div>
          <div class="forecast">
            <template v-for="(day, index) in weatherData.forecast.forecastday.slice(0, props.widget.forecast.days)">
              <div
                v-if="!props.widget.forecast.hideToday || (props.widget.forecast.hideToday && index !== 0)"
                :key="index"
                class="forecastDay"
                :class="{
                  forecastIconEnabled: props.widget.forecast.icon.on,
                  forecastHorz: props.widget.forecast.horizontal,
                }"
              >
                <i
                  v-if="props.widget.forecast.icon.on"
                  class="forecastIcon"
                  :class="`w-code-${day.day.condition.code}`"
                  :style="`font-size: ${props.widget.forecast.icon.size * 0.5}em; color: ${hsl(
                    props.widget.overrideColors
                      ? props.widget.forecast.icon.color
                      : props.widget.base.font.override
                      ? props.widget.base.font.color
                      : store.config.global.font.color
                  )}`"
                ></i>
                <div
                  v-if="
                    props.widget.forecast.day.on ||
                    props.widget.forecast.temperature.high ||
                    props.widget.forecast.temperature.low
                  "
                  class="forecastData"
                >
                  <div
                    v-if="props.widget.forecast.day.on"
                    class="forecastDate"
                    :style="`color: ${hsl(
                      props.widget.overrideColors
                        ? props.widget.forecast.day.color
                        : props.widget.base.font.override
                        ? props.widget.base.font.color
                        : store.config.global.font.color
                    )}`"
                  >
                    {{ DateTime.fromFormat(day.date, 'yyyy-MM-dd').toFormat('ccc') }}
                  </div>
                  <div
                    v-if="props.widget.forecast.temperature.high || props.widget.forecast.temperature.low"
                    class="forecastTemp"
                  >
                    <div
                      v-if="props.widget.forecast.temperature.high"
                      class="forecastTempHigh"
                      :style="`color: ${hsl(
                        props.widget.overrideColors
                          ? props.widget.forecast.temperature.highColor
                          : props.widget.base.font.override
                          ? props.widget.base.font.color
                          : store.config.global.font.color
                      )}`"
                    >
                      {{ props.widget.scale ? round(day.day.maxtemp_f) : round(day.day.maxtemp_c)
                      }}{{ props.widget.forecast.temperature.degree ? '°' : '' }}
                    </div>
                    <div
                      v-if="props.widget.forecast.temperature.low"
                      class="forecastTempLow"
                      :style="`color: ${hsl(
                        props.widget.overrideColors
                          ? props.widget.forecast.temperature.lowColor
                          : props.widget.base.font.override
                          ? props.widget.base.font.color
                          : store.config.global.font.color
                      )}`"
                    >
                      {{ props.widget.scale ? round(day.day.mintemp_f) : round(day.day.mintemp_c)
                      }}{{ props.widget.forecast.temperature.degree ? '°' : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weatherContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2em;
  &.weatherHorz {
    flex-direction: row;
  }
  .group {
    gap: 0.6em;
  }
}

.locationName {
  font-size: 1.2em;
}

.forecastWrap {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
}

.forecast {
  display: flex;
  align-items: center;
  gap: 2em;
}

.forecastDay {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr;
  gap: 0.6em;
  &.forecastHorz {
    &.forecastIconEnabled {
      grid-template-columns: auto 1fr;
    }
  }
}

.forecastData {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
}

.forecastDate {
  font-size: 1.1em;
}

.forecastTemp {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  gap: 0;
  .forecastHorz & {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.4em;
  }
}

.forecastTemp *:first-child {
  font-size: 2em;
}

.forecastTemp *:nth-child(2) {
  font-size: 1.1em;
}

.currentItem {
  display: grid;
  grid-template-columns: 1.3em 1fr;
  align-items: center;
  gap: 0.2em;
  [class^='w-'] {
    font-size: inherit;
    text-align: center;
  }
}

.current {
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 1em;
  &.currentIconEnabled {
    grid-template-columns: auto 1fr;
  }
}

.currentData {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2em;
}

.currentTemp {
  display: flex;
  align-items: center;
  gap: 0.6em;
  line-height: 1.8em;
  .currentTempDeg {
    font-size: 2em;
  }
  .currentTempFeels {
    font-size: 1.1em;
  }
}

.currentSunrise,
.currentSunset {
  [class^='w-'] {
    font-size: 0.9em;
  }
}

.currentMoon {
  [class^='w-'] {
    font-size: 1.1em;
  }
}

.currentWind {
  [class^='w-'],
  [class*=' w-'] {
    font-size: 1.2em;
    &.N {
      transform: rotate(0deg);
    }
    &.NNE {
      transform: rotate(23deg);
    }
    &.NE {
      transform: rotate(45deg);
    }
    &.ENE {
      transform: rotate(68deg);
    }
    &.E {
      transform: rotate(90deg);
    }
    &.ESE {
      transform: rotate(113deg);
    }
    &.SE {
      transform: rotate(135deg);
    }
    &.SSE {
      transform: rotate(158deg);
    }
    &.S {
      transform: rotate(180deg);
    }
    &.SSW {
      transform: rotate(203deg);
    }
    &.SW {
      transform: rotate(225deg);
    }
    &.WSW {
      transform: rotate(248deg);
    }
    &.W {
      transform: rotate(270deg);
    }
    &.WNW {
      transform: rotate(293deg);
    }
    &.NW {
      transform: rotate(313deg);
    }
    &.NNW {
      transform: rotate(336deg);
    }
  }
}

.container-nw {
  .weatherContainer {
    align-items: start;
    justify-content: start;
    &.weatherHorz {
      align-items: start;
      justify-content: start;
    }
  }
}

.container-n {
  .weatherContainer {
    align-items: center;
    justify-content: start;
    &.weatherHorz {
      align-items: start;
      justify-content: center;
    }
  }
}

.container-ne {
  .weatherContainer {
    align-items: end;
    justify-content: start;
    &.weatherHorz {
      align-items: start;
      justify-content: end;
      .current {
        order: 1;
      }
    }
  }
}

.container-w {
  .weatherContainer {
    align-items: start;
    justify-content: center;
    &.weatherHorz {
      align-items: center;
      justify-content: start;
    }
  }
}

.container-c {
  .weatherContainer {
    align-items: center;
    justify-content: center;
    &.weatherHorz {
      align-items: center;
      justify-content: center;
    }
  }
}

.container-e {
  .weatherContainer {
    align-items: end;
    justify-content: center;
    &.weatherHorz {
      align-items: center;
      justify-content: end;
      .current {
        order: 1;
      }
    }
  }
}

.container-sw {
  .weatherContainer {
    align-items: start;
    justify-content: end;
    &.weatherHorz {
      align-items: end;
      justify-content: start;
    }
  }
}

.container-s {
  .weatherContainer {
    align-items: center;
    justify-content: end;
    &.weatherHorz {
      align-items: end;
      justify-content: center;
    }
  }
}

.container-se {
  .weatherContainer {
    align-items: end;
    justify-content: end;
    &.weatherHorz {
      align-items: end;
      justify-content: end;
      .current {
        order: 1;
      }
    }
  }
}

.container-nw,
.container-w,
.container-sw {
  .currentData,
  .forecastHorz .forecastData {
    align-items: start;
  }
  .forecastHorz .forecastTemp {
    justify-content: start;
  }
}

.container-ne,
.container-e,
.container-se {
  .currentIcon,
  .currentTempDeg,
  .forecastHorz .forecastIcon {
    order: 1;
  }
  .currentData,
  .forecastHorz .forecastData {
    align-items: end;
  }
  .forecastHorz .forecastTemp {
    justify-content: end;
  }
}
</style>
