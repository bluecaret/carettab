<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import WidgetSegmentFont from '@/components/forms/WidgetSegmentFont.vue'

const store = useSettingsStore()

const widgetStore = 'countdowns'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}
allTimezones.unshift({ id: 'local', label: 'Local' })
</script>

<template>
  <PageHeading title="Countdown" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <div class="label mra">
          <label for="clockTimezone">Countdown to date</label>
        </div>
        <input v-model="widget.target" type="datetime-local" class="input w25" />
      </div>
      <div class="block">
        <div class="label mra">
          <label for="clockTimezone">{{ $t('widget.timezone') }}</label>
          <div class="desc">{{ $t('widget.enterATimezoneName') }}</div>
        </div>
        <AutocompleteField
          tag-id="clockTimezone"
          class="w20"
          :list="allTimezones"
          :selected="widget.timezone"
          @selected="
            (tz) => {
              widget.timezone = tz.id
            }
          "
        ></AutocompleteField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">Countdown label</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableLabel" class="label">Enable countdown label</label>
            <ToggleField v-model="widget.label.on" tag-id="enableLabel" class="mla"></ToggleField>
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="labelText" class="label">{{ $t('widget.labelText') }}</label>
            <input id="labelText" v-model="widget.label.label" type="text" class="input mla w20" />
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="labelPosition" class="label">Position</label>
            <select v-model="widget.label.position" tag-id="labelPosition" class="select mla w20">
              <option value="inline">Inline</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
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
          <div class="label">Unit label</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableLabel" class="label">Enable unit label</label>
            <ToggleField v-model="widget.units.on" tag-id="enableUnitLabel" class="mla"></ToggleField>
          </div>
          <div v-if="widget.units.on" class="block">
            <label for="unitPosition" class="label">Position</label>
            <select v-model="widget.units.position" tag-id="unitPosition" class="select mla w20">
              <option value="inline">Inline</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
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
              <label for="equalWidth">Equal width units</label>
              <div class="desc">Make each unit equal width (e.g. "years" will be the same width as "seconds").</div>
            </div>
            <ToggleField v-model="widget.equalWidth" tag-id="equalWidth"></ToggleField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="monospace">{{ $t('widget.equalWidthDigits') }}</label>
              <div class="desc">Make each number equal widths (e.g. "1" will be the same width as "9").</div>
            </div>
            <ToggleField v-model="widget.monospace" tag-id="monospace"></ToggleField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="spaceBetween">Spacing between units</label>
            </div>
            <NumberField v-model="widget.spaceBetween" :increment="0.1" class="w10" tag-id="spaceBetween">
            </NumberField>
          </div>
        </template>
      </FieldAccordion>
      <div class="block">
        <div class="label fill">Years</div>
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
        <div class="label fill">Months</div>
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
        <div class="label fill">Weeks</div>
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
        <div class="label fill">Days</div>
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
        <div class="label fill">Hours</div>
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
        <div class="label fill">Minutes</div>
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
        <div class="label fill">Seconds</div>
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
