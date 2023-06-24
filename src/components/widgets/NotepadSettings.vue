<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore, getStorage, setStorage, removeStorage } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'notepads'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
const sync = ref(widget.sync)

const changeStorageLocation = async () => {
  if (widget.sync) {
    if (
      confirm(
        'Do you want to disable syncing of your notes? Notes will no longer update on other computers. Changing this setting could potentially result in a loss of notes, please backup your notes before proceeding. \n\nOnce syncing is disabled, you will be able to add up to 250,000 characters in your notes.'
      )
    ) {
      const notesKey = `notes-${widget.id}`
      const currentNotes = await getStorage(notesKey, 'sync')
      await setStorage({ ['notes-' + widget.id]: currentNotes[notesKey] }, 'local')
      await removeStorage(notesKey, 'sync')
      widget.sync = false
    } else {
      sync.value = true
    }
  } else {
    if (
      confirm(
        'Are you sure you want to enable syncing of notes? Your current notes will start to sync across other computers with this browser that you have logged into. \n\n**NOTE** Synced notes are limited to only 7,000 characters. If you currently have more than that, you may lose some of your notes. Please backup your notes before proceeding!'
      )
    ) {
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
  <div class="page">
    <PageHeading title="Notepad" :widget-id="widget.id"></PageHeading>
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="overrideColors" class="label">Override colors</label>
        <ToggleField v-model="widget.overrideColors" tag-id="overrideColors"></ToggleField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">Text box</div>
        </template>
        <template #children>
          <div class="block">
            <div class="label mra">Width</div>
            <NumberField v-model="widget.width" tag-id="width" class="w10" :min="1" :increment="10"></NumberField>
          </div>
          <div class="block">
            <label for="height" class="label mra">Height</label>
            <NumberField v-model="widget.height" tag-id="height" class="w10" :min="1" :increment="10"></NumberField>
          </div>
          <div class="block">
            <label for="padding" class="label mra">Padding</label>
            <NumberField v-model="widget.padding" tag-id="padding" class="w10" :min="0" :increment="1"></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="backgroundColor" class="label">Background</label>
            <ColorField v-model="widget.background" class="w20" tag-id="backgroundColor"></ColorField>
          </div>
          <div class="block">
            <label for="borderWidth" class="label mra">Border size</label>
            <NumberField
              v-model="widget.borderWidth"
              tag-id="borderWidth"
              class="w10"
              :min="0"
              :increment="1"
            ></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="borderColor" class="label">Border color</label>
            <ColorField v-model="widget.borderColor" class="w20" tag-id="borderColor"></ColorField>
          </div>
          <div class="block">
            <label for="borderRadius" class="label">Rounded corners</label>
            <NumberField
              v-model="widget.borderRadius"
              tag-id="borderRadius"
              class="w10"
              :min="0"
              :increment="1"
            ></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="shadow" class="label">Shadow</label>
            <ColorField v-model="widget.shadow" class="w20" shadow tag-id="shadow"></ColorField>
          </div>
        </template>
      </FieldAccordion>
      <div class="block">
        <div class="label">
          <label for="sync">Sync notes</label>
          <div class="desc">
            Allow notes to sync across computers. You must be signed in to the browser for syncing to work. Browsers
            have a higher restriction on syncing data, this means notes will be limited to only 7,000 characters.
            Disabling sync for notes allows up to 250,000 characters.
          </div>
          <div class="desc">Notes are currently limited to {{ widget.sync ? '7,000' : '250,000' }} characters.</div>
        </div>
        <ToggleField v-model="sync" tag-id="sync" @click="changeStorageLocation()"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spellCheck">Enable Browser Spellcheck</label>
          <div class="desc">Allows the browser to run spellcheck on the notes (if available).</div>
        </div>
        <ToggleField v-model="widget.spellCheck" tag-id="spellCheck"></ToggleField>
      </div>
      <div class="block">
        <div class="label">
          <label for="spellCheck">Show count</label>
          <div class="desc">
            Display the current character count and the total allowed in the bottom of the notepad.
          </div>
        </div>
        <ToggleField v-model="widget.showCharLimit" tag-id="showCharLimit"></ToggleField>
      </div>
    </div>
  </div>
</template>
