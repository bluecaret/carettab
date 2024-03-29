<script setup>
import { ref, nextTick, computed } from 'vue'
import { useSettingsStore } from '@/store.js'

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
const positionHelpModal = ref(false)
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
  <ModalWindow :show="positionHelpModal" size="670px" @close="positionHelpModal = false">
    <template #button>
      <SizeAndPositionField
        v-if="!props.globalSetting"
        :index="props.index"
        :widget-store="props.widgetStore"
        :no-container-alignment="props.noContainerAlignment"
        @open-help="positionHelpModal = true"
      />
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <h1 class="modalTitle">{{ $t('settings.instructionsForPositionAndSizeOptions') }}</h1>
          <button class="modalClose" type="button" :aria-label="$t('common.close')" @click="positionHelpModal = false">
            <fa icon="fa-xmark" />
          </button>
        </header>
        <div class="modalContent">
          <div
            class="block globalSettingsContainer"
            style="background-color: var(--g3); border-radius: var(--s3); border: 2px solid var(--b1)"
          >
            <SizeAndPositionField help-diagram @open-help="positionHelpModal = true" />
          </div>
          <ol class="instructions">
            <li>
              {{ $t('settings.useTheArrowsToAdjustTheHorizontalAndVerticalOffset') }}
            </li>
            <li>{{ $t('settings.manuallySetTheHorizontalOffset') }}</li>
            <li>{{ $t('settings.unitOfMeasureForTheHorizontalOffset') }}</li>
            <li>{{ $t('settings.manuallySetTheVerticalOffset') }}</li>
            <li>{{ $t('settings.unitOfMeasureForTheVerticalOffset') }}</li>
            <li>{{ $t('settings.anchorPositionDeterminesWhere') }}</li>
            <li>
              {{ $t('settings.alignmentOfContentWithinTheWidgetContainer') }}
            </li>
            <li>{{ $t('settings.widthOfTheWidgetsContainer') }}</li>
            <li>{{ $t('settings.unitOfMeasureForTheWidth') }}</li>
            <li>{{ $t('settings.heightOfTheWidgetsContainer') }}</li>
            <li>{{ $t('settings.unitOfMeasureForTheHeight') }}</li>
          </ol>
          <p>{{ $t('settings.widgetPositionsAreIndependent') }}</p>
        </div>
      </div>
    </template>
  </ModalWindow>
  <FieldAccordion v-if="!refreshDisplay && !props.noBoxStyles" :start-open="startOpen" :hide-toggle="hideToggle">
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
      <div v-if="!props.noBoxStyles && !props.globalSetting" class="block">
        <div class="label mra">
          <label for="overrideGlobalContainer">
            {{ $t('settings.overrideGlobalContainerStyles') }}
          </label>
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
        <ToggleField v-model="widget.override" tag-id="overrideGlobalContainer"> </ToggleField>
      </div>
      <template v-if="props.globalSetting || widget.override">
        <div class="block">
          <label for="dynamicScaling" class="label mra">
            {{ $t('settings.dynamicScaling') }}
            <div class="desc">
              {{ $t('settings.dynamicScalingDesc') }}
            </div>
          </label>
          <ToggleField v-model="widget.dynamicScaling" tag-id="dynamicScaling"> </ToggleField>
        </div>
        <div class="block">
          <label for="boxBg" class="label mra">
            {{ $t('common.background') }}
          </label>
          <ColorField v-model="widget.background" tag-id="boxBg" class="w20"> </ColorField>
        </div>
        <div class="block">
          <label for="boxShadow" class="label mra">
            {{ $t('common.shadow') }}
          </label>
          <ColorField v-model="widget.shadow" shadow tag-id="boxShadow" class="w20"> </ColorField>
        </div>
        <div class="block">
          <label for="boxBc" class="label mra">
            {{ $t('common.borderColor') }}
          </label>
          <ColorField v-model="widget.borderColor" tag-id="boxBc" class="w20"> </ColorField>
        </div>
        <div class="block">
          <label for="boxBs" class="label mra">
            {{ $t('common.borderSize') }}
          </label>
          <NumberField v-model="widget.borderSize" tag-id="boxBs" :increment="1" :min="0" class="w10"> </NumberField>
        </div>
        <div class="block">
          <label for="boxRounded" class="label mra">
            {{ $t('common.rounded') }}
          </label>
          <NumberField v-model="widget.radius" tag-id="boxRounded" :increment="1" :min="0" class="w10"> </NumberField>
        </div>
        <div class="block">
          <label for="boxPadding" class="label mra">
            {{ $t('common.padding') }}
          </label>
          <NumberField v-model="widget.padding" tag-id="boxPadding" :increment="1" :min="0" class="w10"> </NumberField>
        </div>
      </template>
    </template>
  </FieldAccordion>
</template>

<style lang="scss" scoped>
.globalSettingsContainer {
  padding: 0;
}
.instructions {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  font-size: 1.6rem;
  li {
    padding-left: 0.6rem;
  }
}
</style>
