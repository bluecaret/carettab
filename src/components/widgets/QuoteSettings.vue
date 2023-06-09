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
  <div class="page">
    <PageHeading title="Quote" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <div class="block">
        <div class="label mra">Quote options</div>
        <div class="group">
          <div class="group compact">
            <label for="showAuthor" class="desc">Show author</label>
            <ToggleField v-model="widget.showAuthor" tag-id="showAuthor"></ToggleField>
          </div>
          <div class="group compact">
            <label for="showQuoteMarks" class="desc">Show quote marks</label>
            <ToggleField v-model="widget.showQuoteMarks" tag-id="showQuoteMarks"></ToggleField>
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Quotes</h3>
    <template v-if="widget.quotes && widget.quotes.length > 0">
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
                <div>Enter your custom quotes below.</div>
                <div class="desc">
                  Adding multiple quotes will cause the quote to be updated each day. By default, the next quote in the
                  list will be used. Enable "random" to pick a random quote instead.
                </div>
              </div>
              <div class="group stack compact mla">
                <label for="random" class="desc">Random</label>
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
              <input v-model="element.text" class="input" type="text" placeholder="Quote" aria-label="Quote" />
              <input v-model="element.author" class="input w16" type="text" placeholder="Author" aria-label="Author" />
              <button type="button" class="btn" aria-label="Delete quote" @click="deleteQuote(element.id)">
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
                Add new quote
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
