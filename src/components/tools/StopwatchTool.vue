<script setup>
import { useStopwatchStore } from '@/components/tools/toolStore.js'
const store = useStopwatchStore()
const pad = (value, length = 2) => String(value).padStart(length, '0')
</script>

<template>
  <div class="toolbarToolPanel panel">
    <div class="page">
      <h2 class="title">Stopwatch</h2>
      <div class="blockContainer">
        <div class="block stack">
          <div class="group fill">
            <div class="btnGroup fill">
              <button class="btn fill" @click="store.startStop">{{ $t('widget.startStop') }}</button>
              <button class="btn fill" @click="store.reset">{{ $t('widget.reset') }}</button>
              <button class="btn fill" @click="store.recordLap">{{ $t('widget.lap') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="blockContainer">
        <div class="block time">
          {{ pad(store.hours) }}:{{ pad(store.minutes) }}:{{ pad(store.seconds)
          }}<span>:{{ pad(store.milliseconds, 3) }}</span>
        </div>
        <div v-for="(lap, index) in store.laps" :key="index" class="block laps">
          {{ pad(lap.hours) }}:{{ pad(lap.minutes) }}:{{ pad(lap.seconds) }}<span>:{{ pad(lap.milliseconds, 3) }}</span>
        </div>
      </div>
      <div class="subBlockContainer">
        <div class="block desc fill">
          {{ $t('widget.switchingTabsWarning') }}
        </div>
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
  span {
    font-size: 0.5em;
    opacity: 0.6;
  }
}

.laps {
  justify-content: center;
  gap: 0.1rem;
  min-height: 0;
  padding-block: var(--s4);
  background-color: var(--cSubBlock);
  align-items: baseline;
  font-family: Consolas, monaco, monospace;
  font-weight: 400;
  font-size: 2.4rem;
  color: var(--cTextSubtle);
  span {
    font-size: 0.6em;
    opacity: 0.6;
  }
}
</style>
