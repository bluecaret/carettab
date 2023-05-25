<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { getLocation, getWeather } from '@/helpers/weather.js'

const store = useSettingsStore()

const access = inject('access')
const ci = ref(store.config.weathers.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.weathers[ci.value])
const showLocationSearch = ref(false)
const locQueary = ref('')
let searchResults = ref([])

const openLocSearch = async () => {
  showLocationSearch.value = true
}

const searchLoc = async () => {
  store.isLoading = true
  const loc = await getLocation(locQueary.value, access.items.w, store.config.global.lang)
  searchResults.value = [...location]
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
      searchResults.value = [...location]
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
      <SizeAndPositionField
        v-model:width="widget.base.width"
        v-model:height="widget.base.height"
        v-model:autoSize="widget.base.autoSize"
        v-model:align="widget.base.alignment"
        v-model:calign="widget.base.container.alignment"
        v-model:x="widget.base.x"
        v-model:y="widget.base.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="widget.base.font.override"
        v-model:color="widget.base.font.color"
        v-model:size="widget.base.font.size"
        v-model:bold="widget.base.font.bold"
        v-model:italic="widget.base.font.italic"
        v-model:underline="widget.base.font.underline"
        v-model:letterSpacing="widget.base.font.letterSpacing"
        v-model:shadow="widget.base.font.shadow"
        v-model:transform="widget.base.font.transform"
        v-model:family="widget.base.font.family"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="widget.base.container.override"
        v-model:rounded="widget.base.container.radius"
        v-model:borderSize="widget.base.container.borderSize"
        v-model:borderColor="widget.base.container.borderColor"
        v-model:background="widget.base.container.background"
        v-model:shadow="widget.base.container.shadow"
        v-model:padding="widget.base.container.padding"
      >
      </WidgetBoxField>
      <div class="block">
        <label for="hz" class="label mra">Horizontal display</label>
        <ToggleField v-model="widget.horizontal" tag-id="hz"></ToggleField>
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
          <button type="button" class="btn" @click="refreshWeather">Refresh weather</button>
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
      </div>
      <div class="block">
        <div class="label mra">Location name</div>
        <div class="group">
          <div class="group compact">
            <label for="locname" class="desc">Enable</label>
            <ToggleField v-model="widget.label.on" tag-id="locname"></ToggleField>
          </div>
          <div v-if="widget.label.on" class="group compact">
            <label for="loccolor" class="desc">Color</label>
            <ColorField v-model="widget.label.color" tag-id="loccolor" class="w4"></ColorField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="group compact fill">
            <label for="scale" class="label"
              >Scale<br /><small>{{ widget.scale ? '&deg;F' : '&deg;C' }}</small></label
            >
            <ToggleField v-model="widget.scale" tag-id="scale"></ToggleField>
          </div>
          <div class="group compact fill">
            <label for="unit" class="label"
              >Units<br /><small>{{ widget.unit ? 'Imperial' : 'Metric' }}</small></label
            >
            <ToggleField v-model="widget.unit" tag-id="unit"></ToggleField>
          </div>
          <div class="group compact fill">
            <label for="precise" class="label">Precise</label>
            <ToggleField v-model="widget.precise" tag-id="precise"></ToggleField>
          </div>
          <div class="group compact fill">
            <label for="tf" class="label">24 hour</label>
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
            <div class="desc">Enable</div>
            <ToggleField v-model="widget.current.on" tag-id="currentOn"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="group fill">
          <div class="label mra">Icon</div>
          <div class="group compact">
            <label for="currentIcon" class="desc">Enable</label>
            <ToggleField v-model="widget.current.icon.on" tag-id="currentIcon"></ToggleField>
          </div>
          <div v-if="widget.current.icon.on" class="group compact">
            <label for="currentIconSz" class="desc">Size</label>
            <NumberField
              v-model="widget.current.icon.size"
              tag-id="currentIconSz"
              aria-label="Icon size"
              title="Icon size"
              :min="1"
              class="w8"
            ></NumberField>
          </div>
          <div v-if="widget.current.icon.on" class="group compact">
            <label for="iconcolor" class="desc">Color</label>
            <ColorField v-model="widget.current.icon.color" tag-id="iconcolor" class="w4"></ColorField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="group fill">
          <div class="label mra">Temperature</div>
          <div class="group compact">
            <label for="currentTemp" class="desc">Current</label>
            <ToggleField v-model="widget.current.temperature.currently" tag-id="currentTemp"></ToggleField>
            <ColorField
              v-if="widget.current.temperature.currently"
              v-model="widget.current.temperature.currentlyColor"
              tag-id="ccl"
              class="w4"
              aria-label="Current color"
              title="Current color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="currentFeelsLike" class="desc">Feels like</label>
            <ToggleField v-model="widget.current.temperature.feelsLike" tag-id="currentFeelsLike"></ToggleField>
            <ColorField
              v-if="widget.current.temperature.feelsLike"
              v-model="widget.current.temperature.feelsLikeColor"
              tag-id="fcl"
              class="w4"
              aria-label="Feels like color"
              title="Feels like color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="currentDegSym" class="desc">Symbol</label>
            <ToggleField v-model="widget.current.temperature.degree" tag-id="currentDegSym"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="group fill">
          <div class="label mra">Statistics</div>
          <div class="group compact">
            <label for="currentCondition" class="desc">Condition</label>
            <ToggleField v-model="widget.current.condition" tag-id="currentCondition"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentHum" class="desc">Humidity</label>
            <ToggleField v-model="widget.current.humidity.on" tag-id="currentHum"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentPre" class="desc">Pressure</label>
            <ToggleField v-model="widget.current.pressure.on" tag-id="currentPre"></ToggleField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentWind" class="desc">Wind</label>
            <ToggleField v-model="widget.current.wind.on" tag-id="currentWind"></ToggleField>
          </div>
          <div v-if="widget.current.wind.on" class="group compact">
            <label for="windunit" class="desc"
              >Wind unit<br /><small>{{
                widget.windUnit ? (widget.unit ? 'mph' : 'kph') : widget.unit ? 'ft/s' : 'm/s'
              }}</small></label
            >
            <ToggleField v-model="widget.windUnit" tag-id="windunit"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.current.on" class="block">
        <div class="group fill">
          <div class="label mra">Astrology</div>
          <div class="group compact">
            <label for="currentSunrise" class="desc">Sunrise</label>
            <ToggleField v-model="widget.current.astro.sunrise" tag-id="currentSunrise"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentSunset" class="desc">Sunset</label>
            <ToggleField v-model="widget.current.astro.sunset" tag-id="currentSunset"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentMoon" class="desc">Moon phase</label>
            <ToggleField v-model="widget.current.astro.moonPhase" tag-id="currentMoon"></ToggleField>
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Forecast weather</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="forecastOn" class="label mra">Forecast weather</label>
        <div class="group compact">
          <div class="desc">Enable</div>
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
          <div class="group compact">
            <label for="forecastHideToday" class="desc">Hide today</label>
            <ToggleField v-model="widget.forecast.hideToday" tag-id="forecastHideToday"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.forecast.on" class="block">
        <div class="label mra">Display</div>
        <div class="group">
          <div class="group compact">
            <label for="forecastHoriz" class="desc">Horizontal display</label>
            <ToggleField v-model="widget.forecast.horizontal" tag-id="forecastHoriz"></ToggleField>
          </div>
          <div class="group compact">
            <label for="forecastDayName" class="desc">Day Name</label>
            <ToggleField v-model="widget.forecast.day.on" tag-id="forecastDayName"></ToggleField>
            <ColorField
              v-if="widget.forecast.day.on"
              v-model="widget.forecast.day.color"
              tag-id="dycl"
              class="w4"
              aria-label="Day name color"
              title="Day name color"
            ></ColorField>
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
          <div class="group compact">
            <label for="forecastIconSz" class="desc">Size</label>
            <NumberField
              v-if="widget.forecast.icon.on"
              v-model="widget.forecast.icon.size"
              tag-id="forecastIconSz"
              aria-label="Icon size"
              title="Icon size"
              :min="1"
              class="w8"
            ></NumberField>
          </div>
          <div v-if="widget.forecast.icon.on" class="group compact">
            <label for="forecasticoncolor" class="desc">Color</label>
            <ColorField v-model="widget.forecast.icon.color" tag-id="forecasticoncolor" class="w4"></ColorField>
          </div>
        </div>
      </div>
      <div v-if="widget.forecast.on" class="block">
        <div class="label mra">Temperature</div>
        <div class="group">
          <div class="group compact">
            <label for="forecastHigh" class="desc">High</label>
            <ToggleField v-model="widget.forecast.temperature.high" tag-id="forecastHigh"></ToggleField>
            <ColorField
              v-if="widget.forecast.temperature.high"
              v-model="widget.forecast.temperature.highColor"
              tag-id="fhcl"
              class="w4"
              aria-label="High color"
              title="High color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="forecastLow" class="desc">Low</label>
            <ToggleField v-model="widget.forecast.temperature.low" tag-id="forecastLow"></ToggleField>
            <ColorField
              v-if="widget.forecast.temperature.low"
              v-model="widget.forecast.temperature.lowColor"
              tag-id="flcl"
              class="w4"
              aria-label="Low color"
              title="Low color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="forecastDegSym" class="desc">Symbol</label>
            <ToggleField v-model="widget.forecast.temperature.degree" tag-id="forecastDegSym"></ToggleField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locationSearchModal {
  position: relative;
}

.locationSearchModalHeading {
  margin-top: 0;
}

.locationSearchModalClose {
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

.locationSearchModalList {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.locationSearchModalResultBtn {
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
