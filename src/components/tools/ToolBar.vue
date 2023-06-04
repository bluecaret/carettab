<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/store.js'
import AIChatTool from '@/components/tools/AIChatTool.vue'

const store = useSettingsStore()
const selected = ref('')

const toggleTool = (tool) => {
  selected.value = selected.value === tool ? '' : tool
}

const getToolIndex = (tool) => {
  return store.config.toolbar.tools.findIndex((t) => t.id === tool)
}
</script>

<template>
  <div class="toolbar">
    <ul>
      <li v-if="store.config.toolbar.tools[getToolIndex('aiChat')].on">
        <button class="toolBtn" type="button" :class="{ active: selected === 'aiChat' }" @click="toggleTool('aiChat')">
          <fa icon="fa-robot" fixed-width />
        </button>
      </li>
    </ul>
  </div>
  <AIChatTool v-if="selected === 'aiChat'" />
</template>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: var(--toolbarSize);
  font-size: var(--toolbarSize);
  background-color: var(--toolbarBg);
  border-right: var(--toolbarBorderSize) solid var(--toolbarBorderColor);
  color: var(--toolbarFg);
  padding: 0.15em 0;
  box-shadow: var(--toolbarShadow);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  align-items: center;
  justify-content: var(--toolbarAlign);
  li {
    font-size: 0.45em;
  }
}

.toolBtn {
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  border-radius: 0.2em;
  padding: 0.2em;
  color: currentColor;
  .svg-inline--fa {
    font-size: 1em;
  }
  &.active {
    border-color: var(--toolbarFg);
  }
  &.toolbarSettingsBtn {
    opacity: 0.4;
    &:hover,
    &:focus-visible,
    &.active {
      opacity: 1;
    }
    .svg-inline--fa {
      font-size: 0.65em;
    }
  }
}
</style>
