<script setup>
import { ref, reactive, watch, toRaw, onMounted } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const store = useSettingsStore()
const tool = reactive(store.config.toolbar.tools.find((t) => t.id === 'breathingExercise'))
const showSettings = ref(false)
let timer = null

onMounted(() => {
  tool.exercise ? (showSettings.value = false) : (showSettings.value = true)
})

const saveKey = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    setStorage({ ['toolbar']: { ...toRaw(store.config.toolbar) } }, 'sync')
  }, 500)
}

const breathingExercises = [
  {
    id: 'boxBreathing',
    name: 'widget.boxBreathing',
    desc: 'widget.boxBreathingDesc',
    pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
  },
  {
    id: 'fourSevenEight',
    name: 'widget.4_7_8Breathing',
    desc: 'widget.4_7_8BreathingDesc',
    pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
  },
  {
    id: 'diaphragmatic',
    name: 'widget.diaphragmaticBreathing',
    desc: 'widget.diaphragmaticBreathingDesc',
    pattern: { inhale: 4, hold: 1, exhale: 6, pause: 0 },
  },
  {
    id: 'equalBreathing',
    name: 'widget.equalBreathing',
    desc: 'widget.equalBreathingDesc',
    pattern: { inhale: 4, hold: 0, exhale: 4, pause: 0 },
  },
  {
    id: 'lionsBreath',
    name: 'widget.lionsBreath',
    desc: 'widget.lionsBreathDesc',
    pattern: { inhale: 5, hold: 1, exhale: 6, pause: 0 },
  },
  {
    id: 'alternateNostril',
    name: 'widget.alternateNostrilBreathing',
    desc: 'widget.alternateNostrilBreathingDesc',
    pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
  },
  {
    id: 'pursedLip',
    name: 'widget.pursedLipBreathing',
    desc: 'widget.pursedLipBreathingDesc',
    pattern: { inhale: 2, hold: 0, exhale: 4, pause: 0 },
  },
  {
    id: 'coherentBreathing',
    name: 'widget.coherentBreathing',
    desc: 'widget.coherentBreathingDesc',
    pattern: { inhale: 6, hold: 0, exhale: 6, pause: 0 },
  },
  {
    id: 'buteykoBreathing',
    name: 'widget.buteykoBreathing',
    desc: 'widget.buteykoBreathingDesc',
    pattern: { inhale: 2, hold: 4, exhale: 4, pause: 0 },
  },
  {
    id: 'threePartBreath',
    name: 'widget.threePartBreath',
    desc: 'widget.threePartBreathDesc',
    pattern: { inhale: 6, hold: 2, exhale: 6, pause: 0 },
  },
]

let selectedExercise = tool.exercise
  ? { ...breathingExercises.find((e) => e.id === tool.exercise) }
  : { id: '', name: '', desc: '', pattern: {} }

watch(tool, () => {
  selectedExercise = { ...breathingExercises.find((e) => e.id === tool.exercise) }
})

const scale = ref(1)
const inProgress = ref(false)
const animationId = ref(null)
const completedCycles = ref(0)
const phase = ref('')
const phaseLabel = ref('')
let timeoutIds = []

const startExercise = async () => {
  if (animationId.value === null) {
    inProgress.value = true
    let startTime = 0
    let pattern = selectedExercise.pattern
    completedCycles.value = 0

    phase.value = 'inhale'
    phaseLabel.value = 'widget.ready'
    timeoutIds.forEach((id) => clearTimeout(id))
    timeoutIds = []
    timeoutIds.push(
      setTimeout(() => {
        phaseLabel.value = '3'
      }, 1000)
    )
    timeoutIds.push(
      setTimeout(() => {
        phaseLabel.value = '2'
      }, 2000)
    )
    timeoutIds.push(
      setTimeout(() => {
        phaseLabel.value = '1'
      }, 3000)
    )
    timeoutIds.push(
      setTimeout(() => {
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp

          const elapsed = timestamp - startTime

          if (phase.value === 'inhale') {
            phaseLabel.value = 'widget.inhale'
            scale.value = 1 + elapsed / (pattern.inhale * 1000)
            if (elapsed >= pattern.inhale * 1000) {
              startTime = timestamp
              phase.value = 'hold'
            }
          } else if (phase.value === 'hold') {
            pattern.hold !== 0 ? (phaseLabel.value = 'widget.hold') : (phaseLabel.value = '')
            if (elapsed >= pattern.hold * 1000) {
              startTime = timestamp
              phase.value = 'exhale'
            }
          } else if (phase.value === 'exhale') {
            phaseLabel.value = 'widget.exhale'
            scale.value = 2 - elapsed / (pattern.exhale * 1000)
            if (elapsed >= pattern.exhale * 1000) {
              startTime = timestamp
              phase.value = 'pause'
            }
          } else if (phase.value === 'pause') {
            pattern.pause !== 0 ? (phaseLabel.value = 'widget.hold') : (phaseLabel.value = '')
            if (elapsed >= pattern.pause * 1000) {
              startTime = timestamp
              phase.value = 'inhale'

              completedCycles.value += 1
              if (completedCycles.value >= tool.cycles) {
                stopExercise()
                return
              }
            }
          }

          animationId.value = requestAnimationFrame(animate)
        }
        animationId.value = requestAnimationFrame(animate)
      }, 4000)
    )
  }
}

const stopExercise = () => {
  timeoutIds.forEach((id) => clearTimeout(id))
  cancelAnimationFrame(animationId.value)
  animationId.value = null
  inProgress.value = false
  phaseLabel.value = ''
  phase.value = ''
  scale.value = 1
}
</script>

<template>
  <div class="toolbarToolPanel panel">
    <div class="page">
      <h2 class="title">
        Breathing Exercise
        <button
          class="btn mla"
          :class="{ active: showSettings }"
          type="button"
          :aria-label="$t('widget.toolSettings')"
          @click="showSettings = !showSettings"
        >
          <fa icon="fa-gear" />
        </button>
      </h2>
      <div v-if="!tool.exercise || showSettings" class="blockContainer">
        <div class="block">
          <div class="group stack fill">
            <div class="group stack fill">
              <div class="group fill">
                <label for="cycles" class="label">{{ $t('widget.numberOfCycles') }}</label>
                <NumberField v-model="tool.cycles" tag-id="cycles" class="w8" :min="1" @update:model-value="saveKey" />
              </div>
            </div>
            <div class="group fill">
              <label for="breathingPattern" class="label">{{ $t('settings.pattern') }}</label>
              <select
                id="breathingPattern"
                v-model="tool.exercise"
                name="breathingPattern"
                class="select w18"
                @change="saveKey"
              >
                <option v-for="exercise in breathingExercises" :key="exercise.id" :value="exercise.id">
                  {{ $t(exercise.name) }}
                </option>
              </select>
            </div>
            <div v-if="selectedExercise.name" class="desc" style="display: block">
              <strong style="display: inline">{{ $t(selectedExercise.name) }}:</strong> {{ $t(selectedExercise.desc) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!tool.exercise || showSettings" class="blockContainer">
        <div class="block stack">
          <div class="label">{{ $t('widget.whyBreathingExercises') }}</div>
          <div class="desc">
            {{ $t('widget.breathingExercisesAreMoreThan') }}
          </div>
          <div class="label">{{ $t('widget.moreInformation') }}</div>
          <div class="desc">"The Healing Power of the Breath" by Richard P. Brown and Patricia L. Gerbarg</div>
          <div class="desc">
            <a
              href="https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/relaxation-technique/art-20045368"
              target="_blank"
              >"Relaxation techniques: Breath control helps quell errant stress response" - Mayo Clinic</a
            >
          </div>
        </div>
      </div>
      <div v-if="tool.exercise" class="blockContainer">
        <div class="block">
          <button
            v-if="!inProgress"
            type="button"
            class="btn btnBlock"
            style="justify-content: center"
            @click="startExercise"
          >
            {{ $t('widget.startSelectedExerciseName') }} {{ $t(selectedExercise.name) }}
          </button>
          <div v-if="inProgress" class="label fill">
            {{ $t('widget.cycleCompletedOfTotal', [completedCycles + 1, tool.cycles]) }}
          </div>
          <button
            v-if="inProgress"
            type="button"
            class="btn btnBlock"
            style="justify-content: center"
            @click="stopExercise"
          >
            {{ $t('widget.stop') }}
          </button>
        </div>
        <div class="block stack">
          <svg class="breathingCircle" viewBox="0 0 100 100">
            <!-- Outer circle -->
            <circle class="breathingCircleOuter" cx="50" cy="50" r="45" stroke-width="3" fill="none" />
            <!-- Inner circle -->
            <circle class="breathingCircleInner" cx="50" cy="50" r="33" :style="`transform: scale(${scale * 0.6});`" />
            <text class="breathingCirclePhase" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
              {{ ['3', '2', '1', ''].includes(phaseLabel) ? phaseLabel : $t(phaseLabel) }}
            </text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes breathingExercisePulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

<style lang="scss" scoped>
.panel {
  width: 36rem;
}

.breathingCircle {
  width: 100%;
  height: auto;
  transform-origin: center;
  circle {
    transform-origin: center;
    transition: transform 0.3s ease-out;
  }
}
.breathingCircleOuter {
  stroke: hsl(0deg 0% 0% / 0.4);
}
.breathingCircleInner {
  fill: hsl(0deg 0% 100% / 0.1);
}

.breathingCirclePhase {
  fill: white;
  font-family: inherit;
  font-weight: 400;
  font-size: 0.8rem;
}

body.lightMode {
  .breathingCircleOuter {
    stroke: hsl(0deg 0% 100% / 0.7);
  }
  .breathingCircleInner {
    fill: hsl(0deg 0% 0% / 0.15);
  }
  .breathingCirclePhase {
    fill: black;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
