<script setup>
import { ref } from 'vue'
const props = defineProps({
  startOpen: {
    type: Boolean,
    default: false,
  },
})

const open = ref(null)
</script>

<template>
  <details :open="props.startOpen" class="block fieldAccordion" @toggle="open = $event.target.open">
    <summary class="group fill">
      <div class="group mra">
        <slot name="label"></slot>
      </div>
      <fa :icon="!open ? 'fa-caret-right' : 'fa-caret-down'" fixed-width />
    </summary>
    <div class="subBlockContainer fieldAccordionChildren">
      <slot name="children"></slot>
    </div>
  </details>
</template>

<style lang="scss" scoped>
.fieldAccordion {
  summary {
    min-height: 6.6rem;
    cursor: pointer;
    user-select: none;
    padding: var(--s5);
    margin: calc(var(--s5) * -1);
    width: auto;
    transition: margin 0.3s ease-out;
  }
}

.fieldAccordionChildren {
  margin-block-start: var(--s5);
}
</style>
