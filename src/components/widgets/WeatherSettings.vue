<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { getLocation, getWeather } from '@/helpers/weather.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useSettingsStore()

const widgetStore = 'weathers'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
const showLocationSearch = ref(false)
const locQueary = ref('')
let searchResults = ref([])

const openLocSearch = async () => {
  showLocationSearch.value = true
}

const searchLoc = async () => {
  store.isLoading = true
  const loc = await getLocation(locQueary.value, store.config.global.lang)
  searchResults.value = [...loc]
  store.isLoading = false
}

const getMyLoc = () => {
  store.isLoading = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      store.isLoading = false
      const loc = await getLocation(`${pos.coords.latitude},${pos.coords.longitude}`, store.config.global.lang)
      searchResults.value = [...loc]
    },
    (err) => {
      store.isLoading = false
      console.warn(`ERROR(${err.code}): ${err.message}`)
      const unableToGetYourLocationMsg = t('widget.unableToGetYourLocation')
      alert(unableToGetYourLocationMsg)
    },
    {
      timeout: 5000,
    }
  )
}

const selectLoc = (loc) => {
  widget.location = loc
  showLocationSearch.value = false
  refreshWeather()
}

const refreshWeather = async () => {
  store.isLoading = true
  let data = await getWeather(widget.location.url, store.config.global.lang)
  let wKey = 'weather-' + widget.id
  if (data === false) {
    alert(
      'Unable to retrieve weather data from servers at this time. Please check your internet connection or try again later.'
    )
  } else {
    await setStorage({ [wKey]: data }, 'local')
  }
  store.isLoading = false
}
</script>

<template>
  <PageHeading title="Weather" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.location') }}</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">
              <div class="desc">{{ $t('widget.currentLocation') }}</div>
              <strong>{{ widget.location.name }}</strong>
              <div class="desc">
                <strong>
                  {{ widget.location.region }}{{ widget.location.region && widget.location.country ? ', ' : ''
                  }}{{ widget.location.country }}
                </strong>
              </div>
            </div>
            <div class="btnGroup">
              <button type="button" class="btn mla" @click="refreshWeather">{{ $t('common.refresh') }}</button>
              <ModalWindow :show="showLocationSearch" size="400px" @close="showLocationSearch = false">
                <template #button>
                  <button type="button" class="btn" @click="openLocSearch">{{ $t('widget.changeLocation') }}</button>
                </template>
                <template #window>
                  <div class="modal">
                    <header class="modalHeader">
                      <h1 class="modalTitle">{{ $t('widget.findALocation') }}</h1>
                      <button
                        class="modalClose"
                        type="button"
                        :aria-label="$t('common.close')"
                        @click="showLocationSearch = false"
                      >
                        <fa icon="fa-xmark" />
                      </button>
                    </header>
                    <div class="modalContent">
                      <div class="group stack fill">
                        <div for="locSearchModalInput" class="label">
                          <label for="locSearchModalInput">{{ $t('settings.search') }}</label>
                          <div class="desc">{{ $t('widget.cityNamePostalCodeCoordinatesEtc') }}</div>
                        </div>
                        <form novalidate class="group fill compact" @submit.prevent="searchLoc">
                          <input
                            id="locSearchModalInput"
                            v-model="locQueary"
                            type="text"
                            :placeholder="$t('widget.enterALocation')"
                            class="input"
                          />
                          <button type="submit" class="btn" aria-label="Search" title="Search">
                            <fa icon="fa-magnifying-glass" />
                          </button>
                          <button
                            type="button"
                            class="btn"
                            :aria-label="$t('widget.getMyLocation')"
                            :title="$t('widget.getMyLocation')"
                            @click="getMyLoc"
                          >
                            <fa icon="fa-location-crosshairs" />
                          </button>
                        </form>
                      </div>
                      <ul class="locSearchModalList">
                        <li v-for="item in searchResults" :key="item.id">
                          <button type="button" class="btn stack locSearchModalResultBtn" @click="selectLoc(item)">
                            <strong>{{ item.name }}</strong>
                            <div>{{ item.region }}{{ item.region && item.country ? ', ' : '' }}{{ item.country }}</div>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>
              </ModalWindow>
            </div>
          </div>
          <div class="block">
            <label for="locname" class="label mra">{{ $t('widget.showLocationName') }}</label>
            <ToggleField v-model="widget.label.on" tag-id="locname"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.label.on" class="block">
            <label for="loccolor" class="label mra">{{ $t('widget.locationColor') }}</label>
            <ColorField v-model="widget.label.color" tag-id="loccolor" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
      <div class="block">
        <label for="layout" class="label mra">{{ $t('widget.layout') }}</label>
        <select id="layout" v-model="widget.layout" name="layout" class="select w20">
          <option value="Classic">Classic</option>
          <option value="ClassicV">Classic V</option>
          <option value="Nimbus">Nimbus</option>
          <option value="Weatherman">Weatherman</option>
          <option value="BarebonesV">Barebones V</option>
          <option value="BarebonesH">Barebones H</option>
        </select>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="elColors" class="label mra">{{ $t('widget.overrideTextColors') }}</label>
          <ToggleField v-model="widget.overrideColors" tag-id="elColors"></ToggleField>
        </div>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.measurementsAndNumbers') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="scale" class="label mra">{{ $t('widget.temperatureScale') }}</label>
            <select id="scale" v-model="widget.scale" name="scale" class="select w20">
              <option :value="true">Fahrenheit - &deg;F</option>
              <option :value="false">Celsius - &deg;C</option>
            </select>
          </div>
          <div class="block">
            <label for="unit" class="label mra">{{ $t('widget.measurementUnits') }}</label>
            <select id="unit" v-model="widget.unit" name="unit" class="select w20">
              <option :value="true">Imperial</option>
              <option :value="false">Metric</option>
            </select>
          </div>
          <div class="block">
            <label for="roundDecimals" class="label mra">{{ $t('widget.roundDecimals') }}</label>
            <ToggleField v-model="widget.roundDecimals" tag-id="roundDecimals"></ToggleField>
          </div>
          <div class="block">
            <label for="tf" class="label mra">{{ $t('widget.24HourTime') }}</label>
            <ToggleField v-model="widget.twentyFour" tag-id="tf"></ToggleField>
          </div>
        </template>
      </FieldAccordion>
    </div>
    <h3 class="subtitle">{{ $t('widget.currentWeather') }}</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="currentOn" class="label mra">{{ $t('widget.currentWeather') }}</label>
        <ToggleField v-model="widget.current.on" tag-id="currentOn"></ToggleField>
      </div>
      <FieldAccordion v-if="widget.current.on">
        <template #label>
          <div class="label">{{ $t('widget.temperature') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="currentTemp" class="label mra">{{ $t('widget.currentTemperature') }}</label>
            <ToggleField v-model="widget.current.temperature.currently" tag-id="currentTemp"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.temperature.currently" class="block">
            <label for="currentTempColor" class="label mra">{{ $t('widget.currentTemperatureColor') }}</label>
            <ColorField
              v-model="widget.current.temperature.currentlyColor"
              tag-id="currentTempColor"
              class="w20"
            ></ColorField>
          </div>
          <div class="block">
            <label for="currentFeelsLike" class="label mra">{{ $t('widget.feelsLike') }}</label>
            <ToggleField v-model="widget.current.temperature.feelsLike" tag-id="currentFeelsLike"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.temperature.feelsLike" class="block">
            <label for="flc" class="label mra">{{ $t('widget.feelsLikeColor') }}</label>
            <ColorField v-model="widget.current.temperature.feelsLikeColor" tag-id="flc" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="currentDegSym" class="label mra">{{ $t('widget.degreeSymbol') }}</label>
            <ToggleField v-model="widget.current.temperature.degree" tag-id="currentDegSym"></ToggleField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion v-if="widget.current.on">
        <template #label>
          <div class="label">{{ $t('widget.statistics') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="currentCondition" class="label mra">{{ $t('widget.condition') }}</label>
            <ToggleField v-model="widget.current.condition.on" tag-id="currentCondition"></ToggleField>
          </div>
          <div class="block">
            <label for="currentConditionColor" class="label mra">{{ $t('widget.condition') }}</label>
            <ColorField
              v-model="widget.current.condition.color"
              tag-id="currentConditionColor"
              class="w20"
            ></ColorField>
          </div>
          <div class="block">
            <label for="currentHum" class="label mra">{{ $t('widget.humidity') }}</label>
            <ToggleField v-model="widget.current.humidity.on" tag-id="currentHum"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.humidity.on" class="block">
            <label for="currentHumidityColor" class="label mra">{{ $t('widget.humidityColor') }}</label>
            <ColorField v-model="widget.current.humidity.color" tag-id="currentHumidityColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="currentPre" class="label mra">{{ $t('widget.pressure') }}</label>
            <ToggleField v-model="widget.current.pressure.on" tag-id="currentPre"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.pressure.on" class="block">
            <label for="currentPressureColor" class="label mra">{{ $t('widget.pressure') }}</label>
            <ColorField v-model="widget.current.pressure.color" tag-id="currentPressureColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="currentWind" class="label mra">{{ $t('widget.wind') }}</label>
            <ToggleField v-model="widget.current.wind.on" tag-id="currentWind"></ToggleField>
          </div>
          <div v-if="widget.current.wind.on" class="block">
            <label for="windUnit" class="label mra">{{ $t('widget.windUnits') }}</label>
            <select id="windUnit" v-model="widget.windUnit" name="windUnit" class="select w10">
              <option :value="true">{{ widget.unit ? 'mph' : 'kph' }}</option>
              <option :value="false">{{ widget.unit ? 'ft/s' : 'm/s' }}</option>
            </select>
          </div>
          <div v-if="widget.current.wind.on" class="block">
            <label for="currentWindColor" class="label mra">{{ $t('widget.windColor') }}</label>
            <ColorField v-model="widget.current.wind.color" tag-id="currentWindColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="currentSunrise" class="label mra">{{ $t('widget.sunrise') }}</label>
            <ToggleField v-model="widget.current.astro.sunrise" tag-id="currentSunrise"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.astro.sunrise" class="block">
            <label for="currentSunriseColor" class="label mra">{{ $t('widget.sunriseColor') }}</label>
            <ColorField
              v-model="widget.current.astro.sunriseColor"
              tag-id="currentSunriseColor"
              class="w20"
            ></ColorField>
          </div>
          <div class="block">
            <label for="currentSunset" class="label mra">{{ $t('widget.sunset') }}</label>
            <ToggleField v-model="widget.current.astro.sunset" tag-id="currentSunset"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.astro.sunset" class="block">
            <label for="currentSunsetColor" class="label mra">{{ $t('widget.sunsetColor') }}</label>
            <ColorField v-model="widget.current.astro.sunsetColor" tag-id="currentSunsetColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="currentMoon" class="label mra">{{ $t('widget.moonPhase') }}</label>
            <ToggleField v-model="widget.current.astro.moonPhase" tag-id="currentMoon"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.current.astro.moonPhase" class="block">
            <label for="currentMoon" class="label mra">{{ $t('widget.moonPhaseColor') }}</label>
            <ColorField
              v-model="widget.current.astro.moonPhaseColor"
              tag-id="currentMoonColor"
              class="w20"
            ></ColorField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion v-if="widget.current.on">
        <template #label>
          <div class="label">{{ $t('widget.icon') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="currentIcon" class="label mra" aria-label="Enable icon">{{ $t('widget.enableIcon') }}</label>
            <ToggleField v-model="widget.current.icon.on" tag-id="currentIcon"></ToggleField>
          </div>
          <div v-if="widget.current.icon.on" class="block">
            <label for="currentIconAnimated" class="label mra">
              <div>{{ $t('widget.animatedIcons') }}</div>
            </label>
            <ToggleField v-model="widget.current.icon.animated" tag-id="currentIconAnimated"></ToggleField>
          </div>
          <template v-if="widget.current.icon.on">
            <div class="block">
              <label for="colorSun" class="label mra">{{ $t('widget.sunColor') }}</label>
              <ColorField v-model="widget.current.icon.colors.sun" tag-id="colorSun" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="colorMoon" class="label mra">{{ $t('widget.moonColor') }}</label>
              <ColorField v-model="widget.current.icon.colors.moon" tag-id="colorMoon" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="colorCloud" class="label mra">{{ $t('widget.cloudColor') }}</label>
              <ColorField v-model="widget.current.icon.colors.cloud" tag-id="colorCloud" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="colorRain" class="label mra">{{ $t('widget.rainColor') }}</label>
              <ColorField v-model="widget.current.icon.colors.rain" tag-id="colorRain" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="colorSnow" class="label mra">{{ $t('widget.snowColor') }}</label>
              <ColorField v-model="widget.current.icon.colors.snow" tag-id="colorSnow" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="colorThunder" class="label mra">{{ $t('widget.lightningColor') }}</label>
              <ColorField v-model="widget.current.icon.colors.thunder" tag-id="colorThunder" class="w20"></ColorField>
            </div>
          </template>
        </template>
      </FieldAccordion>
    </div>
    <h3 class="subtitle">{{ $t('widget.forecastWeather') }}</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="forecastOn" class="label mra">{{ $t('widget.forecastWeather') }}</label>
        <ToggleField v-model="widget.forecast.on" tag-id="forecastOn"></ToggleField>
      </div>
      <FieldAccordion v-if="widget.forecast.on">
        <template #label>
          <div class="label">{{ $t('widget.days') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="forecastDays" class="label mra">{{ $t('widget.numberOfDaysToShow') }}</label>
            <div class="range w20">
              <output class="output">{{ widget.forecast.days }}</output>
              <input id="forecastDays" v-model="widget.forecast.days" type="range" class="rangeInput" min="1" max="5" />
            </div>
          </div>
          <div class="block">
            <label for="forecastHideToday" class="label mra">{{ $t('widget.hideToday') }}</label>
            <ToggleField v-model="widget.forecast.hideToday" tag-id="forecastHideToday"></ToggleField>
          </div>
          <div class="block">
            <label for="forecastDayName" class="label mra">{{ $t('widget.showDate') }}</label>
            <ToggleField v-model="widget.forecast.day.on" tag-id="forecastDayName"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.forecast.day.on" class="block">
            <label for="forecastDayColor" class="label mra">{{ $t('widget.dateColor') }}</label>
            <ColorField v-model="widget.forecast.day.color" tag-id="forecastDayColor" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion v-if="widget.forecast.on">
        <template #label>
          <div class="label">{{ $t('widget.temperature') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="forecastHigh" class="label mra">{{ $t('widget.daysHighTemperature') }}</label>
            <ToggleField v-model="widget.forecast.temperature.high" tag-id="forecastHigh"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.forecast.temperature.high" class="block">
            <label for="forecastHighColor" class="label mra">{{ $t('widget.highTemperatureColor') }}</label>
            <ColorField
              v-model="widget.forecast.temperature.highColor"
              tag-id="forecastHighColor"
              class="w20"
            ></ColorField>
          </div>
          <div class="block">
            <label for="forecastLow" class="label mra">{{ $t('widget.daysLowTemperature') }}</label>
            <ToggleField v-model="widget.forecast.temperature.low" tag-id="forecastLow"></ToggleField>
          </div>
          <div v-if="widget.overrideColors && widget.forecast.temperature.low" class="block">
            <label for="forecastLowColor" class="label mra">{{ $t('widget.lowTemperatureColor') }}</label>
            <ColorField
              v-model="widget.forecast.temperature.lowColor"
              tag-id="forecastLowColor"
              class="w20"
            ></ColorField>
          </div>
          <div class="block">
            <label for="forecastDegSym" class="label mra">{{ $t('widget.degreeSymbol') }}</label>
            <ToggleField v-model="widget.forecast.temperature.degree" tag-id="forecastDegSym"></ToggleField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion v-if="widget.forecast.on">
        <template #label>
          <div class="label">{{ $t('widget.icon') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="forecastIcon" class="label mra">{{ $t('widget.enableIcon') }}</label>
            <ToggleField v-model="widget.forecast.icon.on" tag-id="forecastIcon"></ToggleField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="forecastIconAnimated" class="label mra">
              <div>{{ $t('widget.animatedIcons') }}</div>
            </label>
            <ToggleField v-model="widget.forecast.icon.animated" tag-id="forecastIconAnimated"></ToggleField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="fcolorSun" class="label mra">{{ $t('widget.sunColor') }}</label>
            <ColorField v-model="widget.forecast.icon.colors.sun" tag-id="fcolorSun" class="w20"></ColorField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="fcolorMoon" class="label mra">{{ $t('widget.moonColor') }}</label>
            <ColorField v-model="widget.forecast.icon.colors.moon" tag-id="fcolorMoon" class="w20"></ColorField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="fcolorCloud" class="label mra">{{ $t('widget.cloudColor') }}</label>
            <ColorField v-model="widget.forecast.icon.colors.cloud" tag-id="fcolorCloud" class="w20"></ColorField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="fcolorRain" class="label mra">{{ $t('widget.rainColor') }}</label>
            <ColorField v-model="widget.forecast.icon.colors.rain" tag-id="fcolorRain" class="w20"></ColorField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="fcolorSnow" class="label mra">{{ $t('widget.snowColor') }}</label>
            <ColorField v-model="widget.forecast.icon.colors.snow" tag-id="fcolorSnow" class="w20"></ColorField>
          </div>
          <div v-if="widget.forecast.icon.on" class="block">
            <label for="fcolorThunder" class="label mra">{{ $t('widget.lightningColor') }}</label>
            <ColorField v-model="widget.forecast.icon.colors.thunder" tag-id="fcolorThunder" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locSearchModalList {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  list-style: none;
  margin: var(--s5) 0 0 0;
  padding: 0;
  width: 100%;
}

.locSearchModalResultBtn {
  display: flex;
  width: 100%;
  padding: var(--s4) var(--s5);
  strong {
    display: block;
    font-weight: 600;
    font-size: 1.6rem;
  }
  div {
    font-weight: 400;
    font-size: 1.4rem;
  }
}
</style>
