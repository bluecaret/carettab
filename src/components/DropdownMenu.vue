<script setup>
import { ref, watch, nextTick } from 'vue'
import { useDetectOutsideClick } from '../helpers/outsideClick'

const ddWrapper = ref()
const ddBtn = ref()
const ddMenu = ref()
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const updatePosition = () => {
  if (ddBtn.value && ddMenu.value) {
    const btn = ddBtn.value.getBoundingClientRect()
    const menu = ddMenu.value.getBoundingClientRect()
    const margin = 20

    if (btn.top + btn.height + menu.height > window.innerHeight - margin) {
      if (btn.left + btn.width + menu.width > window.innerWidth - margin) {
        ddMenu.value.style.translate = `-${menu.width - btn.width}px -${menu.height + 4}px`
      } else {
        ddMenu.value.style.translate = `0 -${menu.height + 4}px`
      }
    } else {
      if (btn.left + btn.width + menu.width > window.innerWidth - margin) {
        ddMenu.value.style.translate = `-${menu.width - btn.width}px ${btn.height + 4}px`
      } else {
        ddMenu.value.style.translate = `0 ${btn.height + 4}px`
      }
    }
  }
}

watch(showDropdown, async () => {
  await nextTick()
  if (showDropdown.value) {
    updatePosition()
  }
})

useDetectOutsideClick(ddWrapper, () => {
  if (showDropdown.value) showDropdown.value = false
})

const close = () => {
  showDropdown.value = false
}

defineExpose({ close })
</script>

<template>
  <div ref="ddWrapper" class="dropdownWrapper">
    <div ref="ddBtn" class="dropdownButtonWrapper" @click="toggleDropdown">
      <slot name="button"> </slot>
    </div>
    <div v-show="showDropdown" ref="ddMenu" class="dropdownMenuWrapper">
      <div class="dropdown">
        <slot name="menu"> </slot>
      </div>
    </div>
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
  position: absolute;
  z-index: 999;
}

.dropdown {
  position: sticky;
  z-index: 1000;
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cGrey3);
  border: 0.1rem solid var(--cGrey3Alt);
  border-radius: var(--s3);
}
</style>
