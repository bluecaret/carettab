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
        it: 'none',
        iid: '', // Image ID
        its: '', // Image timestamp
        unpt: '', // Unsplash photo title
        unpl: '', // Unsplash photo link
        unalt: '', // Unsplash alt description
        unau: '', // Unsplash author
        unal: '', // Unsplash author link
        unli: '', // Unsplash list
        unll: '', // Unsplash list link
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
        it: 'pattern',
        iid: id, // Image ID
        its: '', // Image timestamp
        unpt: '', // Unsplash photo title
        unpl: '', // Unsplash photo link
        unalt: '', // Unsplash alt description
        unau: '', // Unsplash author
        unal: '', // Unsplash author link
        unli: '', // Unsplash list
        unll: '', // Unsplash list link
      },
    },
  })
  store.save()
}
</script>

<template>
  <div class="page">
    <h2 class="title">
      <button class="back" title="Back to Global settings" @click="store.goTo('dashboard')">
        <fa icon="fa-circle-left" size="xl" fixed-width></fa>
      </button>
      Patterns
    </h2>
    <div class="blockContainer">
      <div class="block">
        <label for="backgroundColor" class="label mra">Wallpaper color</label>
        <ColorPickerField v-model="store.config.global.bg" tag-id="backgroundColor" class="w10"> </ColorPickerField>
      </div>
      <div class="block">
        <div class="group fill">
          <label id="patternSelect" class="label mra">Choose a pattern</label>
          <button v-if="store.config.global.it === 'pattern'" class="btn" type="button" @click="handleRemoveImage()">
            Remove pattern
          </button>
        </div>
        <div class="group fill">
          <div class="patternGrid">
            <button
              v-for="pattern in patterns"
              :key="pattern.id"
              aria-labelledby="patternSelect"
              type="button"
              class="patternBtn"
              :class="store.config.global.iid === pattern.id ? 'active' : ''"
              @click="handlePatternSelect(pattern.id)"
            >
              <div class="patternPreview" :class="`pattern-${pattern.id}`"></div>
              <div class="patternName">{{ pattern.id }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patternGrid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  // --bgSat: 0%;
}

.patternBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid var(--cGrey1);
  border-radius: var(--s3);
  background-color: var(--cGrey1);
  padding: var(--s4);

  &.active {
    border-color: var(--cBlue3);
    background-color: var(--cBlue3);
  }

  &:hover {
    border-color: var(--cGrey1Hover);
  }
}

.patternPreview {
  width: 100%;
  height: 100px;
  border-radius: var(--s3);
  border: 1px solid var(--cGrey1);
  margin-bottom: var(--s3);
}

.patternName {
  margin-top: var(--s2);
  font-size: 1.4rem;
  font-weight: 500;
  color: currentColor;
  opacity: 0.6;
}
</style>
