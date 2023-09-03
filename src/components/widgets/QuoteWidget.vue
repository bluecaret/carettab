<script setup>
import { computed, ref, onMounted, inject, watchEffect } from 'vue'
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
const displayQuote = ref({ text: '*no quote found*', author: '*no quote found*' })

const setDisplayQuote = () => {
  const current = props.widget.currentQuote ? props.widget.quotes[props.widget.currentQuote] : props.widget.quotes[0]
  if (current) {
    displayQuote.value.text = current.text
    displayQuote.value.author = current.author
  } else {
    displayQuote.value.text = '*no quote found*'
    displayQuote.value.author = '*no quote found*'
  }
}

watchEffect(() => {
  setDisplayQuote()
})

onMounted(() => {
  const lastUpdate = props.widget.lastUpdate
  const current = props.widget.currentQuote
  const ci = store.config.quotes.findIndex((c) => c.id === props.widget.id)
  const last = DateTime.fromISO(lastUpdate).toFormat('yyyy-MM-dd')
  const now = DateTime.now().toFormat('yyyy-MM-dd')
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
      save()
    }
  }
  setDisplayQuote()
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
  return setWidgetContainerStyles(props.widget, store.config.global)
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
