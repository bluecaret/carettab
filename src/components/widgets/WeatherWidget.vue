<script setup>
import { ref, computed, onMounted, inject, onBeforeUnmount } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, setStorage } from '@/store.js'
import { setWidgetContainerStyles, hsl } from '@/helpers/widgets.js'
import { getWeather } from '@/helpers/weather.js'
import WeatherIcon from '@/components/widgets/WeatherIcon.vue'
import WeatherAuxIcon from '@/components/widgets/WeatherAuxIcon.vue'
import {} from '@/assets/lists.js'

const access = inject('access')
const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const current = ref(props.widget.current)
const forecast = ref(props.widget.forecast)

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

const getCurrently = computed(() => {
  return `${props.widget.scale ? round(weatherData.value.current.temp_f) : round(weatherData.value.current.temp_c)}${
    current.value.temperature.degree ? '°' : ''
  }`
})

const getFeelsLike = computed(() => {
  return `${
    props.widget.scale ? round(weatherData.value.current.feelslike_f) : round(weatherData.value.current.feelslike_c)
  }${current.value.temperature.degree ? '°' : ''}`
})

const getWindText = computed(() => {
  return props.widget.unit
    ? getWindUnit(weatherData.value.current.wind_mph)
    : getWindUnit(weatherData.value.current.wind_kph)
})

const checkIfDetailsIsEnabled = computed(() => {
  return (
    props.widget.current.temperature.feelsLike ||
    props.widget.current.humidity.on ||
    props.widget.current.wind.on ||
    props.widget.current.pressure.on ||
    props.widget.current.astro.sunrise ||
    props.widget.current.astro.sunset ||
    props.widget.current.astro.moonPhase
  )
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const locationNameStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? props.widget.label.color
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentTempDegStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.temperature.currentlyColor
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentTempFeelsStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.temperature.feelsLikeColor
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const forecastDateStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? forecast.value.day.color
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const forecastTempHighStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? forecast.value.temperature.highColor
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const forecastTempLowStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? forecast.value.temperature.lowColor
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
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
      <!-- 
        Layout 1
       -->
      <div
        v-if="(props.widget.layout === '1' || props.widget.layout === '1a') && weatherData"
        class="weatherContainer"
        :class="`layout${props.widget.layout}`"
      >
        <div v-if="current.on || props.widget.label.on" class="current">
          <WeatherIcon
            v-if="current.on && current.icon.on"
            class="icon"
            :day="weatherData.current.is_day"
            :code="weatherData.current.condition.code"
            :size="current.icon.size"
            :colors="current.icon.colors"
            :animated="current.icon.animated"
          />
          <div v-if="props.widget.label.on" class="location" :style="locationNameStyle()">
            {{ widget.location.name }}
          </div>
          <div v-if="current.on" class="tempWrapper">
            <div v-if="current.temperature.currently" class="currently" :style="currentTempDegStyle()">
              {{ getCurrently }}
            </div>
            <div v-if="current.condition" class="condition">
              {{ weatherData.current.condition.text }}
            </div>
          </div>
          <div v-if="current.on" class="details">
            <div>
              <div v-if="current.temperature.feelsLike" class="feelsLike" :style="currentTempFeelsStyle()">
                Feels like
                {{ getFeelsLike }}
              </div>
              <div
                v-if="current.wind.on"
                class="wind"
                :title="`Wind is currently blowing at ${getWindText} from the ${weatherData.current.wind_dir} (${weatherData.current.wind_degree}°).`"
              >
                <WeatherAuxIcon :icon="'wind' + weatherData.current.wind_degree" />
                {{ getWindText }}
              </div>
              <div v-if="current.humidity.on" class="humidity">
                <WeatherAuxIcon icon="humidity" />
                {{ round(weatherData.current.humidity) }}%
              </div>
              <div v-if="current.pressure.on" class="pressure">
                <WeatherAuxIcon icon="barometer" />
                {{
                  props.widget.unit
                    ? round(weatherData.current.pressure_in) + ' in'
                    : round(weatherData.current.pressure_mb) + ' mb'
                }}
              </div>
            </div>
            <div>
              <div v-if="current.astro.sunrise" class="sunrise">
                <WeatherAuxIcon icon="sunrise" />
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunrise, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
              <div v-if="current.astro.sunset" class="sunset">
                <WeatherAuxIcon icon="sunset" />
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunset, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
              <div v-if="current.astro.moonPhase" class="moon">
                <WeatherAuxIcon :icon="weatherData.forecast.forecastday[0].astro.moon_phase" />
                {{ weatherData.forecast.forecastday[0].astro.moon_phase }}
              </div>
            </div>
          </div>
        </div>
        <ul v-if="forecast.on" class="forecast">
          <template v-for="(day, index) in weatherData.forecast.forecastday.slice(0, forecast.days)">
            <li v-if="!forecast.hideToday || (forecast.hideToday && index !== 0)" :key="index" class="day">
              <WeatherIcon
                v-if="forecast.icon.on"
                class="icon"
                :day="1"
                :code="day.day.condition.code"
                :size="forecast.icon.size"
                :colors="forecast.icon.colors"
                :animated="forecast.icon.animated"
              />
              <div v-if="forecast.day.on" class="date" :style="forecastDateStyle()">
                {{ index === 0 ? 'Today' : DateTime.fromFormat(day.date, 'yyyy-MM-dd').toFormat('ccc') }}
              </div>
              <div class="tempWrapper">
                <div v-if="forecast.temperature.high" class="high" :style="forecastTempHighStyle()">
                  {{ props.widget.scale ? round(day.day.maxtemp_f) : round(day.day.maxtemp_c)
                  }}{{ forecast.temperature.degree ? '°' : '' }}
                </div>
                <div v-if="forecast.temperature.low" class="low" :style="forecastTempLowStyle()">
                  {{ props.widget.scale ? round(day.day.mintemp_f) : round(day.day.mintemp_c)
                  }}{{ forecast.temperature.degree ? '°' : '' }}
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <!-- 
        Layout 2
       -->
      <div v-if="props.widget.layout === '2' && weatherData" class="weatherContainer layout2">
        <div v-if="current.on || props.widget.label.on" class="current">
          <div v-if="props.widget.label.on" class="location">
            <div class="locationName" :style="locationNameStyle()">
              {{ widget.location.name }}
            </div>
            <div class="todayTemps">
              {{
                props.widget.scale
                  ? round(weatherData.forecast.forecastday[0].day.maxtemp_f)
                  : round(weatherData.forecast.forecastday[0].day.maxtemp_c)
              }}{{ forecast.temperature.degree ? '°' : '' }} /
              {{
                props.widget.scale
                  ? round(weatherData.forecast.forecastday[0].day.mintemp_f)
                  : round(weatherData.forecast.forecastday[0].day.mintemp_c)
              }}{{ forecast.temperature.degree ? '°' : '' }}
            </div>
          </div>
          <WeatherIcon
            v-if="current.on && current.icon.on"
            class="icon"
            :day="weatherData.current.is_day"
            :code="weatherData.current.condition.code"
            :size="current.icon.size"
            :colors="current.icon.colors"
            :animated="current.icon.animated"
          />
          <div v-if="current.on" class="tempWrapper">
            <div v-if="current.temperature.currently" class="currently" :style="currentTempDegStyle()">
              {{ getCurrently }}
            </div>
            <div v-if="current.temperature.feelsLike" class="feelsLike" :style="currentTempFeelsStyle()">
              Feels like
              {{ getFeelsLike }}
            </div>
          </div>
          <div v-if="current.condition" class="condition">
            {{ weatherData.current.condition.text }} with patchy rain showers possibly.
          </div>
          <div v-if="current.on && checkIfDetailsIsEnabled" class="details">
            <div>
              <div
                v-if="current.wind.on"
                class="wind"
                :title="`Wind is currently blowing at ${getWindText} from the ${weatherData.current.wind_dir} (${weatherData.current.wind_degree}°).`"
              >
                <WeatherAuxIcon :icon="'wind' + weatherData.current.wind_degree" />
                {{ getWindText }}
              </div>
              <div v-if="current.humidity.on" class="humidity">
                <WeatherAuxIcon icon="humidity" />
                {{ round(weatherData.current.humidity) }}%
              </div>
              <div v-if="current.pressure.on" class="pressure">
                <WeatherAuxIcon icon="barometer" />
                {{
                  props.widget.unit
                    ? round(weatherData.current.pressure_in) + ' in'
                    : round(weatherData.current.pressure_mb) + ' mb'
                }}
              </div>
            </div>
            <div>
              <div v-if="current.astro.sunrise" class="sunrise">
                <WeatherAuxIcon icon="sunrise" />
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunrise, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
              <div v-if="current.astro.sunset" class="sunset">
                <WeatherAuxIcon icon="sunset" />
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunset, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
            </div>
            <div>
              <div v-if="current.astro.moonPhase" class="moon">
                <WeatherAuxIcon :icon="weatherData.forecast.forecastday[0].astro.moon_phase" />
                {{ weatherData.forecast.forecastday[0].astro.moon_phase }}
              </div>
            </div>
          </div>
        </div>
        <ul v-if="forecast.on" class="forecast">
          <template v-for="(day, index) in weatherData.forecast.forecastday.slice(0, forecast.days)">
            <li v-if="!forecast.hideToday || (forecast.hideToday && index !== 0)" :key="index" class="day">
              <WeatherIcon
                v-if="forecast.icon.on"
                class="icon"
                :day="1"
                :code="day.day.condition.code"
                :size="forecast.icon.size"
                :colors="forecast.icon.colors"
                :animated="forecast.icon.animated"
              />
              <div v-if="forecast.day.on" class="date" :style="forecastDateStyle()">
                {{ index === 0 ? 'Today' : DateTime.fromFormat(day.date, 'yyyy-MM-dd').toFormat('cccc') }}
              </div>
              <div class="tempWrapper">
                <div v-if="forecast.temperature.high" class="high" :style="forecastTempHighStyle()">
                  {{ props.widget.scale ? round(day.day.maxtemp_f) : round(day.day.maxtemp_c)
                  }}{{ forecast.temperature.degree ? '°' : '' }}
                </div>
                <div v-if="forecast.temperature.low" class="low" :style="forecastTempLowStyle()">
                  {{ props.widget.scale ? round(day.day.mintemp_f) : round(day.day.mintemp_c)
                  }}{{ forecast.temperature.degree ? '°' : '' }}
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather {
  grid-template-columns: 1fr;
}

.current {
  grid-area: current;
}

.currentDetails {
  grid-area: details;
}

.forecast {
  grid-area: forecast;
}

.currently {
  grid-area: currently;
}

.weatherContainer.layout1,
.weatherContainer.layout1a,
.weatherContainer.layout2 {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.2em;
  .current {
    position: relative;
    display: flex;
    flex-direction: column;
    .location {
      font-size: 0.8em;
    }
    .tempWrapper {
      display: flex;
      align-items: first baseline;
      margin-block-start: -0.5em;
    }
    .currently {
      font-size: 4.6em;
      line-height: 1;
    }
    .icon {
      position: absolute;
      top: 0;
      right: 0;
      order: 1;
      width: auto;
      height: 4em;
    }
    .condition {
      order: 2;
      font-size: 1em;
      line-height: 1.2;
      margin-inline-start: -1.1em;
    }
  }
  .details {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    margin-block-start: 0.2em;
    margin-block-end: 0.6em;
  }
  .details > div {
    display: flex;
    gap: 0.5em;
    > div {
      display: flex;
      align-items: center;
      gap: 0.2em;
      font-size: 0.8em;
      line-height: 1.2;
      .weatherAuxIcon {
        width: 1.4em;
        height: 1.4em;
      }
    }
  }
  .forecast {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    margin: 0;
    padding: 0;
    list-style: none;
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 4em;
        height: auto;
        margin-block-end: 0.3em;
      }
    }
    .date {
      font-size: 0.9em;
    }
    .tempWrapper {
      display: flex;
      align-items: first baseline;
      font-size: 1.2em;
      gap: 0.15em;
      *:nth-child(2) {
        font-size: 0.7em;
      }
    }
  }
}
.weatherContainer.layout1a {
  flex-direction: row;
  align-items: center;
  gap: 1.6em;
  .current {
    flex-direction: column;
    min-width: max-content;
    .location {
      margin-inline-start: 9em;
    }
    .tempWrapper {
      flex-direction: column;
      margin-block-start: -0.5em;
      margin-inline-start: 7.1em;
    }
    .icon {
      top: 50%;
      translate: 0 -50%;
      right: unset;
      left: 0;
      width: 7em;
      height: auto;
    }
    .condition {
      line-height: 1.3;
      margin-block-start: -0.4em;
    }
  }
  .details {
    margin-inline-start: 7.2em;
    margin-block-start: 0.2em;
  }
}
.weatherContainer.layout2 {
  width: 12em;
  .location {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .current {
    align-items: start;
    .icon {
      position: relative;
      top: unset;
      right: unset;
      width: 10em;
      height: auto;
      order: unset;
      margin-inline: auto;
    }
    .currently {
      font-size: 3.6em;
    }
    .feelsLike {
      font-size: 0.8em;
      margin-inline-start: -0.9em;
    }
    .condition {
      margin-inline-start: 0;
      order: unset;
    }
  }
  .details > div {
    > div {
      font-size: 0.7em;
      .weatherAuxIcon {
        width: 1.4em;
        height: 1.4em;
      }
    }
  }
  .forecast {
    flex-direction: column;
    gap: 0.2em;
    .day {
      flex-direction: row;
      gap: 0.3em;
      .icon {
        width: 2em;
        margin: 0;
      }
    }
    .date {
      font-size: 0.8em;
    }
    .tempWrapper {
      margin-inline-start: auto;
      align-items: center;
      gap: 0.4em;
    }
  }
}
</style>
