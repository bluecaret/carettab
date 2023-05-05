<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const ci = ref(store.config.dates.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.dates[ci.value])

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
    newDates[newDates.findIndex((c) => c.id === widget.id)].tz = tz.id
    store.$patch({ config: { dates: newDates } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Date" :widget-id="widget.id"></PageHeading>
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
          :selected="widget.tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="format" class="label mra">Format</label>
          <select id="format" v-model="widget.ft" name="format" class="select w25">
            <option value="little">Little-Endian (31 Jan. 2000)</option>
            <option value="middle">Middle-Endian (Jan. 31, 2000)</option>
            <option value="big">Big-Endian (2000 Jan. 31)</option>
          </select>
        </div>
      </div>
      <div class="block">
        <label for="shortDate" class="label mra">Short date</label>
        <ToggleField v-model="widget.sd" tag-id="shortDate"></ToggleField>
      </div>
    </div>
    <h3 class="subtitle">Delimiter</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableDl" class="label mra">Enable delimiter</label>
        <ToggleField v-model="widget.dl.on" tag-id="enableDl"></ToggleField>
      </div>
      <div v-if="widget.dl.on" class="block">
        <label id="dlSymLabel" for="dlSym1" class="label mra">Symbol</label>
        <div class="group compact">
          <label for="dlSym1" class="desc">1st</label>
          <input v-if="widget.sd" id="dlSym1" v-model="widget.dl.ss1" type="text" class="input w5" maxlength="20" />
          <input v-if="!widget.sd" id="dlSym1" v-model="widget.dl.ls1" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym2" class="desc">2nd</label>
          <input v-if="widget.sd" id="dlSym2" v-model="widget.dl.ss2" type="text" class="input w5" maxlength="20" />
          <input v-if="!widget.sd" id="dlSym2" v-model="widget.dl.ls2" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym3" class="desc">3rd</label>
          <input v-if="widget.sd" id="dlSym3" v-model="widget.dl.ss3" type="text" class="input w5" maxlength="20" />
          <input v-if="!widget.sd" id="dlSym3" v-model="widget.dl.ls3" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym4" class="desc">4th</label>
          <input v-if="widget.sd" id="dlSym4" v-model="widget.dl.ss4" type="text" class="input w5" maxlength="20" />
          <input v-if="!widget.sd" id="dlSym4" v-model="widget.dl.ls4" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym5" class="desc">5th</label>
          <input v-if="widget.sd" id="dlSym5" v-model="widget.dl.ss5" type="text" class="input w5" maxlength="20" />
          <input v-if="!widget.sd" id="dlSym5" v-model="widget.dl.ls5" type="text" class="input w5" maxlength="20" />
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.dl.on"
        v-model:override="widget.dl.or"
        v-model:cl="widget.dl.cl"
        v-model:ts="widget.dl.ts"
        v-model:ls="widget.dl.ls"
        v-model:fs="widget.dl.fs"
        v-model:ox="widget.dl.ox"
        v-model:oy="widget.dl.oy"
        type="dl"
        :clock="widget"
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
            <ToggleField v-model="widget.yr.on" tag-id="enableYear"></ToggleField>
          </div>
          <div v-if="widget.yr.on" class="group compact">
            <label for="yearTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.yr.td" tag-id="yearTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.yr.on"
        v-model:override="widget.yr.or"
        v-model:cl="widget.yr.cl"
        v-model:ts="widget.yr.ts"
        v-model:ls="widget.yr.ls"
        v-model:fs="widget.yr.fs"
        v-model:ox="widget.yr.ox"
        v-model:oy="widget.yr.oy"
        type="year"
        :clock="widget"
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
            <ToggleField v-model="widget.mh.on" tag-id="enableMonth"></ToggleField>
          </div>
          <div v-if="widget.mh.on && !widget.sd" class="group compact">
            <label for="monthAbbr" class="desc">Abbreviated</label>
            <ToggleField v-model="widget.mh.ab" tag-id="monthAbbr"></ToggleField>
          </div>
          <div v-if="widget.mh.on && widget.sd" class="group compact">
            <label for="monthTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.mh.td" tag-id="monthTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.mh.on"
        v-model:override="widget.mh.or"
        v-model:cl="widget.mh.cl"
        v-model:ts="widget.mh.ts"
        v-model:ls="widget.mh.ls"
        v-model:fs="widget.mh.fs"
        v-model:ox="widget.mh.ox"
        v-model:oy="widget.mh.oy"
        type="month"
        :clock="widget"
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
            <ToggleField v-model="widget.dy.on" tag-id="enableDay"></ToggleField>
          </div>
          <div v-if="widget.dy.on" class="group compact">
            <label for="dayTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.dy.td" tag-id="dayTwoDigit"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.dy.on"
        v-model:override="widget.dy.or"
        v-model:cl="widget.dy.cl"
        v-model:ts="widget.dy.ts"
        v-model:ls="widget.dy.ls"
        v-model:fs="widget.dy.fs"
        v-model:ox="widget.dy.ox"
        v-model:oy="widget.dy.oy"
        type="day"
        :clock="widget"
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
            <ToggleField v-model="widget.dow.on" tag-id="enableDow"></ToggleField>
          </div>
          <div v-if="widget.dow.on" class="group compact">
            <label for="dowAbbr" class="desc">Abbreviated</label>
            <ToggleField v-model="widget.dow.ab" tag-id="dowAbbr"></ToggleField>
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.dow.on"
        v-model:override="widget.dow.or"
        v-model:cl="widget.dow.cl"
        v-model:ts="widget.dow.ts"
        v-model:ls="widget.dow.ls"
        v-model:fs="widget.dow.fs"
        v-model:ox="widget.dow.ox"
        v-model:oy="widget.dow.oy"
        type="dow"
        :clock="widget"
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
            <ToggleField v-model="widget.doy.on" tag-id="enableDoy"></ToggleField>
          </div>
          <div v-if="widget.doy.on" class="group compact">
            <label for="doyTd" class="desc">Three digit</label>
            <ToggleField v-model="widget.doy.td" tag-id="doyTd"></ToggleField>
          </div>
        </div>
        <div v-if="widget.doy.on" class="group fill">
          <div class="group stack fill">
            <label for="doyPLabel" class="desc">Prefix label</label>
            <input v-model="widget.doy.lbp" maxlength="50" type="text" tag-id="doyPLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="doySLabel" class="desc">Suffix label</label>
            <input v-model="widget.doy.lbs" maxlength="50" type="text" tag-id="doySLabel" class="input" />
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.doy.on"
        v-model:override="widget.doy.or"
        v-model:cl="widget.doy.cl"
        v-model:ts="widget.doy.ts"
        v-model:ls="widget.doy.ls"
        v-model:fs="widget.doy.fs"
        v-model:ox="widget.doy.ox"
        v-model:oy="widget.doy.oy"
        type="doy"
        :clock="widget"
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
            <ToggleField v-model="widget.wk.on" tag-id="enableWeek"></ToggleField>
          </div>
          <div v-if="widget.wk.on" class="group compact">
            <label for="wkTwoDigit" class="desc">Two digit</label>
            <ToggleField v-model="widget.wk.td" tag-id="wkTwoDigit"></ToggleField>
          </div>
        </div>
        <div v-if="widget.wk.on" class="group fill">
          <div class="group stack fill">
            <label for="wkPLabel" class="desc">Prefix label</label>
            <input v-model="widget.wk.lbp" maxlength="50" type="text" tag-id="wkPLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="wkSLabel" class="desc">Suffix label</label>
            <input v-model="widget.wk.lbs" maxlength="50" type="text" tag-id="wkSLabel" class="input" />
          </div>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.wk.on"
        v-model:override="widget.wk.or"
        v-model:cl="widget.wk.cl"
        v-model:ts="widget.wk.ts"
        v-model:ls="widget.wk.ls"
        v-model:fs="widget.wk.fs"
        v-model:ox="widget.wk.ox"
        v-model:oy="widget.wk.oy"
        type="wk"
        :clock="widget"
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
            <ToggleField v-model="widget.qr.on" tag-id="enableQr"></ToggleField>
          </div>
        </div>
        <div v-if="widget.qr.on" class="group fill">
          <div class="group stack fill">
            <label for="qrPLabel" class="desc">Prefix label</label>
            <input v-model="widget.qr.lbp" maxlength="50" type="text" tag-id="qrPLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="qrSLabel" class="desc">Suffix label</label>
            <input v-model="widget.qr.lbs" maxlength="50" type="text" tag-id="qrSLabel" class="input" />
          </div>
          <div class="group stack fill">
            <label for="qrStart" class="desc">Start on</label>
            <select id="qrStart" v-model="widget.qr.st" name="qrStart" class="select">
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
        v-if="widget.qr.on"
        v-model:override="widget.qr.or"
        v-model:cl="widget.qr.cl"
        v-model:ts="widget.qr.ts"
        v-model:ls="widget.qr.ls"
        v-model:fs="widget.qr.fs"
        v-model:ox="widget.qr.ox"
        v-model:oy="widget.qr.oy"
        type="qr"
        :clock="widget"
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
        <ToggleField v-model="widget.rt.on" tag-id="enableRt"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.rt.on"
        v-model:override="widget.rt.or"
        v-model:cl="widget.rt.cl"
        v-model:ts="widget.rt.ts"
        v-model:ls="widget.rt.ls"
        v-model:fs="widget.rt.fs"
        v-model:ox="widget.rt.ox"
        v-model:oy="widget.rt.oy"
        type="rt"
        :clock="widget"
      >
      </DigitalClockSegmentFont>
    </div> -->
  </div>
</template>
