<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore, setStorage, getStorage } from '@/store.js'
import { setWidgetContainerStyles, hsl, shadow, getDynamicSize } from '@/helpers/widgets.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const notes = ref('')
let timer = null

onMounted(async () => {
  const currentNotes = await getStorage('notes-' + props.widget.id, props.widget.sync ? 'sync' : 'local')
  notes.value = currentNotes['notes-' + props.widget.id]
})

const saveNotes = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    setStorage({ ['notes-' + props.widget.id]: notes.value }, props.widget.sync ? 'sync' : 'local')
  }, 1000)
}

const isDynamicScaling = computed(() => {
  return props.widget.base.container.override
    ? props.widget.base.container.dynamicScaling
    : store.config.global.container.dynamicScaling
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})
</script>

<template>
  <div
    class="notepad widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div
        class="textbox"
        :style="`border-radius: ${getDynamicSize(widget.borderRadius, isDynamicScaling)}; background-color: ${hsl(
          widget.overrideColors ? widget.background : store.config.global.element.primaryColor
        )}; box-shadow: ${shadow(
          widget.overrideColors ? widget.shadow : store.config.global.element.shadow
        )}; border: ${getDynamicSize(widget.borderWidth, isDynamicScaling)} solid ${hsl(
          widget.overrideColors ? widget.borderColor : store.config.global.element.secondaryColor
        )}`"
      >
        <textarea
          v-model="notes"
          class="editor"
          :spellcheck="widget.spellCheck"
          :maxlength="widget.sync ? 7000 : 250000"
          autocomplete="off"
          :style="`padding: ${getDynamicSize(widget.padding, isDynamicScaling)}; border-radius: ${getDynamicSize(
            widget.borderRadius - widget.borderWidth,
            isDynamicScaling
          )};`"
          placeholder="Take a note..."
          @keyup="saveNotes()"
          @paste="saveNotes()"
        ></textarea>
        <div v-if="widget.showCharLimit" class="charCount">
          {{ notes ? notes.length : '0' }} / {{ widget.sync ? '7000' : '250000' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notepad {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
.widgetInner {
  width: 100%;
  height: 100%;
}
.textbox {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid currentColor;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.editor {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.3;
  text-shadow: inherit;
  color: inherit;
  border-radius: inherit;
  position: relative;
  z-index: +1;
  &::placeholder {
    color: currentColor;
  }
  &:focus {
    outline: 1px solid color-mix(in hsl, currentColor 80%, transparent);
    outline-offset: -1px;
  }
}

.editor::-webkit-scrollbar {
  display: none;
}

.editor:focus-visible::-webkit-scrollbar {
  display: block;
}

.charCount {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  opacity: 0.25;
}
</style>
