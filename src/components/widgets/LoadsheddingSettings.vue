<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSettingsStore } from '@/store.js'
import { checkPermission } from '@/helpers/widgets.js'

const store = useSettingsStore()

const widgetStore = 'loadsheddings'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const apiPermission = ref(false)
const allowance = ref({})
const apiError = ref(null)
const showLocationSearch = ref(false)
const hasSearched = ref(false)
const locationList = ref([])
const locQueary = ref([])

onMounted(() => {
  checkApiPermission()
})

const requestFromApi = async (url, params = null) => {
  const apiUrl = 'https://developer.sepush.co.za/business/2.0'
  return new Promise((resolve) => {
    store.isLoading = true
    try {
      const headers = new Headers()
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*')
      headers.append('token', `${widget.license}`)
      fetch(`${apiUrl}/${url}${params ? '?' + params : ''}`, {
        method: 'GET',
        mode: 'cors',
        headers,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            console.warn('Error while requesting data from API: ', result.error)
            store.isLoading = false
            resolve({ error: result.error })
          }
          resolve(result)
          store.isLoading = false
        })
        .catch((error) => console.warn('error', error))
      store.isLoading = false
    } catch (error) {
      console.warn('Unknown error while requesting data from API: ', error)
      store.isLoading = false
      resolve({ error: 'Unknown error while requesting data from API' })
    }
  })
}

const checkApiPermission = async () => {
  apiPermission.value = await checkPermission('https://developer.sepush.co.za/*', true)
}

const checkAllowance = async () => {
  const data = await requestFromApi('api_allowance')
  if (data.error) {
    apiError.value = data.error
    allowance.value = {}
  } else {
    apiError.value = null
    allowance.value = { ...data.allowance }
  }
}

const openLocSearch = async () => {
  showLocationSearch.value = true
  hasSearched.value = false
}

const searchLoc = async () => {
  const data = await requestFromApi('areas_search', `text=${locQueary.value}`)
  if (data.error) {
    apiError.value = data.error
    locationList.value = []
  } else {
    apiError.value = null
    locationList.value = [...data.areas]
  }
  hasSearched.value = true
}

const getMyLoc = () => {
  store.isLoading = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const data = await requestFromApi('areas_nearby', `lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      if (data.error) {
        apiError.value = data.error
        locationList.value = []
      } else {
        apiError.value = null
        locationList.value = [...data.areas]
      }
      store.isLoading = false
      hasSearched.value = true
    },
    (err) => {
      store.isLoading = false
      console.warn(`ERROR(${err.code}): ${err.message}`)
      alert('Unable to get your location.')
      hasSearched.value = true
    },
    {
      timeout: 5000,
    }
  )
}

const selectLoc = (loc) => {
  widget.area = { id: loc.id, name: loc.name, region: loc.region }
  showLocationSearch.value = false
}
</script>

<template>
  <PageHeading title="Loadshedding" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <h3 class="subtitle">Loadshedding for the South African Energy Crisis</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="paragraph">
          This widget is used for displaying the current Loadshedding status for citizens of South Africa during the
          energy crisis currently happening there. Read more about the
          <a href="https://en.wikipedia.org/wiki/South_African_energy_crisis" rel="noreferrer" target="_blank"
            >South African energy crisis on Wikipedia</a
          >. Please note that this widget is only intended for citizens of South Africa, if you are not a citizen there
          please refrain from using it to prevent the API from being overused and thus stay available to those that need
          it. The data is provided by
          <a href="https://eskomsepush.gumroad.com/l/api" rel="noreferrer" target="_blank">EskomSePush</a>. CaretTab
          takes no responsibility for the accuracy or reliability of this data.
        </div>
      </div>
      <div class="block">
        <label for="citizen" class="label">Are you living or working in South Africa?</label>
        <ToggleField v-model="widget.citizen" tag-id="citizen"></ToggleField>
      </div>
      <div v-if="widget.citizen && !apiPermission" class="block">
        <div class="label">
          Permission to access API
          <div class="paragraph">
            In order for the extension to have access to the API, you must provide permission for CaretTab to read the
            site "https://developer.sepush.co.za/".
          </div>
        </div>
        <RequestPermissionModal
          permission="https://developer.sepush.co.za/"
          permission-label="EskomSePush API"
          reason="This permission is needed to retrieve the Loadshedding data from the API at the site 'https://developer.sepush.co.za/'. Denying this permission will prevent the Loadshedding widget from working."
          :origins="true"
          @requested="checkApiPermission()"
        />
      </div>
      <div v-if="widget.citizen && apiPermission" class="block">
        <div class="label">
          Instructions
          <div class="paragraph">
            <div>
              In order to get loadshedding data from Eskom, you must sign up to the EskomSePush API yourself and provide
              your license key below. It is free to sign up. Go to
              <a href="https://eskomsepush.gumroad.com/l/api" rel="noreferrer" target="_blank"
                >https://eskomsepush.gumroad.com/l/api</a
              >
              to register, takes just a couple minutes.
            </div>
          </div>
        </div>
      </div>
      <div v-if="widget.citizen && apiPermission" class="block stack">
        <div class="group fill">
          <div class="label">
            <label for="licenseKey">EskomSePush License Key</label>
            <div class="desc">
              <div>
                <div>
                  <button class="btn btnLink" type="button" @click="checkAllowance()">
                    Check number of requests used.
                  </button>
                  <div v-if="allowance && allowance.type">
                    {{ allowance.count }} out of {{ allowance.limit }} {{ allowance.type }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input id="licenseKey" v-model="widget.license" type="text" class="input w30" />
        </div>
        <div v-if="apiError" class="error">{{ apiError }}</div>
      </div>
    </div>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="group stack mra">
            <label class="label">Location</label>
            <div v-if="widget.area.name" class="">
              <div class="desc">
                <strong>{{ widget.area.name }}</strong>
              </div>
              <div class="desc">
                {{ widget.area.region }}
              </div>
            </div>
          </div>
          <ModalWindow :show="showLocationSearch" size="400px" @close="showLocationSearch = false">
            <template #button>
              <button type="button" class="btn" @click="openLocSearch">
                {{ widget.area.name ? 'Change location' : 'Search for location' }}
              </button>
            </template>
            <template #window>
              <div class="modal">
                <header class="modalHeader">
                  <h1 class="modalTitle">Find a location</h1>
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
                    <label for="locSearchModalInput" class="label"
                      >Search
                      <div class="desc">(city name, postal code, coordinates, etc.)</div></label
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
                  <ul v-if="hasSearched" class="locSearchModalList">
                    <li v-for="item in locationList" :key="item.id">
                      <button type="button" class="btn stack locSearchModalResultBtn" @click="selectLoc(item)">
                        <strong>{{ item.name }}</strong>
                        <div>{{ item.region }}</div>
                      </button>
                    </li>
                    <li v-if="hasSearched && locationList.length <= 0">No locations found.</li>
                  </ul>
                </div>
              </div>
            </template>
          </ModalWindow>
        </div>
      </div>
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
