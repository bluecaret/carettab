<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'

const store = useSettingsStore()

const ci = ref(store.config.binaryClocks.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.binaryClocks[ci.value])

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
    newClocks[newClocks.findIndex((c) => c.id === widget.id)].tz = tz.id
    store.$patch({ config: { binaryClocks: newClocks } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Binary clock" :widget-id="widget.id"></PageHeading>
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
          :selected="widget.tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">Sizing</div>
          <div class="group compact">
            <label for="indicatorSize" class="desc">Indicator</label>
            <NumberField v-model="widget.ind.sz" :increment="5" :min="0" class="w10 mla" tag-id="indicatorSize">
            </NumberField>
          </div>
          <div class="group compact">
            <label for="clockSize" class="desc">Padding</label>
            <NumberField v-model="widget.ind.pd" :increment="5" :min="0" class="w10 mla" tag-id="clockSize">
            </NumberField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Options</div>
        <div class="group compact mla">
          <label for="showSec" class="desc">Seconds</label>
          <ToggleField v-model="widget.ind.ss" tag-id="showSec"></ToggleField>
        </div>
        <div class="group compact">
          <label for="hideExtra" class="desc">Extras</label>
          <ToggleField v-model="widget.ind.se" tag-id="hideExtra"></ToggleField>
        </div>
        <div class="group compact">
          <label for="useDots" class="desc">Dots</label>
          <ToggleField v-model="widget.ind.dot" tag-id="useDots"></ToggleField>
        </div>
        <div v-if="!widget.ind.dot" class="group compact">
          <label for="dotOverride" class="desc">Indicators</label>
          <input
            v-model="widget.ind.lbon"
            type="text"
            class="input w4"
            maxlength="20"
            aria-label="On label"
            placeholder="on"
          />
          <input
            v-model="widget.ind.lboff"
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
            <ColorField v-model="widget.ind.sh" shadow class="" tag-id="indShadow"> </ColorField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Hour - on</label>
            <ColorField v-model="widget.ind.hronc" tag-id="onc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Hour - off</label>
            <ColorField v-model="widget.ind.hroffc" tag-id="offc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Min. - on</label>
            <ColorField v-model="widget.ind.minonc" tag-id="onc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Min. - off</label>
            <ColorField v-model="widget.ind.minoffc" tag-id="offc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Sec. - on</label>
            <ColorField v-model="widget.ind.seconc" tag-id="onc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Sec. - off</label>
            <ColorField v-model="widget.ind.secoffc" tag-id="offc"></ColorField>
          </div>
        </div>
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
        <input id="labelText" v-model="widget.lb.lb" type="text" class="input w20 mla" />
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
    <h3 class="subtitle">Relative time</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label fill">
            <label for="enableRt">Enable relative time</label>
            <div class="desc">Shows the difference in time compared to your computer's time.</div>
          </div>
          <ToggleField v-model="widget.rt.on" tag-id="enableRt"></ToggleField>
        </div>
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
