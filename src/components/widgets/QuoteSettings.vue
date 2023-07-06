<script setup>
import { ref, reactive } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore, generateUID } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'quotes'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const addQuote = () => {
  widget.quotes.push({
    id: generateUID(),
    text: '',
    author: '',
  })
}

const deleteQuote = (id) => {
  const index = widget.quotes.findIndex((q) => q.id === id)
  store.config[widgetStore][ci.value].quotes.splice(index, 1)
  if (widget.currentQuote >= index) {
    store.config[widgetStore][ci.value].currentQuote = 0
  }
}
</script>

<template>
  <PageHeading title="Quote" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.quoteDisplay') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="showAuthor" class="label">{{ $t('widget.showAuthor') }}</label>
            <ToggleField v-model="widget.showAuthor" tag-id="showAuthor"></ToggleField>
          </div>
          <div class="block">
            <label for="showQuoteMarks" class="label">{{ $t('widget.showQuoteMarks') }}</label>
            <ToggleField v-model="widget.showQuoteMarks" tag-id="showQuoteMarks"></ToggleField>
          </div>
        </template>
      </FieldAccordion>
    </div>
    <h3 class="subtitle">{{ $t('widget.quotes') }}</h3>
    <template v-if="widget.quotes">
      <draggable
        class="blockContainer"
        :list="widget.quotes"
        item-key="id"
        ghost-class="dragGhost"
        chosen-class="dragChosen"
        drag-class="dragMove"
        handle=".drag"
        @start="drag = true"
        @end="drag = false"
      >
        <template #header>
          <div class="block">
            <div class="group fill">
              <div class="label fill">
                <div>{{ $t('widget.enterYourCustomQuotesBelow') }}</div>
                <div class="desc">
                  {{ $t('widget.addingMultipleQuotesWillCause') }}
                </div>
              </div>
              <div class="group stack compact mla">
                <label for="random" class="desc">{{ $t('widget.random') }}</label>
                <ToggleField v-model="widget.random" tag-id="random"></ToggleField>
              </div>
            </div>
          </div>
        </template>
        <template #item="{ element }">
          <div class="block">
            <div class="group fill compact">
              <div type="button" class="drag fit">
                <fa icon="fa-grip-vertical" size="xs" fixed-width></fa>
              </div>
              <input
                v-model="element.text"
                class="input"
                type="text"
                :placeholder="$t('widget.quote')"
                :aria-label="$t('widget.quote')"
              />
              <input
                v-model="element.author"
                class="input w16"
                type="text"
                :placeholder="$t('widget.author')"
                :aria-label="$t('widget.author')"
              />
              <button type="button" class="btn" :aria-label="$t('widget.deleteQuote')" @click="deleteQuote(element.id)">
                <fa icon="fa-trash" fixed-width></fa>
              </button>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="block">
            <div class="group fill">
              <button type="button" class="btn" @click="addQuote()">
                <fa icon="fa-plus"></fa>
                {{ $t('widget.addNewQuote') }}
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </template>
  </div>
</template>
