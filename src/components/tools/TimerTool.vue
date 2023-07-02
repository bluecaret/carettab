<script setup>
import { reactive } from 'vue'
import { useTimerStore } from '@/components/tools/toolStore.js'
import { useSettingsStore } from '@/store.js'
const store = useSettingsStore()
const timerStore = useTimerStore()
timerStore.watchTotalSeconds()

const tool = reactive(store.config.toolbar.tools.find((t) => t.id === 'timer'))

const toggleTimer = () => {
  if (timerStore.running) {
    timerStore.stopTimer()
  } else {
    timerStore.startTimer()
  }
}
</script>

<template>
  <div class="toolbarToolPanel panel">
    <div class="page">
      <h2 class="title">
        Timer
        <button
          class="btn mla"
          :aria-label="tool.sound ? $t('widget.soundEnabled') : $t('widget.soundDisabled')"
          :title="tool.sound ? $t('widget.soundEnabled') : $t('widget.soundDisabled')"
          @click="tool.sound = !tool.sound"
        >
          <fa :icon="tool.sound ? 'fa-bell' : 'fa-bell-slash'" fixed-width />
        </button>
      </h2>
      <div class="blockContainer">
        <div class="block stack">
          <div class="group fill compact">
            <NumberField v-model="timerStore.hours" class="fill" aria-label="Hour" placeholder="Hr" :min="0" />
            <NumberField
              v-model="timerStore.minutes"
              class="fill"
              aria-label="Minute"
              placeholder="Min"
              :min="0"
              :max="59"
            />
            <NumberField
              v-model="timerStore.seconds"
              class="fill"
              aria-label="Second"
              placeholder="Sec"
              :min="0"
              :max="59"
            />
          </div>
          <div class="group stack fill">
            <div class="btnGroup fill">
              <button class="btn presetTimer fill" @click="timerStore.setTimer(0, 1, 0)">1 min</button>
              <button class="btn presetTimer fill" @click="timerStore.setTimer(0, 5, 0)">5 min</button>
              <button class="btn presetTimer fill" @click="timerStore.setTimer(0, 10, 0)">10 min</button>
            </div>
            <div class="btnGroup fill">
              <button class="btn presetTimer fill" @click="timerStore.setTimer(0, 15, 0)">15 min</button>
              <button class="btn presetTimer fill" @click="timerStore.setTimer(0, 30, 0)">30 min</button>
              <button class="btn presetTimer fill" @click="timerStore.setTimer(1, 0, 0)">60 min</button>
            </div>
            <div class="btnGroup fill">
              <button class="btn fill" @click="toggleTimer">
                {{ timerStore.running ? $t('widget.stop') : $t('widget.start') }}
              </button>
              <button class="btn fill" @click="timerStore.resetTimer">{{ $t('widget.reset') }}</button>
              <button class="btn fill" @click="timerStore.clearTimer">{{ $t('widget.clear') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="blockContainer">
        <div class="block time">
          {{ timerStore.displayTime }}
        </div>
      </div>
      <div class="subBlockContainer">
        <div class="block desc fill">{{ $t('widget.switchingTabsWarning') }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  width: 36rem;
}
.time {
  justify-content: center;
  align-items: baseline;
  font-family: Consolas, monaco, monospace;
  font-weight: 400;
  font-size: 4rem;
  gap: 0.4rem;
}

.presetTimer {
  background-color: var(--cSubBlock);
  border-color: var(--cSubBlock);
  justify-content: center;
}
</style>
