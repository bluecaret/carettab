<script setup>
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import { languages } from '@/assets/lists.js'

if (typeof browser === 'undefined') {
  var browser = chrome
}

const store = useSettingsStore()
const { locale } = useI18n({ useScope: 'global' })

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}
allTimezones.unshift({ id: 'local', label: 'Local' })

const selectTimezone = (tz) => {
  store.config.global.tabTitle.timezone = tz.id
}

const handleLangSelect = (event) => {
  locale.value = event.target.value
}
</script>

<template>
  <FieldAccordion>
    <template #label>
      <div class="label">
        <div>Extension settings</div>
        <div class="desc">Language, tab title, advanced options and more.</div>
      </div>
    </template>
    <template #children>
      <div class="block">
        <label for="lang" class="label mra">Language</label>
        <select
          id="lang"
          v-model="store.config.global.lang"
          class="select w25"
          name="lang"
          @change="handleLangSelect($event)"
        >
          <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.label }}</option>
        </select>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="tabTitle">Tab Title</label>
            <div class="desc">
              Choose what to display in the New Tab title (shows on the tab itself as well as in the browser's title
              bar).
            </div>
          </div>
          <div class="group stack">
            <select id="tabTitle" v-model="store.config.global.tabTitle.type" name="tabTitle" class="select w25">
              <option value="newtab">"New Tab"</option>
              <option value="datetime">Date/time</option>
              <option value="custom">Custom text</option>
            </select>
          </div>
        </div>
        <div v-if="store.config.global.tabTitle.type !== 'newtab'" class="group fill">
          <div v-if="store.config.global.tabTitle.type === 'custom'" class="group stack fill">
            <label for="customTabTitle" class="desc">Custom title text</label>
            <input
              id="customTabTitle"
              v-model="store.config.global.tabTitle.custom"
              type="text"
              class="input fill"
              placeholder="Enter custom text"
            />
          </div>
          <div v-if="store.config.global.tabTitle.type === 'datetime'" class="group stack fill">
            <label for="datetimeFormat" class="desc">
              <div>
                Date/time
                <a href="https://moment.github.io/luxon/#/parsing?id=table-of-tokens" target="_blank"> format code </a>
              </div>
            </label>
            <input
              id="datetimeFormat"
              v-model="store.config.global.tabTitle.datetime"
              type="text"
              class="input fill"
              placeholder="Enter date/time format"
            />
          </div>
          <div v-if="store.config.global.tabTitle.type === 'datetime'" class="group stack fill">
            <label for="tabTitleTimezone" class="desc"> Timezone </label>
            <AutocompleteField
              tag-id="tabTitleTimezone"
              class="fill"
              :list="allTimezones"
              :selected="store.config.global.tabTitle.timezone"
              @selected="(item) => selectTimezone(item)"
            ></AutocompleteField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="disableSelection">Disable text selection</label>
            <div class="desc">
              This will prevent you from selecting text on the new tab page resulting in a cleaner look in case of
              accidental clicks.
            </div>
          </div>
          <ToggleField v-model="store.config.global.disableSelection" tag-id="disableSelection" />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">Hide settings button</label>
            <div class="desc">
              When enabled the settings button will display when you hover over the bottom right corner.
            </div>
          </div>
          <ToggleField v-model="store.config.global.hideSettings" tag-id="hideSettings" />
        </div>
      </div>
      <div class="block">
        <div class="label mra">Advanced</div>
        <button class="btn" type="button" @click="store.goTo('advanced')">
          <fa icon="fa-gear" fixed-width></fa>Advanced settings
        </button>
      </div>
    </template>
  </FieldAccordion>
</template>
