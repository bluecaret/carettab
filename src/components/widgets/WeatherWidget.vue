<script setup>
import { ref, computed, onMounted, inject, onBeforeUnmount } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, setStorage, getStorage } from '@/store.js'
import { setWidgetContainerStyles, hsl, shadow } from '@/helpers/widgets.js'
import { getWeather } from '@/helpers/weather.js'
import WeatherIcon from '@/components/widgets/WeatherIcon.vue'
import WeatherAuxIcon from '@/components/widgets/WeatherAuxIcon.vue'

const user = inject('user')
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
  let weatherKey = 'weather-' + props.widget.id
  const cachedWeather = await getStorage([weatherKey], 'local')
  if (cachedWeather[weatherKey]) {
    // Apply cached data right away
    weatherData.value = cachedWeather[weatherKey]

    // Check when cached was last updated, if old, get latest
    const current = DateTime.fromJSDate(new Date(store.currentTime))
    const lastUpdated = DateTime.fromFormat(cachedWeather[weatherKey].current.last_updated, 'yyyy-MM-dd HH:mm')
    const duration = current.diff(lastUpdated).as('hours')
    if (duration > 0.75) {
      updateWeather()
    }
  } else {
    // If no cache, grab latest
    updateWeather()
  }

  // update weather if chrome storage settings update
  chrome.storage.onChanged.addListener((changes, area) => {
    let wKey = 'weather-' + props.widget.id
    if (area === 'local' && changes[wKey]) {
      weatherData.value = changes[wKey].newValue
    }
  })

  // Automatically refresh weather after period of time if tab is left open.
  autoUpdate = setInterval(() => {
    updateWeather()
  }, 2700000) // 45 minutes
})

onBeforeUnmount(() => {
  clearInterval(autoUpdate)
})

const updateWeather = async () => {
  let data = await getWeather(props.widget.location.url, store.config.global.lang)
  weatherData.value = data
  console.log(data)
  await setStorage({ ['weather-' + props.widget.id]: data }, 'local')
}

const round = (num) => {
  return props.widget.roundDecimals ? Math.round(num) : num
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

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const iconStyle = () => {
  if (
    (props.widget.base.font.override && props.widget.base.font.shadow[0] === false) ||
    store.config.global.font.shadow[0] === false
  ) {
    return ''
  }
  return `
    filter: drop-shadow(${shadow(
      props.widget.base.font.override ? props.widget.base.font.shadow : store.config.global.font.shadow
    )});
  `
}

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

const currentConditionStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.condition.color
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentWindStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.wind.color
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentHumidityStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.humidity.color
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentPressureStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.pressure.color
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentMoonPhaseStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.astro.moonPhaseColor
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentSunriseStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.astro.sunriseColor
        : props.widget.base.font.override
        ? props.widget.base.font.color
        : store.config.global.font.color
    ),
  }
}

const currentSunsetStyle = () => {
  return {
    color: hsl(
      props.widget.overrideColors
        ? current.value.astro.sunsetColor
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
      <div v-if="weatherData" class="weatherContainer" :class="`layout${props.widget.layout}`">
        <div v-if="current.on" class="currentContainer">
          <div class="iconContainer">
            <WeatherIcon
              v-if="current.icon.on"
              class="icon"
              :day="weatherData.current.is_day"
              :code="weatherData.current.condition.code"
              :colors="current.icon.colors"
              :animated="current.icon.animated"
              :style="iconStyle()"
            />
          </div>
          <div class="currentDataContainer">
            <div v-if="props.widget.label.on" class="locationContainer">
              <div class="location" :style="locationNameStyle()">
                {{ widget.location.name }}
              </div>
            </div>
            <div v-if="current.temperature.currently || current.temperature.feelsLike" class="tempContainer">
              <div v-if="current.temperature.currently" class="currently" :style="currentTempDegStyle()">
                {{ getCurrently }}
              </div>
              <div
                v-if="current.temperature.feelsLike"
                class="feelsLike"
                :class="{ noCurrently: !current.temperature.currently }"
                :style="currentTempFeelsStyle()"
              >
                {{ $t('widget.feelsLike') }}
                {{ getFeelsLike }}
              </div>
            </div>
            <div v-if="current.condition.on" class="conditionContainer">
              <div class="stat condition" :style="currentConditionStyle()">
                {{ weatherData.current.condition.text }}
              </div>
            </div>
            <div v-if="current.wind.on || current.humidity.on || current.pressure.on" class="statsContainer">
              <div
                v-if="current.wind.on"
                class="stat wind"
                :title="
                  $t('widget.windIsCurrentlyBlowing', [
                    getWindText,
                    weatherData.current.wind_dir,
                    weatherData.current.wind_degree,
                  ])
                "
                :style="currentWindStyle()"
              >
                <WeatherAuxIcon :icon="'wind' + weatherData.current.wind_degree" :style="iconStyle()" />
                {{ getWindText }}
              </div>
              <div v-if="current.humidity.on" class="stat humidity" :style="currentHumidityStyle()">
                <WeatherAuxIcon icon="humidity" :style="iconStyle()" />
                {{ round(weatherData.current.humidity) }}%
              </div>
              <div v-if="current.pressure.on" class="stat pressure" :style="currentPressureStyle()">
                <WeatherAuxIcon icon="barometer" :style="iconStyle()" />
                {{
                  props.widget.unit
                    ? round(weatherData.current.pressure_in) + ' in'
                    : round(weatherData.current.pressure_mb) + ' mb'
                }}
              </div>
            </div>
            <div v-if="current.astro.sunrise || current.astro.sunset" class="sunContainer">
              <div v-if="current.astro.sunrise" class="stat sunrise" :style="currentSunriseStyle()">
                <WeatherAuxIcon icon="sunrise" :style="iconStyle()" />
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunrise, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
              <div v-if="current.astro.sunset" class="stat sunset" :style="currentSunsetStyle()">
                <WeatherAuxIcon icon="sunset" :style="iconStyle()" />
                {{
                  DateTime.fromFormat(weatherData.forecast.forecastday[0].astro.sunset, 'hh:mm a').toFormat(
                    props.widget.twentyFour ? 'HH:mm' : 'h:mm a'
                  )
                }}
              </div>
            </div>
            <div v-if="current.astro.moonPhase" class="moonContainer">
              <div class="stat moon" :style="currentMoonPhaseStyle()">
                <WeatherAuxIcon :icon="weatherData.forecast.forecastday[0].astro.moon_phase" :style="iconStyle()" />
                {{ weatherData.forecast.forecastday[0].astro.moon_phase }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="forecast.on" class="forecastContainer">
          <div v-if="!current.on && props.widget.label.on" class="locationContainer">
            <div class="location" :style="locationNameStyle()">
              {{ widget.location.name }}
            </div>
          </div>
          <ul class="forecast">
            <template v-for="(day, index) in weatherData.forecast.forecastday.slice(0, forecast.days)">
              <li v-if="!forecast.hideToday || (forecast.hideToday && index !== 0)" :key="index" class="dayContainer">
                <div v-if="forecast.icon.on" class="iconContainer">
                  <WeatherIcon
                    class="icon"
                    :day="1"
                    :code="day.day.condition.code"
                    :colors="forecast.icon.colors"
                    :animated="forecast.icon.animated"
                    :style="iconStyle()"
                  />
                </div>
                <div v-if="forecast.day.on" class="dateContainer">
                  <div class="date" :style="forecastDateStyle()">
                    {{ index === 0 ? $t('widget.today') : DateTime.fromFormat(day.date, 'yyyy-MM-dd').toFormat('ccc') }}
                  </div>
                </div>
                <div v-if="forecast.temperature.high || forecast.temperature.low" class="tempContainer">
                  <div v-if="forecast.temperature.high" class="high" :style="forecastTempHighStyle()">
                    {{ props.widget.scale ? round(day.day.maxtemp_f) : round(day.day.maxtemp_c)
                    }}{{ forecast.temperature.degree ? '°' : '' }}
                  </div>
                  <div
                    v-if="forecast.temperature.low"
                    class="low"
                    :class="{ noHigh: !forecast.temperature.high }"
                    :style="forecastTempLowStyle()"
                  >
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
  </div>
</template>

<style lang="scss" scoped>
.weather {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.weatherContainer {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  line-height: 1;

  .container-w &,
  .container-c &,
  .container-e & {
    align-items: center;
  }
  .container-sw &,
  .container-s &,
  .container-se & {
    align-items: end;
  }

  .container-n &,
  .container-c &,
  .container-s & {
    justify-content: center;
    text-align: center;
  }
  .container-ne &,
  .container-e &,
  .container-se & {
    justify-content: end;
    text-align: right;
  }

  .currentContainer,
  .currentDataContainer,
  .forecastContainer,
  .forecast,
  .iconContainer,
  .locationContainer,
  .tempContainer,
  .conditionContainer,
  .statsContainer,
  .sunContainer,
  .moonContainer,
  .dayContainer,
  .dateContainer,
  .currently,
  .feelsLike,
  .stat,
  .high,
  .low {
    display: grid;
    justify-content: start;
    align-items: start;
    width: max-content;

    .container-w &,
    .container-c &,
    .container-e & {
      align-items: center;
    }
    .container-sw &,
    .container-s &,
    .container-se & {
      align-items: end;
    }

    .container-n &,
    .container-c &,
    .container-s & {
      justify-content: center;
      text-align: center;
    }
    .container-ne &,
    .container-e &,
    .container-se & {
      justify-content: end;
      text-align: right;
    }
  }
  .currentDataContainer,
  .forecastContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;

    .container-nw &,
    .container-n &,
    .container-ne & {
      justify-content: start;
    }
    .container-w &,
    .container-c &,
    .container-e & {
      justify-content: center;
    }
    .container-sw &,
    .container-s &,
    .container-se & {
      justify-content: end;
    }

    .container-nw &,
    .container-w &,
    .container-sw & {
      align-items: start;
      text-align: left;
    }
    .container-n &,
    .container-c &,
    .container-s & {
      align-items: center;
      text-align: center;
    }
    .container-ne &,
    .container-e &,
    .container-se & {
      align-items: end;
      text-align: right;
    }
  }
  .forecast {
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0.5em;
  }
  .icon,
  .weatherAuxIcon {
    width: 2em;
    line-height: 1;
    display: grid;
    place-items: center;
  }
  .weatherAuxIcon {
    width: 1em;
  }
  .condition {
    max-width: 12em;
    text-align: left;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 0.1em;
  }
}

.weatherContainer.layoutClassic,
.weatherContainer.layoutClassicV,
.weatherContainer.layoutNimbus {
  gap: 1em;

  .currentContainer {
    grid-column: 1 / 2;
    gap: 0.18em;
    .container-ne &,
    .container-e &,
    .container-se & {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    .currentDataContainer {
      grid-column: 2 / 3;
      gap: 0.18em;
    }
    .locationContainer {
      width: 100%;
    }

    .container-ne &,
    .container-e &,
    .container-se & {
      gap: 0.5em;
      .currentDataContainer {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
      .iconContainer {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
      }
    }
    .icon {
      width: 8em;
    }
    .tempContainer {
      grid-template-columns: auto auto;
      gap: 0.1em;
      align-items: center;
      .container-ne &,
      .container-e &,
      .container-se & {
        gap: 0.2em;
      }
      .currently {
        font-size: 2.6em;
        line-height: 0.9em;
        .container-ne &,
        .container-e &,
        .container-se & {
          order: +1;
        }
      }
      .feelsLike {
        display: flex;
        align-items: center;
        gap: 0.3em;
        &:not(.noHigh)::before {
          content: '/';
          font-size: 1.3em;
        }
        .container-ne &,
        .container-e &,
        .container-se & {
          gap: 0.1em;
          &::before {
            order: +1;
          }
        }
      }
    }
    .conditionContainer,
    .statsContainer,
    .sunContainer,
    .moonContainer {
      grid-auto-flow: column;
      gap: 0.4em;
    }

    .conditionContainer {
      font-size: 1.3em;
    }
  }

  .forecastContainer {
    grid-column: 2 / 3;
    gap: 0.4em;
    .container-ne &,
    .container-e &,
    .container-se & {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
  }
  .forecast {
    grid-auto-flow: column;
    width: 100%;
    .iconContainer,
    .dateContainer,
    .tempContainer,
    .high,
    .low {
      width: 100%;
    }
    .dayContainer {
      grid-template-columns: auto auto;
      grid-template-rows: auto auto;
      gap: 0.14em 0.1em;
    }
    .iconContainer {
      grid-row: 1 / 3;
      .container-ne &,
      .container-e &,
      .container-se & {
        grid-column: 2 / 3;
      }
    }
    .icon {
      width: 3em;
    }
    .dateContainer {
      grid-row: 1 / 2;
    }
    .tempContainer {
      grid-template-columns: auto auto;
      gap: 0.1em;
      grid-row: 2 / 3;
      align-items: center;
    }
    .high {
      font-size: 1.8em;
    }
    .low {
      display: flex;
      align-items: center;
      gap: 0.3em;
      &:not(.noHigh)::before {
        content: '/';
        font-size: 1em;
      }
    }
  }
}

.weatherContainer.layoutClassicV {
  .forecast,
  .forecast .iconContainer,
  .forecast .tempContainer,
  .dayContainer,
  .dateContainer,
  .currently,
  .feelsLike,
  .high,
  .low {
    justify-content: center;
  }
  .forecast {
    .dayContainer {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-auto-flow: row;
      gap: 0.14em;
    }
    .iconContainer {
      grid-column: 1 / 2;
      grid-row: auto;
      .container-ne &,
      .container-e &,
      .container-se & {
        grid-column: 1 / 2;
      }
    }
    .dateContainer {
      grid-column: 1 / 2;
      grid-row: auto;
    }
    .tempContainer {
      grid-template-columns: auto;
      grid-template-rows: auto;
      grid-auto-flow: row;
      grid-column: 1 / 2;
      grid-row: auto;
      gap: 0.1em;
    }
    .high {
      .container-ne &,
      .container-e &,
      .container-se & {
        order: unset;
      }
    }
    .low {
      &::before {
        display: none;
      }
    }
  }
}

.weatherContainer.layoutNimbus {
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-auto-flow: row;
  .currentContainer {
    width: 100%;
    grid-column: 1/2;
    grid-row: 1/2;
    .container-ne &,
    .container-e &,
    .container-se & {
      grid-column: 1/2;
      grid-row: 1/2;
    }
    .iconContainer {
      width: 100%;
      .container-ne &,
      .container-e &,
      .container-se & {
        grid-column: 1 / 2;
      }
    }
    .currentDataContainer {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      .container-ne &,
      .container-e &,
      .container-se & {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
      }
    }
  }
  .forecastContainer {
    width: 100%;
    grid-column: 1/2;
    grid-row: 2 / 3;
    .container-ne &,
    .container-e &,
    .container-se & {
      grid-column: 1/2;
      grid-row: 2 / 3;
    }
  }
  .forecast {
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-auto-flow: row;
    .dayContainer {
      width: 100%;
      grid-template-columns: auto auto auto;
      grid-template-rows: 1fr;
      grid-auto-flow: column;
      .container-nw &,
      .container-w &,
      .container-sw & {
        grid-template-columns: auto 1fr auto;
      }
      .container-ne &,
      .container-e &,
      .container-se & {
        grid-template-columns: auto 1fr auto;
      }
      .container-nw &,
      .container-n &,
      .container-ne &,
      .container-sw &,
      .container-s &,
      .container-se & {
        align-items: center;
      }
      .iconContainer {
        grid-column: auto;
        grid-row: auto;
        .container-ne &,
        .container-e &,
        .container-se & {
          order: +2;
        }
      }
      .icon {
        width: 2em;
      }
      .dateContainer {
        grid-column: auto;
        grid-row: auto;
        padding-inline-end: 0.5em;
        .container-ne &,
        .container-e &,
        .container-se & {
          order: +1;
        }
      }
      .tempContainer {
        grid-column: auto;
        grid-row: auto;
        .container-nw &,
        .container-w &,
        .container-sw & {
          justify-content: end;
        }
      }
      .high {
        font-size: 1.2em;
      }
      .low {
        gap: 0.16em;
      }
    }
  }
}
</style>
