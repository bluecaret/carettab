<script setup>
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import WidgetSegmentFont from '@/components/forms/WidgetSegmentFont.vue'
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
allTimezones.unshift({ id: 'local', label: 'Local' })

const selectTimezone = (tz) => {
  if (tz) {
    let newClocks = [...store.config.analogClocks]
    newClocks[newClocks.findIndex((c) => c.id === widget.id)].timezone = tz.id
    store.$patch({ config: { analogClocks: newClocks } })
  }
}
</script>

<template>
  <PageHeading title="Analog clock" :widget-id="widget.id"></PageHeading>
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
            <label for="enableLabel" class="label mra">{{ $t('widget.enableLabel') }}</label>
            <ToggleField v-model="widget.label.on" tag-id="enableLabel"></ToggleField>
          </div>
          <div v-if="widget.label.on" class="block">
            <label for="labelText" class="label mra">{{ $t('widget.labelText') }}</label>
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
          <div class="label">{{ $t('widget.clockFace') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="clockSize" class="label mra">{{ $t('common.size') }}</label>
            <NumberField v-model="widget.size" :increment="10" class="w10" tag-id="clockSize"> </NumberField>
          </div>
          <div class="block">
            <label for="faceStyle" class="label mra">{{ $t('settings.style') }}</label>
            <select id="faceStyle" v-model="widget.face.style" name="faceStyle" class="select w20">
              <option
                v-for="st in analogFaceStyles"
                :key="st.id"
                :selected="st.id === widget.face.style"
                :value="st.id"
              >
                {{ st.label }}
              </option>
            </select>
          </div>
          <div class="block">
            <label for="faceBorderSize" class="label mra">{{ $t('common.borderSize') }}</label>
            <NumberField v-model="widget.face.borderSize" class="w10" tag-id="faceBorderSize"> </NumberField>
          </div>
          <div class="block">
            <label for="hourOverride" class="label mra">{{ $t('widget.overrideColors') }}</label>
            <ToggleField v-model="widget.face.override" tag-id="hourOverride"></ToggleField>
          </div>
          <div v-if="widget.face.override" class="block">
            <label for="faceBorderColor" class="label mra">{{ $t('common.borderColor') }}</label>
            <ColorField v-model="widget.face.borderColor" class="w20" tag-id="faceBorderColor"></ColorField>
          </div>
          <div v-if="widget.face.override" class="block">
            <label for="qmc" class="label mra">{{ $t('widget.quarterMark') }}</label>
            <ColorField v-model="widget.face.quarterColor" class="w20" tag-id="qmc"></ColorField>
          </div>
          <div v-if="widget.face.override" class="block">
            <label for="hmc" class="label mra">{{ $t('widget.hourMark') }}</label>
            <ColorField v-model="widget.face.hourColor" class="w20" tag-id="hmc"></ColorField>
          </div>
          <div v-if="widget.face.override" class="block">
            <label for="mmc" class="label mra">{{ $t('widget.minuteMark') }}</label>
            <ColorField v-model="widget.face.minuteColor" class="w20" tag-id="mmc"></ColorField>
          </div>
          <div v-if="widget.face.override" class="block">
            <label for="faceShadow" class="label mra">{{ $t('common.shadow') }}</label>
            <ColorField v-model="widget.face.shadow" shadow class="w20" tag-id="faceShadow"> </ColorField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.clockHands') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="handStyle" class="label mra">{{ $t('settings.style') }}</label>
            <select id="handStyle" v-model="widget.hand.style" name="handStyle" class="select w20">
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
          <div class="block">
            <label for="hourOverride" class="label mra">{{ $t('widget.overrideColors') }}</label>
            <ToggleField v-model="widget.hand.override" tag-id="hourOverride"></ToggleField>
          </div>
          <div class="block">
            <label for="enableCenter" class="label mra">{{ $t('widget.enableCenterCircle') }}</label>
            <ToggleField v-model="widget.center.on" tag-id="enableCenter"></ToggleField>
          </div>
          <div v-if="widget.hand.override && widget.center.on" class="block">
            <label for="centerColor" class="label mra">{{ $t('widget.centerCircleColor') }}</label>
            <ColorField v-model="widget.center.color" tag-id="centerColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="enableHour" class="label mra">{{ $t('widget.enableHourHand') }}</label>
            <ToggleField v-model="widget.hour.on" tag-id="enableHour"></ToggleField>
          </div>
          <div v-if="widget.hand.override && widget.hour.on" class="block">
            <label for="hourColor" class="label mra">{{ $t('widget.hourHandColor') }}</label>
            <ColorField v-model="widget.hour.color" tag-id="hourColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="enableMinute" class="label mra">{{ $t('widget.enableMinuteHand') }}</label>
            <ToggleField v-model="widget.min.on" tag-id="enableMinute"></ToggleField>
          </div>
          <div v-if="widget.hand.override && widget.min.on" class="block">
            <label for="minColor" class="label mra">{{ $t('widget.minuteHandColor') }}</label>
            <ColorField v-model="widget.min.color" tag-id="minColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="enableSecond" class="label mra">{{ $t('widget.enableSecondHand') }}</label>
            <ToggleField v-model="widget.sec.on" tag-id="enableSecond"></ToggleField>
          </div>
          <div v-if="widget.sec.on" class="block">
            <label for="secondSmooth" class="label mra">{{ $t('widget.smoothSecondsMovement') }}</label>
            <ToggleField v-model="widget.sec.smoothSeconds" tag-id="secondSmooth"></ToggleField>
          </div>
          <div v-if="widget.hand.override && widget.sec.on" class="block">
            <label for="secColor" class="label mra">{{ $t('widget.secondHandColor') }}</label>
            <ColorField v-model="widget.sec.color" tag-id="secColor" class="w20"></ColorField>
          </div>
          <div v-if="widget.hand.override" class="block">
            <label for="handShadow" class="label mra">{{ $t('common.shadow') }}</label>
            <ColorField v-model="widget.hand.shadow" shadow tag-id="handShadow" class="w20"> </ColorField>
          </div>
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
