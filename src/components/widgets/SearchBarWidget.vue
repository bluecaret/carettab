<script setup>
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles, hsl, shadow, getDynamicSize } from '@/helpers/widgets.js'
import { searchEngines } from '@/assets/lists.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const searchText = ref('')
const engine = computed(() => searchEngines.find((e) => e.id === props.widget.engine))
const customEngine = computed(() => {
  return {
    id: 'custom',
    label: 'Custom',
    url: props.widget.customEngineUrl,
  }
})
const currentEngine = ref(props.widget.customEngine ? customEngine.value : engine.value)
const placeholderText = computed(() => {
  return props.widget.label.split('%e').length > 1
    ? `${props.widget.label.split('%e')[0] ? props.widget.label.split('%e')[0] : ''}${currentEngine.value.label}${
        props.widget.label.split('%e')[1] ? props.widget.label.split('%e')[1] : ''
      }`
    : props.widget.label
})

watch(
  () => props.widget.engine,
  () => {
    currentEngine.value = props.widget.customEngine ? customEngine.value : engine.value
  }
)
watch(
  () => props.widget.customEngine,
  () => {
    currentEngine.value = props.widget.customEngine ? customEngine.value : engine.value
  }
)
watch(
  () => props.widget.customEngineUrl,
  () => {
    currentEngine.value = props.widget.customEngine ? customEngine.value : engine.value
  }
)

const isDynamicScaling = computed(() => {
  return props.widget.base.container.override
    ? props.widget.base.container.dynamicScaling
    : store.config.global.container.dynamicScaling
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const performSearch = () => {
  if (!searchText.value || searchText.value.trim() == '') {
    return
  }

  chrome.search.query({
    text: searchText.value,
    disposition: 'CURRENT_TAB',
  })
}

const setBarStyles = computed(() => {
  return `
    border-style: solid;
    border-width: 0;
    border${props.widget.borderBottom ? '-bottom' : ''}-width: ${getDynamicSize(
    props.widget.borderSize,
    isDynamicScaling.value
  )};
    border-color: ${hsl(
      props.widget.overrideColors ? props.widget.borderColor : store.config.global.element.primaryColor
    )};
    background-color: ${hsl(
      props.widget.overrideColors ? props.widget.background : store.config.global.element.secondaryColor
    )};
    border-radius: ${getDynamicSize(props.widget.radius, isDynamicScaling.value)};
    font-size: ${getDynamicSize(props.widget.base.font.size, isDynamicScaling.value)};
    text-shadow: ${shadow(
      props.widget.base.font.override ? props.widget.base.font.shadow : store.config.global.font.shadow
    )};
    box-shadow: ${shadow(props.widget.overrideColors ? props.widget.boxShadow : store.config.global.element.shadow)};
    color: ${hsl(props.widget.base.font.override ? props.widget.base.font.color : store.config.global.font.color)};
    --elementPadding: ${getDynamicSize(props.widget.padding, isDynamicScaling.value)};
  `
})

const setSearchIconShadow = computed(() => {
  return `drop-shadow(${shadow(
    props.widget.base.font.override ? props.widget.base.font.shadow : store.config.global.font.shadow
  )})`
})

const elementStyles = computed(() => {
  if (
    (props.widget.base.font.override && props.widget.base.font.shadow[0] === false) ||
    store.config.global.font.shadow[0] === false
  ) {
    return ''
  }
  return `
    filter: drop-shadow(${shadow(
      props.widget.base.font.override ? props.widget.base.font.shadow : store.config.global.font.shadow
    )});
  `
})
</script>

<template>
  <div
    class="searchBar widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <form novalidate class="searchBarWrapper" :style="setBarStyles" @submit.prevent="performSearch">
        <input
          id="search-box"
          v-model="searchText"
          name="search-box"
          type="text"
          :autocomplete="props.widget.autocomplete ? 'on' : 'off'"
          :placeholder="placeholderText"
          :style="elementStyles"
        />
        <button v-if="props.widget.icon" type="submit" :style="elementStyles">
          <fa v-if="props.widget.icon" icon="fa-magnifying-glass" fixed-width></fa>
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchBar {
  grid-template-columns: 1fr;
}
.searchBarWrapper {
  width: 100%;
  display: inline-grid;
  grid-template-columns: 1fr;
  font-size: 16px;
  &:has(> button),
  &:has(> .dropdownWrapper) {
    grid-template-columns: 1fr auto;
    input {
      padding-right: calc(var(--elementPadding) / 2) !important;
    }
  }
  &:has(> button + .dropdownWrapper) {
    grid-template-columns: 1fr auto auto;
  }
  &:focus-within {
    outline: currentColor solid 2px;
  }
  input,
  button {
    &:focus {
      outline: none;
    }
  }
  input {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    text-decoration: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    text-shadow: inherit;
    width: 100%;
    border-radius: inherit;
    color: currentColor;
    padding: var(--elementPadding);
    &::placeholder {
      color: currentColor;
      opacity: 1;
    }
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
    background: transparent;
    border-radius: inherit;
    border: none;
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    text-decoration: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    text-shadow: inherit;
    color: currentColor;
    cursor: pointer;
    padding: var(--elementPadding) calc(var(--elementPadding) / 2);
    .svg-inline--fa {
      font-size: inherit;
      filter: v-bind(setSearchIconShadow);
    }
    &:last-child {
      padding-right: var(--elementPadding);
    }
  }
  .dropdownWrapper {
    button {
      padding-right: var(--elementPadding);
    }
  }
}
</style>
