<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore } from '@/store.js'
// import { languages } from '@/assets/lists.js';

if (typeof browser === 'undefined') {
  var browser = chrome
}

const store = useSettingsStore()

const patterns = [
  { id: 'wavy' },
  { id: 'rhombus' },
  { id: 'zigzag' },
  { id: 'zigzag3d' },
  { id: 'moon' },
  { id: 'ripple' },
  { id: 'diagonal' },
  { id: 'diagonal2' },
  { id: 'diagonal3' },
  { id: 'paper' },
  { id: 'isometric' },
  { id: 'lines' },
  { id: 'lines2' },
  { id: 'lines3' },
  { id: 'lines4' },
  { id: 'boxes' },
  { id: 'triangles' },
  { id: 'triangles2' },
  { id: 'rectangles' },
  { id: 'cross' },
  { id: 'polka' },
  { id: 'polka2' },
]

const handleRemoveImage = () => {
  store.wallpaper = 'none'
  chrome.storage.local.remove('currentWallpaper')
  chrome.storage.local.remove('nextWallpaper')
  store.$patch({
    config: {
      global: {
        wallpaper: {
          type: 'none',
          id: '',
          timestamp: '',
        },
        wallpaperApi: {
          photoTitle: '',
          photoLink: '',
          photoAlt: '',
          authorName: '',
          authorLink: '',
          listName: '',
          listLink: '',
        },
      },
    },
  })
  store.save()
  store.goTo('dashboard')
}

const handlePatternSelect = (id) => {
  store.wallpaper = 'none'
  store.$patch({
    config: {
      global: {
        wallpaper: {
          type: 'pattern',
          id: id,
          timestamp: '',
        },
        wallpaperApi: {
          photoTitle: '',
          photoLink: '',
          photoAlt: '',
          authorName: '',
          authorLink: '',
          listName: '',
          listLink: '',
        },
      },
    },
  })
  store.save()
}
</script>

<template>
  <PageHeading :title="$t('settings.patterns')" back-page="dashboard"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <div class="block">
        <label for="backgroundColor" class="label">{{ $t('settings.wallpaperColor') }}</label>
        <ColorField v-model="store.config.global.wallpaper.background" tag-id="backgroundColor" class="w20">
        </ColorField>
      </div>
      <div class="block stack">
        <div class="group fill">
          <label id="patternSelect" class="label mra">{{ $t('settings.chooseAPattern') }}</label>
          <button
            v-if="store.config.global.wallpaper.type === 'pattern'"
            class="btn"
            type="button"
            @click="handleRemoveImage()"
          >
            {{ $t('settings.removePattern') }}
          </button>
        </div>
        <div class="group fill">
          <div class="bgTypeList">
            <button
              v-for="pattern in patterns"
              :key="pattern.id"
              aria-labelledby="patternSelect"
              type="button"
              class="bgTypeListItem"
              :class="store.config.global.wallpaper.id === pattern.id ? 'active' : ''"
              @click="handlePatternSelect(pattern.id)"
            >
              <div class="patternPreview bgTypeListItemPreview" :class="`pattern-${pattern.id}`"></div>
              <div class="bgTypeListItemName">{{ pattern.id }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
