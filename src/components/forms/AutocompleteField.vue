<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  selected: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  useLabel: {
    type: Boolean,
    default: false,
  },
  allowCustom: {
    type: Boolean,
    default: false,
  },
  tagId: {
    type: String,
  },
  list: {
    type: Array,
    default: () => [],
  },
  left: {
    type: Boolean,
    default: false,
  },
  fonts: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['selected'])

const inputValue = ref(
  props.selected
    ? props.allowCustom
      ? props.useLabel
        ? props.list.find((item) => item.id === props.selected)
          ? props.list.find((item) => item.id === props.selected).label
          : props.selected
        : props.list.find((item) => item.id === props.selected)
        ? props.list.find((item) => item.id === props.selected).id
        : props.selected
      : props.useLabel
      ? props.list.find((item) => item.id === props.selected)?.label
      : props.list.find((item) => item.id === props.selected)?.id
    : ''
)
const showList = ref(false)
const showFiltered = ref(false)
const selectedIndex = ref(-1)
const inputEl = ref(null)
const listEl = ref(null)

const filteredList = computed(() => {
  return props.list.filter(
    (item) =>
      item.id === '' ||
      item.label
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .includes(inputValue.value?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()) ||
      item.id
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .includes(inputValue.value?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
  )
})

function updateList() {
  selectedIndex.value = -1
}

function closeList() {
  showList.value = false
  if (props.allowCustom) return
  if (
    !filteredList.value.some((item) =>
      props.useLabel
        ? item.label.toLowerCase() === inputValue.value.toLowerCase()
        : item.id.toLowerCase() === inputValue.value.toLowerCase()
    )
  ) {
    inputValue.value = ''
  }
}

function selectItem(item) {
  inputValue.value = props.useLabel ? item.label : item.id
  emit('selected', item)
  showList.value = false
}

function handleKeyDown(event) {
  showFiltered.value = true
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % filteredList.value.length
      listEl.value.children[selectedIndex.value + 2].scrollIntoView({
        block: 'nearest',
        inline: 'center',
      })
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = selectedIndex.value <= 0 ? filteredList.value.length - 1 : selectedIndex.value - 1
      listEl.value.children[selectedIndex.value].scrollIntoView({
        block: 'nearest',
        inline: 'center',
      })
      break
    case 'Enter':
      event.preventDefault()
      if (filteredList.value[selectedIndex.value]) {
        selectItem(filteredList.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      closeList()
      break
  }
}

function handleDocClick() {
  if (
    inputEl.value &&
    !inputEl.value.contains(document.activeElement) &&
    listEl.value &&
    !listEl.value.contains(document.activeElement)
  ) {
    closeList()
  }
}

function clearInput() {
  inputValue.value = ''
  inputEl.value.focus()
}

onMounted(() => {
  document.addEventListener('click', handleDocClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocClick)
})
</script>

<template>
  <div class="autocomplete">
    <input
      :id="tagId"
      ref="inputEl"
      v-model="inputValue"
      class="autocompleteInput"
      autocomplete="off"
      :disabled="props.disabled ? 'disabled' : null"
      @input="updateList"
      @focus="showList = true"
      @keydown="handleKeyDown"
    />
    <button class="autocompleteClear" type="button" @click="clearInput">
      <fa icon="fa fa-close"></fa>
      {{ $t('common.clear') }}
    </button>
    <ul v-if="showList" ref="listEl" class="autocompleteList" tabindex="-1" :style="left && 'right: auto; left: 0;'">
      <li class="autocompleteItem">
        <button type="button" class="toggleFilterBtn" @click="showFiltered = !showFiltered">
          <div>
            <fa :icon="showFiltered ? 'fa-filter' : 'fa-filter-circle-xmark'" />
            {{ showFiltered ? $t('settings.filteredItems') : $t('settings.allItems') }}
          </div>
          <div class="switchViewBtn">
            {{ showFiltered ? $t('settings.viewAll') : $t('settings.viewFiltered') }}
          </div>
        </button>
      </li>
      <li
        v-for="(item, index) in showFiltered ? filteredList : props.list"
        :key="item.id"
        class="autocompleteItem"
        :class="{ active: selectedIndex === index }"
      >
        <FontLink
          v-if="props.fonts && !(allowCustom && index === 0)"
          :widget="{ id: item.id, base: { font: { bold: 400, family: item.label } } }"
        ></FontLink>
        <button
          v-if="allowCustom && index === 0"
          type="button"
          :style="props.fonts && `font-family: '${inputValue}';`"
          @click="selectItem({ id: inputValue, label: inputValue })"
        >
          <span style="opacity: 0.7">{{ $t('settings.custom') }}</span> {{ inputValue }}
        </button>
        <button v-else type="button" :style="props.fonts && `font-family: '${item.label}';`" @click="selectItem(item)">
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.autocomplete {
  position: relative;
  width: 100%;

  .autocompleteInput {
    background-image: linear-gradient(0deg, var(--cArrow) 50%, var(--cArrow) 50%),
      linear-gradient(0deg, var(--cArrow) 50%, var(--cArrow) 50%),
      linear-gradient(0deg, var(--cArrow) 50%, var(--cArrow) 50%),
      linear-gradient(to right, var(--cArrowFade), var(--cArrowFade));
    background-position: calc(100% - 0.9rem) calc(100% - 2.15rem), calc(100% - 0.9rem) calc(100% - 1.55rem),
      calc(100% - 0.9rem) calc(100% - 0.95rem), calc(100% - 2rem) 0.2em;
    background-size: 0.3rem 0.3rem, 0.3rem 0.3rem, 0.3rem 0.3rem, 1px 2.8rem;
    background-repeat: no-repeat;
    padding-right: 2.1rem;
    &:disabled {
      background-image: linear-gradient(0deg, var(--cArrowDisabled) 50%, var(--cArrowDisabled) 50%),
        linear-gradient(0deg, var(--cArrowDisabled) 50%, var(--cArrowDisabled) 50%),
        linear-gradient(0deg, var(--cArrowDisabled) 50%, var(--cArrowDisabled) 50%),
        linear-gradient(to right, var(--cArrowDisabled), var(--cArrowDisabled));
    }
  }

  .autocompleteClear {
    display: none;
    cursor: pointer;
    position: absolute;
    inset: 0.3rem 0.1rem auto auto;
    place-items: center;
    z-index: +1;
    padding: 0;
    gap: 0.3em;
    justify-content: center;
    width: 6rem;
    height: 2.8rem;
    background-color: var(--cInputBg);
    border: 0;
    border-left: 1px solid var(--cArrowFade);
    font-size: 1.4rem;
    color: var(--cArrow);
  }

  &:focus-within {
    .autocompleteInput {
      padding-right: 6.1rem;
    }
    .autocompleteClear {
      display: flex;
    }
  }

  .autocompleteList {
    --autocompleteBorder: hsl(var(--cInputBgH) var(--cInputBgS) calc(var(--cInputBgL) + 10%));
    position: absolute;
    right: 0;
    width: max-content;
    min-width: 100%;
    border: none;
    max-height: 200px;
    overflow-y: auto;
    border-top: 0.1rem solid var(--autocompleteBorder);
    border-bottom: 0.1rem solid var(--autocompleteBorder);
    box-shadow: 0 0 10px 0 var(--cShadow);
    background-color: var(--cInputBg);
    z-index: +1;
    margin: 0;
    padding: 0;
    .lightMode & {
      --autocompleteBorder: hsl(var(--cInputBgH) calc(var(--cInputBgS) - 40%) calc(var(--cInputBgL) - 20%));
    }
    .lightGrayMode & {
      --autocompleteBorder: hsl(var(--cInputBgH) 0% calc(var(--cInputBgL) - 20%));
    }

    .autocompleteItem {
      cursor: pointer;
      background-color: var(--cInputBg);
      border-bottom: 0.1rem solid var(--autocompleteBorder);
      border-left: 0.1rem solid var(--autocompleteBorder);
      border-right: 0.1rem solid var(--autocompleteBorder);
      font-family: inherit;
      font-size: 1.5rem;
      font-weight: 400;
      list-style: none;

      &:last-child {
        border-bottom: none;
      }

      button {
        width: 100%;
        padding: var(--s2) var(--s4);
        border: 0;
        background-color: transparent;
        text-align: left;
        cursor: pointer;
        max-width: 40rem;
      }
      button.toggleFilterBtn {
        display: flex;
        align-items: center;
        padding: var(--s4) var(--s4);
        color: var(--cTextSubtle);
        .switchViewBtn {
          border: 1px solid var(--cBtnBorder);
          color: var(--cBtnFg);
          padding: 0.1em 0.5em;
          margin-inline-start: auto;
          border-radius: var(--radius);
        }
      }

      &.active {
        background-color: hsl(var(--cInputBgH) var(--cInputBgS) calc(var(--cInputBgL) + 10%));
        .lightGrayMode &,
        .lightMode & {
          background-color: hsl(var(--cInputBgH) var(--cInputBgS) calc(var(--cInputBgL) - 10%));
        }
      }
    }

    .autocompleteDesc {
      padding: var(--s4) var(--s4) var(--s2);
      font-size: 0.9em;
      color: var(--cTextSubtle);
      cursor: default;
    }
  }
}
</style>
