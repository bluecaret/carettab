<script setup>
import { computed, ref, onMounted, inject } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { setWidgetContainerStyles } from '@/helpers/widgets.js'
import { DateTime } from 'luxon'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

// Current quote to display is only determined on load.
// Any updates to the quote list will not be reflected until the page is reloaded.
let currentQuote = { ...props.widget.quotes[props.widget.currentQuote] }
let displayQuote = { text: '*no quote found*', author: '*no quote found*' }
if (currentQuote) {
  displayQuote.text = currentQuote.text
  displayQuote.author = currentQuote.author
}

onMounted(() => {
  const lastUpdate = props.widget.lastUpdate
  const current = props.widget.currentQuote
  const ci = store.config.quotes.findIndex((c) => c.id === props.widget.id)
  const last = DateTime.fromISO(lastUpdate).toFormat('yyyy-MM-dd')
  const now = DateTime.now().toFormat('yyyy-MM-dd')
  // const last = DateTime.fromISO(lastUpdate).toFormat('yyyy-MM-dd hh:mm')
  // const now = DateTime.now().toFormat('yyyy-MM-dd hh:mm')
  if (last !== now) {
    if (props.widget.quotes.length > 1) {
      if (props.widget.random) {
        let randomIndex = getRandomeNumer(0, props.widget.quotes.length - 1)
        store.config.quotes[ci].currentQuote = randomIndex
      } else {
        if (current === props.widget.quotes.length - 1) {
          store.config.quotes[ci].currentQuote = 0
        } else {
          store.config.quotes[ci].currentQuote = current + 1
        }
      }
      store.config.quotes[ci].lastUpdate = DateTime.now().startOf('day').toISO()
      // store.config.quotes[ci].lastUpdate = DateTime.now().startOf('minute').toISO()
      save()
    }
  }
})

const getRandomeNumer = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const save = () => {
  let newStore = {}
  newStore[props.widget.id] = JSON.parse(JSON.stringify(props.widget))
  setStorage(newStore, 'sync')
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})
</script>

<template>
  <div
    class="quote widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div class="quoteContainer">
        <div class="quoteText">
          <span v-if="props.widget.showQuoteMarks">&ldquo;</span>{{ displayQuote.text
          }}<span v-if="props.widget.showQuoteMarks">&rdquo;</span>
        </div>
        <div v-if="props.widget.showAuthor" class="quoteAuthor">&mdash;&nbsp;{{ displayQuote.author }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.quote {
  max-width: 100%;
}
</style>
