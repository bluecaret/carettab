<script setup>
import { ref, inject, computed } from 'vue'
import { widgetTypes, widgetTags } from '@/assets/lists.js'
import { useSettingsStore } from '@/store.js'

const user = inject('user')
const store = useSettingsStore()
const emit = defineEmits(['selected'])
const show = ref(false)
const addWidgetBtnEl = ref(null)
const modalCloseEl = ref(null)
const currentTag = ref(null)

const filteredWidgets = computed(() => {
  if (!currentTag.value) return widgetTypes
  return widgetTypes.filter((widget) => widget.tags.includes(currentTag.value))
})

const handleWidgetClick = (type) => {
  show.value = false
  emit('selected', type)
}

const hasReachedLimit = (type) => {
  const widgetLayers = store.config.layers.filter((layer) => layer.widget === type)
  const widget = widgetTypes.find((w) => w.type === type)
  return widgetLayers.length >= widget.limit
}

const hasReachedMax = (type) => {
  const widgetLayers = store.config.layers.filter((layer) => layer.widget === type)
  const widget = widgetTypes.find((w) => w.type === type)
  return widgetLayers.length >= widget.max
}

const handleOpenPremiumModal = () => {
  store.showPremiumModal = true
  store.premiumModalBtnRef = modalCloseEl
}

const filterByTag = (tag) => {
  currentTag.value = tag
}
</script>

<template>
  <ModalWindow
    window-class="addWidgetModal"
    :show="show"
    :button-ref="addWidgetBtnEl"
    size="1000px"
    @close="show = false"
  >
    <template #button>
      <button ref="addWidgetBtnEl" type="button" class="btn btnText addBtn" @click.stop="show = true">
        <fa icon="fa-plus"></fa>
        {{ $t('settings.addNewWidget') }}
      </button>
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <h1 class="modalTitle">{{ $t('settings.chooseYourNewWidget') }}</h1>
          <button
            ref="modalCloseEl"
            class="modalClose"
            type="button"
            :aria-label="$t('common.close')"
            @click="show = false"
          >
            <fa icon="fa-xmark" />
          </button>
        </header>
        <div class="modalContent">
          <div class="widgetTags">
            <div>
              <fa icon="fa-tags" fixed-width :title="$t('settings.filterByTag')" />
            </div>
            <div>
              <button class="btn widgetTag" :class="{ active: !currentTag }" @click="filterByTag(null)">
                <fa :icon="!currentTag ? 'fa-check' : 'fa-tag'" fixed-width />
                {{ $t('settings.tagAll') }}
              </button>
              <button
                v-for="tag in widgetTags"
                :key="tag.translation"
                class="btn widgetTag"
                :class="{ active: currentTag === tag.label }"
                @click="filterByTag(tag.label)"
              >
                <fa
                  :icon="currentTag === tag.label ? 'fa-check' : tag.label === 'Premium Access' ? 'fa-gem' : 'fa-tag'"
                  fixed-width
                />
                {{ $t(tag.translation) }}
              </button>
            </div>
          </div>
          <ul class="widgetList">
            <li v-for="widget in filteredWidgets" :key="widget.type">
              <button v-if="hasReachedMax(widget.type)" type="button" class="widgetItem widgetMax">
                <div class="group compact">
                  <fa class="widgetItemIcon" :icon="widget.icon" fixed-width />
                  <div class="widgetItemName">{{ widget.name }}</div>
                </div>
                <div class="widgetItemContent">
                  <div class="widgetLimitDesc">
                    <span>
                      {{ $t('settings.youHaveTheMaximumNumberAllowed') }}
                    </span>
                  </div>
                </div>
              </button>
              <button
                v-else-if="!user.paid && hasReachedLimit(widget.type)"
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
                    <span>{{ $t('settings.youReachedTheLimitForThisWidget') }}</span>
                  </div>
                  <div v-if="widget.limit !== 0" class="widgetPremiumDesc">
                    <fa icon="fa-gem" /><span>{{ $t('settings.goPremiumForUnlimitedWidgetsAndMore') }}</span>
                  </div>
                  <div v-if="widget.limit === 0" class="widgetLimitDesc widgetLimitDescTruncate">
                    <span :title="widget.desc">{{ widget.desc }}</span>
                  </div>
                  <div v-if="widget.limit === 0" class="widgetPremiumDesc">
                    <fa icon="fa-gem" /><span>{{ $t('settings.goPremiumToGetThisWidgetAndMoreCustomization') }}</span>
                  </div>
                </div>
              </button>
              <button v-else type="button" class="widgetItem" @click="handleWidgetClick(widget.type)">
                <fa class="widgetItemIcon" :icon="widget.icon" fixed-width />
                <div class="widgetItemContent">
                  <div class="widgetItemName">
                    {{ widget.name }}
                    <PremiumLabel v-if="widget.limit === 0" />
                  </div>
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

<style lang="scss">
.addWidgetModal {
  height: min(90dvh, 1000px);
}
</style>

<style lang="scss" scoped>
.btn.addBtn {
  width: 100%;
  justify-content: center;
  padding: var(--s4);
  background-color: hsl(var(--cBlockH) calc(var(--cBlockS) + 20%) calc(var(--cBlockL) + 5%));
  .lightMode & {
    background-color: hsl(var(--cBlockH) calc(var(--cBlockS) + 20%) calc(var(--cBlockL) - 11%));
  }
  .lightGrayMode & {
    background-color: hsl(var(--cBlockH) 0% calc(var(--cBlockL) - 11%));
  }
}

.widgetTags {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--s4);
  margin-block-end: var(--s5);
  max-width: 950px; // avoid scrollbar changing list
  > div {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s4);
  }
}

.widgetTag {
  padding: var(--s3) var(--s4);
  border-radius: var(--s5);
  font-size: 1.6rem;
  min-height: unset;
  .svg-inline--fa {
    font-size: 1.2rem;
  }
}

.widgetList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  min-height: 16.5rem;
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
  display: inline-flex;
  align-items: baseline;
  gap: 0.3em;
  .lightGrayMode &,
  .lightMode & {
    font-weight: 400;
  }
}
.widgetItemDesc {
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--cTextSubtle);
}

.widgetMax,
.widgetPremium {
  background-blend-mode: darken;
  background-color: hsl(var(--g2H) calc(var(--g2S) - 40%) calc(var(--g2L) - 0.5%));
  --iconBg: hsl(var(--g2H) calc(var(--g2S) - 40%) calc(var(--g2L) - 1.5%));
  .lightMode & {
    background-color: hsl(var(--g2H) var(--g2S) calc(var(--g2L) - 9%));
  }
  .lightGrayMode & {
    background-color: hsl(var(--g2H) var(--g2S) calc(var(--g2L) - 10%));
  }
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
  .widgetLimitDescTruncate {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
