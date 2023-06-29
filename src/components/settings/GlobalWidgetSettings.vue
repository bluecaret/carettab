<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()
</script>

<template>
  <WidgetBoxField :index="0" widget-store="global" global-setting />
  <WidgetFontField :index="0" widget-store="global" global-setting />
  <FieldAccordion>
    <template #label>
      <div class="label">
        <div>{{ $t('settings.widgetElementColors') }}</div>
        <div class="desc">{{ $t('settings.widgetElementColorsDescription') }}</div>
      </div>
    </template>
    <template #children>
      <div class="block">
        <label for="elPcl" class="label mra">{{ $t('settings.primaryColor') }}</label>
        <ColorField v-model="store.config.global.element.primaryColor" tag-id="elPcl" class="w20"> </ColorField>
      </div>
      <div class="block">
        <label for="elScl" class="label mra">{{ $t('settings.secondaryColor') }}</label>
        <ColorField v-model="store.config.global.element.secondaryColor" tag-id="elScl" class="w20"> </ColorField>
      </div>
      <div class="block">
        <label for="elTcl" class="label mra">{{ $t('settings.tertiaryColor') }}</label>
        <ColorField v-model="store.config.global.element.tertiaryColor" tag-id="elTcl" class="w20"> </ColorField>
      </div>
      <div class="block">
        <label for="elShadow" class="label mra">{{ $t('settings.shadow') }}</label>
        <ColorField v-model="store.config.global.element.shadow" shadow tag-id="elShadow" class="w20"> </ColorField>
      </div>
    </template>
  </FieldAccordion>
</template>
