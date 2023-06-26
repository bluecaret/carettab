<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import WidgetSegmentFont from '@/components/forms/WidgetSegmentFont.vue'

const store = useSettingsStore()

const widgetStore = 'dates'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}

const selectTimezone = (tz) => {
  if (tz) {
    let newDates = [...store.config.dates]
    newDates[newDates.findIndex((c) => c.id === widget.id)].timezone = tz.id
    store.$patch({ config: { dates: newDates } })
  }
}
</script>

<template>
  <PageHeading title="Date" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <div class="label">
          <label for="dateTimezone">Timezone</label>
          <div class="desc">Enter a timezone name (e.g. "America/Los_Angeles").</div>
        </div>
        <AutocompleteField
          tag-id="dateTimezone"
          class="mla w20"
          :list="allTimezones"
          :selected="widget.timezone"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <label for="format" class="label mra">Format</label>
        <select id="format" v-model="widget.format" name="format" class="select w24">
          <option value="little">Little-Endian (31 Jan. 2000)</option>
          <option value="middle">Middle-Endian (Jan. 31, 2000)</option>
          <option value="big">Big-Endian (2000 Jan. 31)</option>
        </select>
      </div>
      <div class="block">
        <label for="shortDate" class="label mra">Short date (e.g. 01/01/2020)</label>
        <ToggleField v-model="widget.short" tag-id="shortDate"></ToggleField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">Delimiter</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableDl" class="label mra">Enable delimiter</label>
            <ToggleField v-model="widget.delimiter.on" tag-id="enableDl"></ToggleField>
          </div>
          <div v-if="widget.delimiter.on" class="block">
            <div class="label mra">
              <div>Prefix/Suffix labels</div>
              <div class="desc">Add text to the start or end of the date.</div>
            </div>
            <div class="group stack">
              <div class="group compact mla">
                <label for="dlSym1" class="desc">Prefix</label>
                <input
                  v-if="widget.short"
                  id="dlSym1"
                  v-model="widget.delimiter.shortSymbol1"
                  type="text"
                  class="input w10"
                  maxlength="20"
                />
                <input
                  v-if="!widget.short"
                  id="dlSym1"
                  v-model="widget.delimiter.longSymbol1"
                  type="text"
                  class="input w10"
                  maxlength="20"
                />
              </div>
              <div class="group compact mla">
                <label for="dlSym5" class="desc">Suffix</label>
                <input
                  v-if="widget.short"
                  id="dlSym5"
                  v-model="widget.delimiter.shortSymbol5"
                  type="text"
                  class="input w10"
                  maxlength="20"
                />
                <input
                  v-if="!widget.short"
                  id="dlSym5"
                  v-model="widget.delimiter.longSymbol5"
                  type="text"
                  class="input w10"
                  maxlength="20"
                />
              </div>
            </div>
          </div>
          <div v-if="widget.delimiter.on" class="block">
            <div class="label fill">
              <div>Delimiter symbols</div>
              <div class="desc">Symbols that appear between parts of the date such as spaces and commas.</div>
            </div>
            <div class="group stack">
              <div class="group compact mla">
                <label for="dlSym2" class="desc fit">Symbol #1</label>
                <input
                  v-if="widget.short"
                  id="dlSym2"
                  v-model="widget.delimiter.shortSymbol2"
                  type="text"
                  class="input w5"
                  maxlength="20"
                />
                <input
                  v-if="!widget.short"
                  id="dlSym2"
                  v-model="widget.delimiter.longSymbol2"
                  type="text"
                  class="input w5"
                  maxlength="20"
                />
              </div>
              <div class="group compact mla">
                <label for="dlSym3" class="desc fit">Symbol #2</label>
                <input
                  v-if="widget.short"
                  id="dlSym3"
                  v-model="widget.delimiter.shortSymbol3"
                  type="text"
                  class="input w5"
                  maxlength="20"
                />
                <input
                  v-if="!widget.short"
                  id="dlSym3"
                  v-model="widget.delimiter.longSymbol3"
                  type="text"
                  class="input w5"
                  maxlength="20"
                />
              </div>
              <div class="group compact mla">
                <label for="dlSym4" class="desc fit">Symbol #3</label>
                <input
                  v-if="widget.short"
                  id="dlSym4"
                  v-model="widget.delimiter.shortSymbol4"
                  type="text"
                  class="input w5"
                  maxlength="20"
                />
                <input
                  v-if="!widget.short"
                  id="dlSym4"
                  v-model="widget.delimiter.longSymbol4"
                  type="text"
                  class="input w5"
                  maxlength="20"
                />
              </div>
            </div>
          </div>
          <WidgetSegmentFont
            v-if="widget.delimiter.on"
            v-model:override="widget.delimiter.override"
            v-model:color="widget.delimiter.color"
            v-model:shadow="widget.delimiter.shadow"
            v-model:letterSpacing="widget.delimiter.letterSpacing"
            v-model:size="widget.delimiter.size"
            v-model:x="widget.delimiter.x"
            v-model:y="widget.delimiter.y"
            type="delimiter"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Year</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableYear" class="label mra">Enable year</label>
            <ToggleField v-model="widget.year.on" tag-id="enableYear"></ToggleField>
          </div>
          <div v-if="widget.year.on" class="block">
            <label for="yearTwoDigit" class="label mra">Two digit</label>
            <ToggleField v-model="widget.year.twoDigit" tag-id="yearTwoDigit"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.year.on"
            v-model:override="widget.year.override"
            v-model:color="widget.year.color"
            v-model:shadow="widget.year.shadow"
            v-model:letterSpacing="widget.year.letterSpacing"
            v-model:size="widget.year.size"
            v-model:x="widget.year.x"
            v-model:y="widget.year.y"
            type="year"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Month</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableMonth" class="label mra">Enable month</label>
            <ToggleField v-model="widget.month.on" tag-id="enableMonth"></ToggleField>
          </div>
          <div v-if="widget.month.on && !widget.short" class="block">
            <label for="monthAbbr" class="label mra">Abbreviate month name</label>
            <ToggleField v-model="widget.month.abbreviated" tag-id="monthAbbr"></ToggleField>
          </div>
          <div v-if="widget.month.on && widget.short" class="block">
            <label for="monthTwoDigit" class="label mra">Two digit</label>
            <ToggleField v-model="widget.month.twoDigit" tag-id="monthTwoDigit"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.month.on"
            v-model:override="widget.month.override"
            v-model:color="widget.month.color"
            v-model:shadow="widget.month.shadow"
            v-model:letterSpacing="widget.month.letterSpacing"
            v-model:size="widget.month.size"
            v-model:x="widget.month.x"
            v-model:y="widget.month.y"
            type="month"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Day</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableDay" class="label mra">Enable day</label>
            <ToggleField v-model="widget.day.on" tag-id="enableDay"></ToggleField>
          </div>
          <div v-if="widget.day.on" class="block">
            <label for="dayTwoDigit" class="label mra">Two digit</label>
            <ToggleField v-model="widget.day.twoDigit" tag-id="dayTwoDigit"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.day.on"
            v-model:override="widget.day.override"
            v-model:color="widget.day.color"
            v-model:shadow="widget.day.shadow"
            v-model:letterSpacing="widget.day.letterSpacing"
            v-model:size="widget.day.size"
            v-model:x="widget.day.x"
            v-model:y="widget.day.y"
            type="day"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Day of week</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableDow" class="label mra">Enable day of week</label>
            <ToggleField v-model="widget.dayOfWeek.on" tag-id="enableDow"></ToggleField>
          </div>
          <div v-if="widget.dayOfWeek.on" class="block">
            <label for="dowAbbr" class="label mra">Abbreviate day name</label>
            <ToggleField v-model="widget.dayOfWeek.abbreviated" tag-id="dowAbbr"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.dayOfWeek.on"
            v-model:override="widget.dayOfWeek.override"
            v-model:color="widget.dayOfWeek.color"
            v-model:shadow="widget.dayOfWeek.shadow"
            v-model:letterSpacing="widget.dayOfWeek.letterSpacing"
            v-model:size="widget.dayOfWeek.size"
            v-model:x="widget.dayOfWeek.x"
            v-model:y="widget.dayOfWeek.y"
            type="dayOfWeek"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Day of year</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableDoy" class="label mra">Enable day of year</label>
            <ToggleField v-model="widget.dayOfYear.on" tag-id="enableDoy"></ToggleField>
          </div>
          <div v-if="widget.dayOfYear.on" class="block">
            <label for="doyTd" class="label mra">Three digit</label>
            <ToggleField v-model="widget.dayOfYear.threeDigit" tag-id="doyTd"></ToggleField>
          </div>
          <div v-if="widget.dayOfYear.on" class="block">
            <label for="doyPLabel" class="label mra">Prefix label</label>
            <input
              v-model="widget.dayOfYear.prefixLabel"
              maxlength="50"
              type="text"
              tag-id="doyPLabel"
              class="input w20"
            />
          </div>
          <div v-if="widget.dayOfYear.on" class="block">
            <label for="doySLabel" class="label mra">Suffix label</label>
            <input
              v-model="widget.dayOfYear.suffixLabel"
              maxlength="50"
              type="text"
              tag-id="doySLabel"
              class="input w20"
            />
          </div>
          <WidgetSegmentFont
            v-if="widget.dayOfYear.on"
            v-model:override="widget.dayOfYear.override"
            v-model:color="widget.dayOfYear.color"
            v-model:shadow="widget.dayOfYear.shadow"
            v-model:letterSpacing="widget.dayOfYear.letterSpacing"
            v-model:size="widget.dayOfYear.size"
            v-model:x="widget.dayOfYear.x"
            v-model:y="widget.dayOfYear.y"
            type="dayOfYear"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Week number</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableWeek" class="label mra">Enable week number (ISO standard)</label>
            <ToggleField v-model="widget.week.on" tag-id="enableWeek"></ToggleField>
          </div>
          <div v-if="widget.week.on" class="block">
            <label for="wkTwoDigit" class="label mra">Two digit</label>
            <ToggleField v-model="widget.week.twoDigit" tag-id="wkTwoDigit"></ToggleField>
          </div>
          <div v-if="widget.week.on" class="block">
            <label for="wkPLabel" class="label mra">Prefix label</label>
            <input v-model="widget.week.prefixLabel" maxlength="50" type="text" tag-id="wkPLabel" class="input w20" />
          </div>
          <div v-if="widget.week.on" class="block">
            <label for="wkSLabel" class="label mra">Suffix label</label>
            <input v-model="widget.week.suffixLabel" maxlength="50" type="text" tag-id="wkSLabel" class="input w20" />
          </div>
          <WidgetSegmentFont
            v-if="widget.week.on"
            v-model:override="widget.week.override"
            v-model:color="widget.week.color"
            v-model:shadow="widget.week.shadow"
            v-model:letterSpacing="widget.week.letterSpacing"
            v-model:size="widget.week.size"
            v-model:x="widget.week.x"
            v-model:y="widget.week.y"
            type="week"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Quarter</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableQr" class="label mra">Enable quarter</label>
            <ToggleField v-model="widget.quarter.on" tag-id="enableQr"></ToggleField>
          </div>
          <div v-if="widget.quarter.on" class="block">
            <label for="qrPLabel" class="label mra">Prefix label</label>
            <input
              v-model="widget.quarter.prefixLabel"
              maxlength="50"
              type="text"
              tag-id="qrPLabel"
              class="input w20"
            />
          </div>
          <div v-if="widget.quarter.on" class="block">
            <label for="qrSLabel" class="label mra">Suffix label</label>
            <input
              v-model="widget.quarter.suffixLabel"
              maxlength="50"
              type="text"
              tag-id="qrSLabel"
              class="input w20"
            />
          </div>
          <div v-if="widget.quarter.on" class="block">
            <label for="qrStart" class="label mra">Start on</label>
            <select id="qrStart" v-model="widget.quarter.start" name="qrStart" class="select w20">
              <option value="0">1 - January</option>
              <option value="1">2 - February</option>
              <option value="2">3 - March</option>
              <option value="3">4 - April</option>
              <option value="4">5 - May</option>
              <option value="5">6 - June</option>
              <option value="6">7 - July</option>
              <option value="7">8 - August</option>
              <option value="8">9 - September</option>
              <option value="9">10 - October</option>
              <option value="10">11 - November</option>
              <option value="11">12 - December</option>
            </select>
          </div>
          <WidgetSegmentFont
            v-if="widget.quarter.on"
            v-model:override="widget.quarter.override"
            v-model:color="widget.quarter.color"
            v-model:shadow="widget.quarter.shadow"
            v-model:letterSpacing="widget.quarter.letterSpacing"
            v-model:size="widget.quarter.size"
            v-model:x="widget.quarter.x"
            v-model:y="widget.quarter.y"
            type="quarter"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>
