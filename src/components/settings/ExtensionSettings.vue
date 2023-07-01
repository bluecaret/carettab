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
        <div>{{ $t('settings.extensionSettings') }}</div>
        <div class="desc">{{ $t('settings.extensionSettingsDescription') }}</div>
      </div>
    </template>
    <template #children>
      <div class="block">
        <label for="lang" class="label mra">{{ $t('settings.language') }}</label>
        <select
          id="lang"
          v-model="store.config.global.lang"
          class="select w25"
          name="lang"
          @change="handleLangSelect($event)"
        >
          <option v-for="lang in languages" :key="lang.id" :value="lang.id">
            {{ lang.name }} &mdash; {{ lang.label }}
          </option>
        </select>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="tabTitle">{{ $t('settings.tabTitle') }}</label>
            <div class="desc">
              {{ $t('settings.tabTitleDescription') }}
            </div>
          </div>
          <div class="group stack">
            <select id="tabTitle" v-model="store.config.global.tabTitle.type" name="tabTitle" class="select w25">
              <option value="newtab">"New Tab"</option>
              <option value="datetime">{{ $t('settings.tabTitleDateTime') }}</option>
              <option value="custom">{{ $t('settings.tabTitleCustomText') }}</option>
            </select>
          </div>
        </div>
        <div v-if="store.config.global.tabTitle.type !== 'newtab'" class="group fill">
          <div v-if="store.config.global.tabTitle.type === 'custom'" class="group stack fill">
            <label for="customTabTitle" class="desc">{{ $t('settings.customTitleText') }}</label>
            <input
              id="customTabTitle"
              v-model="store.config.global.tabTitle.custom"
              type="text"
              class="input fill"
              :placeholder="$t('settings.enterCustomText')"
            />
          </div>
          <div v-if="store.config.global.tabTitle.type === 'datetime'" class="group stack fill">
            <label for="datetimeFormat" class="desc">
              <div>
                {{ store.tSplit($t('settings.dateTimeFormatCode'))[0] }}
                <a href="https://moment.github.io/luxon/#/parsing?id=table-of-tokens" target="_blank">{{
                  store.tSplit($t('settings.dateTimeFormatCode'))[1]
                }}</a>
              </div>
            </label>
            <input
              id="datetimeFormat"
              v-model="store.config.global.tabTitle.datetime"
              type="text"
              class="input fill"
              :placeholder="$t('settings.enterDateTimeFormat')"
            />
          </div>
          <div v-if="store.config.global.tabTitle.type === 'datetime'" class="group stack fill">
            <label for="tabTitleTimezone" class="desc"> {{ $t('settings.timezone') }} </label>
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
            <label for="disableSelection">{{ $t('settings.disableTextSelection') }}</label>
            <div class="desc">
              {{ $t('settings.disableTextSelectionDesciption') }}
            </div>
          </div>
          <ToggleField v-model="store.config.global.disableSelection" tag-id="disableSelection" />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">{{ $t('settings.hideSettingsButton') }}</label>
            <div class="desc">
              {{ $t('settings.hideSettingsButtonDescription') }}
            </div>
          </div>
          <ToggleField v-model="store.config.global.hideSettings" tag-id="hideSettings" />
        </div>
      </div>
      <div class="block">
        <div class="label mra">{{ $t('settings.advanced') }}</div>
        <button class="btn" type="button" @click="store.goTo('advanced')">
          <fa icon="fa-gear" fixed-width></fa>{{ $t('settings.advancedSettings') }}
        </button>
      </div>
    </template>
  </FieldAccordion>
</template>
