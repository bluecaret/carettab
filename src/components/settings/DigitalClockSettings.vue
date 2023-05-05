<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'
// import * as locale from 'locale-codes'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const ci = ref(store.config.digitalClocks.findIndex((c) => c.id === store.editing))

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

const selectFont = (font) => {
  if (font) {
    let newClocks = [...store.config.digitalClocks]
    newClocks[newClocks.findIndex((c) => c.id === store.config.digitalClocks[ci.value].id)].w.ff = font
    store.$patch({ config: { digitalClocks: newClocks } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Digital clock" :widget-id="store.config.digitalClocks[ci].id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="store.config.digitalClocks[ci].w.w"
        v-model:height="store.config.digitalClocks[ci].w.h"
        v-model:autoSize="store.config.digitalClocks[ci].w.as"
        v-model:align="store.config.digitalClocks[ci].w.a"
        v-model:calign="store.config.digitalClocks[ci].w.ca"
        v-model:x="store.config.digitalClocks[ci].w.x"
        v-model:y="store.config.digitalClocks[ci].w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="store.config.digitalClocks[ci].w.orf"
        v-model:cl="store.config.digitalClocks[ci].w.cl"
        v-model:fs="store.config.digitalClocks[ci].w.fs"
        v-model:fb="store.config.digitalClocks[ci].w.fb"
        v-model:fi="store.config.digitalClocks[ci].w.fi"
        v-model:fu="store.config.digitalClocks[ci].w.fu"
        v-model:ls="store.config.digitalClocks[ci].w.ls"
        v-model:ts="store.config.digitalClocks[ci].w.ts"
        v-model:tt="store.config.digitalClocks[ci].w.tt"
        :ff="store.config.digitalClocks[ci].w.ff"
        @update:ff="selectFont($event)"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="store.config.digitalClocks[ci].w.cor"
        v-model:rounded="store.config.digitalClocks[ci].w.crd"
        v-model:bs="store.config.digitalClocks[ci].w.cbs"
        v-model:bc="store.config.digitalClocks[ci].w.cbc"
        v-model:bg="store.config.digitalClocks[ci].w.cbg"
        v-model:shadow="store.config.digitalClocks[ci].w.csh"
        v-model:padding="store.config.digitalClocks[ci].w.cpd"
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
          :selected="store.config.digitalClocks[ci].tz"
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
        <ToggleField v-model="store.config.digitalClocks[ci].ms" class="mla" tag-id="monospace"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spaceBetween">Spacing between digit segments</label>
          <div class="desc">The spacing between segments such as hour, minute and delimiters.</div>
        </div>
        <NumberField v-model="store.config.digitalClocks[ci].sb" class="mla w6" tag-id="spaceBetween"> </NumberField>
      </div>
    </div>
    <h3 class="subtitle">Label</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableLabel" class="label">Enable label</label>
        <ToggleField v-model="store.config.digitalClocks[ci].lb.on" tag-id="enableLabel" class="mla"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].lb.on" class="block">
        <label for="labelText" class="label">Label text</label>
        <input id="labelText" v-model="store.config.digitalClocks[ci].lb.lb" type="text" class="input mla w20" />
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].lb.on"
        v-model:override="store.config.digitalClocks[ci].lb.or"
        v-model:cl="store.config.digitalClocks[ci].lb.cl"
        v-model:ts="store.config.digitalClocks[ci].lb.ts"
        v-model:ls="store.config.digitalClocks[ci].lb.ls"
        v-model:fs="store.config.digitalClocks[ci].lb.fs"
        v-model:ox="store.config.digitalClocks[ci].lb.ox"
        v-model:oy="store.config.digitalClocks[ci].lb.oy"
        type="label"
        :clock="store.config.digitalClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Hour</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableHour" class="label mra">Enable hour</label>
        <ToggleField v-model="store.config.digitalClocks[ci].hr.on" tag-id="enableHour"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].hr.on" class="block">
        <div class="label mra">
          <label for="twentyFour">24-hour</label>
          <div class="desc">Displays hour in 24-hour format (military time).</div>
        </div>
        <ToggleField v-model="store.config.digitalClocks[ci].hr.tf" tag-id="twentyFour"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].hr.on" class="block">
        <div class="label mra">
          <label for="hourTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="store.config.digitalClocks[ci].hr.td" tag-id="hourTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].hr.on"
        v-model:override="store.config.digitalClocks[ci].hr.or"
        v-model:cl="store.config.digitalClocks[ci].hr.cl"
        v-model:ts="store.config.digitalClocks[ci].hr.ts"
        v-model:ls="store.config.digitalClocks[ci].hr.ls"
        v-model:fs="store.config.digitalClocks[ci].hr.fs"
        v-model:ox="store.config.digitalClocks[ci].hr.ox"
        v-model:oy="store.config.digitalClocks[ci].hr.oy"
        type="hour"
        :clock="store.config.digitalClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Minute</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableMin" class="label mra">Enable minute</label>
        <ToggleField v-model="store.config.digitalClocks[ci].min.on" tag-id="enableMin"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].min.on" class="block">
        <div class="label mra">
          <label for="minTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="store.config.digitalClocks[ci].min.td" tag-id="minTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].min.on"
        v-model:override="store.config.digitalClocks[ci].min.or"
        v-model:cl="store.config.digitalClocks[ci].min.cl"
        v-model:ts="store.config.digitalClocks[ci].min.ts"
        v-model:ls="store.config.digitalClocks[ci].min.ls"
        v-model:fs="store.config.digitalClocks[ci].min.fs"
        v-model:ox="store.config.digitalClocks[ci].min.ox"
        v-model:oy="store.config.digitalClocks[ci].min.oy"
        type="min"
        :clock="store.config.digitalClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Second</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableSec" class="label mra">Enable second</label>
        <ToggleField v-model="store.config.digitalClocks[ci].sec.on" tag-id="enableSec"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].sec.on" class="block">
        <div class="label mra">
          <label for="secTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="store.config.digitalClocks[ci].sec.td" tag-id="secTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].sec.on"
        v-model:override="store.config.digitalClocks[ci].sec.or"
        v-model:cl="store.config.digitalClocks[ci].sec.cl"
        v-model:ts="store.config.digitalClocks[ci].sec.ts"
        v-model:ls="store.config.digitalClocks[ci].sec.ls"
        v-model:fs="store.config.digitalClocks[ci].sec.fs"
        v-model:ox="store.config.digitalClocks[ci].sec.ox"
        v-model:oy="store.config.digitalClocks[ci].sec.oy"
        type="sec"
        :clock="store.config.digitalClocks[ci]"
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
        <ToggleField v-model="store.config.digitalClocks[ci].md.on" tag-id="enableMeridiem"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].md.on" class="block">
        <label for="" class="label mra">Meridiem labels</label>
        <div class="group compact">
          <label for="mdAm" class="desc">A.M.</label>
          <input id="mdAm" v-model="store.config.digitalClocks[ci].md.am" type="text" class="input w8" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="mdPm" class="desc">P.M.</label>
          <input id="mdPm" v-model="store.config.digitalClocks[ci].md.pm" type="text" class="input w8" maxlength="20" />
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].md.on"
        v-model:override="store.config.digitalClocks[ci].md.or"
        v-model:cl="store.config.digitalClocks[ci].md.cl"
        v-model:ts="store.config.digitalClocks[ci].md.ts"
        v-model:ls="store.config.digitalClocks[ci].md.ls"
        v-model:fs="store.config.digitalClocks[ci].md.fs"
        v-model:ox="store.config.digitalClocks[ci].md.ox"
        v-model:oy="store.config.digitalClocks[ci].md.oy"
        type="md"
        :clock="store.config.digitalClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Delimiter</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableDl" class="label mra">Enable delimiter</label>
        <ToggleField v-model="store.config.digitalClocks[ci].dl.on" tag-id="enableDl"></ToggleField>
      </div>
      <div v-if="store.config.digitalClocks[ci].dl.on" class="block">
        <label id="dlSymLabel" for="dlSym1" class="label mra">Symbol</label>
        <div class="group compact">
          <label for="dlSym1" class="desc">1st</label>
          <input
            id="dlSym1"
            v-model="store.config.digitalClocks[ci].dl.sym1"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
        <div class="group compact">
          <label for="dlSym2" class="desc">2nd</label>
          <input
            id="dlSym2"
            v-model="store.config.digitalClocks[ci].dl.sym2"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
        <div class="group compact">
          <label for="dlSym3" class="desc">3rd</label>
          <input
            id="dlSym3"
            v-model="store.config.digitalClocks[ci].dl.sym3"
            type="text"
            class="input w5"
            maxlength="20"
          />
        </div>
      </div>
      <div v-if="store.config.digitalClocks[ci].dl.on" class="block">
        <div class="label mra">
          <label for="dlBlink">Blink</label>
          <div class="desc">Every second the delimiter will blink similar to a some real digital clocks.</div>
        </div>
        <ToggleField v-model="store.config.digitalClocks[ci].dl.bl" tag-id="dlBlink"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].dl.on"
        v-model:override="store.config.digitalClocks[ci].dl.or"
        v-model:cl="store.config.digitalClocks[ci].dl.cl"
        v-model:ts="store.config.digitalClocks[ci].dl.ts"
        v-model:ls="store.config.digitalClocks[ci].dl.ls"
        v-model:fs="store.config.digitalClocks[ci].dl.fs"
        v-model:ox="store.config.digitalClocks[ci].dl.ox"
        v-model:oy="store.config.digitalClocks[ci].dl.oy"
        type="dl"
        :clock="store.config.digitalClocks[ci]"
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
        <ToggleField v-model="store.config.digitalClocks[ci].rt.on" tag-id="enableRt"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.digitalClocks[ci].rt.on"
        v-model:override="store.config.digitalClocks[ci].rt.or"
        v-model:cl="store.config.digitalClocks[ci].rt.cl"
        v-model:ts="store.config.digitalClocks[ci].rt.ts"
        v-model:ls="store.config.digitalClocks[ci].rt.ls"
        v-model:fs="store.config.digitalClocks[ci].rt.fs"
        v-model:ox="store.config.digitalClocks[ci].rt.ox"
        v-model:oy="store.config.digitalClocks[ci].rt.oy"
        type="rt"
        :clock="store.config.digitalClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
  </div>
</template>
