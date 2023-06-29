<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { fontList, fontWeight, textTransform } from '@/assets/lists.js'

const props = defineProps({
  globalSetting: Boolean,
  index: Number,
  widgetStore: String,
  startOpen: Boolean,
})

const store = useSettingsStore()
const user = inject('user')
const widgetPrep = ref(null)
if (props.widgetStore === 'global') {
  widgetPrep.value = store.config.global.font
} else {
  widgetPrep.value = store.config[props.widgetStore][props.index].base.font
}
const widget = reactive(widgetPrep.value)

const updateFamily = (family) => {
  widget.family = family.label
}
</script>

<template>
  <FieldAccordion :start-open="startOpen">
    <template #label>
      <div class="label">
        <div>{{ $t('settings.widgetFontStyles') }}</div>
        <div class="desc">{{ $t('settings.changesSizeFontColorForTheWidgetsText') }}</div>
      </div>
    </template>
    <template #children>
      <div v-if="!props.globalSetting" class="block">
        <label for="fontSize" class="label mra"> {{ $t('common.size') }} </label>
        <NumberField
          v-model="widget.size"
          tag-id="fontSize"
          class="w8"
          aria-label="Font size"
          :increment="1"
          :min="1"
        ></NumberField>
      </div>
      <div v-if="!props.globalSetting" class="block">
        <label for="overrideGlobalFont" class="label mra">{{ $t('common.overrideGlobal') }}</label>
        <ToggleField v-model="widget.override" tag-id="overrideGlobalFont"> </ToggleField>
      </div>
      <template v-if="props.globalSetting || widget.override">
        <div class="block">
          <label for="fontFamily" class="label mra">
            <div><PremiumLabel v-if="!props.globalSetting" />{{ $t('settings.font') }}</div>
          </label>
          <AutocompleteField
            class="w34"
            left
            fonts
            tag-id="test"
            use-label
            allow-custom
            :list="fontList"
            :selected="widget.family"
            :disabled="!props.globalSetting && !user.paid"
            @selected="(item) => updateFamily(item)"
          ></AutocompleteField>
        </div>
        <div class="block">
          <label for="widgetLetterSpacing" class="label mra"> {{ $t('settings.letterSpacing') }} </label>
          <NumberField v-model="widget.letterSpacing" tag-id="widgetLetterSpacing" class="w10" :increment="0.2">
          </NumberField>
        </div>
        <div class="block">
          <label class="label mra">
            <div><PremiumLabel v-if="!props.globalSetting" />{{ $t('settings.style') }}</div>
          </label>
          <select
            id="fontBold"
            v-model="widget.bold"
            name="fontBold"
            class="select w11"
            :disabled="!props.globalSetting && !user.paid"
            :aria-label="$t('settings.weight')"
          >
            <option v-for="wgt in fontWeight" :key="wgt.id" :value="wgt.id">
              {{ wgt.label }}
            </option>
          </select>
          <div class="btnGroup">
            <button
              id="togglePosition"
              :aria-label="$t('settings.italic')"
              class="btn"
              type="button"
              :class="{ active: widget.italic }"
              :disabled="!props.globalSetting && !user.paid"
              @click="widget.italic = !widget.italic"
            >
              <fa icon="fa-italic" fixed-width></fa>
            </button>
            <button
              id="togglePosition"
              :aria-label="$t('settings.underline')"
              class="btn"
              type="button"
              :class="{ active: widget.underline }"
              :disabled="!props.globalSetting && !user.paid"
              @click="widget.underline = !widget.underline"
            >
              <fa icon="fa-underline" fixed-width></fa>
            </button>
          </div>
        </div>
        <div class="block">
          <label for="textTranform" class="label mra">
            <div><PremiumLabel v-if="!props.globalSetting" />{{ $t('settings.case') }}</div>
          </label>
          <select
            id="textTranform"
            v-model="widget.transform"
            name="textTranform"
            class="select w20"
            :disabled="!props.globalSetting && !user.paid"
          >
            <option v-for="opt in textTransform" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="block">
          <label for="widgetFontColor" class="label mra"> {{ $t('common.color') }} </label>
          <ColorField v-model="widget.color" tag-id="widgetFontColor" class="w20"> </ColorField>
        </div>
        <div class="block">
          <label for="widgetFontShadow" class="label mra"> {{ $t('common.shadow') }} </label>
          <ColorField v-model="widget.shadow" shadow text tag-id="widgetFontShadow" class="w20"> </ColorField>
        </div>
      </template>
    </template>
  </FieldAccordion>
</template>
