<script setup>
import { ref } from 'vue'
import { blueprints } from '@/helpers/blueprints.js'
import { useSettingsStore, setStorage } from '@/store.js'
import merge from 'lodash/merge'
import find from 'lodash/find'
import cloneDeep from 'lodash/cloneDeep'
import isArray from 'lodash/isArray'

const store = useSettingsStore()
const show = ref(false)
const showConfirmation = ref(null)
const blueprintBtnEl = ref(null)
const confirmationBtnEl = ref(null)
const modalCloseEl = ref(null)

const handleBlueprintSelection = async (blueprint) => {
  store.isLoading = true

  // Clone the current config to avoid mutating the original
  let newConfig = cloneDeep(store.config)

  // Turn off any existing layers
  newConfig.layers.forEach((l) => {
    l.on = false
  })

  // Loop over the keys in the blueprint
  Object.keys(blueprint.blueprint.config).forEach((key) => {
    // Check if the property is an array
    if (isArray(blueprint.blueprint.config[key])) {
      // Handle array merging
      blueprint.blueprint.config[key].forEach((blueprintItem) => {
        // Find matching item in the config array
        const storeItem = find(newConfig[key], { id: blueprintItem.id })

        if (storeItem) {
          // Merge matching items
          merge(storeItem, blueprintItem)
        } else {
          // Push the new item into the config array if it's not found
          newConfig[key].push(blueprintItem)
        }
      })
    } else {
      // Simply replace non-array properties
      newConfig[key] = cloneDeep(blueprint.blueprint.config[key])
    }
  })

  store.$patch({ config: newConfig })

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
        <fa icon="fa-compass-drafting" /> {{ $t('settings.useABlueprint') }}
      </button>
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <h1 class="modalTitle">
            <fa icon="fa-compass-drafting" style="margin-right: 1.5rem" size="lg" />{{
              $t('settings.selectABlueprintToTransformYourNewTab')
            }}
          </h1>
          <button
            ref="modalCloseEl"
            class="modalClose"
            type="button"
            :aria-label="$t('common.close')"
            @click="show = false"
          >
            <fa icon="fa-close" />
          </button>
        </header>
        <div class="modalContent">
          <div class="explanation">
            <div class="explanationTitle">{{ $t('settings.whatsABlueprint') }}</div>
            <div class="explanationDesc">
              {{ $t('settings.whatsABlueprintDescription') }}
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
                      <h1 class="modalTitle">{{ $t('settings.applyBlueprint') }}</h1>
                      <button
                        ref="modalCloseEl"
                        class="modalClose"
                        type="button"
                        :aria-label="$t('common.close')"
                        @click="showConfirmation = false"
                      >
                        <fa icon="fa-close" />
                      </button>
                    </header>
                    <div class="modalContent">
                      <div class="warning">
                        <strong><fa icon="fa-triangle-exclamation" /> {{ $t('settings.caution') }}</strong>
                        {{ $t('settings.blueprintCaution') }}
                      </div>
                      <p>
                        {{ store.tSplit($t('settings.areYouSureYouWantToApplyBlueprint', [blueprint.name]))[0] }}
                        <strong>{{ blueprint.name }}</strong>
                        {{ store.tSplit($t('settings.areYouSureYouWantToApplyBlueprint', [blueprint.name]))[1] }}
                      </p>
                      <div class="group fill">
                        <button type="button" class="btn btnText mla" @click="showConfirmation = false">
                          {{ $t('common.cancel') }}
                        </button>
                        <button type="button" class="btn" @click="handleBlueprintSelection(blueprint)">
                          {{ $t('settings.yesApplyBlueprint') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </ModalWindow>
            </li>
          </ul>
          <div class="explanation">
            <div class="explanationTitle">{{ $t('settings.shareYourCreation') }}</div>
            <div class="explanationDesc">
              {{ store.tSplit($t('settings.doYouHaveALayout'))[0] }}
              <a href="mailto:dev@bluecaret.com">dev@bluecaret.com</a>
              {{ store.tSplit($t('settings.doYouHaveALayout'))[1] }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.modalContent {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}
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
}

.explanationTitle {
  font-size: 2.2rem;
}
.explanationDesc {
  font-size: 1.5rem;
  line-height: 1.3;
}
</style>
