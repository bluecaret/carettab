<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()
</script>

<template>
  <div class="page">
    <PageHeading title="Global Widget Settings"></PageHeading>
    <div class="blockContainer">
      <WidgetBoxField :index="0" widget-store="global" no-override />
      <WidgetFontField :index="0" widget-store="global" no-override />
      <div class="block">
        <div class="group fill">
          <div>
            <div class="label">Elements</div>
            <div class="desc">
              Some widgets such as analog clock and weather have more than just text. This section sets the defaults for
              those elements.
            </div>
          </div>
        </div>
        <div class="group fill">
          <div class="group stack fill">
            <label for="elPcl" class="desc">Primary color</label>
            <ColorField v-model="store.config.global.element.primaryColor" tag-id="elPcl"> </ColorField>
          </div>
          <div class="group stack fill">
            <label for="elScl" class="desc">Secondary color</label>
            <ColorField v-model="store.config.global.element.secondaryColor" tag-id="elScl"> </ColorField>
          </div>
          <div class="group stack fill">
            <label for="elTcl" class="desc">Tertiary color</label>
            <ColorField v-model="store.config.global.element.tertiaryColor" tag-id="elTcl"> </ColorField>
          </div>
          <div class="group stack fill">
            <label for="elShadow" class="desc">Shadow</label>
            <ColorField v-model="store.config.global.element.shadow" shadow tag-id="elShadow"> </ColorField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
