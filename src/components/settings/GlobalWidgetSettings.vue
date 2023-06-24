<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()
</script>

<template>
  <div class="page">
    <PageHeading title="Global Widget Settings"></PageHeading>
    <div class="blockContainer">
      <WidgetBoxField :index="0" widget-store="global" global-setting start-open />
      <WidgetFontField :index="0" widget-store="global" global-setting start-open />
      <FieldAccordion start-open>
        <template #label>
          <div class="label">
            <div>Elements</div>
            <div class="desc">
              Some widgets such as analog clock and weather have more than just text. This section sets the defaults for
              those elements.
            </div>
          </div>
        </template>
        <template #children>
          <div class="block">
            <label for="elPcl" class="label mra">Primary color</label>
            <ColorField v-model="store.config.global.element.primaryColor" tag-id="elPcl" class="w20"> </ColorField>
          </div>
          <div class="block">
            <label for="elScl" class="label mra">Secondary color</label>
            <ColorField v-model="store.config.global.element.secondaryColor" tag-id="elScl" class="w20"> </ColorField>
          </div>
          <div class="block">
            <label for="elTcl" class="label mra">Tertiary color</label>
            <ColorField v-model="store.config.global.element.tertiaryColor" tag-id="elTcl" class="w20"> </ColorField>
          </div>
          <div class="block">
            <label for="elShadow" class="label mra">Shadow</label>
            <ColorField v-model="store.config.global.element.shadow" shadow tag-id="elShadow" class="w20"> </ColorField>
          </div>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>
