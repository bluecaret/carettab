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
  widget.loc = loc
  showLocationSearch.value = false
  refreshWeather()
}

const refreshWeather = async () => {
  store.isLoading = true
  let data = await getWeather(widget.loc.url, access.items.w, store.config.global.lang)
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
        v-model:width="widget.w.w"
        v-model:height="widget.w.h"
        v-model:autoSize="widget.w.as"
        v-model:align="widget.w.a"
        v-model:calign="widget.w.ca"
        v-model:x="widget.w.x"
        v-model:y="widget.w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="widget.w.orf"
        v-model:cl="widget.w.cl"
        v-model:fs="widget.w.fs"
        v-model:fb="widget.w.fb"
        v-model:fi="widget.w.fi"
        v-model:fu="widget.w.fu"
        v-model:ls="widget.w.ls"
        v-model:ts="widget.w.ts"
        v-model:tt="widget.w.tt"
        v-model:ff="widget.w.ff"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="widget.w.cor"
        v-model:rounded="widget.w.crd"
        v-model:bs="widget.w.cbs"
        v-model:bc="widget.w.cbc"
        v-model:bg="widget.w.cbg"
        v-model:shadow="widget.w.csh"
        v-model:padding="widget.w.cpd"
      >
      </WidgetBoxField>
      <div class="block">
        <label for="hz" class="label mra">Horizontal display</label>
        <ToggleField v-model="widget.hz" tag-id="hz"></ToggleField>
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
                <strong>{{ widget.loc.name }}</strong>
              </div>
              <div class="desc">
                {{ widget.loc.region }}{{ widget.loc.region && widget.loc.country ? ', ' : '' }}{{ widget.loc.country }}
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
            <ToggleField v-model="widget.lb.on" tag-id="locname"></ToggleField>
          </div>
          <div v-if="widget.lb.on" class="group compact">
            <label for="loccolor" class="desc">Color</label>
            <ColorField v-model="widget.lb.cl" tag-id="loccolor" class="w4"></ColorField>
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
            <ToggleField v-model="widget.pd" tag-id="precise"></ToggleField>
          </div>
          <div class="group compact fill">
            <label for="tf" class="label">24 hour</label>
            <ToggleField v-model="widget.tf" tag-id="tf"></ToggleField>
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
            <ToggleField v-model="widget.c.on" tag-id="currentOn"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.c.on" class="block">
        <div class="group fill">
          <div class="label mra">Icon</div>
          <div class="group compact">
            <label for="currentIcon" class="desc">Enable</label>
            <ToggleField v-model="widget.c.ic.on" tag-id="currentIcon"></ToggleField>
          </div>
          <div v-if="widget.c.ic.on" class="group compact">
            <label for="currentIconSz" class="desc">Size</label>
            <NumberField
              v-model="widget.c.ic.sz"
              tag-id="currentIconSz"
              aria-label="Icon size"
              title="Icon size"
              :min="1"
              class="w8"
            ></NumberField>
          </div>
          <div v-if="widget.c.ic.on" class="group compact">
            <label for="iconcolor" class="desc">Color</label>
            <ColorField v-model="widget.c.ic.cl" tag-id="iconcolor" class="w4"></ColorField>
          </div>
        </div>
      </div>
      <div v-if="widget.c.on" class="block">
        <div class="group fill">
          <div class="label mra">Temperature</div>
          <div class="group compact">
            <label for="currentTemp" class="desc">Current</label>
            <ToggleField v-model="widget.c.tp.cur" tag-id="currentTemp"></ToggleField>
            <ColorField
              v-if="widget.c.tp.cur"
              v-model="widget.c.tp.ccl"
              tag-id="ccl"
              class="w4"
              aria-label="Current color"
              title="Current color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="currentFeelsLike" class="desc">Feels like</label>
            <ToggleField v-model="widget.c.tp.fl" tag-id="currentFeelsLike"></ToggleField>
            <ColorField
              v-if="widget.c.tp.fl"
              v-model="widget.c.tp.fcl"
              tag-id="fcl"
              class="w4"
              aria-label="Feels like color"
              title="Feels like color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="currentDegSym" class="desc">Symbol</label>
            <ToggleField v-model="widget.c.tp.de" tag-id="currentDegSym"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.c.on" class="block">
        <div class="group fill">
          <div class="label mra">Statistics</div>
          <div class="group compact">
            <label for="currentCondition" class="desc">Condition</label>
            <ToggleField v-model="widget.c.cd" tag-id="currentCondition"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentHum" class="desc">Humidity</label>
            <ToggleField v-model="widget.c.hy.on" tag-id="currentHum"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentPre" class="desc">Pressure</label>
            <ToggleField v-model="widget.c.pr.on" tag-id="currentPre"></ToggleField>
          </div>
        </div>
        <div class="group fill">
          <div class="group compact mla">
            <label for="currentWind" class="desc">Wind</label>
            <ToggleField v-model="widget.c.wd.on" tag-id="currentWind"></ToggleField>
          </div>
          <div v-if="widget.c.wd.on" class="group compact">
            <label for="windunit" class="desc"
              >Wind unit<br /><small>{{
                widget.wu ? (widget.unit ? 'mph' : 'kph') : widget.unit ? 'ft/s' : 'm/s'
              }}</small></label
            >
            <ToggleField v-model="widget.wu" tag-id="windunit"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.c.on" class="block">
        <div class="group fill">
          <div class="label mra">Astrology</div>
          <div class="group compact">
            <label for="currentSunrise" class="desc">Sunrise</label>
            <ToggleField v-model="widget.c.ao.sr" tag-id="currentSunrise"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentSunset" class="desc">Sunset</label>
            <ToggleField v-model="widget.c.ao.ss" tag-id="currentSunset"></ToggleField>
          </div>
          <div class="group compact">
            <label for="currentMoon" class="desc">Moon phase</label>
            <ToggleField v-model="widget.c.ao.mp" tag-id="currentMoon"></ToggleField>
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
          <ToggleField v-model="widget.f.on" tag-id="forecastOn"></ToggleField>
        </div>
      </div>
      <div v-if="widget.f.on" class="block">
        <label for="forecastDays" class="label mra">Days</label>
        <div class="group">
          <div class="range">
            <output class="output">{{ widget.f.ds }}</output>
            <input id="forecastDays" v-model="widget.f.ds" type="range" class="rangeInput w10" min="1" max="5" />
          </div>
          <div class="group compact">
            <label for="forecastHideToday" class="desc">Hide today</label>
            <ToggleField v-model="widget.f.ht" tag-id="forecastHideToday"></ToggleField>
          </div>
        </div>
      </div>
      <div v-if="widget.f.on" class="block">
        <div class="label mra">Display</div>
        <div class="group">
          <div class="group compact">
            <label for="forecastHoriz" class="desc">Horizontal display</label>
            <ToggleField v-model="widget.f.hz" tag-id="forecastHoriz"></ToggleField>
          </div>
          <div class="group compact">
            <label for="forecastDayName" class="desc">Day Name</label>
            <ToggleField v-model="widget.f.dy.on" tag-id="forecastDayName"></ToggleField>
            <ColorField
              v-if="widget.f.dy.on"
              v-model="widget.f.dy.cl"
              tag-id="dycl"
              class="w4"
              aria-label="Day name color"
              title="Day name color"
            ></ColorField>
          </div>
        </div>
      </div>
      <div v-if="widget.f.on" class="block">
        <div class="label mra">Icon</div>
        <div class="group">
          <div class="group compact">
            <label for="forecastIcon" class="desc">Enable</label>
            <ToggleField v-model="widget.f.ic.on" tag-id="forecastIcon"></ToggleField>
          </div>
          <div class="group compact">
            <label for="forecastIconSz" class="desc">Size</label>
            <NumberField
              v-if="widget.f.ic.on"
              v-model="widget.f.ic.sz"
              tag-id="forecastIconSz"
              aria-label="Icon size"
              title="Icon size"
              :min="1"
              class="w8"
            ></NumberField>
          </div>
          <div v-if="widget.f.ic.on" class="group compact">
            <label for="forecasticoncolor" class="desc">Color</label>
            <ColorField v-model="widget.f.ic.cl" tag-id="forecasticoncolor" class="w4"></ColorField>
          </div>
        </div>
      </div>
      <div v-if="widget.f.on" class="block">
        <div class="label mra">Temperature</div>
        <div class="group">
          <div class="group compact">
            <label for="forecastHigh" class="desc">High</label>
            <ToggleField v-model="widget.f.tp.h" tag-id="forecastHigh"></ToggleField>
            <ColorField
              v-if="widget.f.tp.h"
              v-model="widget.f.tp.hcl"
              tag-id="fhcl"
              class="w4"
              aria-label="High color"
              title="High color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="forecastLow" class="desc">Low</label>
            <ToggleField v-model="widget.f.tp.l" tag-id="forecastLow"></ToggleField>
            <ColorField
              v-if="widget.f.tp.l"
              v-model="widget.f.tp.lcl"
              tag-id="flcl"
              class="w4"
              aria-label="Low color"
              title="Low color"
            ></ColorField>
          </div>
          <div class="group compact">
            <label for="forecastDegSym" class="desc">Symbol</label>
            <ToggleField v-model="widget.f.tp.de" tag-id="forecastDegSym"></ToggleField>
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
