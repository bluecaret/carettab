<script setup>
import { ref, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { useStopwatchStore, useTimerStore } from '@/components/tools/toolStore.js'
import CalculatorTool from '@/components/tools/CalculatorTool.vue'
import ConverterTool from '@/components/tools/ConverterTool.vue'
import TimerTool from '@/components/tools/TimerTool.vue'
import StopwatchTool from '@/components/tools/StopwatchTool.vue'
import PasswordGeneratorTool from '@/components/tools/PasswordGeneratorTool.vue'
import AIChatTool from '@/components/tools/AIChatTool.vue'
import { toolTypes } from '@/assets/lists.js'

const store = useSettingsStore()
const stopwatchStore = useStopwatchStore()
const timerStore = useTimerStore()
const user = inject('user')
const selected = ref('')

const toggleTool = (tool) => {
  selected.value = selected.value === tool ? '' : tool
}

const getToolType = (id) => {
  const tool = toolTypes.find((t) => t.tool === id)
  return tool ? tool : ''
}
</script>

<template>
  <div class="toolbar">
    <ul>
      <template v-for="tool in store.config.toolbar.tools" :key="tool.id">
        <li v-if="tool.on && (!getToolType(tool.id).premium || user.paid)">
          <button
            class="toolBtn"
            type="button"
            :class="{ active: selected === tool.id }"
            :title="getToolType(tool.id).name"
            @click="toggleTool(tool.id)"
          >
            <fa :icon="`${getToolType(tool.id).icon}`" fixed-width />
            <fa v-if="tool.id === 'stopwatch' && stopwatchStore.running" class="toolRunning" icon="fa-circle-play" />
            <fa v-if="tool.id === 'timer' && timerStore.running" class="toolRunning" icon="fa-circle-play" />
          </button>
        </li>
      </template>
    </ul>
  </div>
  <CalculatorTool v-if="selected === 'calculator'" />
  <ConverterTool v-if="selected === 'converter'" />
  <TimerTool v-if="selected === 'timer'" />
  <StopwatchTool v-if="selected === 'stopwatch'" />
  <PasswordGeneratorTool v-if="selected === 'passwordGenerator'" />
  <AIChatTool v-if="selected === 'aiChat'" />
</template>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 11;
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
  position: relative;
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
    font-size: 0.9em;
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
  .toolRunning {
    position: absolute;
    inset: auto 0.2em 0.2em auto;
    font-size: 0.5em;
    background-color: hsl(0deg 0% 0% / 0.8);
    color: hsl(0deg 0% 100% / 0.8);
    padding: 0.15em;
    border-radius: 50%;
  }
}
</style>
