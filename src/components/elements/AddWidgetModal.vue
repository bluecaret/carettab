<script setup>
import { ref, inject } from 'vue'
import { widgetTypes } from '@/assets/lists.js'
import { useSettingsStore } from '@/store.js'

const user = inject('user')
const store = useSettingsStore()
const emit = defineEmits(['selected'])
const show = ref(false)
const addWidgetBtnEl = ref(null)
const modalCloseEl = ref(null)

const handleWidgetClick = (type) => {
  show.value = false
  emit('selected', type)
}

const hasReachedLimit = (type) => {
  const widgetLayers = store.config.layers.filter((layer) => layer.widget === type)
  const widget = widgetTypes.find((w) => w.type === type)
  return widgetLayers.length >= widget.limit
}

const handleOpenPremiumModal = () => {
  store.showPremiumModal = true
  store.premiumModalBtnRef = modalCloseEl
}
</script>

<template>
  <ModalWindow :show="show" :button-ref="addWidgetBtnEl" size="1000px" @close="show = false">
    <template #button>
      <button ref="addWidgetBtnEl" type="button" class="btn btnText addBtn" @click.stop="show = true">
        <fa icon="fa-plus"></fa>
        Add new widget
      </button>
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <h1 class="modalTitle">Choose your new widget</h1>
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
          <ul class="widgetList">
            <li v-for="widget in widgetTypes" :key="widget.type">
              <button
                v-if="user.paid || !hasReachedLimit(widget.type)"
                type="button"
                class="widgetItem"
                @click="handleWidgetClick(widget.type)"
              >
                <fa class="widgetItemIcon" :icon="widget.icon" fixed-width />
                <div class="widgetItemContent">
                  <div class="widgetItemName">{{ widget.name }}</div>
                  <div class="widgetItemDesc">{{ widget.desc }}</div>
                </div>
              </button>
              <button
                v-if="!user.paid && hasReachedLimit(widget.type)"
                type="button"
                class="widgetItem widgetPremium"
                @click.stop="handleOpenPremiumModal()"
              >
                <div class="group compact">
                  <fa class="widgetItemIcon" :icon="widget.icon" fixed-width />
                  <div class="widgetItemName">{{ widget.name }}</div>
                </div>
                <div class="widgetItemContent">
                  <div v-if="widget.limit !== 0" class="widgetLimitDesc">
                    <span>You reached the limit for this widget.</span>
                  </div>
                  <div v-if="widget.limit !== 0" class="widgetPremiumDesc">
                    <fa icon="fa-gem" /><span>Go Premium for unlimited widgets and more!</span>
                  </div>
                  <div v-if="widget.limit === 0" class="widgetLimitDesc">
                    <span>Only available with Premium Access.</span>
                  </div>
                  <div v-if="widget.limit === 0" class="widgetPremiumDesc">
                    <fa icon="fa-gem" /><span>Go Premium to get this widget and more customization!</span>
                  </div>
                </div>
              </button>
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
.widgetList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 1fr;
  gap: var(--s4);
  li {
    width: 100%;
    position: relative;
  }
}

.widgetItem {
  position: relative;
  z-index: 1;
  --iconBg: hsl(var(--g2H) calc(var(--g2S) + 0%) calc(var(--g2L) - 1.5%));
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
  background-image: linear-gradient(150deg, var(--iconBg) 0%, var(--iconBg) 10rem, transparent 10rem, transparent 100%);
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 0.5rem 0 var(--cBtnShadow);
  }
}

.widgetItemIcon {
  font-size: 2.4rem;
  color: var(--cBtnFg);
}

.widgetItemContent {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.widgetItemName {
  font-size: 2.2rem;
  font-weight: 300;
  color: var(--cBtnFg);
}
.widgetItemDesc {
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--cTextSubtle);
}

.widgetPremium {
  grid-template: auto 1fr / 1fr;
  position: absolute;
  inset: 0 0 0 0;
  height: auto;
  z-index: 2;
  background-blend-mode: darken;
  background-color: hsl(var(--g2H) calc(var(--g2S) - 40%) calc(var(--g2L) - 0.5%));
  --iconBg: hsl(var(--g2H) calc(var(--g2S) - 40%) calc(var(--g2L) - 1.5%));
  .widgetItemIcon {
    font-size: 2rem;
  }
  .widgetItemName {
    font-size: 1.8rem;
  }
  .widgetLimitDesc {
    font-size: 1.4rem;
    display: flex;
    gap: var(--s4);
    color: var(--cTextSubtle);
  }
  .widgetPremiumDesc {
    font-size: 1.4rem;
    display: flex;
    gap: var(--s4);
    margin-block-start: var(--s5);
    color: var(--b2);
    .svg-inline--fa {
      font-size: 1.8rem;
    }
  }
}
</style>
