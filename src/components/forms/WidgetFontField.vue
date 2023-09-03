<script setup>
import { inject, computed, ref, nextTick } from 'vue'
import { useSettingsStore } from '@/store.js'
import { fontList, fontWeight, textTransform } from '@/assets/lists.js'

const props = defineProps({
  globalSetting: Boolean,
  index: Number,
  widgetStore: String,
  startOpen: Boolean,
  hideToggle: Boolean,
})

const store = useSettingsStore()
const refreshDisplay = ref(false)
const editGlobalModal = ref(false)
const copyGlobalModal = ref(false)
const user = inject('user')
const widget = computed({
  get: () => {
    if (props.widgetStore === 'global') {
      return store.config.global.font
    } else {
      return store.config[props.widgetStore][props.index].base.font
    }
  },
  set: (newValue) => {
    if (props.widgetStore === 'global') {
      store.config.global.font = newValue
    } else {
      store.config[props.widgetStore][props.index].base.font = newValue
    }
  },
})

const updateFamily = (family) => {
  widget.value.family = family.label
}

const handleGlobalCopy = () => {
  store.config[props.widgetStore][props.index].base.font.color = store.config.global.font.color
  store.config[props.widgetStore][props.index].base.font.shadow = store.config.global.font.shadow
  store.config[props.widgetStore][props.index].base.font.family = store.config.global.font.family
  store.config[props.widgetStore][props.index].base.font.letterSpacing = store.config.global.font.letterSpacing
  store.config[props.widgetStore][props.index].base.font.bold = store.config.global.font.bold
  store.config[props.widgetStore][props.index].base.font.italic = store.config.global.font.italic
  store.config[props.widgetStore][props.index].base.font.underline = store.config.global.font.underline
  store.config[props.widgetStore][props.index].base.font.transform = store.config.global.font.transform

  refreshDisplay.value = true
  nextTick(() => {
    refreshDisplay.value = false
  })
  copyGlobalModal.value = false
}
</script>

<template>
  <FieldAccordion :start-open="startOpen" :hide-toggle="hideToggle">
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
        <div class="label mra">
          <label for="overrideGlobalFont">{{ $t('common.overrideGlobal') }}</label>
          <div class="group fill">
            <div class="desc">
              <ModalWindow :show="editGlobalModal" size="460px" @close="editGlobalModal = false">
                <template #button>
                  <button class="btn btnLink" type="button" @click="editGlobalModal = true">
                    {{ $t('settings.editGlobalFontSettings') }}
                  </button>
                </template>
                <template #window>
                  <div class="modal">
                    <header class="modalHeader">
                      <h1 class="modalTitle">{{ $t('settings.globalWidgetFontStyles') }}</h1>
                      <button
                        class="modalClose"
                        type="button"
                        :aria-label="$t('common.close')"
                        @click="editGlobalModal = false"
                      >
                        <fa icon="fa-xmark" />
                      </button>
                    </header>
                    <div class="modalContent">
                      <div class="block globalSettingsContainer">
                        <WidgetFontField :index="0" widget-store="global" global-setting start-open hide-toggle />
                      </div>
                    </div>
                  </div>
                </template>
              </ModalWindow>
            </div>
            <div v-if="widget.override" class="desc">
              <ModalWindow :show="copyGlobalModal" size="460px" @close="copyGlobalModal = false">
                <template #button>
                  <button class="btn btnLink" type="button" @click="copyGlobalModal = true">
                    {{ $t('settings.copyFromGlobal') }}
                  </button>
                </template>
                <template #window>
                  <div class="modal">
                    <header class="modalHeader">
                      <h1 class="modalTitle">{{ $t('settings.copyGlobalFontStyles') }}</h1>
                      <button
                        class="modalClose"
                        type="button"
                        :aria-label="$t('common.close')"
                        @click="copyGlobalModal = false"
                      >
                        <fa icon="fa-xmark" />
                      </button>
                    </header>
                    <div class="modalContent">
                      <p>{{ $t('settings.thisOptionWillMatchTheWidgetFont') }}</p>
                      <div class="group fill">
                        <button type="button" class="btn btnText mla" @click="copyGlobalModal = false">
                          {{ $t('common.cancel') }}
                        </button>
                        <button type="button" class="btn" @click="handleGlobalCopy()">
                          {{ $t('settings.copyFromGlobal') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </ModalWindow>
            </div>
          </div>
        </div>
        <ToggleField v-model="widget.override" tag-id="overrideGlobalFont"> </ToggleField>
      </div>
      <template v-if="!refreshDisplay && (props.globalSetting || widget.override)">
        <div class="block">
          <label for="widgetFontColor" class="label mra"> {{ $t('common.color') }} </label>
          <ColorField v-model="widget.color" tag-id="widgetFontColor" class="w20"> </ColorField>
        </div>
        <div class="block">
          <label for="widgetFontShadow" class="label mra"> {{ $t('common.shadow') }} </label>
          <ColorField v-model="widget.shadow" shadow text tag-id="widgetFontShadow" class="w20"> </ColorField>
        </div>
        <div class="block">
          <label for="fontFamily" class="label mra">
            {{ $t('settings.font') }}
          </label>
          <AutocompleteField
            class="w34"
            left
            fonts
            tag-id="fontFamily"
            use-label
            allow-custom
            :list="fontList"
            :selected="widget.family"
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
            {{ $t('settings.style') }}
          </label>
          <select
            id="fontBold"
            v-model="widget.bold"
            name="fontBold"
            class="select w11"
            :aria-label="$t('settings.weight')"
          >
            <option v-for="wgt in fontWeight" :key="wgt.id" :value="wgt.id">
              {{ wgt.label }}
            </option>
          </select>
          <div class="btnGroup">
            <button
              :aria-label="$t('settings.italic')"
              class="btn"
              type="button"
              :class="{ active: widget.italic }"
              @click="widget.italic = !widget.italic"
            >
              <fa icon="fa-italic" fixed-width></fa>
            </button>
            <button
              :aria-label="$t('settings.underline')"
              class="btn"
              type="button"
              :class="{ active: widget.underline }"
              @click="widget.underline = !widget.underline"
            >
              <fa icon="fa-underline" fixed-width></fa>
            </button>
          </div>
        </div>
        <div class="block">
          <label for="textTranform" class="label mra">
            {{ $t('settings.case') }}
          </label>
          <select id="textTranform" v-model="widget.transform" name="textTranform" class="select w20">
            <option v-for="opt in textTransform" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </template>
    </template>
  </FieldAccordion>
</template>

<style lang="scss" scoped>
.globalSettingsContainer {
  padding: 0;
}
</style>
