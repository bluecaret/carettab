<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
// import * as locale from 'locale-codes'
import { useSettingsStore } from '@/store.js'
import WidgetSegmentFont from '@/components/forms/WidgetSegmentFont.vue'

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
  <PageHeading title="Digital clock" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.label') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableLabel" class="label">{{ $t('widget.enableLabel') }}</label>
            <ToggleField v-model="widget.label.on" tag-id="enableLabel" class="mla"></ToggleField>
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="labelText" class="label">{{ $t('widget.labelText') }}</label>
            <input id="labelText" v-model="widget.label.label" type="text" class="input mla w20" />
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
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.spacing') }}</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">
              <label for="monospace">{{ $t('widget.equalWidthDigits') }}</label>
              <div class="desc">
                {{ $t('widget.makeEachDigitWithinEqual') }}
              </div>
            </div>
            <ToggleField v-model="widget.monospace" tag-id="monospace"></ToggleField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="spaceBetween">{{ $t('widget.spacingBetweenDigitSegments') }}</label>
              <div class="desc">{{ $t('widget.theSpacingBetweenSegments') }}</div>
            </div>
            <NumberField v-model="widget.spaceBetween" class="w10" tag-id="spaceBetween"> </NumberField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.hour') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableHour" class="label mra">{{ $t('widget.enableHour') }}</label>
            <ToggleField v-model="widget.hour.on" tag-id="enableHour"></ToggleField>
          </div>
          <div v-if="widget.hour.on" class="block">
            <div class="label mra">
              <label for="twentyFour">24-hour</label>
              <div class="desc">{{ $t('widget.displaysHourIn24') }}</div>
            </div>
            <ToggleField v-model="widget.hour.twentyFour" tag-id="twentyFour"></ToggleField>
          </div>
          <div v-if="widget.hour.on" class="block">
            <div class="label mra">
              <label for="hourTwoDigit">{{ $t('widget.twoDigit') }}</label>
              <div class="desc">{{ $t('widget.willDisplayALeadingZero') }}</div>
            </div>
            <ToggleField v-model="widget.hour.twoDigit" tag-id="hourTwoDigit"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.hour.on"
            v-model:override="widget.hour.override"
            v-model:color="widget.hour.color"
            v-model:shadow="widget.hour.shadow"
            v-model:letterSpacing="widget.hour.letterSpacing"
            v-model:size="widget.hour.size"
            v-model:x="widget.hour.x"
            v-model:y="widget.hour.y"
            type="hour"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.minute') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableMin" class="label mra">{{ $t('widget.enableMinute') }}</label>
            <ToggleField v-model="widget.min.on" tag-id="enableMin"></ToggleField>
          </div>
          <div v-if="widget.min.on" class="block">
            <div class="label mra">
              <label for="minTwoDigit">{{ $t('widget.twoDigit') }}</label>
              <div class="desc">{{ $t('widget.willDisplayALeadingZero') }}</div>
            </div>
            <ToggleField v-model="widget.min.twoDigit" tag-id="minTwoDigit"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.min.on"
            v-model:override="widget.min.override"
            v-model:color="widget.min.color"
            v-model:shadow="widget.min.shadow"
            v-model:letterSpacing="widget.min.letterSpacing"
            v-model:size="widget.min.size"
            v-model:x="widget.min.x"
            v-model:y="widget.min.y"
            type="min"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.seconds') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableSec" class="label mra">{{ $t('widget.enableSecond') }}</label>
            <ToggleField v-model="widget.sec.on" tag-id="enableSec"></ToggleField>
          </div>
          <div v-if="widget.sec.on" class="block">
            <div class="label mra">
              <label for="secTwoDigit">{{ $t('widget.twoDigit') }}</label>
              <div class="desc">{{ $t('widget.willDisplayALeadingZero') }}</div>
            </div>
            <ToggleField v-model="widget.sec.twoDigit" tag-id="secTwoDigit"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.sec.on"
            v-model:override="widget.sec.override"
            v-model:color="widget.sec.color"
            v-model:shadow="widget.sec.shadow"
            v-model:letterSpacing="widget.sec.letterSpacing"
            v-model:size="widget.sec.size"
            v-model:x="widget.sec.x"
            v-model:y="widget.sec.y"
            type="sec"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.meridiem') }}</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">
              <label for="enableMeridiem">{{ $t('widget.enableMeridiem') }}</label>
              <div class="desc">{{ $t('widget.displaysAMOrPM') }}</div>
            </div>
            <ToggleField v-model="widget.meridiem.on" tag-id="enableMeridiem"></ToggleField>
          </div>
          <div v-if="widget.meridiem.on" class="block">
            <label for="" class="label mra">{{ $t('widget.meridiemLabels') }}</label>
            <div class="group compact">
              <label for="mdAm" class="desc">A.M.</label>
              <input id="mdAm" v-model="widget.meridiem.am" type="text" class="input w6" maxlength="20" />
            </div>
            <div class="group compact">
              <label for="mdPm" class="desc">P.M.</label>
              <input id="mdPm" v-model="widget.meridiem.pm" type="text" class="input w6" maxlength="20" />
            </div>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="ignoreForAlignment">{{ $t('widget.ignoreMeridiemForTextAlignment') }}</label>
              <div class="desc">
                {{ $t('widget.ignoreMeridiemForTextAlignmentDesc') }}
              </div>
            </div>
            <ToggleField v-model="widget.meridiem.ignoreForAlignment" tag-id="ignoreForAlignment"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.meridiem.on"
            v-model:override="widget.meridiem.override"
            v-model:color="widget.meridiem.color"
            v-model:shadow="widget.meridiem.shadow"
            v-model:letterSpacing="widget.meridiem.letterSpacing"
            v-model:size="widget.meridiem.size"
            v-model:x="widget.meridiem.x"
            v-model:y="widget.meridiem.y"
            type="meridiem"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.delimiter') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableDl" class="label mra">{{ $t('widget.enableDelimiter') }}</label>
            <ToggleField v-model="widget.delimiter.on" tag-id="enableDl"></ToggleField>
          </div>
          <div v-if="widget.delimiter.on" class="block">
            <label id="dlSymLabel" for="dlSym1" class="label mra">{{ $t('widget.symbol') }}</label>
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
              <label for="dlBlink">{{ $t('widget.blink') }}</label>
              <div class="desc">{{ $t('widget.everySecondTheDelimiterWillBlink') }}</div>
            </div>
            <ToggleField v-model="widget.delimiter.blink" tag-id="dlBlink"></ToggleField>
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
          <div class="label">{{ $t('widget.relativeTime') }}</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">
              <label for="enableRt">{{ $t('widget.enableRelativeTime') }}</label>
              <div class="desc">{{ $t('widget.showsTheDifferenceInTime') }}</div>
            </div>
            <ToggleField v-model="widget.relative.on" tag-id="enableRt"></ToggleField>
          </div>
          <WidgetSegmentFont
            v-if="widget.relative.on"
            v-model:override="widget.relative.override"
            v-model:color="widget.relative.color"
            v-model:shadow="widget.relative.shadow"
            v-model:letterSpacing="widget.relative.letterSpacing"
            v-model:size="widget.relative.size"
            v-model:x="widget.relative.x"
            v-model:y="widget.relative.y"
            type="relative"
            :widget="widget"
          >
          </WidgetSegmentFont>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>
