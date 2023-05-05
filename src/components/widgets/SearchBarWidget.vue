<script setup>
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/store.js'
import { setWidgetContainerStyles } from '@/helpers/widgets.js'
import { searchEngines } from '@/assets/lists.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const engineMenu = ref(null)
const searchText = ref('')
const engine = computed(() => searchEngines.find((e) => e.id === props.widget.en))
const customEngine = computed(() => {
  return {
    id: 'custom',
    label: 'Custom',
    url: props.widget.ceu,
  }
})
const currentEngine = ref(props.widget.ce ? customEngine.value : engine.value)
const placeholderText = computed(() => {
  return props.widget.lb.split('%e').length > 1
    ? `${props.widget.lb.split('%e')[0] ? props.widget.lb.split('%e')[0] : ''}${currentEngine.value.label}${
        props.widget.lb.split('%e')[1] ? props.widget.lb.split('%e')[1] : ''
      }`
    : props.widget.lb
})

watch(
  () => props.widget.en,
  () => {
    currentEngine.value = props.widget.ce ? customEngine.value : engine.value
  }
)
watch(
  () => props.widget.ce,
  () => {
    currentEngine.value = props.widget.ce ? customEngine.value : engine.value
  }
)
watch(
  () => props.widget.ceu,
  () => {
    currentEngine.value = props.widget.ce ? customEngine.value : engine.value
  }
)

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global)
})

const setEngine = (en) => {
  currentEngine.value = en
  engineMenu.value.close()
}

const performSearch = () => {
  if (!searchText.value || searchText.value.trim() == '') {
    return
  }

  let engine = currentEngine.value.url
  let searchUrl = `${engine.split('%s')[0] ? engine.split('%s')[0] : ''}${encodeURIComponent(searchText.value)}${
    engine.split('%s')[1] ? engine.split('%s')[1] : ''
  }`

  location.replace(searchUrl)
}

const setBarStyles = computed(() => {
  return `
    width: ${props.widget.sz}px;
    border-style: solid;
    border-width: 0;
    border${props.widget.bb ? '-bottom' : ''}-width: ${props.widget.bsz}px;
    border-color: hsl(${props.widget.bc[0]}deg ${props.widget.bc[1]}% ${props.widget.bc[2]}% / ${props.widget.bc[3]});
    background-color:
      hsl(${props.widget.bg[0]}deg ${props.widget.bg[1]}% ${props.widget.bg[2]}% / ${props.widget.bg[3]});
    border-radius: ${props.widget.br}px;
    font-size: ${props.widget.w.fs}px;
    text-shadow: ${
      props.widget.ts[0]
        ? `${props.widget.ts[1]}px ${props.widget.ts[2]}px ${props.widget.ts[3]}px
        hsl(${props.widget.ts[4]}deg ${props.widget.ts[5]}% ${props.widget.ts[6]}% / ${props.widget.ts[7]})`
        : 'none'
    };
    box-shadow: ${
      props.widget.bs[0]
        ? `${props.widget.bs[1]}px ${props.widget.bs[2]}px ${props.widget.bs[3]}px 0px
        hsl(${props.widget.bs[4]}deg ${props.widget.bs[5]}% ${props.widget.bs[6]}% / ${props.widget.bs[7]})`
        : 'none'
    };
    color: hsl(${props.widget.cl[0]}deg ${props.widget.cl[1]}% ${props.widget.cl[2]}% / ${props.widget.cl[3]});
    --elementPadding: ${props.widget.pd}px;
  `
})

const elementStyles = computed(() => {
  return `
    filter: drop-shadow(${
      props.widget.ts[0]
        ? `${props.widget.ts[1]}px ${props.widget.ts[2]}px ${props.widget.ts[3]}px
        hsl(${props.widget.ts[4]}deg ${props.widget.ts[5]}% ${props.widget.ts[6]}% / ${props.widget.ts[7]})`
        : 'none'
    })
  `
})
</script>

<template>
  <div class="searchBar widget" :class="[props.widget.w.a, `container-${props.widget.w.ca}`]" :style="containerStyles">
    <FontLink v-if="props.widget.w.orf" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <form novalidate class="searchBarWrapper" :style="setBarStyles" @submit.prevent="performSearch">
        <input
          id="search-box"
          v-model="searchText"
          name="search-box"
          type="text"
          :autocomplete="props.widget.ac ? 'on' : 'off'"
          :placeholder="placeholderText"
          :style="elementStyles"
        />
        <button v-if="props.widget.ic || props.widget.el" type="submit" :style="elementStyles">
          <fa v-if="props.widget.ic" icon="fa-magnifying-glass" fixed-width></fa>
          {{ props.widget.el ? currentEngine.label : '' }}
        </button>
        <DropdownMenu v-if="props.widget.ed" ref="engineMenu">
          <template #button>
            <button type="button" :style="elementStyles">
              <fa icon="fa-caret-down" fixed-width></fa>
            </button>
          </template>
          <template #menu>
            <div class="block">
              <div class="group compact stack">
                <button
                  v-if="props.widget.ce"
                  class="btn btnBlock w20"
                  :class="{ active: currentEngine.id === 'custom' }"
                  @click="setEngine(customEngine)"
                >
                  Custom
                </button>
                <button
                  v-for="en in searchEngines"
                  :key="en.id"
                  class="btn btnBlock w20"
                  :class="{ active: currentEngine.id === en.id }"
                  @click="setEngine(en)"
                >
                  {{ en.label }}
                </button>
              </div>
            </div>
          </template>
        </DropdownMenu>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchBarWrapper {
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
    font-size: inherit;
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
    font-size: inherit;
    color: currentColor;
    cursor: pointer;
    padding: var(--elementPadding) calc(var(--elementPadding) / 2);
    .svg-inline--fa {
      font-size: inherit;
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
