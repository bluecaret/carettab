<script setup>
import { ref } from 'vue'
import { blueprints } from '@/helpers/blueprints.js'
import { useSettingsStore, setStorage } from '@/store.js'

const store = useSettingsStore()
const show = ref(false)
const showConfirmation = ref(null)
const blueprintBtnEl = ref(null)
const confirmationBtnEl = ref(null)
const modalCloseEl = ref(null)

const handleBlueprintSelection = async (blueprint) => {
  console.log(blueprint)
  store.isLoading = true
  store.$patch({ config: blueprint.blueprint.config })
  store.save()
  await setStorage({ currentWallpaper: blueprint.blueprint.currentWallpaper }, 'local')
  await setStorage({ nextWallpaper: blueprint.blueprint.nextWallpaper }, 'local')
  setTimeout(() => {
    store.isLoading = false
    showConfirmation.value = null
    show.value = false
  }, 300)
}
</script>

<template>
  <ModalWindow :show="show" :button-ref="blueprintBtnEl" size="800px" @close="show = false">
    <template #button>
      <button ref="blueprintBtnEl" type="button" class="btn btnText addBtn" @click.stop="show = true">
        <fa icon="fa-compass-drafting" /> Use a Blueprint
      </button>
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <h1 class="modalTitle">
            <fa icon="fa-compass-drafting" style="margin-right: 1.5rem" size="lg" />Select a Blueprint to transform your
            New Tab
          </h1>
          <button
            ref="modalCloseEl"
            class="modalClose"
            type="button"
            aria-label="{{'options.common.close' | translate}}"
            @click="show = false"
          >
            <fa icon="fa-close" />
          </button>
        </header>
        <div class="modalContent">
          <div class="explanation">
            <div class="explanationTitle">What's a Blueprint?</div>
            <div class="explanationDesc">
              A Blueprint is a pre-configured layout with various widgets and settings already set up for you. It
              provides an easy and quick way to customize your new tab, giving you a head start on personalizing your
              browsing experience.
            </div>
          </div>
          <ul class="blueprintList">
            <li v-for="blueprint in blueprints" :key="blueprint.id">
              <ModalWindow
                :show="showConfirmation === blueprint.id"
                :button-ref="confirmationBtnEl"
                size="500px"
                @close="showConfirmation = false"
              >
                <template #button>
                  <button type="button" class="blueprintItem" @click="showConfirmation = blueprint.id">
                    <div class="blueprintItemContent">
                      <div class="blueprintItemName"><fa icon="fa-compass-drafting" />{{ blueprint.name }}</div>
                      <div class="blueprintItemDesc">{{ blueprint.desc }}</div>
                    </div>
                  </button>
                </template>
                <template #window>
                  <div class="modal">
                    <header class="modalHeader">
                      <h1 class="modalTitle">Apply Blueprint?</h1>
                      <button
                        ref="modalCloseEl"
                        class="modalClose"
                        type="button"
                        aria-label="{{'options.common.close' | translate}}"
                        @click="showConfirmation = false"
                      >
                        <fa icon="fa-close" />
                      </button>
                    </header>
                    <div class="modalContent">
                      <div class="warning">
                        <strong><fa icon="fa-triangle-exclamation" /> Caution:</strong> Applying a Blueprint overhauls
                        many of your current settings, including widgets, colors, positioning, fonts, and wallpapers.
                        While widgets with custom content such as Quotes and Notepads will be preserved, their display
                        settings may alter. It's strongly advised to back up your current settings before proceeding.
                      </div>
                      <p>
                        Are you sure you want to apply the <strong>{{ blueprint.name }}</strong> blueprint?
                      </p>
                      <div class="group fill">
                        <button type="button" class="btn btnText mla" @click="showConfirmation = false">Cancel</button>
                        <button type="button" class="btn" @click="handleBlueprintSelection(blueprint)">
                          Yes, apply blueprint
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </ModalWindow>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.btn.addBtn {
  width: 100%;
  justify-content: center;
  padding: var(--s4);
  background-color: hsl(var(--cBlockH) calc(var(--cBlockS) + 20%) calc(var(--cBlockL) + 5%));
}
.blueprintList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;
  gap: var(--s4);
  li {
    width: 100%;
    position: relative;
  }
}

.blueprintItem {
  position: relative;
  z-index: 1;
  --lines: hsl(var(--g2H) calc(var(--g2S) + 0%) calc(var(--g2L) + 3%));
  --lines2: hsl(var(--g2H) calc(var(--g2S) + 0%) calc(var(--g2L) + 2.2%));
  border: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template: auto 1fr / 1fr;
  gap: var(--s4);
  padding: var(--s5) var(--s5);
  border-radius: var(--s4);
  text-align: left;
  background-color: var(--g2);
  background-image: linear-gradient(var(--lines) 2px, transparent 2px),
    linear-gradient(90deg, var(--lines) 2px, transparent 1px), linear-gradient(var(--lines2) 1px, transparent 1px),
    linear-gradient(90deg, var(--lines2) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -32px -32px, -32px -32px, -31px -31px, -31px -31px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 0.5rem 0 var(--cBtnShadow);
  }
}

.blueprintItemContent {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.blueprintItemName {
  font-size: 2.4rem;
  font-weight: 300;
  color: var(--cBtnFg);
  display: flex;
  gap: var(--s4);
}
.blueprintItemDesc {
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--cTextSubtle);
  line-height: 1.3;
}

.warning {
  font-size: 1.6rem;
  background: var(--g1);
  border: 1px solid var(--cError);
  padding: var(--s5);
  border-radius: var(--s4);
  line-height: 1.3;
  margin-block-end: var(--s5);
}

.explanation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--s4);
  padding: var(--s5) var(--s5);
  border-radius: var(--s4);
  background: var(--g3);
  color: var(--cTextSubtle);
  margin-block-end: var(--s4);
}

.explanationTitle {
  font-size: 2.2rem;
}
.explanationDesc {
  font-size: 1.5rem;
  line-height: 1.3;
}
</style>
