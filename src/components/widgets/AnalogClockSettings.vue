<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import DigitalClockSegmentFont from '@/components/forms/DigitalClockSegmentFont.vue'
import { analogFaceStyles, analogHandStyles } from '@/assets/lists.js'

const store = useSettingsStore()

const widgetStore = 'analogClocks'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

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
    newClocks[newClocks.findIndex((c) => c.id === widget.id)].timezone = tz.id
    store.$patch({ config: { analogClocks: newClocks } })
  }
}
</script>

<template>
  <div class="page">
    <PageHeading title="Analog clock" :widget-id="widget.id"></PageHeading>
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
          class="mla w23"
          :list="allTimezones"
          :selected="widget.timezone"
          @selected="(item) => selectTimezone(item)"
        ></AutocompleteField>
      </div>
      <div class="block">
        <label for="clockSize" class="label">Clock size</label>
        <NumberField v-model="widget.size" :increment="10" class="w10 mla" tag-id="clockSize"> </NumberField>
      </div>
      <div class="block">
        <div class="label">Clock face</div>
        <div class="group compact mla">
          <label for="hourOverride" class="desc">Override colors</label>
          <ToggleField v-model="widget.face.override" tag-id="hourOverride"></ToggleField>
        </div>
        <div class="group stack">
          <label for="faceStyle" class="desc">Style</label>
          <select id="faceStyle" v-model="widget.face.style" name="faceStyle" class="select w16">
            <option v-for="st in analogFaceStyles" :key="st.id" :selected="st.id === widget.face.style" :value="st.id">
              {{ st.label }}
            </option>
          </select>
        </div>
        <div class="group stack">
          <label for="faceBorderSize" class="desc">Border size</label>
          <NumberField v-model="widget.face.borderSize" class="w8" tag-id="faceBorderSize"> </NumberField>
        </div>
        <div v-if="widget.face.override" class="group fill">
          <div class="group fill stack">
            <label for="faceShadow" class="desc">Shadow</label>
            <ColorField v-model="widget.face.shadow" shadow class="" tag-id="faceShadow"> </ColorField>
          </div>
          <div class="group fill stack">
            <label for="faceBorderColor" class="desc">Border color</label>
            <ColorField v-model="widget.face.borderColor" tag-id="faceBorderColor"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="qmc" class="desc">Quarter mark</label>
            <ColorField v-model="widget.face.quarterColor" tag-id="qmc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="hmc" class="desc">Hour mark</label>
            <ColorField v-model="widget.face.hourColor" tag-id="hmc"></ColorField>
          </div>
          <div class="group fill stack">
            <label for="mmc" class="desc">Minute mark</label>
            <ColorField v-model="widget.face.minuteColor" tag-id="mmc"></ColorField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="label">Clock hands</div>
        <div class="group compact mla">
          <label for="hourOverride" class="desc">Override colors</label>
          <ToggleField v-model="widget.hand.override" tag-id="hourOverride"></ToggleField>
        </div>
        <div class="group">
          <div class="group stack">
            <label for="handStyle" class="desc">Style</label>
            <select id="handStyle" v-model="widget.hand.style" name="handStyle" class="select w16">
              <option
                v-for="st in analogHandStyles"
                :key="st.id"
                :selected="st.id === widget.hand.style"
                :value="st.id"
              >
                {{ st.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="group fill">
          <div v-if="widget.hand.override" class="group stack fill">
            <label for="handShadow" class="desc">Shadow</label>
            <ColorField v-model="widget.hand.shadow" shadow tag-id="handShadow" class="fill"> </ColorField>
          </div>
          <div class="group stack fill">
            <label for="enableCenter" class="desc">Center</label>
            <div class="group compact">
              <ToggleField v-model="widget.center.on" tag-id="enableCenter"></ToggleField>
              <ColorField
                v-if="widget.hand.override && widget.center.on"
                v-model="widget.center.color"
                aria-label="Center dot color"
                class="w4"
              ></ColorField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="enableHour" class="desc">Hour hand</label>
            <div class="group compact">
              <ToggleField v-model="widget.hour.on" tag-id="enableHour"></ToggleField>
              <ColorField
                v-if="widget.hand.override && widget.hour.on"
                v-model="widget.hour.color"
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
                v-if="widget.hand.override && widget.min.on"
                v-model="widget.min.color"
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
                v-if="widget.hand.override && widget.sec.on"
                v-model="widget.sec.color"
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
            <ToggleField v-model="widget.sec.smoothSeconds" tag-id="secondSmooth"></ToggleField>
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
