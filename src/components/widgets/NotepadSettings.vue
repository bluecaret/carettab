<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore, getStorage, setStorage, removeStorage } from '@/store.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useSettingsStore()

const widgetStore = 'notepads'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
const sync = ref(widget.sync)

const changeStorageLocation = async () => {
  if (widget.sync) {
    if (confirm(t('widget.doYouWantToDisableSyncingOfYourNotes'))) {
      const notesKey = `notes-${widget.id}`
      const currentNotes = await getStorage(notesKey, 'sync')
      await setStorage({ ['notes-' + widget.id]: currentNotes[notesKey] }, 'local')
      await removeStorage(notesKey, 'sync')
      widget.sync = false
    } else {
      sync.value = true
    }
  } else {
    if (confirm(t('widget.areYouSureYouWantToEnableSyncing'))) {
      const notesKey = `notes-${widget.id}`
      const currentNotes = await getStorage(notesKey, 'local')
      await setStorage({ ['notes-' + widget.id]: currentNotes[notesKey].slice(0, 7000) }, 'sync')
      await removeStorage(notesKey, 'local')
      widget.sync = true
    } else {
      sync.value = false
    }
  }
}
</script>

<template>
  <PageHeading title="Notepad" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="overrideColors" class="label">{{ $t('widget.overrideColors') }}</label>
        <ToggleField v-model="widget.overrideColors" tag-id="overrideColors"></ToggleField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.textBox') }}</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">{{ $t('widget.width') }}</div>
            <NumberField v-model="widget.width" tag-id="width" class="w10" :min="1" :increment="10"></NumberField>
          </div>
          <div class="block">
            <label for="height" class="label mra">{{ $t('widget.height') }}</label>
            <NumberField v-model="widget.height" tag-id="height" class="w10" :min="1" :increment="10"></NumberField>
          </div>
          <div class="block">
            <label for="padding" class="label mra">{{ $t('common.padding') }}</label>
            <NumberField v-model="widget.padding" tag-id="padding" class="w10" :min="0" :increment="1"></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="backgroundColor" class="label">{{ $t('common.background') }}</label>
            <ColorField v-model="widget.background" class="w20" tag-id="backgroundColor"></ColorField>
          </div>
          <div class="block">
            <label for="borderWidth" class="label mra">{{ $t('common.borderSize') }}</label>
            <NumberField
              v-model="widget.borderWidth"
              tag-id="borderWidth"
              class="w10"
              :min="0"
              :increment="1"
            ></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="borderColor" class="label">{{ $t('common.borderColor') }}</label>
            <ColorField v-model="widget.borderColor" class="w20" tag-id="borderColor"></ColorField>
          </div>
          <div class="block">
            <label for="borderRadius" class="label">{{ $t('widget.roundedCorners') }}</label>
            <NumberField
              v-model="widget.borderRadius"
              tag-id="borderRadius"
              class="w10"
              :min="0"
              :increment="1"
            ></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="shadow" class="label">{{ $t('common.shadow') }}</label>
            <ColorField v-model="widget.shadow" class="w20" shadow tag-id="shadow"></ColorField>
          </div>
        </template>
      </FieldAccordion>
      <div class="block">
        <div class="label">
          <label for="sync">{{ $t('widget.syncNotes') }}</label>
          <div class="desc">
            {{ $t('widget.allowNotesToSync') }}
          </div>
          <div class="desc">{{ $t('widget.notesAreCurrentlyLimitedTo', [widget.sync ? '7,000' : '250,000']) }}</div>
        </div>
        <ToggleField v-model="sync" tag-id="sync" @click="changeStorageLocation()"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spellCheck">{{ $t('widget.enableBrowserSpellcheck') }}</label>
          <div class="desc">{{ $t('widget.allowsTheBrowserToRunSpellcheck') }}</div>
        </div>
        <ToggleField v-model="widget.spellCheck" tag-id="spellCheck"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spellCheck">{{ $t('widget.showCount') }}</label>
          <div class="desc">
            {{ $t('widget.displayTheCurrentCharacterCount') }}
          </div>
        </div>
        <ToggleField v-model="widget.showCharLimit" tag-id="showCharLimit"></ToggleField>
      </div>
    </div>
  </div>
</template>
