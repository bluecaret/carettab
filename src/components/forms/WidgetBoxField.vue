<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore } from '@/store.js'

const user = inject('user')

const props = defineProps({
  noOverride: Boolean,
  index: Number,
  widgetStore: String,
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
  <div class="block">
    <div class="group fill">
      <label class="label mra">Container box</label>
      <div v-if="!props.noOverride" class="group compact">
        <label for="overrideGlobalFont" class="desc">
          <div><PremiumLabel />Override global</div>
        </label>
        <ToggleField v-model="widget.override" tag-id="overrideGlobalFont" :disabled="!user.paid"> </ToggleField>
      </div>
    </div>
    <div v-if="props.noOverride || widget.override" class="group fill">
      <div class="group stack">
        <label for="boxPadding" class="desc">
          <div><PremiumLabel />Padding</div>
        </label>
        <NumberField v-model="widget.padding" tag-id="boxPadding" :increment="1" :min="0" :disabled="!user.paid">
        </NumberField>
      </div>
      <div class="group stack">
        <label for="boxRounded" class="desc">
          <div><PremiumLabel />Rounded</div>
        </label>
        <NumberField v-model="widget.radius" tag-id="boxRounded" :increment="1" :min="0" :disabled="!user.paid">
        </NumberField>
      </div>
      <div class="group stack">
        <label for="boxBs" class="desc">
          <div><PremiumLabel />Border size</div>
        </label>
        <NumberField v-model="widget.borderSize" tag-id="boxBs" :increment="1" :min="0" :disabled="!user.paid">
        </NumberField>
      </div>
    </div>
    <div v-if="props.noOverride || widget.override" class="group fill">
      <div class="group stack fill">
        <label for="boxBc" class="desc">
          <div><PremiumLabel />Border color</div>
        </label>
        <ColorField v-model="widget.borderColor" tag-id="boxBc" class="fill" :disabled="!user.paid"> </ColorField>
      </div>
      <div class="group stack fill">
        <label for="boxBg" class="desc">
          <div><PremiumLabel />Background</div>
        </label>
        <ColorField v-model="widget.background" tag-id="boxBg" class="fill" :disabled="!user.paid"> </ColorField>
      </div>
      <div class="group stack fill">
        <label for="boxShadow" class="desc">
          <div><PremiumLabel />Shadow</div>
        </label>
        <ColorField v-model="widget.shadow" shadow tag-id="boxShadow" class="fill" :disabled="!user.paid"> </ColorField>
      </div>
    </div>
  </div>
</template>
