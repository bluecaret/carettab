<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
// import * as locale from 'locale-codes'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const ci = ref(store.config.digitalClocks.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.digitalClocks[ci.value])

// const allLocales = []
// for (const loc of locale.all) {
//   allLocales.push({ id: loc.tag, label: `${loc.name}${loc.location != null ? '/' + loc.location : ''} (${loc.tag})` })
// }

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}

const selectTimezone = (tz) => {
  if (tz) {
    let newClocks = [...store.config.digitalClocks]
    newClocks[newClocks.findIndex((c) => c.id === store.config.digitalClocks[ci.value].id)].tz = tz.id
    store.$patch({ config: { digitalClocks: newClocks } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Digital clock" :widget-id="widget.id"></PageHeading>
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
    <h3 class="subtitle">Clock options</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="label">
          <label for="clockTimezone">Timezone</label>
          <div class="desc">Enter a timezone name (e.g. "America/Los_Angeles").</div>
        </div>
        <AutocompleteField
          tag-id="clockTimezone"
          class="mla w20"
          :list="allTimezones"
          :selected="widget.tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <div class="label">
          <label for="monospace">Equal width digits</label>
          <div class="desc">
            Make each digit within the clock equal widths (e.g. "1" will be the same width as "9").
          </div>
        </div>
        <ToggleField v-model="widget.ms" class="mla" tag-id="monospace"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spaceBetween">Spacing between digit segments</label>
          <div class="desc">The spacing between segments such as hour, minute and delimiters.</div>
        </div>
        <NumberField v-model="widget.sb" class="mla w6" tag-id="spaceBetween"> </NumberField>
      </div>
    </div>
    <h3 class="subtitle">Label</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableLabel" class="label">Enable label</label>
        <ToggleField v-model="widget.lb.on" tag-id="enableLabel" class="mla"></ToggleField>
      </div>
      <div v-if="widget.lb.on" class="block">
        <label for="labelText" class="label">Label text</label>
        <input id="labelText" v-model="widget.lb.lb" type="text" class="input mla w20" />
      </div>
      <DigitalClockSegmentFont
        v-if="widget.lb.on"
        v-model:override="widget.lb.or"
        v-model:cl="widget.lb.cl"
        v-model:ts="widget.lb.ts"
        v-model:ls="widget.lb.ls"
        v-model:fs="widget.lb.fs"
        v-model:ox="widget.lb.ox"
        v-model:oy="widget.lb.oy"
        type="label"
        :clock="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Hour</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableHour" class="label mra">Enable hour</label>
        <ToggleField v-model="widget.hr.on" tag-id="enableHour"></ToggleField>
      </div>
      <div v-if="widget.hr.on" class="block">
        <div class="label mra">
          <label for="twentyFour">24-hour</label>
          <div class="desc">Displays hour in 24-hour format (military time).</div>
        </div>
        <ToggleField v-model="widget.hr.tf" tag-id="twentyFour"></ToggleField>
      </div>
      <div v-if="widget.hr.on" class="block">
        <div class="label mra">
          <label for="hourTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="widget.hr.td" tag-id="hourTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.hr.on"
        v-model:override="widget.hr.or"
        v-model:cl="widget.hr.cl"
        v-model:ts="widget.hr.ts"
        v-model:ls="widget.hr.ls"
        v-model:fs="widget.hr.fs"
        v-model:ox="widget.hr.ox"
        v-model:oy="widget.hr.oy"
        type="hour"
        :clock="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Minute</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableMin" class="label mra">Enable minute</label>
        <ToggleField v-model="widget.min.on" tag-id="enableMin"></ToggleField>
      </div>
      <div v-if="widget.min.on" class="block">
        <div class="label mra">
          <label for="minTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="widget.min.td" tag-id="minTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.min.on"
        v-model:override="widget.min.or"
        v-model:cl="widget.min.cl"
        v-model:ts="widget.min.ts"
        v-model:ls="widget.min.ls"
        v-model:fs="widget.min.fs"
        v-model:ox="widget.min.ox"
        v-model:oy="widget.min.oy"
        type="min"
        :clock="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Second</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableSec" class="label mra">Enable second</label>
        <ToggleField v-model="widget.sec.on" tag-id="enableSec"></ToggleField>
      </div>
      <div v-if="widget.sec.on" class="block">
        <div class="label mra">
          <label for="secTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="widget.sec.td" tag-id="secTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.sec.on"
        v-model:override="widget.sec.or"
        v-model:cl="widget.sec.cl"
        v-model:ts="widget.sec.ts"
        v-model:ls="widget.sec.ls"
        v-model:fs="widget.sec.fs"
        v-model:ox="widget.sec.ox"
        v-model:oy="widget.sec.oy"
        type="sec"
        :clock="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Meridiem</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="label mra">
          <label for="enableMeridiem">Enable meridiem</label>
          <div class="desc">Displays "a.m." or "p.m." if using 12-hour format.</div>
        </div>
        <ToggleField v-model="widget.md.on" tag-id="enableMeridiem"></ToggleField>
      </div>
      <div v-if="widget.md.on" class="block">
        <label for="" class="label mra">Meridiem labels</label>
        <div class="group compact">
          <label for="mdAm" class="desc">A.M.</label>
          <input id="mdAm" v-model="widget.md.am" type="text" class="input w8" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="mdPm" class="desc">P.M.</label>
          <input id="mdPm" v-model="widget.md.pm" type="text" class="input w8" maxlength="20" />
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.md.on"
        v-model:override="widget.md.or"
        v-model:cl="widget.md.cl"
        v-model:ts="widget.md.ts"
        v-model:ls="widget.md.ls"
        v-model:fs="widget.md.fs"
        v-model:ox="widget.md.ox"
        v-model:oy="widget.md.oy"
        type="md"
        :clock="widget"
      >
      </DigitalClockSegmentFont>
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
          <input id="dlSym1" v-model="widget.dl.sym1" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym2" class="desc">2nd</label>
          <input id="dlSym2" v-model="widget.dl.sym2" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym3" class="desc">3rd</label>
          <input id="dlSym3" v-model="widget.dl.sym3" type="text" class="input w5" maxlength="20" />
        </div>
      </div>
      <div v-if="widget.dl.on" class="block">
        <div class="label mra">
          <label for="dlBlink">Blink</label>
          <div class="desc">Every second the delimiter will blink similar to a some real digital clocks.</div>
        </div>
        <ToggleField v-model="widget.dl.bl" tag-id="dlBlink"></ToggleField>
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
    <h3 class="subtitle">Relative time</h3>
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
    </div>
  </div>
</template>
