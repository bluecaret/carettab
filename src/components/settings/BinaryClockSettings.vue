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
    newClocks[newClocks.findIndex((c) => c.id === widget.id)].timezone = tz.id
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
        v-model:width="widget.base.width"
        v-model:height="widget.base.height"
        v-model:autoSize="widget.base.autoSize"
        v-model:align="widget.base.alignment"
        v-model:calign="widget.base.container.alignment"
        v-model:x="widget.base.x"
        v-model:y="widget.base.y"
      >
      </SizeAndPositionField>
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
          :selected="widget.timezone"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">Sizing</div>
          <div class="group compact">
            <label for="indicatorSize" class="desc">Indicator</label>
            <NumberField v-model="widget.indicator.size" :increment="5" :min="0" class="w10 mla" tag-id="indicatorSize">
            </NumberField>
          </div>
          <div class="group compact">
            <label for="clockSize" class="desc">Padding</label>
            <NumberField v-model="widget.indicator.padding" :increment="5" :min="0" class="w10 mla" tag-id="clockSize">
            </NumberField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Options</div>
        <div class="group compact mla">
          <label for="showSec" class="desc">Seconds</label>
          <ToggleField v-model="widget.indicator.seconds" tag-id="showSec"></ToggleField>
        </div>
        <div class="group compact">
          <label for="hideExtra" class="desc">Extras</label>
          <ToggleField v-model="widget.indicator.extras" tag-id="hideExtra"></ToggleField>
        </div>
        <div class="group compact">
          <label for="useDots" class="desc">Dots</label>
          <ToggleField v-model="widget.indicator.dot" tag-id="useDots"></ToggleField>
        </div>
        <div v-if="!widget.indicator.dot" class="group compact">
          <label for="dotOverride" class="desc">Indicators</label>
          <input
            v-model="widget.indicator.onLabel"
            type="text"
            class="input w4"
            maxlength="20"
            aria-label="On label"
            placeholder="on"
          />
          <input
            v-model="widget.indicator.offLabel"
            type="text"
            class="input w4"
            maxlength="20"
            aria-label="Off label"
            placeholder="off"
          />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">Colors</div>
          <div class="group compact">
            <label for="overrideColors" class="desc">Override colors</label>
            <ToggleField v-model="widget.indicator.overrideColors" tag-id="overrideColors"></ToggleField>
          </div>
        </div>
        <div v-if="widget.indicator.overrideColors" class="group fill">
          <div class="group fill stack">
            <label for="indShadow" class="desc">Shadow</label>
            <ColorField v-model="widget.indicator.shadow" shadow tag-id="indShadow"> </ColorField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Hour - on</label>
            <ColorField v-model="widget.indicator.hourOnColor" tag-id="onc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Hour - off</label>
            <ColorField v-model="widget.indicator.hourOffColor" tag-id="offc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Min. - on</label>
            <ColorField v-model="widget.indicator.minOnColor" tag-id="onc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Min. - off</label>
            <ColorField v-model="widget.indicator.minOffColor" tag-id="offc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="onc" class="desc">Sec. - on</label>
            <ColorField v-model="widget.indicator.secOnColor" tag-id="onc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="offc" class="desc">Sec. - off</label>
            <ColorField v-model="widget.indicator.secOffColor" tag-id="offc"></ColorField>
          </div>
        </div>
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
        <input id="labelText" v-model="widget.label.label" type="text" class="input w20 mla" />
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
    <h3 class="subtitle">Relative time</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label fill">
            <label for="enableRt">Enable relative time</label>
            <div class="desc">Shows the difference in time compared to your computer's time.</div>
          </div>
          <ToggleField v-model="widget.relative.on" tag-id="enableRt"></ToggleField>
        </div>
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
