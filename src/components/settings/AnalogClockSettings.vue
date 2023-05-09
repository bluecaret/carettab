<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'
import { analogFaceStyles, analogHandStyles } from '@/assets/lists.js'

const store = useSettingsStore()

const ci = ref(store.config.analogClocks.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.analogClocks[ci.value])

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
    newClocks[newClocks.findIndex((c) => c.id === widget.id)].tz = tz.id
    store.$patch({ config: { analogClocks: newClocks } })
  }
}

const resetFaceColors = () => {
  widget.face.sh = widget.w.ts
  widget.face.bc = widget.w.cl
  widget.face.qmc = widget.w.cl
  widget.face.hmc = widget.w.cl
  widget.face.mmc = widget.w.cl
}

const resetHandColors = () => {
  widget.hand.sh = widget.w.ts
  widget.hr.cl = widget.w.cl
  widget.min.cl = widget.w.cl
  widget.sec.cl = widget.w.cl
  widget.cr.cl = widget.w.cl
}

const updateClockParts = () => {
  resetFaceColors()
  resetHandColors()
}
</script>

<template>
  <div class="page">
    <PageHeading title="Analog clock" :widget-id="widget.id"></PageHeading>
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
        @update:cl="updateClockParts"
        @update:ts="updateClockParts"
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
          class="mla w23"
          :list="allTimezones"
          :selected="widget.tz"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <label for="clockSize" class="label">Clock size</label>
        <NumberField v-model="widget.sz" :increment="10" class="w10 mla" tag-id="clockSize"> </NumberField>
      </div>
      <div class="block">
        <div class="label">Clock face</div>
        <div class="group compact mla">
          <label for="hourOverride" class="desc">Override colors</label>
          <ToggleField
            v-model="widget.face.or"
            tag-id="hourOverride"
            @update:model-value="resetFaceColors"
          ></ToggleField>
        </div>
        <div class="group stack">
          <label for="faceStyle" class="desc">Style</label>
          <select id="faceStyle" v-model="widget.face.st" name="faceStyle" class="select w16">
            <option v-for="st in analogFaceStyles" :key="st.id" :selected="st.id === widget.face.st" :value="st.id">
              {{ st.label }}
            </option>
          </select>
        </div>
        <div class="group stack">
          <label for="faceBorderSize" class="desc">Border size</label>
          <NumberField v-model="widget.face.bs" class="w8" tag-id="faceBorderSize"> </NumberField>
        </div>
        <div v-if="widget.face.or" class="group fill">
          <div class="group fill stack">
            <label for="faceShadow" class="desc">Shadow</label>
            <ColorField v-model="widget.face.sh" shadow class="" tag-id="faceShadow"> </ColorField>
          </div>
          <div class="group fill stack">
            <label for="faceBorderColor" class="desc">Border color</label>
            <ColorField v-model="widget.face.bc" tag-id="faceBorderColor"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="qmc" class="desc">Quarter mark</label>
            <ColorField v-model="widget.face.qmc" tag-id="qmc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="hmc" class="desc">Hour mark</label>
            <ColorField v-model="widget.face.hmc" tag-id="hmc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="mmc" class="desc">Minute mark</label>
            <ColorField v-model="widget.face.mmc" tag-id="mmc"></ColorField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="label">Clock hands</div>
        <div class="group compact mla">
          <label for="hourOverride" class="desc">Override colors</label>
          <ToggleField
            v-model="widget.hand.or"
            tag-id="hourOverride"
            @update:model-value="resetHandColors"
          ></ToggleField>
        </div>
        <div class="group">
          <div class="group stack">
            <label for="handStyle" class="desc">Style</label>
            <select id="handStyle" v-model="widget.hand.st" name="handStyle" class="select w16">
              <option v-for="st in analogHandStyles" :key="st.id" :selected="st.id === widget.hand.st" :value="st.id">
                {{ st.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="group fill">
          <div v-if="widget.hand.or" class="group stack fill">
            <label for="handShadow" class="desc">Shadow</label>
            <ColorField v-model="widget.hand.sh" shadow tag-id="handShadow" class="fill"> </ColorField>
          </div>
          <div class="group stack fill">
            <label for="enableCenter" class="desc">Center</label>
            <div class="group compact">
              <ToggleField v-model="widget.cr.on" tag-id="enableCenter"></ToggleField>
              <ColorField
                v-if="widget.hand.or && widget.cr.on"
                v-model="widget.cr.cl"
                aria-label="Center dot color"
                class="w4"
              ></ColorField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableHour" class="desc">Hour hand</label>
            <div class="group compact">
              <ToggleField v-model="widget.hr.on" tag-id="enableHour"></ToggleField>
              <ColorField
                v-if="widget.hand.or && widget.hr.on"
                v-model="widget.hr.cl"
                aria-label="Hour hand color"
                class="w4"
              ></ColorField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableMinute" class="desc">Minute hand</label>
            <div class="group compact">
              <ToggleField v-model="widget.min.on" tag-id="enableMinute"></ToggleField>
              <ColorField
                v-if="widget.hand.or && widget.min.on"
                v-model="widget.min.cl"
                aria-label="Minute hand color"
                class="w4"
              ></ColorField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableSecond" class="desc">Second hand</label>
            <div class="group compact">
              <ToggleField v-model="widget.sec.on" tag-id="enableSecond"></ToggleField>
              <ColorField
                v-if="widget.hand.or && widget.sec.on"
                v-model="widget.sec.cl"
                aria-label="Second hand color"
                class="w4"
              ></ColorField>
            </div>
          </div>
          <div v-if="widget.sec.on" class="group stack fill">
            <label
              for="secondSmooth"
              class="desc"
              title="Smooth second hand movement"
              aria-label="Smooth second hand movement"
              >Smooth</label
            >
            <ToggleField v-model="widget.sec.ss" tag-id="secondSmooth"></ToggleField>
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
