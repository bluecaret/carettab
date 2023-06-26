<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import WidgetSegmentFont from '@/components/forms/WidgetSegmentFont.vue'

const store = useSettingsStore()

const widgetStore = 'binaryClocks'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

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
    let newClocks = [...store.config[widgetStore]]
    newClocks[newClocks.findIndex((c) => c.id === widget.id)].timezone = tz.id
    store.$patch({ config: { [widgetStore]: newClocks } })
  }
}
</script>

<template>
  <PageHeading title="Binary clock" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <FieldAccordion>
        <template #label>
          <div class="label">Label</div>
        </template>
        <template #children>
          <div class="block">
            <label for="enableLabel" class="label mra">Enable label</label>
            <ToggleField v-model="widget.label.on" tag-id="enableLabel"></ToggleField>
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="labelText" class="label mra">Label text</label>
            <input id="labelText" v-model="widget.label.label" type="text" class="input w20" />
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
          <label for="clockTimezone">Timezone</label>
          <div class="desc">Enter a timezone name (e.g. "America/Los_Angeles").</div>
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
          <div class="label">Indicators</div>
        </template>
        <template #children>
          <div class="block">
            <label for="indicatorSize" class="label mra">Indicator size</label>
            <NumberField v-model="widget.indicator.size" :increment="5" :min="0" class="w10" tag-id="indicatorSize">
            </NumberField>
          </div>
          <div class="block">
            <label for="clockSize" class="label mra">Padding</label>
            <NumberField v-model="widget.indicator.padding" :increment="5" :min="0" class="w10" tag-id="clockSize">
            </NumberField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="useDots">Dots</label>
              <div class="desc">Shows dots to represent on/off state. Disable to use text (e.g. 1's and 0's).</div>
            </div>
            <ToggleField v-model="widget.indicator.dot" tag-id="useDots"></ToggleField>
          </div>
          <div v-if="!widget.indicator.dot" class="block">
            <div class="label mra">Indicator labels</div>
            <div class="group compact">
              <label for="onLabel" class="desc">On</label>
              <input
                v-model="widget.indicator.onLabel"
                type="text"
                class="input w6"
                maxlength="20"
                tag-id="onLabel"
                placeholder="on"
              />
            </div>
            <div class="group compact">
              <label for="offLabel" class="desc">Off</label>
              <input
                v-model="widget.indicator.offLabel"
                type="text"
                class="input w6"
                maxlength="20"
                tag-id="offLabel"
                placeholder="off"
              />
            </div>
          </div>
          <div class="block">
            <label for="showSec" class="label mra">Show seconds</label>
            <ToggleField v-model="widget.indicator.seconds" tag-id="showSec"></ToggleField>
          </div>
          <div class="block">
            <div class="label mra">
              <label for="hideExtra">Show extra indicators</label>
              <div class="desc">Displays unused indicators to create a complete grid.</div>
            </div>
            <ToggleField v-model="widget.indicator.extras" tag-id="hideExtra"></ToggleField>
          </div>

          <div class="block">
            <label for="overrideColors" class="label mra">Override colors</label>
            <ToggleField v-model="widget.indicator.overrideColors" tag-id="overrideColors"></ToggleField>
          </div>
          <template v-if="widget.indicator.overrideColors">
            <div class="block">
              <label for="onc" class="label mra">Hour - on</label>
              <ColorField v-model="widget.indicator.hourOnColor" tag-id="onc" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="offc" class="label mra">Hour - off</label>
              <ColorField v-model="widget.indicator.hourOffColor" tag-id="offc" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="onc" class="label mra">Minute - on</label>
              <ColorField v-model="widget.indicator.minOnColor" tag-id="onc" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="offc" class="label mra">Minute - off</label>
              <ColorField v-model="widget.indicator.minOffColor" tag-id="offc" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="onc" class="label mra">Seconds - on</label>
              <ColorField v-model="widget.indicator.secOnColor" tag-id="onc" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="offc" class="label mra">Seconds - off</label>
              <ColorField v-model="widget.indicator.secOffColor" tag-id="offc" class="w20"></ColorField>
            </div>
            <div class="block">
              <label for="indShadow" class="label mra">Shadow</label>
              <ColorField v-model="widget.indicator.shadow" shadow tag-id="indShadow" class="w20"> </ColorField>
            </div>
          </template>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">Relative time</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">
              <label for="enableRt">Enable relative time</label>
              <div class="desc">Shows the difference in time compared to your computer's time.</div>
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
