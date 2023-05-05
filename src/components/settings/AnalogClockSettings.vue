<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'
import { analogFaceStyles, analogHandStyles } from '@/assets/lists.js'

const store = useSettingsStore()

const ci = ref(store.config.analogClocks.findIndex((c) => c.id === store.editing))

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}

const selectTimezone = (tz) => {
  if (tz) {
    let newClocks = [...store.config.analogClocks]
    newClocks[newClocks.findIndex((c) => c.id === store.config.analogClocks[ci.value].id)].tz = tz.id
    store.$patch({ config: { analogClocks: newClocks } })
  }
}

const resetFaceColors = () => {
  store.config.analogClocks[ci.value].face.sh = store.config.analogClocks[ci.value].w.ts
  store.config.analogClocks[ci.value].face.bc = store.config.analogClocks[ci.value].w.cl
  store.config.analogClocks[ci.value].face.qmc = store.config.analogClocks[ci.value].w.cl
  store.config.analogClocks[ci.value].face.hmc = store.config.analogClocks[ci.value].w.cl
  store.config.analogClocks[ci.value].face.mmc = store.config.analogClocks[ci.value].w.cl
}

const resetHandColors = () => {
  store.config.analogClocks[ci.value].hand.sh = store.config.analogClocks[ci.value].w.ts
  store.config.analogClocks[ci.value].hr.cl = store.config.analogClocks[ci.value].w.cl
  store.config.analogClocks[ci.value].min.cl = store.config.analogClocks[ci.value].w.cl
  store.config.analogClocks[ci.value].sec.cl = store.config.analogClocks[ci.value].w.cl
  store.config.analogClocks[ci.value].cr.cl = store.config.analogClocks[ci.value].w.cl
}

const updateClockParts = () => {
  resetFaceColors()
  resetHandColors()
}
</script>

<template>
  <div class="page">
    <PageHeading title="Analog clock" :widget-id="store.config.analogClocks[ci].id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="store.config.analogClocks[ci].w.w"
        v-model:height="store.config.analogClocks[ci].w.h"
        v-model:autoSize="store.config.analogClocks[ci].w.as"
        v-model:align="store.config.analogClocks[ci].w.a"
        v-model:calign="store.config.analogClocks[ci].w.ca"
        v-model:x="store.config.analogClocks[ci].w.x"
        v-model:y="store.config.analogClocks[ci].w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="store.config.analogClocks[ci].w.orf"
        v-model:cl="store.config.analogClocks[ci].w.cl"
        v-model:fs="store.config.analogClocks[ci].w.fs"
        v-model:fb="store.config.analogClocks[ci].w.fb"
        v-model:fi="store.config.analogClocks[ci].w.fi"
        v-model:fu="store.config.analogClocks[ci].w.fu"
        v-model:ls="store.config.analogClocks[ci].w.ls"
        v-model:ts="store.config.analogClocks[ci].w.ts"
        v-model:tt="store.config.analogClocks[ci].w.tt"
        v-model:ff="store.config.analogClocks[ci].w.ff"
        @update:cl="updateClockParts"
        @update:ts="updateClockParts"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="store.config.analogClocks[ci].w.cor"
        v-model:rounded="store.config.analogClocks[ci].w.crd"
        v-model:bs="store.config.analogClocks[ci].w.cbs"
        v-model:bc="store.config.analogClocks[ci].w.cbc"
        v-model:bg="store.config.analogClocks[ci].w.cbg"
        v-model:shadow="store.config.analogClocks[ci].w.csh"
        v-model:padding="store.config.analogClocks[ci].w.cpd"
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
          class="mla w23"
          :list="allTimezones"
          :selected="store.config.analogClocks[ci].tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <label for="clockSize" class="label">Clock size</label>
        <NumberField v-model="store.config.analogClocks[ci].sz" :increment="10" class="w10 mla" tag-id="clockSize">
        </NumberField>
      </div>
      <div class="block">
        <div class="label">Clock face</div>
        <div class="group compact mla">
          <label for="hourOverride" class="desc">Override colors</label>
          <ToggleField
            v-model="store.config.analogClocks[ci].face.or"
            tag-id="hourOverride"
            @update:model-value="resetFaceColors"
          ></ToggleField>
        </div>
        <div class="group stack">
          <label for="faceStyle" class="desc">Style</label>
          <select id="faceStyle" v-model="store.config.analogClocks[ci].face.st" name="faceStyle" class="select w16">
            <option
              v-for="st in analogFaceStyles"
              :key="st.id"
              :selected="st.id === store.config.analogClocks[ci].face.st"
              :value="st.id"
            >
              {{ st.label }}
            </option>
          </select>
        </div>
        <div class="group stack">
          <label for="faceBorderSize" class="desc">Border size</label>
          <NumberField v-model="store.config.analogClocks[ci].face.bs" class="w8" tag-id="faceBorderSize">
          </NumberField>
        </div>
        <div v-if="store.config.analogClocks[ci].face.or" class="group fill">
          <div class="group fill stack">
            <label for="faceShadow" class="desc">Shadow</label>
            <ShadowField v-model="store.config.analogClocks[ci].face.sh" class="" tag-id="faceShadow"> </ShadowField>
          </div>
          <div class="group fill stack">
            <label for="faceBorderColor" class="desc">Border color</label>
            <ColorPickerField
              v-model="store.config.analogClocks[ci].face.bc"
              tag-id="faceBorderColor"
            ></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="qmc" class="desc">Quarter mark</label>
            <ColorPickerField v-model="store.config.analogClocks[ci].face.qmc" tag-id="qmc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="hmc" class="desc">Hour mark</label>
            <ColorPickerField v-model="store.config.analogClocks[ci].face.hmc" tag-id="hmc"></ColorPickerField>
          </div>
          <div class="group fill stack">
            <label for="mmc" class="desc">Minute mark</label>
            <ColorPickerField v-model="store.config.analogClocks[ci].face.mmc" tag-id="mmc"></ColorPickerField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="label">Clock hands</div>
        <div class="group compact mla">
          <label for="hourOverride" class="desc">Override colors</label>
          <ToggleField
            v-model="store.config.analogClocks[ci].hand.or"
            tag-id="hourOverride"
            @update:model-value="resetHandColors"
          ></ToggleField>
        </div>
        <div class="group">
          <div class="group stack">
            <label for="handStyle" class="desc">Style</label>
            <select id="handStyle" v-model="store.config.analogClocks[ci].hand.st" name="handStyle" class="select w16">
              <option
                v-for="st in analogHandStyles"
                :key="st.id"
                :selected="st.id === store.config.analogClocks[ci].hand.st"
                :value="st.id"
              >
                {{ st.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="group fill">
          <div v-if="store.config.analogClocks[ci].hand.or" class="group stack fill">
            <label for="handShadow" class="desc">Shadow</label>
            <ShadowField v-model="store.config.analogClocks[ci].hand.sh" tag-id="handShadow" class="fill">
            </ShadowField>
          </div>
          <div class="group stack fill">
            <label for="enableCenter" class="desc">Center</label>
            <div class="group compact">
              <ToggleField v-model="store.config.analogClocks[ci].cr.on" tag-id="enableCenter"></ToggleField>
              <ColorPickerField
                v-if="store.config.analogClocks[ci].hand.or && store.config.analogClocks[ci].cr.on"
                v-model="store.config.analogClocks[ci].cr.cl"
                aria-label="Center dot color"
                class="w4"
              ></ColorPickerField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableHour" class="desc">Hour hand</label>
            <div class="group compact">
              <ToggleField v-model="store.config.analogClocks[ci].hr.on" tag-id="enableHour"></ToggleField>
              <ColorPickerField
                v-if="store.config.analogClocks[ci].hand.or && store.config.analogClocks[ci].hr.on"
                v-model="store.config.analogClocks[ci].hr.cl"
                aria-label="Hour hand color"
                class="w4"
              ></ColorPickerField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableMinute" class="desc">Minute hand</label>
            <div class="group compact">
              <ToggleField v-model="store.config.analogClocks[ci].min.on" tag-id="enableMinute"></ToggleField>
              <ColorPickerField
                v-if="store.config.analogClocks[ci].hand.or && store.config.analogClocks[ci].min.on"
                v-model="store.config.analogClocks[ci].min.cl"
                aria-label="Minute hand color"
                class="w4"
              ></ColorPickerField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableSecond" class="desc">Second hand</label>
            <div class="group compact">
              <ToggleField v-model="store.config.analogClocks[ci].sec.on" tag-id="enableSecond"></ToggleField>
              <ColorPickerField
                v-if="store.config.analogClocks[ci].hand.or && store.config.analogClocks[ci].sec.on"
                v-model="store.config.analogClocks[ci].sec.cl"
                aria-label="Second hand color"
                class="w4"
              ></ColorPickerField>
            </div>
          </div>
          <div v-if="store.config.analogClocks[ci].sec.on" class="group stack fill">
            <label
              for="secondSmooth"
              class="desc"
              title="Smooth second hand movement"
              aria-label="Smooth second hand movement"
              >Smooth</label
            >
            <ToggleField v-model="store.config.analogClocks[ci].sec.ss" tag-id="secondSmooth"></ToggleField>
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Label</h3>
    <div class="blockContainer">
      <div class="block">
        <label for="enableLabel" class="label">Enable label</label>
        <ToggleField v-model="store.config.analogClocks[ci].lb.on" tag-id="enableLabel" class="mla"></ToggleField>
      </div>
      <div v-if="store.config.analogClocks[ci].lb.on" class="block">
        <label for="labelText" class="label">Label text</label>
        <input id="labelText" v-model="store.config.analogClocks[ci].lb.lb" type="text" class="input w20 mla" />
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.analogClocks[ci].lb.on"
        v-model:override="store.config.analogClocks[ci].lb.or"
        v-model:cl="store.config.analogClocks[ci].lb.cl"
        v-model:ts="store.config.analogClocks[ci].lb.ts"
        v-model:ls="store.config.analogClocks[ci].lb.ls"
        v-model:fs="store.config.analogClocks[ci].lb.fs"
        v-model:ox="store.config.analogClocks[ci].lb.ox"
        v-model:oy="store.config.analogClocks[ci].lb.oy"
        type="label"
        :clock="store.config.analogClocks[ci]"
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
          <ToggleField v-model="store.config.analogClocks[ci].rt.on" tag-id="enableRt"></ToggleField>
        </div>
      </div>
      <DigitalClockSegmentFont
        v-if="store.config.analogClocks[ci].rt.on"
        v-model:override="store.config.analogClocks[ci].rt.or"
        v-model:cl="store.config.analogClocks[ci].rt.cl"
        v-model:ts="store.config.analogClocks[ci].rt.ts"
        v-model:ls="store.config.analogClocks[ci].rt.ls"
        v-model:fs="store.config.analogClocks[ci].rt.fs"
        v-model:ox="store.config.analogClocks[ci].rt.ox"
        v-model:oy="store.config.analogClocks[ci].rt.oy"
        type="rt"
        :clock="store.config.analogClocks[ci]"
      >
      </DigitalClockSegmentFont>
    </div>
  </div>
</template>
