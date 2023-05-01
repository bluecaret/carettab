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
    const pad = 5

    ddMenu.value.style.left = `${btn.left}px`
    if (btn.left + menu.width > window.innerWidth - margin) {
      ddMenu.value.style.left = `${btn.left + btn.width - menu.width}px`
    }
    ddMenu.value.style.top = `${btn.top + btn.height + pad}px`
    if (btn.top + menu.height > window.innerHeight - margin) {
      ddMenu.value.style.top = `${btn.top - menu.height - pad}px`
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
    <Teleport to="#dropdowns">
      <div v-show="showDropdown" ref="ddMenu" class="dropdownMenuWrapper">
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
  position: absolute;
  z-index: 999;
}

.dropdown {
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cGrey1);
  border: 0.1rem solid var(--cGrey3Alt);
  border-radius: var(--s3);
  overflow: hidden;
}
</style>
