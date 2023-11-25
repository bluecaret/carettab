<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store.js'
import WidgetSegmentFont from '@/components/forms/WidgetSegmentFont.vue'

const store = useSettingsStore()
const { t } = useI18n()

const widgetStore = 'countdowns'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
const weekdayNames = ref([])

const getWeekdayNames = () => {
  const startDate = DateTime.local(2023, 1, 2).setLocale(store.config.global.lang) // January 2, 2023 was a Monday
  weekdayNames.value = []
  for (let i = 0; i < 7; i++) {
    weekdayNames.value.push([
      startDate.plus({ days: i }).toFormat('ccccc'),
      startDate.plus({ days: i }).toFormat('cccc'),
    ])
  }
}

const getNthWeekdayOfMonth = computed(() => {
  const dateTime = DateTime.fromISO(widget.target)

  let nth = 0
  for (let i = 1; i <= dateTime.day; i++) {
    let tempDate = DateTime.local(dateTime.year, dateTime.month, i)
    if (tempDate.weekday === dateTime.weekday) {
      nth++
    }
  }

  let nthWord
  switch (nth) {
    case 2:
      nthWord = 'widget.secondWeekdayOfMonth'
      break
    case 3:
      nthWord = 'widget.thirdWeekdayOfMonth'
      break
    case 4:
      nthWord = 'widget.fourthWeekdayOfMonth'
      break
    case 5:
      nthWord = 'widget.fifthWeekdayOfMonth'
      break
    default:
      nthWord = 'widget.firstWeekdayOfMonth'
      break
  }

  const weekdayLocalized = dateTime.setLocale(store.config.global.lang).toLocaleString({ weekday: 'long' })

  return `${t(nthWord)} ${weekdayLocalized}`
})

const setWeeklyOn = (day) => {
  if (widget.repeat.weeklyOn.includes(day)) {
    const index = widget.repeat.weeklyOn.findIndex((d) => day === d)
    widget.repeat.weeklyOn.splice(index, 1)
  } else {
    widget.repeat.weeklyOn.push(day)
  }
}

const updateWeeklyOn = () => {
  if (widget.repeat.recurrence === 'week') {
    const dateTime = DateTime.fromISO(widget.target)
    widget.repeat.weeklyOn = []
    widget.repeat.weeklyOn.push(dateTime.weekday)
  }
}

watch(
  () => widget.target,
  () => {
    updateWeeklyOn()
  }
)

watch(
  () => widget.repeat.recurrence,
  () => {
    updateWeeklyOn()
  }
)

onMounted(() => {
  getWeekdayNames()
})
</script>

<template>
  <PageHeading title="Countdown" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block stack">
        <div class="group fill">
          <label for="countdownTarget" class="label mra">{{ $t('widget.countdownToDate') }}</label>
          <input id="countdownTarget" v-model="widget.target" type="datetime-local" class="input w20" />
          <div class="group compact">
            <label for="repeatEnable" class="desc">{{ $t('widget.repeat') }}</label>
            <ToggleField v-model="widget.repeat.on" tag-id="repeatEnable"></ToggleField>
          </div>
        </div>
        <div v-if="widget.repeat.on" class="group fill compact">
          <label for="repeatNth" class="desc mla">{{ $t('widget.repeatEvery') }}</label>
          <NumberField v-model="widget.repeat.nth" :increment="1" class="w7" tag-id="repeatNth" />
          <select v-model="widget.repeat.recurrence" :aria-label="$t('widget.recurrence')" class="select w12">
            <option value="day">{{ $t('widget.day') }}</option>
            <option value="week">{{ $t('widget.week') }}</option>
            <option value="month">{{ $t('widget.month') }}</option>
            <option value="year">{{ $t('widget.year') }}</option>
          </select>
        </div>
        <div v-if="widget.repeat.on && widget.repeat.recurrence === 'week'" class="group fill compact">
          <div class="desc mla">{{ $t('widget.weeklyOn') }}</div>
          <div v-if="weekdayNames && weekdayNames.length > 6" class="btnGroup">
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(7) }"
              :title="weekdayNames[6][1]"
              @click="setWeeklyOn(7)"
            >
              {{ weekdayNames[6][0] }}
            </button>
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(1) }"
              :title="weekdayNames[0][1]"
              @click="setWeeklyOn(1)"
            >
              {{ weekdayNames[0][0] }}
            </button>
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(2) }"
              :title="weekdayNames[1][1]"
              @click="setWeeklyOn(2)"
            >
              {{ weekdayNames[1][0] }}
            </button>
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(3) }"
              :title="weekdayNames[2][1]"
              @click="setWeeklyOn(3)"
            >
              {{ weekdayNames[2][0] }}
            </button>
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(4) }"
              :title="weekdayNames[3][1]"
              @click="setWeeklyOn(4)"
            >
              {{ weekdayNames[3][0] }}
            </button>
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(5) }"
              :title="weekdayNames[4][1]"
              @click="setWeeklyOn(5)"
            >
              {{ weekdayNames[4][0] }}
            </button>
            <button
              class="btn w3"
              :class="{ active: widget.repeat.weeklyOn.includes(6) }"
              :title="weekdayNames[5][1]"
              @click="setWeeklyOn(6)"
            >
              {{ weekdayNames[5][0] }}
            </button>
          </div>
        </div>
        <div v-if="widget.repeat.on && widget.repeat.recurrence === 'month'" class="group fill compact">
          <label for="repeatMonthlyOn" class="desc mla">{{ $t('widget.monthlyOn') }}</label>
          <select id="repeatMonthlyOn" v-model="widget.repeat.monthlyOn" class="select w20">
            <option value="day">
              {{ $t('widget.day') }}
              {{ DateTime.fromISO(widget.target).toFormat('d') }}
            </option>
            <option value="weekday">{{ getNthWeekdayOfMonth }}</option>
          </select>
        </div>
      </div>
      <div class="block">
        <label for="layoutDirection" class="label">{{ $t('widget.layoutDirection') }}</label>
        <select id="layoutDirection" v-model="widget.direction" class="select mla w20">
          <option value="horizontal">{{ $t('widget.horizontal') }}</option>
          <option value="vertical">{{ $t('widget.vertical') }}</option>
        </select>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.countdownLabel') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableCountdownLabel" class="label">{{ $t('widget.enableCountdownLabel') }}</label>
            <ToggleField v-model="widget.label.on" tag-id="enableCountdownLabel" class="mla"></ToggleField>
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="countdownLabelText" class="label">{{ $t('widget.labelText') }}</label>
            <input id="countdownLabelText" v-model="widget.label.label" type="text" class="input mla w20" />
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="countdownLabelPosition" class="label">{{ $t('widget.position') }}</label>
            <select id="countdownLabelPosition" v-model="widget.label.position" class="select mla w20">
              <option value="inline">{{ $t('widget.inline') }}</option>
              <option value="top">{{ $t('widget.top') }}</option>
              <option value="bottom">{{ $t('widget.bottom') }}</option>
            </select>
          </div>
          <WidgetSegmentFont
            v-if="widget.label.on"
            v-model:override="widget.label.override"
            v-model:color="widget.label.color"
            v-model:shadow="widget.label.shadow"
            v-model:letterSpacing="widget.label.letterSpacing"
            v-model:size="widget.label.size"
            v-model:x="widget.label.x"
            v-model:y="widget.label.y"
            type="label"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.unitLabel') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableUnitLabel" class="label">{{ $t('widget.enableUnitLabel') }}</label>
            <ToggleField v-model="widget.units.on" tag-id="enableUnitLabel" class="mla"></ToggleField>
          </div>
          <div v-if="widget.units.on" class="block">
            <label for="unitPosition" class="label">{{ $t('widget.position') }}</label>
            <select id="unitPosition" v-model="widget.units.position" class="select mla w20">
              <option value="inline">{{ $t('widget.inline') }}</option>
              <option value="top">{{ $t('widget.top') }}</option>
              <option value="bottom">{{ $t('widget.bottom') }}</option>
            </select>
          </div>
          <WidgetSegmentFont
            v-if="widget.units.on"
            v-model:override="widget.units.override"
            v-model:color="widget.units.color"
            v-model:shadow="widget.units.shadow"
            v-model:letterSpacing="widget.units.letterSpacing"
            v-model:size="widget.units.size"
            v-model:x="widget.units.x"
            v-model:y="widget.units.y"
            type="units"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.spacing') }}</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">
              <label for="equalWidth">{{ $t('widget.equalWidthUnits') }}</label>
              <div class="desc">{{ $t('widget.makeEachUnitEqualWidth') }}</div>
            </div>
            <ToggleField v-model="widget.equalWidth" tag-id="equalWidth"></ToggleField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="monospace">{{ $t('widget.equalWidthDigits') }}</label>
              <div class="desc">{{ $t('widget.makeEachNumberEqualWidths') }}</div>
            </div>
            <ToggleField v-model="widget.monospace" tag-id="monospace"></ToggleField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="spaceBetween">{{ $t('widget.spacingBetweenUnits') }}</label>
            </div>
            <NumberField v-model="widget.spaceBetween" :increment="0.1" class="w10" tag-id="spaceBetween">
            </NumberField>
          </div>
        </template>
      </FieldAccordion>
      <div class="block">
        <div class="label fill">{{ $t('widget.year') }}</div>
        <div class="group compact">
          <label for="yearsLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.years.on" tag-id="yearsLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="yearsLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="yearsLabelText"
            v-model="widget.years.label"
            type="text"
            class="input w15"
            :disabled="!widget.years.on"
          />
        </div>
      </div>
      <div class="block">
        <div class="label fill">{{ $t('widget.month') }}</div>
        <div class="group compact">
          <label for="monthsLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.months.on" tag-id="monthsLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="monthsLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="monthsLabelText"
            v-model="widget.months.label"
            type="text"
            class="input w15"
            :disabled="!widget.months.on"
          />
        </div>
      </div>
      <div class="block">
        <div class="label fill">{{ $t('widget.week') }}</div>
        <div class="group compact">
          <label for="weeksLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.weeks.on" tag-id="weeksLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="weeksLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="weeksLabelText"
            v-model="widget.weeks.label"
            type="text"
            class="input w15"
            :disabled="!widget.weeks.on"
          />
        </div>
      </div>
      <div class="block">
        <div class="label fill">{{ $t('widget.day') }}</div>
        <div class="group compact">
          <label for="daysLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.days.on" tag-id="daysLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="daysLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="daysLabelText"
            v-model="widget.days.label"
            type="text"
            class="input w15"
            :disabled="!widget.days.on"
          />
        </div>
      </div>
      <div class="block">
        <div class="label fill">{{ $t('widget.hour') }}</div>
        <div class="group compact">
          <label for="hoursLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.hours.on" tag-id="hoursLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="hoursLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="hoursLabelText"
            v-model="widget.hours.label"
            type="text"
            class="input w15"
            :disabled="!widget.hours.on"
          />
        </div>
      </div>
      <div class="block">
        <div class="label fill">{{ $t('widget.minute') }}</div>
        <div class="group compact">
          <label for="minutesLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.minutes.on" tag-id="minutesLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="minutesLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="minutesLabelText"
            v-model="widget.minutes.label"
            type="text"
            class="input w15"
            :disabled="!widget.minutes.on"
          />
        </div>
      </div>
      <div class="block">
        <div class="label fill">{{ $t('widget.seconds') }}</div>
        <div class="group compact">
          <label for="secondsLabelEnable" class="desc">{{ $t('common.enable') }}</label>
          <ToggleField v-model="widget.seconds.on" tag-id="secondsLabelEnable" class=""></ToggleField>
        </div>
        <div v-if="widget.units.on" class="group compact">
          <label for="secondsLabelText" class="desc">{{ $t('widget.label') }}</label>
          <input
            id="secondsLabelText"
            v-model="widget.seconds.label"
            type="text"
            class="input w15"
            :disabled="!widget.seconds.on"
          />
        </div>
      </div>
    </div>
  </div>
</template>
