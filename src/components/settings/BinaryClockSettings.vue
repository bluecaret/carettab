<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const ci = ref(store.config.binaryClocks.findIndex((c) => c.id === store.editing))

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}

const selectTimezone = (tz) => {
  if (tz) {
    let newClocks = [...store.config.binaryClocks]
    newClocks[newClocks.findIndex((c) => c.id === store.config.binaryClocks[ci.value].id)].tz = tz.id
    store.$patch({ config: { binaryClocks: newClocks } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Binary clock" :widget-id="store.config.binaryClocks[ci].id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="store.config.binaryClocks[ci].w.w"
        v-model:height="store.config.binaryClocks[ci].w.h"
        v-model:autoSize="store.config.binaryClocks[ci].w.as"
        v-model:align="store.config.binaryClocks[ci].w.a"
        v-model:calign="store.config.binaryClocks[ci].w.ca"
        v-model:x="store.config.binaryClocks[ci].w.x"
        v-model:y="store.config.binaryClocks[ci].w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="store.config.binaryClocks[ci].w.orf"
        v-model:cl="store.config.binaryClocks[ci].w.cl"
        v-model:fs="store.config.binaryClocks[ci].w.fs"
        v-model:fb="store.config.binaryClocks[ci].w.fb"
        v-model:fi="store.config.binaryClocks[ci].w.fi"
        v-model:fu="store.config.binaryClocks[ci].w.fu"
        v-model:ls="store.config.binaryClocks[ci].w.ls"
        v-model:ts="store.config.binaryClocks[ci].w.ts"
        v-model:tt="store.config.binaryClocks[ci].w.tt"
        v-model:ff="store.config.binaryClocks[ci].w.ff"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="store.config.binaryClocks[ci].w.cor"
        v-model:rounded="store.config.binaryClocks[ci].w.crd"
        v-model:bs="store.config.binaryClocks[ci].w.cbs"
        v-model:bc="store.config.binaryClocks[ci].w.cbc"
        v-model:bg="store.config.binaryClocks[ci].w.cbg"
        v-model:shadow="store.config.binaryClocks[ci].w.csh"
        v-model:padding="store.config.binaryClocks[ci].w.cpd"
      >
      </WidgetBoxField>
    </div>
    <h3 class="subtitle">Clock and indicator options</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="label">
          <label for="clockTimezone">Timezone</label>
          <div class="desc">Enter a timezone name (e.g. "America/Los_Angeles").</div>
        </div>
        <AutocompleteField
          tag-id="clockTimezone"
          class="mla w23"
          :list="allTimezones"
          :selected="store.config.binaryClocks[ci].tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">Sizing</div>
          <div class="group compact">
            <label for="indicatorSize" class="desc">Indicator</label>
            <NumberField
              v-model="store.config.binaryClocks[ci].ind.sz"
              :increment="5"
              :min="0"
              class="w10 mla"
              tag-id="indicatorSize"
            >
            </NumberField>
          </div>
          <div class="group compact">
            <label for="clockSize" class="desc">Padding</label>
            <NumberField
              v-model="store.config.binaryClocks[ci].ind.pd"
              :increment="5"
              :min="0"
              class="w10 mla"
              tag-id="clockSize"
            >
            </NumberField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Options</div>
        <div class="group compact mla">
          <label for="showSec" class="desc">Seconds</label>
          <ToggleField v-model="store.config.binaryClocks[ci].ind.ss" tag-id="showSec"></ToggleField>
        </div>
        <div class="group compact">
          <label for="hideExtra" class="desc">Extras</label>
          <ToggleField v-model="store.config.binaryClocks[ci].ind.se" tag-id="hideExtra"></ToggleField>
        </div>
        <div class="group compact">
          <label for="useDots" class="desc">Dots</label>
          <ToggleField v-model="store.config.binaryClocks[ci].ind.dot" tag-id="useDots"></ToggleField>
        </div>
        <div v-if="!store.config.binaryClocks[ci].ind.dot" class="group compact">
          <label for="dotOverride" class="desc">Indicators</label>
          <input
            v-model="store.config.binaryClocks[ci].ind.lbon"
            type="text"
            class="input w4"
            maxlength="20"
            aria-label="On label"
            placeholder="on"
          />
          <input
            v-model="store.config.binaryClocks[ci].ind.lboff"
            type="text"
            class="input w4"
            maxlength="20"
            aria-label="Off label"
            placeholder="off"
          />
        </div>
      </div>
      <div class="block">
        <div class="label mra">Colors</div>
        <div class="group fill">
          <div class="group fill stack">
            <label for="indShadow" class="desc">Shadow</label>
            <ShadowField v-model="store.config.binaryClocks[ci].ind.sh" class="" tag-id="indShadow"> </ShadowField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Hour - on</label>
            <ColorPickerField v-model="store.config.binaryClocks[ci].ind.hronc" tag-id="onc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Hour - off</label>
            <ColorPickerField v-model="store.config.binaryClocks[ci].ind.hroffc" tag-id="offc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Min. - on</label>
            <ColorPickerField v-model="store.config.binaryClocks[ci].ind.minonc" tag-id="onc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Min. - off</label>
            <ColorPickerField v-model="store.config.binaryClocks[ci].ind.minoffc" tag-id="offc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Sec. - on</label>
            <ColorPickerField v-model="store.config.binaryClocks[ci].ind.seconc" tag-id="onc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Sec. - off</label>
            <ColorPickerField v-model="store.config.binaryClocks[ci].ind.secoffc" tag-id="offc"></ColorPickerField>
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Label</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableLabel" class="label">Enable label</label>
        <ToggleField v-model="store.config.binaryClocks[ci].lb.on" tag-id="enableLabel" class="mla"></ToggleField>
      </div>
      <div v-if="store.config.binaryClocks[ci].lb.on" class="block">
        <label for="labelText" class="label">Label text</label>
        <input id="labelText" v-model="store.config.binaryClocks[ci].lb.lb" type="text" class="input w20 mla" />
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.binaryClocks[ci].lb.on"
        v-model:override="store.config.binaryClocks[ci].lb.or"
        v-model:cl="store.config.binaryClocks[ci].lb.cl"
        v-model:ts="store.config.binaryClocks[ci].lb.ts"
        v-model:ls="store.config.binaryClocks[ci].lb.ls"
        v-model:fs="store.config.binaryClocks[ci].lb.fs"
        v-model:ox="store.config.binaryClocks[ci].lb.ox"
        v-model:oy="store.config.binaryClocks[ci].lb.oy"
        type="label"
        :clock="store.config.binaryClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
    <h3 class="subtitle">Relative time</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label fill">
            <label for="enableRt">Enable relative time</label>
            <div class="desc">Shows the difference in time compared to your computer's time.</div>
          </div>
          <ToggleField v-model="store.config.binaryClocks[ci].rt.on" tag-id="enableRt"></ToggleField>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.binaryClocks[ci].rt.on"
        v-model:override="store.config.binaryClocks[ci].rt.or"
        v-model:cl="store.config.binaryClocks[ci].rt.cl"
        v-model:ts="store.config.binaryClocks[ci].rt.ts"
        v-model:ls="store.config.binaryClocks[ci].rt.ls"
        v-model:fs="store.config.binaryClocks[ci].rt.fs"
        v-model:ox="store.config.binaryClocks[ci].rt.ox"
        v-model:oy="store.config.binaryClocks[ci].rt.oy"
        type="rt"
        :clock="store.config.binaryClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
  </div>
</template>
