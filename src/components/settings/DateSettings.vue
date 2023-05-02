<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const ci = ref(store.config.dates.findIndex((c) => c.id === store.editing))

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
    newDates[newDates.findIndex((c) => c.id === store.config.dates[ci.value].id)].tz = tz.id
    store.$patch({ config: { dates: newDates } })
  }
}

const selectFont = (font) => {
  if (font) {
    let newDates = [...store.config.dates]
    newDates[newDates.findIndex((c) => c.id === store.config.dates[ci.value].id)].w.ff = font
    store.$patch({ config: { dates: newDates } })
  }
}
</script>

<template>
  <div class="page">
    <h2 class="title">
      <button
        class="back"
        aria-label="Go back to previous page"
        title="Go back to previous page"
        @click="store.goTo('dashboard')"
      >
        <fa icon="fa-circle-left" fixed-width></fa>
      </button>
      Date <span style="font-size: 0.7em; opacity: 0.7">({{ store.config.dates[ci].id }})</span>
    </h2>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="store.config.dates[ci].w.w"
        v-model:height="store.config.dates[ci].w.h"
        v-model:autoSize="store.config.dates[ci].w.as"
        v-model:align="store.config.dates[ci].w.a"
        v-model:calign="store.config.dates[ci].w.ca"
        v-model:x="store.config.dates[ci].w.x"
        v-model:y="store.config.dates[ci].w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="store.config.dates[ci].w.orf"
        v-model:cl="store.config.dates[ci].w.cl"
        v-model:fs="store.config.dates[ci].w.fs"
        v-model:fb="store.config.dates[ci].w.fb"
        v-model:fi="store.config.dates[ci].w.fi"
        v-model:fu="store.config.dates[ci].w.fu"
        v-model:ls="store.config.dates[ci].w.ls"
        v-model:ts="store.config.dates[ci].w.ts"
        v-model:tt="store.config.dates[ci].w.tt"
        :ff="store.config.dates[ci].w.ff"
        @update:ff="selectFont($event)"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="store.config.dates[ci].w.cor"
        v-model:rounded="store.config.dates[ci].w.crd"
        v-model:bs="store.config.dates[ci].w.cbs"
        v-model:bc="store.config.dates[ci].w.cbc"
        v-model:bg="store.config.dates[ci].w.cbg"
        v-model:shadow="store.config.dates[ci].w.csh"
        v-model:padding="store.config.dates[ci].w.cpd"
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
          :selected="store.config.dates[ci].tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="format" class="label mra">Format</label>
          <select id="format" v-model="store.config.dates[ci].ft" name="format" class="select w25">
            <option value="little">Little-Endian (31 Jan. 2000)</option>
            <option value="middle">Middle-Endian (Jan. 31, 2000)</option>
            <option value="big">Big-Endian (2000 Jan. 31)</option>
          </select>
        </div>
      </div>
      <div class="block">
        <label for="shortDate" class="label mra">Short date</label>
        <ToggleField v-model="store.config.dates[ci].sd" tag-id="shortDate"></ToggleField>
      </div>
    </div>
    <h3 class="subtitle">Delimiter</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableDl" class="label mra">Enable delimiter</label>
        <ToggleField v-model="store.config.dates[ci].dl.on" tag-id="enableDl"></ToggleField>
      </div>
      <div v-if="store.config.dates[ci].dl.on" class="block">
        <label id="dlSymLabel" for="dlSym1" class="label mra">Symbol</label>
        <div class="group compact">
          <label for="dlSym1" class="desc">1st</label>
          <input
            v-if="store.config.dates[ci].sd"
            id="dlSym1"
            v-model="store.config.dates[ci].dl.ss1"
            type="text"
            class="input w5"
            maxlength="20"
          />
          <input
            v-if="!store.config.dates[ci].sd"
            id="dlSym1"
            v-model="store.config.dates[ci].dl.ls1"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
        <div class="group compact">
          <label for="dlSym2" class="desc">2nd</label>
          <input
            v-if="store.config.dates[ci].sd"
            id="dlSym2"
            v-model="store.config.dates[ci].dl.ss2"
            type="text"
            class="input w5"
            maxlength="20"
          />
          <input
            v-if="!store.config.dates[ci].sd"
            id="dlSym2"
            v-model="store.config.dates[ci].dl.ls2"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
        <div class="group compact">
          <label for="dlSym3" class="desc">3rd</label>
          <input
            v-if="store.config.dates[ci].sd"
            id="dlSym3"
            v-model="store.config.dates[ci].dl.ss3"
            type="text"
            class="input w5"
            maxlength="20"
          />
          <input
            v-if="!store.config.dates[ci].sd"
            id="dlSym3"
            v-model="store.config.dates[ci].dl.ls3"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].dl.on"
        v-model:override="store.config.dates[ci].dl.or"
        v-model:cl="store.config.dates[ci].dl.cl"
        v-model:ts="store.config.dates[ci].dl.ts"
        v-model:ls="store.config.dates[ci].dl.ls"
        v-model:fs="store.config.dates[ci].dl.fs"
        v-model:ox="store.config.dates[ci].dl.ox"
        v-model:oy="store.config.dates[ci].dl.oy"
        type="dl"
        :clock="store.config.dates[ci]"
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
            <ToggleField v-model="store.config.dates[ci].yr.on" tag-id="enableYear"></ToggleField>
          </div>
          <div v-if="store.config.dates[ci].yr.on" class="group compact">
            <label for="yearTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="store.config.dates[ci].yr.td" tag-id="yearTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].yr.on"
        v-model:override="store.config.dates[ci].yr.or"
        v-model:cl="store.config.dates[ci].yr.cl"
        v-model:ts="store.config.dates[ci].yr.ts"
        v-model:ls="store.config.dates[ci].yr.ls"
        v-model:fs="store.config.dates[ci].yr.fs"
        v-model:ox="store.config.dates[ci].yr.ox"
        v-model:oy="store.config.dates[ci].yr.oy"
        type="year"
        :clock="store.config.dates[ci]"
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
            <ToggleField v-model="store.config.dates[ci].mh.on" tag-id="enableMonth"></ToggleField>
          </div>
          <div v-if="store.config.dates[ci].mh.on && !store.config.dates[ci].sd" class="group compact">
            <label for="monthAbbr" class="desc">Abbreviated</label>
            <ToggleField v-model="store.config.dates[ci].mh.ab" tag-id="monthAbbr"></ToggleField>
          </div>
          <div v-if="store.config.dates[ci].mh.on && store.config.dates[ci].sd" class="group compact">
            <label for="monthTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="store.config.dates[ci].mh.td" tag-id="monthTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].mh.on"
        v-model:override="store.config.dates[ci].mh.or"
        v-model:cl="store.config.dates[ci].mh.cl"
        v-model:ts="store.config.dates[ci].mh.ts"
        v-model:ls="store.config.dates[ci].mh.ls"
        v-model:fs="store.config.dates[ci].mh.fs"
        v-model:ox="store.config.dates[ci].mh.ox"
        v-model:oy="store.config.dates[ci].mh.oy"
        type="month"
        :clock="store.config.dates[ci]"
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
            <ToggleField v-model="store.config.dates[ci].dy.on" tag-id="enableDay"></ToggleField>
          </div>
          <div v-if="store.config.dates[ci].dy.on" class="group compact">
            <label for="dayTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="store.config.dates[ci].dy.td" tag-id="dayTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].dy.on"
        v-model:override="store.config.dates[ci].dy.or"
        v-model:cl="store.config.dates[ci].dy.cl"
        v-model:ts="store.config.dates[ci].dy.ts"
        v-model:ls="store.config.dates[ci].dy.ls"
        v-model:fs="store.config.dates[ci].dy.fs"
        v-model:ox="store.config.dates[ci].dy.ox"
        v-model:oy="store.config.dates[ci].dy.oy"
        type="day"
        :clock="store.config.dates[ci]"
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
            <ToggleField v-model="store.config.dates[ci].dow.on" tag-id="enableDow"></ToggleField>
          </div>
          <div v-if="store.config.dates[ci].dow.on" class="group compact">
            <label for="dowAbbr" class="desc">Abbreviated</label>
            <ToggleField v-model="store.config.dates[ci].dow.ab" tag-id="dowAbbr"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].dow.on"
        v-model:override="store.config.dates[ci].dow.or"
        v-model:cl="store.config.dates[ci].dow.cl"
        v-model:ts="store.config.dates[ci].dow.ts"
        v-model:ls="store.config.dates[ci].dow.ls"
        v-model:fs="store.config.dates[ci].dow.fs"
        v-model:ox="store.config.dates[ci].dow.ox"
        v-model:oy="store.config.dates[ci].dow.oy"
        type="dow"
        :clock="store.config.dates[ci]"
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
            <ToggleField v-model="store.config.dates[ci].doy.on" tag-id="enableDoy"></ToggleField>
          </div>
        </div>
        <div v-if="store.config.dates[ci].doy.on" class="group fill">
          <div class="group stack fill">
            <label for="doyLabel" class="desc">Label</label>
            <input v-model="store.config.dates[ci].doy.lb" maxlength="50" type="text" tag-id="doyLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="doyFormat" class="desc">Format</label>
            <select id="doyFormat" v-model="store.config.dates[ci].doy.ft" name="doyFormat" class="select">
              <option value="DDD">1 2...364 365</option>
              <option value="DDDo">1st 2nd...364th 365th</option>
              <option value="DDDD">001 002...364 365</option>
            </select>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].doy.on"
        v-model:override="store.config.dates[ci].doy.or"
        v-model:cl="store.config.dates[ci].doy.cl"
        v-model:ts="store.config.dates[ci].doy.ts"
        v-model:ls="store.config.dates[ci].doy.ls"
        v-model:fs="store.config.dates[ci].doy.fs"
        v-model:ox="store.config.dates[ci].doy.ox"
        v-model:oy="store.config.dates[ci].doy.oy"
        type="doy"
        :clock="store.config.dates[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Week number</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Week</div>
          <div class="group compact">
            <label for="enableWeek" class="desc">Enable</label>
            <ToggleField v-model="store.config.dates[ci].wk.on" tag-id="enableWeek"></ToggleField>
          </div>
        </div>
        <div v-if="store.config.dates[ci].wk.on" class="group fill">
          <div class="group stack fill">
            <label for="wkLabel" class="desc">Label</label>
            <input v-model="store.config.dates[ci].wk.lb" maxlength="50" type="text" tag-id="wkLabel" class="input" />
          </div>
          <div class="group stack">
            <label for="enableIso" class="desc fit">ISO 8601 standard</label>
            <ToggleField v-model="store.config.dates[ci].wk.iso" tag-id="enableIso"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].wk.on"
        v-model:override="store.config.dates[ci].wk.or"
        v-model:cl="store.config.dates[ci].wk.cl"
        v-model:ts="store.config.dates[ci].wk.ts"
        v-model:ls="store.config.dates[ci].wk.ls"
        v-model:fs="store.config.dates[ci].wk.fs"
        v-model:ox="store.config.dates[ci].wk.ox"
        v-model:oy="store.config.dates[ci].wk.oy"
        type="wk"
        :clock="store.config.dates[ci]"
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
            <ToggleField v-model="store.config.dates[ci].qr.on" tag-id="enableQr"></ToggleField>
          </div>
        </div>
        <div v-if="store.config.dates[ci].qr.on" class="group fill">
          <div class="group stack fill">
            <label for="qrLabel" class="desc">Label</label>
            <input v-model="store.config.dates[ci].qr.lb" maxlength="50" type="text" tag-id="qrLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="qrFormat" class="desc">Format</label>
            <select id="qrFormat" v-model="store.config.dates[ci].qr.ft" name="qrFormat" class="select">
              <option value="Q">1 2 3 4</option>
              <option value="Qo">1st 2nd 3rd 4th</option>
            </select>
          </div>
          <div class="group stack fill">
            <label for="qrStart" class="desc">Start on</label>
            <select id="qrStart" v-model="store.config.dates[ci].qr.st" name="qrStart" class="select">
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
        v-if="store.config.dates[ci].qr.on"
        v-model:override="store.config.dates[ci].qr.or"
        v-model:cl="store.config.dates[ci].qr.cl"
        v-model:ts="store.config.dates[ci].qr.ts"
        v-model:ls="store.config.dates[ci].qr.ls"
        v-model:fs="store.config.dates[ci].qr.fs"
        v-model:ox="store.config.dates[ci].qr.ox"
        v-model:oy="store.config.dates[ci].qr.oy"
        type="qr"
        :clock="store.config.dates[ci]"
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
        <ToggleField v-model="store.config.dates[ci].rt.on" tag-id="enableRt"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.dates[ci].rt.on"
        v-model:override="store.config.dates[ci].rt.or"
        v-model:cl="store.config.dates[ci].rt.cl"
        v-model:ts="store.config.dates[ci].rt.ts"
        v-model:ls="store.config.dates[ci].rt.ls"
        v-model:fs="store.config.dates[ci].rt.fs"
        v-model:ox="store.config.dates[ci].rt.ox"
        v-model:oy="store.config.dates[ci].rt.oy"
        type="rt"
        :clock="store.config.dates[ci]"
      >
      </DigitalClockSegmentFont>
    </div> -->
  </div>
</template>
