<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
// import * as locale from 'locale-codes'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const widgetStore = 'digitalClocks'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

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
allTimezones.unshift({ id: 'local', label: 'Local' })

const selectTimezone = (tz) => {
  if (tz) {
    let newClocks = [...store.config.digitalClocks]
    newClocks[newClocks.findIndex((c) => c.id === store.config.digitalClocks[ci.value].id)].timezone = tz.id
    store.$patch({ config: { digitalClocks: newClocks } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Digital clock" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
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
          :selected="widget.timezone"
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
        <ToggleField v-model="widget.monospace" class="mla" tag-id="monospace"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spaceBetween">Spacing between digit segments</label>
          <div class="desc">The spacing between segments such as hour, minute and delimiters.</div>
        </div>
        <NumberField v-model="widget.spaceBetween" class="mla w6" tag-id="spaceBetween"> </NumberField>
      </div>
    </div>
    <h3 class="subtitle">Label</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableLabel" class="label">Enable label</label>
        <ToggleField v-model="widget.label.on" tag-id="enableLabel" class="mla"></ToggleField>
      </div>
      <div v-if="widget.label.on" class="block">
        <label for="labelText" class="label">Label text</label>
        <input id="labelText" v-model="widget.label.label" type="text" class="input mla w20" />
      </div>
      <DigitalClockSegmentFont
        v-if="widget.label.on"
        v-model:override="widget.label.override"
        v-model:cl="widget.label.color"
        v-model:ts="widget.label.shadow"
        v-model:ls="widget.label.letterSpacing"
        v-model:fs="widget.label.size"
        v-model:x="widget.label.x"
        v-model:y="widget.label.y"
        type="label"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Hour</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableHour" class="label mra">Enable hour</label>
        <ToggleField v-model="widget.hour.on" tag-id="enableHour"></ToggleField>
      </div>
      <div v-if="widget.hour.on" class="block">
        <div class="label mra">
          <label for="twentyFour">24-hour</label>
          <div class="desc">Displays hour in 24-hour format (military time).</div>
        </div>
        <ToggleField v-model="widget.hour.twentyFour" tag-id="twentyFour"></ToggleField>
      </div>
      <div v-if="widget.hour.on" class="block">
        <div class="label mra">
          <label for="hourTwoDigit">Two digit</label>
          <div class="desc">Will display a leading zero if number is less than 10.</div>
        </div>
        <ToggleField v-model="widget.hour.twoDigit" tag-id="hourTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.hour.on"
        v-model:override="widget.hour.override"
        v-model:cl="widget.hour.color"
        v-model:ts="widget.hour.shadow"
        v-model:ls="widget.hour.letterSpacing"
        v-model:fs="widget.hour.size"
        v-model:x="widget.hour.x"
        v-model:y="widget.hour.y"
        type="hour"
        :widget="widget"
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
        <ToggleField v-model="widget.min.twoDigit" tag-id="minTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.min.on"
        v-model:override="widget.min.override"
        v-model:cl="widget.min.color"
        v-model:ts="widget.min.shadow"
        v-model:ls="widget.min.letterSpacing"
        v-model:fs="widget.min.size"
        v-model:x="widget.min.x"
        v-model:y="widget.min.y"
        type="min"
        :widget="widget"
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
        <ToggleField v-model="widget.sec.twoDigit" tag-id="secTwoDigit"></ToggleField>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.sec.on"
        v-model:override="widget.sec.override"
        v-model:cl="widget.sec.color"
        v-model:ts="widget.sec.shadow"
        v-model:ls="widget.sec.letterSpacing"
        v-model:fs="widget.sec.size"
        v-model:x="widget.sec.x"
        v-model:y="widget.sec.y"
        type="sec"
        :widget="widget"
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
        <ToggleField v-model="widget.meridiem.on" tag-id="enableMeridiem"></ToggleField>
      </div>
      <div v-if="widget.meridiem.on" class="block">
        <label for="" class="label mra">Meridiem labels</label>
        <div class="group compact">
          <label for="mdAm" class="desc">A.M.</label>
          <input id="mdAm" v-model="widget.meridiem.am" type="text" class="input w8" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="mdPm" class="desc">P.M.</label>
          <input id="mdPm" v-model="widget.meridiem.pm" type="text" class="input w8" maxlength="20" />
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="widget.meridiem.on"
        v-model:override="widget.meridiem.override"
        v-model:cl="widget.meridiem.color"
        v-model:ts="widget.meridiem.shadow"
        v-model:ls="widget.meridiem.letterSpacing"
        v-model:fs="widget.meridiem.size"
        v-model:x="widget.meridiem.x"
        v-model:y="widget.meridiem.y"
        type="meridiem"
        :widget="widget"
      >
      </DigitalClockSegmentFont>
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
          <input id="dlSym1" v-model="widget.delimiter.symbol1" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym2" class="desc">2nd</label>
          <input id="dlSym2" v-model="widget.delimiter.symbol2" type="text" class="input w5" maxlength="20" />
        </div>
        <div class="group compact">
          <label for="dlSym3" class="desc">3rd</label>
          <input id="dlSym3" v-model="widget.delimiter.symbol3" type="text" class="input w5" maxlength="20" />
        </div>
      </div>
      <div v-if="widget.delimiter.on" class="block">
        <div class="label mra">
          <label for="dlBlink">Blink</label>
          <div class="desc">Every second the delimiter will blink similar to a some real digital clocks.</div>
        </div>
        <ToggleField v-model="widget.delimiter.blink" tag-id="dlBlink"></ToggleField>
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
    <h3 class="subtitle">Relative time</h3>
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
    </div>
  </div>
</template>
