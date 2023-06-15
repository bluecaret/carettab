<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { getLocation, getWeather } from '@/helpers/weather.js'

const store = useSettingsStore()

const access = inject('access')
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
  const loc = await getLocation(locQueary.value, access.items.w, store.config.global.lang)
  searchResults.value = [...loc]
  store.isLoading = false
}

const getMyLoc = () => {
  store.isLoading = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      store.isLoading = false
      const loc = await getLocation(
        `${pos.coords.latitude},${pos.coords.longitude}`,
        access.items.w,
        store.config.global.lang
      )
      searchResults.value = [...loc]
    },
    (err) => {
      store.isLoading = false
      console.warn(`ERROR(${err.code}): ${err.message}`)
      alert('Unable to get your location.')
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
  let data = await getWeather(widget.location.url, access.items.w, store.config.global.lang)
  let wKey = 'weather-' + widget.id
  await setStorage({ [wKey]: data }, 'local')
  store.isLoading = false
}
</script>

<template>
  <div class="page">
    <PageHeading title="Weather" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField :index="ci" :widget-store="widgetStore" />
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
      <div class="block">
        <div class="group fill">
          <label for="elColors" class="label mra">Override text colors</label>
          <ToggleField v-model="widget.overrideColors" tag-id="elColors"></ToggleField>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Weather options</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="group stack mra">
            <label class="label">Location</label>
            <div class="">
              <div class="desc">
                <strong>{{ widget.location.name }}</strong>
              </div>
              <div class="desc">
                {{ widget.location.region }}{{ widget.location.region && widget.location.country ? ', ' : ''
                }}{{ widget.location.country }}
              </div>
            </div>
          </div>
          <div class="group stack">
            <div class="group fill">
              <button type="button" class="btn mla" @click="refreshWeather">Refresh</button>
              <ModalWindow :show="showLocationSearch" size="400px">
                <template #button>
                  <button type="button" class="btn" @click="openLocSearch">Change location</button>
                </template>
                <template #window>
                  <div class="locSearchModal block">
                    <button
                      class="locSearchModalClose"
                      type="button"
                      aria-label="Close modal"
                      @click="showLocationSearch = false"
                    >
                      <fa icon="fa-close" />
                    </button>
                    <h2 class="locSearchModalHeading">Find a location</h2>
                    <div class="group stack fill">
                      <label for="locSearchModalInput" class="label"
                        >Search (city name, postal code, coordinates, etc.)</label
                      >
                      <form novalidate class="group fill compact" @submit.prevent="searchLoc">
                        <input
                          id="locSearchModalInput"
                          v-model="locQueary"
                          type="text"
                          placeholder="Enter a location"
                          class="input"
                        />
                        <button type="submit" class="btn" aria-label="Search" title="Search">
                          <fa icon="fa-magnifying-glass" />
                        </button>
                        <button
                          type="button"
                          class="btn"
                          aria-label="Get my location"
                          title="Get my location"
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
                </template>
              </ModalWindow>
            </div>
            <div class="group fill">
              <div class="group compact mla">
                <label for="locname" class="desc">Show location name</label>
                <ToggleField v-model="widget.label.on" tag-id="locname"></ToggleField>
                <ColorField
                  v-if="widget.overrideColors && widget.label.on"
                  v-model="widget.label.color"
                  tag-id="loccolor"
                  aria-label="Location color"
                  title="Location color"
                  class="w6"
                ></ColorField>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <label for="layout" class="label mra">Layout</label>
        <select id="layout" v-model="widget.layout" name="layout" class="select w18">
          <option value="2">Nimbus</option>
          <option value="1">Boreas Eurus</option>
          <option value="1a">Zephyrus</option>
          <option value="BarebonesV">Bare Bones V</option>
          <option value="BarebonesH">Bare Bones H</option>
        </select>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">Numbers</div>
          <div class="group compact">
            <label for="scale" class="desc">Scale</label>
            <select id="scale" v-model="widget.scale" name="scale" class="select w14">
              <option :value="true">Fahrenheit - &deg;F</option>
              <option :value="false">Celsius - &deg;C</option>
            </select>
          </div>
          <div class="group compact">
            <label for="unit" class="desc">Units</label>
            <select id="unit" v-model="widget.unit" name="unit" class="select w10">
              <option :value="true">Imperial</option>
              <option :value="false">Metric</option>
            </select>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="roundDecimals" class="desc">Round decimals</label>
            <ToggleField v-model="widget.roundDecimals" tag-id="roundDecimals"></ToggleField>
          </div>
          <div class="group compact">
            <label for="tf" class="desc">24 hour times</label>
            <ToggleField v-model="widget.twentyFour" tag-id="tf"></ToggleField>
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Current weather</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <label for="currentOn" class="label mra">Current weather</label>
          <div class="group compact">
            <ToggleField v-model="widget.current.on" tag-id="currentOn"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="group fill">
          <div class="label mra">Temperature</div>
          <div class="group compact">
            <label for="currentTemp" class="desc">Currently</label>
            <ToggleField v-model="widget.current.temperature.currently" tag-id="currentTemp"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.temperature.currently"
              v-model="widget.current.temperature.currentlyColor"
              tag-id="ccl"
              aria-label="Currently color"
              title="Currently color"
              class="w6"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentFeelsLike" class="desc">Feels like</label>
            <ToggleField v-model="widget.current.temperature.feelsLike" tag-id="currentFeelsLike"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.temperature.feelsLike"
              v-model="widget.current.temperature.feelsLikeColor"
              tag-id="flc"
              aria-label="Feels like color"
              title="Feels like color"
              class="w6"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentDegSym" class="desc mla">Degree symbol</label>
            <ToggleField v-model="widget.current.temperature.degree" tag-id="currentDegSym"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="label">Statistics</div>
        <div class="group mla">
          <div class="group compact">
            <label for="currentCondition" class="desc">Condition</label>
            <ToggleField v-model="widget.current.condition.on" tag-id="currentCondition"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.condition.on"
              v-model="widget.current.condition.color"
              tag-id="currentConditionColor"
              class="w6"
              aria-label="Condition color"
              title="Condition color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentHum" class="desc">Humidity</label>
            <ToggleField v-model="widget.current.humidity.on" tag-id="currentHum"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.humidity.on"
              v-model="widget.current.humidity.color"
              tag-id="currentHumidityColor"
              class="w6"
              aria-label="Humidity color"
              title="Humidity color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentPre" class="desc">Pressure</label>
            <ToggleField v-model="widget.current.pressure.on" tag-id="currentPre"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.pressure.on"
              v-model="widget.current.pressure.color"
              tag-id="currentPressureColor"
              class="w6"
              aria-label="Pressure color"
              title="Pressure color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentWind" class="desc">Wind</label>
            <ToggleField v-model="widget.current.wind.on" tag-id="currentWind"></ToggleField>
            <select
              v-if="widget.current.wind.on"
              id="windUnit"
              v-model="widget.windUnit"
              name="windUnit"
              class="select w7"
              aria-label="Wind unit"
              title="Wind unit"
            >
              <option :value="true">{{ widget.unit ? 'mph' : 'kph' }}</option>
              <option :value="false">{{ widget.unit ? 'ft/s' : 'm/s' }}</option>
            </select>
            <ColorField
              v-if="widget.overrideColors && widget.current.wind.on"
              v-model="widget.current.wind.color"
              tag-id="currentWindColor"
              class="w6"
              aria-label="Wind color"
              title="Wind color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentSunrise" class="desc">Sunrise</label>
            <ToggleField v-model="widget.current.astro.sunrise" tag-id="currentSunrise"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.astro.sunrise"
              v-model="widget.current.astro.sunriseColor"
              tag-id="currentSunriseColor"
              class="w6"
              aria-label="Sunrise color"
              title="Sunrise color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentSunset" class="desc">Sunset</label>
            <ToggleField v-model="widget.current.astro.sunset" tag-id="currentSunset"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.astro.sunset"
              v-model="widget.current.astro.sunsetColor"
              tag-id="currentSunsetColor"
              class="w6"
              aria-label="Sunset color"
              title="Sunset color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentMoon" class="desc">Moon phase</label>
            <ToggleField v-model="widget.current.astro.moonPhase" tag-id="currentMoon"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.current.astro.moonPhase"
              v-model="widget.current.astro.moonPhaseColor"
              tag-id="currentMoonColor"
              class="w6"
              aria-label="Moon phase color"
              title="Moon phase color"
            ></ColorField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="group fill">
          <div class="label mra">Icon</div>
          <div class="group compact">
            <label for="currentIcon" class="desc" aria-label="Enable icon">Enable</label>
            <ToggleField v-model="widget.current.icon.on" tag-id="currentIcon"></ToggleField>
          </div>
          <div v-if="widget.current.icon.on" class="group compact">
            <label for="currentIconAnimated" class="desc">Animated</label>
            <ToggleField v-model="widget.current.icon.animated" tag-id="currentIconAnimated"></ToggleField>
          </div>
        </div>
        <div v-if="widget.current.icon.on" class="group compact fill">
          <div class="group stack fill">
            <label for="colorSun" class="desc">Sun</label>
            <ColorField v-model="widget.current.icon.colors.sun" tag-id="colorSun"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="colorMoon" class="desc">Moon</label>
            <ColorField v-model="widget.current.icon.colors.moon" tag-id="colorMoon"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="colorCloud" class="desc">Cloud</label>
            <ColorField v-model="widget.current.icon.colors.cloud" tag-id="colorCloud"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="colorRain" class="desc">Rain</label>
            <ColorField v-model="widget.current.icon.colors.rain" tag-id="colorRain"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="colorSnow" class="desc">Snow</label>
            <ColorField v-model="widget.current.icon.colors.snow" tag-id="colorSnow"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="colorThunder" class="desc">Thunder</label>
            <ColorField v-model="widget.current.icon.colors.thunder" tag-id="colorThunder"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="colorOutline" class="desc">Outline</label>
            <ColorField v-model="widget.current.icon.colors.stroke" tag-id="colorOutline"></ColorField>
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Forecast weather</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="forecastOn" class="label mra">Forecast weather</label>
        <div class="group compact">
          <ToggleField v-model="widget.forecast.on" tag-id="forecastOn"></ToggleField>
        </div>
      </div>
      <div v-if="widget.forecast.on" class="block">
        <label for="forecastDays" class="label mra">Days</label>
        <div class="group">
          <div class="range">
            <output class="output">{{ widget.forecast.days }}</output>
            <input
              id="forecastDays"
              v-model="widget.forecast.days"
              type="range"
              class="rangeInput w10"
              min="1"
              max="5"
            />
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="forecastHideToday" class="desc">Hide today</label>
            <ToggleField v-model="widget.forecast.hideToday" tag-id="forecastHideToday"></ToggleField>
          </div>
          <div class="group compact">
            <label for="forecastDayName" class="desc">Show date</label>
            <ToggleField v-model="widget.forecast.day.on" tag-id="forecastDayName"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.forecast.on" class="block">
        <div class="group fill">
          <div class="label mra">Temperature</div>
          <div class="group compact">
            <label for="forecastHigh" class="desc">High</label>
            <ToggleField v-model="widget.forecast.temperature.high" tag-id="forecastHigh"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.forecast.temperature.high"
              v-model="widget.forecast.temperature.highColor"
              tag-id="forecastHighColor"
              class="w6"
              aria-label="High temperature color"
              title="High temperature color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="forecastLow" class="desc">Low</label>
            <ToggleField v-model="widget.forecast.temperature.low" tag-id="forecastLow"></ToggleField>
            <ColorField
              v-if="widget.overrideColors && widget.forecast.temperature.low"
              v-model="widget.forecast.temperature.lowColor"
              tag-id="forecastLowColor"
              class="w6"
              aria-label="Low temperature color"
              title="Low temperature color"
            ></ColorField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="forecastDegSym" class="desc">Degree Symbol</label>
            <ToggleField v-model="widget.forecast.temperature.degree" tag-id="forecastDegSym"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.forecast.on" class="block">
        <div class="label mra">Icon</div>
        <div class="group">
          <div class="group compact">
            <label for="forecastIcon" class="desc">Enable</label>
            <ToggleField v-model="widget.forecast.icon.on" tag-id="forecastIcon"></ToggleField>
          </div>
          <div v-if="widget.forecast.icon.on" class="group compact">
            <label for="forecastIconAnimated" class="desc">Animated</label>
            <ToggleField v-model="widget.forecast.icon.animated" tag-id="forecastIconAnimated"></ToggleField>
          </div>
        </div>
        <div v-if="widget.forecast.icon.on" class="group fill">
          <div class="group stack fill">
            <label for="fcolorSun" class="desc">Sun</label>
            <ColorField v-model="widget.forecast.icon.colors.sun" tag-id="fcolorSun"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="fcolorMoon" class="desc">Moon</label>
            <ColorField v-model="widget.forecast.icon.colors.moon" tag-id="fcolorMoon"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="fcolorCloud" class="desc">Cloud</label>
            <ColorField v-model="widget.forecast.icon.colors.cloud" tag-id="fcolorCloud"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="fcolorRain" class="desc">Rain</label>
            <ColorField v-model="widget.forecast.icon.colors.rain" tag-id="fcolorRain"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="fcolorSnow" class="desc">Snow</label>
            <ColorField v-model="widget.forecast.icon.colors.snow" tag-id="fcolorSnow"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="fcolorThunder" class="desc">Thunder</label>
            <ColorField v-model="widget.forecast.icon.colors.thunder" tag-id="fcolorThunder"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="fcolorOutline" class="desc">Outline</label>
            <ColorField v-model="widget.forecast.icon.colors.stroke" tag-id="fcolorOutline"></ColorField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locSearchModal {
  position: relative;
}

.locSearchModalHeading {
  margin-top: 0;
}

.locSearchModalClose {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: transparent;
  padding: 1rem;
  border: 0;
  cursor: pointer;
  span {
    font-size: 2.4rem;
    color: var(--getPremiumModalColor);
  }
}

.locSearchModalList {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  list-style: none;
  margin: 0;
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
