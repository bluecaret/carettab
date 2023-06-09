<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

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
  <div class="page">
    <PageHeading title="Date" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField :index="ci" :widget-store="widgetStore" />
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
    </div>
    <h3 class="subtitle">Date options</h3>
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
        <div class="group fill">
          <label for="format" class="label mra">Format</label>
          <select id="format" v-model="widget.format" name="format" class="select w25">
            <option value="little">Little-Endian (31 Jan. 2000)</option>
            <option value="middle">Middle-Endian (Jan. 31, 2000)</option>
            <option value="big">Big-Endian (2000 Jan. 31)</option>
          </select>
        </div>
      </div>
      <div class="block">
        <label for="shortDate" class="label mra">Short date</label>
        <ToggleField v-model="widget.short" tag-id="shortDate"></ToggleField>
      </div>
    </div>
    <h3 class="subtitle">Delimiter</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableDl" class="label mra">Enable delimiter</label>
        <ToggleField v-model="widget.delimiter.on" tag-id="enableDl"></ToggleField>
      </div>
      <div v-if="widget.delimiter.on" class="block">
        <label id="dlSymLabel" for="dlSym1" class="label mra">Symbol</label>
        <div class="group compact">
          <label for="dlSym1" class="desc">1st</label>
          <input
            v-if="widget.short"
            id="dlSym1"
            v-model="widget.delimiter.shortSymbol1"
            type="text"
            class="input w5"
            maxlength="20"
          />
          <input
            v-if="!widget.short"
            id="dlSym1"
            v-model="widget.delimiter.longSymbol1"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
        <div class="group compact">
          <label for="dlSym2" class="desc">2nd</label>
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
        <div class="group compact">
          <label for="dlSym3" class="desc">3rd</label>
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
        <div class="group compact">
          <label for="dlSym4" class="desc">4th</label>
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
        <div class="group compact">
          <label for="dlSym5" class="desc">5th</label>
          <input
            v-if="widget.short"
            id="dlSym5"
            v-model="widget.delimiter.shortSymbol5"
            type="text"
            class="input w5"
            maxlength="20"
          />
          <input
            v-if="!widget.short"
            id="dlSym5"
            v-model="widget.delimiter.longSymbol5"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.delimiter.on"
        v-model:override="widget.delimiter.override"
        v-model:cl="widget.delimiter.color"
        v-model:ts="widget.delimiter.shadow"
        v-model:ls="widget.delimiter.letterSpacing"
        v-model:fs="widget.delimiter.size"
        v-model:x="widget.delimiter.x"
        v-model:y="widget.delimiter.y"
        type="delimiter"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Year</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Year</div>
          <div class="group compact">
            <label for="enableYear" class="desc">Enable</label>
            <ToggleField v-model="widget.year.on" tag-id="enableYear"></ToggleField>
          </div>
          <div v-if="widget.year.on" class="group compact">
            <label for="yearTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.year.twoDigit" tag-id="yearTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.year.on"
        v-model:override="widget.year.override"
        v-model:cl="widget.year.color"
        v-model:ts="widget.year.shadow"
        v-model:ls="widget.year.letterSpacing"
        v-model:fs="widget.year.size"
        v-model:x="widget.year.x"
        v-model:y="widget.year.y"
        type="year"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Month</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Month</div>
          <div class="group compact">
            <label for="enableMonth" class="desc">Enable</label>
            <ToggleField v-model="widget.month.on" tag-id="enableMonth"></ToggleField>
          </div>
          <div v-if="widget.month.on && !widget.short" class="group compact">
            <label for="monthAbbr" class="desc">Abbreviated</label>
            <ToggleField v-model="widget.month.abbreviated" tag-id="monthAbbr"></ToggleField>
          </div>
          <div v-if="widget.month.on && widget.short" class="group compact">
            <label for="monthTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.month.twoDigit" tag-id="monthTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.month.on"
        v-model:override="widget.month.override"
        v-model:cl="widget.month.color"
        v-model:ts="widget.month.shadow"
        v-model:ls="widget.month.letterSpacing"
        v-model:fs="widget.month.size"
        v-model:x="widget.month.x"
        v-model:y="widget.month.y"
        type="month"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Day</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Day</div>
          <div class="group compact">
            <label for="enableDay" class="desc">Enable</label>
            <ToggleField v-model="widget.day.on" tag-id="enableDay"></ToggleField>
          </div>
          <div v-if="widget.day.on" class="group compact">
            <label for="dayTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.day.twoDigit" tag-id="dayTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.day.on"
        v-model:override="widget.day.override"
        v-model:cl="widget.day.color"
        v-model:ts="widget.day.shadow"
        v-model:ls="widget.day.letterSpacing"
        v-model:fs="widget.day.size"
        v-model:x="widget.day.x"
        v-model:y="widget.day.y"
        type="day"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Day of week</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Day of week</div>
          <div class="group compact">
            <label for="enableDow" class="desc">Enable</label>
            <ToggleField v-model="widget.dayOfWeek.on" tag-id="enableDow"></ToggleField>
          </div>
          <div v-if="widget.dayOfWeek.on" class="group compact">
            <label for="dowAbbr" class="desc">Abbreviated</label>
            <ToggleField v-model="widget.dayOfWeek.abbreviated" tag-id="dowAbbr"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.dayOfWeek.on"
        v-model:override="widget.dayOfWeek.override"
        v-model:cl="widget.dayOfWeek.color"
        v-model:ts="widget.dayOfWeek.shadow"
        v-model:ls="widget.dayOfWeek.letterSpacing"
        v-model:fs="widget.dayOfWeek.size"
        v-model:x="widget.dayOfWeek.x"
        v-model:y="widget.dayOfWeek.y"
        type="dayOfWeek"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Day of year</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Day of year</div>
          <div class="group compact">
            <label for="enableDoy" class="desc">Enable</label>
            <ToggleField v-model="widget.dayOfYear.on" tag-id="enableDoy"></ToggleField>
          </div>
          <div v-if="widget.dayOfYear.on" class="group compact">
            <label for="doyTd" class="desc">Three digit</label>
            <ToggleField v-model="widget.dayOfYear.threeDigit" tag-id="doyTd"></ToggleField>
          </div>
        </div>
        <div v-if="widget.dayOfYear.on" class="group fill">
          <div class="group stack fill">
            <label for="doyPLabel" class="desc">Prefix label</label>
            <input v-model="widget.dayOfYear.prefixLabel" maxlength="50" type="text" tag-id="doyPLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="doySLabel" class="desc">Suffix label</label>
            <input v-model="widget.dayOfYear.suffixLabel" maxlength="50" type="text" tag-id="doySLabel" class="input" />
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.dayOfYear.on"
        v-model:override="widget.dayOfYear.override"
        v-model:cl="widget.dayOfYear.color"
        v-model:ts="widget.dayOfYear.shadow"
        v-model:ls="widget.dayOfYear.letterSpacing"
        v-model:fs="widget.dayOfYear.size"
        v-model:x="widget.dayOfYear.x"
        v-model:y="widget.dayOfYear.y"
        type="dayOfYear"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Week number</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Week number (ISO standard)</div>
          <div class="group compact">
            <label for="enableWeek" class="desc">Enable</label>
            <ToggleField v-model="widget.week.on" tag-id="enableWeek"></ToggleField>
          </div>
          <div v-if="widget.week.on" class="group compact">
            <label for="wkTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.week.twoDigit" tag-id="wkTwoDigit"></ToggleField>
          </div>
        </div>
        <div v-if="widget.week.on" class="group fill">
          <div class="group stack fill">
            <label for="wkPLabel" class="desc">Prefix label</label>
            <input v-model="widget.week.prefixLabel" maxlength="50" type="text" tag-id="wkPLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="wkSLabel" class="desc">Suffix label</label>
            <input v-model="widget.week.suffixLabel" maxlength="50" type="text" tag-id="wkSLabel" class="input" />
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.week.on"
        v-model:override="widget.week.override"
        v-model:cl="widget.week.color"
        v-model:ts="widget.week.shadow"
        v-model:ls="widget.week.letterSpacing"
        v-model:fs="widget.week.size"
        v-model:x="widget.week.x"
        v-model:y="widget.week.y"
        type="week"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Quarter</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Quarter</div>
          <div class="group compact">
            <label for="enableQr" class="desc">Enable</label>
            <ToggleField v-model="widget.quarter.on" tag-id="enableQr"></ToggleField>
          </div>
        </div>
        <div v-if="widget.quarter.on" class="group fill">
          <div class="group stack fill">
            <label for="qrPLabel" class="desc">Prefix label</label>
            <input v-model="widget.quarter.prefixLabel" maxlength="50" type="text" tag-id="qrPLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="qrSLabel" class="desc">Suffix label</label>
            <input v-model="widget.quarter.suffixLabel" maxlength="50" type="text" tag-id="qrSLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="qrStart" class="desc">Start on</label>
            <select id="qrStart" v-model="widget.quarter.start" name="qrStart" class="select">
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
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.quarter.on"
        v-model:override="widget.quarter.override"
        v-model:cl="widget.quarter.color"
        v-model:ts="widget.quarter.shadow"
        v-model:ls="widget.quarter.letterSpacing"
        v-model:fs="widget.quarter.size"
        v-model:x="widget.quarter.x"
        v-model:y="widget.quarter.y"
        type="quarter"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <!-- <h3 class="subtitle">Relative time</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="label mra">
          <label for="enableRt">Enable relative time</label>
          <div class="desc">Shows the difference in time compared to your computer's time.</div>
        </div>
        <ToggleField v-model="widget.relative.on" tag-id="enableRt"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.relative.on"
        v-model:override="widget.relative.override"
        v-model:cl="widget.relative.color"
        v-model:ts="widget.relative.shadow"
        v-model:ls="widget.relative.letterSpacing"
        v-model:fs="widget.relative.size"
        v-model:x="widget.relative.x"
        v-model:y="widget.relative.y"
        type="relative"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div> -->
  </div>
</template>
