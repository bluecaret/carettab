<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore } from '@/store.js'

const user = inject('user')

const props = defineProps({
  globalSetting: Boolean,
  index: Number,
  widgetStore: String,
  startOpen: Boolean,
  windowTitle: String,
  containerTitle: String,
  noContainerAlignment: Boolean,
  noBoxStyles: Boolean,
})

const store = useSettingsStore()
const widgetPrep = ref(null)
if (props.widgetStore === 'global') {
  widgetPrep.value = store.config.global.container
} else {
  widgetPrep.value = store.config[props.widgetStore][props.index].base.container
}
const widget = reactive(widgetPrep.value)
</script>

<template>
  <FieldAccordion :start-open="startOpen">
    <template #label>
      <div class="label">
        <div>Widget container</div>
        <div class="desc">
          {{
            props.noBoxStyles
              ? "Changes size and position for the widget's container."
              : "Changes size, position, colors, and other settings for the widget's container."
          }}
        </div>
      </div>
    </template>
    <template #children>
      <SizeAndPositionField
        v-if="!props.globalSetting"
        :index="props.index"
        :widget-store="props.widgetStore"
        :window-title="props.windowTitle"
        :container-title="props.containerTitle"
        :no-container-alignment="props.noContainerAlignment"
      />
      <div v-if="!props.noBoxStyles && !props.globalSetting" class="block">
        <label for="overrideGlobalFont" class="label mra">
          <div><PremiumLabel />Override global container styles</div>
        </label>
        <ToggleField v-model="widget.override" tag-id="overrideGlobalFont" :disabled="!user.paid"> </ToggleField>
      </div>
      <template v-if="!props.noBoxStyles && (props.globalSetting || (user.paid && widget.override))">
        <div class="block">
          <label for="boxPadding" class="label mra">
            <div><PremiumLabel />Padding</div>
          </label>
          <NumberField
            v-model="widget.padding"
            tag-id="boxPadding"
            :increment="1"
            :min="0"
            :disabled="!user.paid"
            class="w10"
          >
          </NumberField>
        </div>
        <div class="block">
          <label for="boxRounded" class="label mra">
            <div><PremiumLabel />Rounded</div>
          </label>
          <NumberField
            v-model="widget.radius"
            tag-id="boxRounded"
            :increment="1"
            :min="0"
            :disabled="!user.paid"
            class="w10"
          >
          </NumberField>
        </div>
        <div class="block">
          <label for="boxBs" class="label mra">
            <div><PremiumLabel />Border size</div>
          </label>
          <NumberField
            v-model="widget.borderSize"
            tag-id="boxBs"
            :increment="1"
            :min="0"
            :disabled="!user.paid"
            class="w10"
          >
          </NumberField>
        </div>
        <div class="block">
          <label for="boxBc" class="label mra">
            <div><PremiumLabel />Border color</div>
          </label>
          <ColorField v-model="widget.borderColor" tag-id="boxBc" class="w20" :disabled="!user.paid"> </ColorField>
        </div>
        <div class="block">
          <label for="boxBg" class="label mra">
            <div><PremiumLabel />Background</div>
          </label>
          <ColorField v-model="widget.background" tag-id="boxBg" class="w20" :disabled="!user.paid"> </ColorField>
        </div>
        <div class="block">
          <label for="boxShadow" class="label mra">
            <div><PremiumLabel />Shadow</div>
          </label>
          <ColorField v-model="widget.shadow" shadow tag-id="boxShadow" class="w20" :disabled="!user.paid">
          </ColorField>
        </div>
      </template>
    </template>
  </FieldAccordion>
</template>
