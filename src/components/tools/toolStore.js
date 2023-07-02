import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import { useSettingsStore } from '@/store.js'

export const useAIChatStore = defineStore({
  id: 'aiChat',
  state: () => ({
    responses: [],
  }),
})

export const useConverterStore = defineStore({
  id: 'converter',
  state: () => ({
    group: 'area',
    fromValue: null,
    toValue: null,
    fromUnit: null,
    toUnit: null,
  }),
})

export const useStopwatchStore = defineStore({
  id: 'stopwatch',
  state: () => ({
    interval: null,
    running: false,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    laps: [],
  }),
  actions: {
    startStop() {
      if (this.running) {
        clearInterval(this.interval)
      } else {
        this.interval = setInterval(() => {
          this.milliseconds += 10
          if (this.milliseconds >= 1000) {
            this.seconds++
            this.milliseconds = 0
          }
          if (this.seconds >= 60) {
            this.minutes++
            this.seconds = 0
          }
          if (this.minutes >= 60) {
            this.hours++
            this.minutes = 0
          }
        }, 10)
      }
      this.running = !this.running
    },
    recordLap() {
      if (this.running) {
        this.laps.push({
          hours: this.hours,
          minutes: this.minutes,
          seconds: this.seconds,
          milliseconds: this.milliseconds,
        })
      }
    },
    reset() {
      clearInterval(this.interval)
      this.running = false
      this.hours = 0
      this.minutes = 0
      this.seconds = 0
      this.milliseconds = 0
      this.laps = []
    },
  },
})

export const useTimerStore = defineStore({
  id: 'timer',
  state: () => ({
    hours: ref(0),
    minutes: ref(0),
    seconds: ref(0),
    running: ref(null),
    remainingSeconds: ref(0),
  }),
  getters: {
    totalSeconds: (state) => state.hours * 3600 + state.minutes * 60 + state.seconds,

    displayTime: (state) => {
      const h = Math.floor(state.remainingSeconds / 3600)
      const m = Math.floor((state.remainingSeconds % 3600) / 60)
      const s = state.remainingSeconds % 60
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    },
  },
  actions: {
    startTimer() {
      this.stopTimer()
      this.running = setInterval(() => {
        if (this.remainingSeconds > 0) this.remainingSeconds--
        else {
          this.stopTimer()
          const globalStore = useSettingsStore()
          if (globalStore.config.toolbar.tools.find((t) => t.id === 'timer').sound) {
            let audio = new Audio('./public/timer.ogg')
            audio.play()
          }
        }
      }, 1000)
    },

    stopTimer() {
      if (this.running) {
        clearInterval(this.running)
        this.running = null
      }
    },

    resetTimer() {
      this.stopTimer()
      this.remainingSeconds = this.totalSeconds
    },

    clearTimer() {
      this.stopTimer()
      this.hours = 0
      this.minutes = 0
      this.seconds = 0
      this.remainingSeconds = 0
    },

    setTimer(hr, min, sec) {
      this.clearTimer()
      this.hours = hr
      this.minutes = min
      this.seconds = sec
    },

    watchTotalSeconds() {
      watchEffect(() => {
        if (!this.running) this.remainingSeconds = this.totalSeconds
      })
    },
  },
})
