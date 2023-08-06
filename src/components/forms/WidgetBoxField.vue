<script setup>
import { ref, nextTick, inject, computed } from 'vue'
import { useSettingsStore } from '@/store.js'

const user = inject('user')

const props = defineProps({
  globalSetting: Boolean,
  index: Number,
  widgetStore: String,
  startOpen: Boolean,
  hideToggle: Boolean,
  windowTitle: String,
  containerTitle: String,
  noContainerAlignment: Boolean,
  noBoxStyles: Boolean,
})

const store = useSettingsStore()
const refreshDisplay = ref(false)
const editGlobalModal = ref(false)
const copyGlobalModal = ref(false)
const widget = computed({
  get: () => {
    if (props.widgetStore === 'global') {
      return store.config.global.container
    } else {
      return store.config[props.widgetStore][props.index].base.container
    }
  },
  set: (newValue) => {
    if (props.widgetStore === 'global') {
      store.config.global.container = newValue
    } else {
      store.config[props.widgetStore][props.index].base.container = newValue
    }
  },
})

const handleGlobalCopy = () => {
  store.config[props.widgetStore][props.index].base.container.background = store.config.global.container.background
  store.config[props.widgetStore][props.index].base.container.borderColor = store.config.global.container.borderColor
  store.config[props.widgetStore][props.index].base.container.shadow = store.config.global.container.shadow
  store.config[props.widgetStore][props.index].base.container.padding = store.config.global.container.padding
  store.config[props.widgetStore][props.index].base.container.radius = store.config.global.container.radius
  store.config[props.widgetStore][props.index].base.container.borderSize = store.config.global.container.borderSize

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
        <div>{{ $t('settings.widgetContainer') }}</div>
        <div class="desc">
          {{
            props.noBoxStyles
              ? $t('settings.changesSizeAndPositionForTheWidgetsContainer')
              : $t('settings.changesSizePositionColorsForTheWidgetsContainer')
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
        <div class="label mra">
          <label for="overrideGlobalContainer"
            ><PremiumLabel />{{ $t('settings.overrideGlobalContainerStyles') }}</label
          >
          <div class="desc">{{ $t('settings.overridesContainerStyles') }}</div>
          <div class="group fill">
            <div class="desc">
              <ModalWindow :show="editGlobalModal" size="460px" @close="editGlobalModal = false">
                <template #button>
                  <button class="btn btnLink" type="button" @click="editGlobalModal = true">
                    {{ $t('settings.editGlobalContainerSettings') }}
                  </button>
                </template>
                <template #window>
                  <div class="modal">
                    <header class="modalHeader">
                      <h1 class="modalTitle">{{ $t('settings.globalWidgetContainerStyles') }}</h1>
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
                        <WidgetBoxField :index="0" widget-store="global" global-setting start-open hide-toggle />
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
                      <h1 class="modalTitle">{{ $t('settings.copyGlobalContainerStyles') }}</h1>
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
                      <p>
                        {{ $t('settings.thisOptionWillMatchTheWidgetContainer') }}
                      </p>
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
        <ToggleField v-model="widget.override" tag-id="overrideGlobalContainer" :disabled="!user.paid"> </ToggleField>
      </div>
      <template v-if="!refreshDisplay && !props.noBoxStyles && (props.globalSetting || (user.paid && widget.override))">
        <div class="block">
          <label for="boxBg" class="label mra">
            <div><PremiumLabel />{{ $t('common.background') }}</div>
          </label>
          <ColorField v-model="widget.background" tag-id="boxBg" class="w20" :disabled="!user.paid"> </ColorField>
        </div>
        <div class="block">
          <label for="boxShadow" class="label mra">
            <div><PremiumLabel />{{ $t('common.shadow') }}</div>
          </label>
          <ColorField v-model="widget.shadow" shadow tag-id="boxShadow" class="w20" :disabled="!user.paid">
          </ColorField>
        </div>
        <div class="block">
          <label for="boxBc" class="label mra">
            <div><PremiumLabel />{{ $t('common.borderColor') }}</div>
          </label>
          <ColorField v-model="widget.borderColor" tag-id="boxBc" class="w20" :disabled="!user.paid"> </ColorField>
        </div>
        <div class="block">
          <label for="boxBs" class="label mra">
            <div><PremiumLabel />{{ $t('common.borderSize') }}</div>
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
          <label for="boxRounded" class="label mra">
            <div><PremiumLabel />{{ $t('common.rounded') }}</div>
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
          <label for="boxPadding" class="label mra">
            <div><PremiumLabel />{{ $t('common.padding') }}</div>
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
      </template>
    </template>
  </FieldAccordion>
</template>

<style lang="scss" scoped>
.globalSettingsContainer {
  padding: 0;
}
</style>
