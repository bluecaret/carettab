<script setup>
import { ref, watch, nextTick } from 'vue'
import { useDetectOutsideClick } from '@/helpers/outsideClick'

const props = defineProps({
  noTeleport: {
    type: Boolean,
    default: false,
  },
  closeOnClick: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const ddBtn = ref()
const ddMenu = ref()
const showDropdown = ref(false)

const toggleDropdown = () => {
  if (props.disabled) return
  showDropdown.value = !showDropdown.value
}

const updatePosition = () => {
  const btn = ddBtn.value
  const menu = ddMenu.value
  const btnRect = btn.getBoundingClientRect()
  const menuRect = menu.getBoundingClientRect()
  const spaceAbove = btnRect.top
  const spaceBelow = window.innerHeight - btnRect.bottom
  const spaceLeft = btnRect.left
  const spaceRight = window.innerWidth - btnRect.right
  const pad = 3

  const hasRoomAbove = spaceAbove > menuRect.height
  const hasRoomBelow = spaceBelow > menuRect.height
  const hasRoomLeft = spaceLeft > menuRect.width
  const hasRoomRight = spaceRight > menuRect.width

  if (hasRoomBelow) {
    menu.style.top = btnRect.bottom + pad + 'px'
  } else if (hasRoomAbove) {
    menu.style.top = btnRect.top - menuRect.height - pad + 'px'
  } else {
    menu.style.top = window.innerHeight - menuRect.height - pad * 2 + 'px'
  }

  if (hasRoomRight) {
    menu.style.left = btnRect.right - btnRect.width + 'px'
  } else if (hasRoomLeft) {
    menu.style.left = btnRect.right - menuRect.width + 'px'
  } else {
    menu.style.left = btnRect.right - btnRect.width + 'px'
  }

  if (!hasRoomAbove && !hasRoomBelow && hasRoomRight) {
    menu.style.left = btnRect.right + pad + 'px'
  } else if (!hasRoomAbove && !hasRoomBelow && hasRoomLeft) {
    menu.style.left = btnRect.left - menuRect.width - pad + 'px'
  }
}

watch(showDropdown, async () => {
  await nextTick()
  nextTick(() => {
    if (showDropdown.value) {
      updatePosition()
      ddMenu.value.focus()
    } else {
      ddBtn.value.querySelector('button').focus()
    }
  })
})

useDetectOutsideClick(
  ddBtn,
  () => {
    if (showDropdown.value) showDropdown.value = false
  },
  props.closeOnClick ? null : ddMenu
)

const close = () => {
  showDropdown.value = false
}

defineExpose({ close })
</script>

<template>
  <div class="dropdownWrapper">
    <div
      ref="ddBtn"
      tabindex="-1"
      class="dropdownButtonWrapper"
      :class="{ dropdownActive: showDropdown }"
      @click="toggleDropdown"
      @keyup.esc="close"
    >
      <slot name="button"> </slot>
    </div>
    <Teleport to="#dropdowns" :disabled="props.noTeleport">
      <div v-show="showDropdown" ref="ddMenu" class="dropdownMenuWrapper" tabindex="-1" @keyup.esc="close">
        <div class="dropdown">
          <slot name="menu"> </slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
.dropdownWrapper,
.dropdownButtonWrapper {
  display: flex;
}

.group > .dropdownWrapper,
.dropdownButtonWrapper {
  width: 100%;
}

.dropdownMenuWrapper {
  position: fixed;
  z-index: 95;
}

.dropdown {
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cDropdownBg);
  border: 0.1rem solid var(--cDropdownBorder);
  border-radius: var(--s3);
  overflow: hidden;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--cText);
}
</style>
