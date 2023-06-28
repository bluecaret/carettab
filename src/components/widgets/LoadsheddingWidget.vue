<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useSettingsStore, setStorage, getStorage } from '@/store.js'
import { setWidgetContainerStyles } from '@/helpers/widgets.js'
import { DateTime } from 'luxon'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const cachedAreaInfo = ref(null)
const days = ref([])
const cacheTimePeriod = 7200000 // 2 hours
let licenseTimer = null

onMounted(() => {
  handleLoadsheddingInit()
})

watch(
  () => props.widget.license,
  () => {
    clearTimeout(licenseTimer)
    licenseTimer = setTimeout(() => handleLoadsheddingInit(), 2000)
  }
)

const handleLoadsheddingInit = async () => {
  if (props.widget.license) {
    const areaInfo = await getStorage(`loadshedding-area-${props.widget.id}`, 'local')
    if (!areaInfo[`loadshedding-area-${props.widget.id}`]) {
      cachedAreaInfo.value = { cachedAt: new Date().getTime().toString(), data: null }
    } else {
      cachedAreaInfo.value = areaInfo[`loadshedding-area-${props.widget.id}`]
    }
    getDayData()
    let areaCacheUntilTime = +cachedAreaInfo.value.cachedAt + cacheTimePeriod
    if (new Date().getTime() > areaCacheUntilTime || !cachedAreaInfo.value.data) {
      // get the current schedule for this area
      refreshData()
    } else {
      cachedAreaInfo.value = areaInfo[`loadshedding-area-${props.widget.id}`]
    }
  } else {
    cachedAreaInfo.value = { cachedAt: new Date().getTime().toString(), data: null }
  }
}

const requestFromApi = async (url, params = null) => {
  const apiUrl = 'https://developer.sepush.co.za/business/2.0'
  return new Promise((resolve) => {
    store.isLoading = true
    try {
      const headers = new Headers()
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*')
      headers.append('token', `${props.widget.license}`)
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
            resolve(null)
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

const refreshData = async (showLoading) => {
  if (showLoading) store.isLoading = true
  let data = await requestFromApi('area', `id=${props.widget.area.id}`)
  let lKey = 'loadshedding-area-' + props.widget.id
  cachedAreaInfo.value = { cachedAt: new Date().getTime().toString(), data: data }
  getDayData()
  await setStorage({ [lKey]: JSON.parse(JSON.stringify(cachedAreaInfo.value)) }, 'local')
  if (showLoading) store.isLoading = false
}

const getDayData = () => {
  if (
    !cachedAreaInfo.value.data ||
    !cachedAreaInfo.value.data.schedule.days.length ||
    !cachedAreaInfo.value.data.events.length
  )
    return []
  let newDays = []
  cachedAreaInfo.value.data.schedule.days.forEach((day) => {
    let newDay = []
    const filteredEvents = cachedAreaInfo.value.data.events.filter(
      (d) => new Date(day.date).getDate() == new Date(d.start).getDate()
    )

    filteredEvents.forEach((e) => {
      let updatedNote = e.note.replace(/ \(TESTING: current\)/g, '').trim()
      updatedNote = updatedNote.substring(updatedNote.length - 2)
      newDay.push({
        stage: updatedNote,
        timeSlot:
          new Date(e.start).getHours().toString().padStart(2, '0') +
          ':' +
          new Date(e.start).getMinutes().toString().padStart(2, '0') +
          ' - ' +
          new Date(e.end).getHours().toString().padStart(2, '0') +
          ':' +
          new Date(e.end).getMinutes().toString().padStart(2, '0'),
      })
    })
    newDays.push({ date: day.date, data: newDay })
  })
  days.value = [...newDays]
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})
</script>

<template>
  <div
    class="searchBar widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div v-if="cachedAreaInfo && cachedAreaInfo.data" class="loadsheddingContainer">
        <div class="loadsheddingSuburb">
          <div class="loadsheddingHeader">
            <h2>
              {{ cachedAreaInfo.data.info.name }}
            </h2>
            <div class="region">{{ cachedAreaInfo.data.info.region }}</div>
          </div>
          <div class="loadsheddingSchedules">
            <div v-for="(day, index) in days" :key="index" class="loadsheddingDaySchedule">
              <div class="loadsheddingDayName">
                {{ DateTime.fromFormat(day.date, 'yyyy-MM-dd').toFormat('EEE dd MMM') }}
              </div>
              <template v-if="day.data.length > 0">
                <div v-for="(timeSlot, tIndex) in day.data" :key="tIndex">
                  {{ timeSlot.timeSlot }}<span class="timeSlotStage">{{ timeSlot.stage }}</span>
                </div>
              </template>
              <div v-else>&mdash;</div>
            </div>
          </div>
          <div class="loadsheddingDim">
            <button type="button" class="refresh" title="Refresh data" @click="refreshData(true)">
              <fa icon="fa-arrow-rotate-right" />
            </button>
            Last refreshed:
            {{ DateTime.fromMillis(parseInt(cachedAreaInfo.cachedAt)).toFormat('dd MMM HH:mm a') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.refresh {
  background: transparent;
  border: 0;
  cursor: pointer;
  margin: 0 0.4em 0 0;
  padding: 0;
  font-size: 1em;
  color: currentColor;
}
.loadsheddingLocationListItem {
  display: flex;
  border-bottom: 1px solid currentColor;
  padding-bottom: var(--s4);
  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
}

.loadshedding {
  display: flex;
  justify-content: center;
  color: currentColor;
  flex-direction: row;
  width: max-content;
}

.loadsheddingDim {
  font-size: 0.7em;
  opacity: 0.5;
}

.region {
  font-size: 0.9em;
  opacity: 0.7;
}

.loadsheddingHeader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 0 0.4em 0;
  h2 {
    font-weight: normal;
    font-size: 1em;
    margin: 0;
  }
  .loadsheddingDim {
    font-size: 0.8em;
  }
}

.loadsheddingSuburb {
  display: flex;
  flex-direction: column;
}

.loadsheddingSchedules {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto;
  margin-bottom: 0.4em;
  gap: 0.6em;
}
.loadsheddingDaySchedule {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  font-size: 1em;
  * {
    padding: 0 0.4em 0 0;
  }
  .loadsheddingDim {
    font-size: 0.6em;
  }
}

.loadsheddingDayName {
  font-style: italic;
  font-size: 0.9em;
}

.timeSlotStage {
  display: inline-block;
  font-size: 0.8em;
  margin-left: 0.2em;
  opacity: 0.8;
  padding: 0;
  transform: translateY(-0.3em);
}
</style>
