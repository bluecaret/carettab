<script setup>
import { ref } from 'vue'
import { widgetTypes } from '@/assets/lists.js'

const emit = defineEmits(['selected'])
const show = ref(false)
const addWidgetBtnEl = ref(null)

const handleWidgetClick = (type) => {
  show.value = false
  emit('selected', type)
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
              <button type="button" class="widgetItem" @click="handleWidgetClick(widget.type)">
                <fa class="widgetItemIcon" :icon="widget.icon" fixed-width />
                <div class="widgetItemContent">
                  <div class="widgetItemName">{{ widget.name }}</div>
                  <div class="widgetItemDesc">{{ widget.desc }}</div>
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
  padding: var(--s5);
  border-top-left-radius: var(--s4);
  border-top-right-radius: var(--s4);
}
.widgetList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template: 1fr / repeat(5, 1fr);
  gap: var(--s4);
  li {
    width: 100%;
  }
}

.widgetItem {
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
  background: var(--g2);
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
</style>
