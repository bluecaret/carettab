<script setup>
import { ref } from 'vue'
import { setPermission } from '@/helpers/widgets.js'

const props = defineProps({
  permission: {
    type: String,
  },
  permissionLabel: {
    type: String,
  },
  reason: {
    type: String,
  },
  origins: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['requested'])
const show = ref(false)

const requestPermission = async () => {
  let request = await setPermission(props.permission, props.origins)
  emit('requested', request)
}
</script>

<template>
  <ModalWindow :show="show" size="460px">
    <template #button>
      <button type="button" class="btn" @click.stop="show = true">Allow permission&hellip;</button>
    </template>
    <template #window>
      <div class="block permissionModal">
        <div class="permissionContent">
          <button
            class="btn btnText close"
            type="button"
            aria-label="{{'options.common.close' | translate}}"
            @click="whatsNewModal = false"
          >
            <fa icon="fa-close" />
          </button>
          <h3>Allow CaretTab access to {{ props.permissionLabel }}?</h3>
          <p>{{ props.reason }}</p>
          <div class="group">
            <button type="button" class="btn btnText" @click="show = false">Deny</button>
            <button type="button" class="btn" @click="requestPermission()">Allow permission</button>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.permissionModal {
  position: relative;
  .close {
    display: inline-flex;
    float: right;
    margin-inline-start: 0.8em;
    margin-block-end: 0.5em;
    background-color: transparent;
    border: 0;
    min-height: 2.8rem;
    cursor: pointer;
  }
  h3 {
    margin: 0 0 var(--s5) 0;
    font-size: 2.2rem;
  }
  h4 {
    margin: 0 0 var(--s4) 0;
    font-size: 2rem;
    font-weight: 400;
  }
  p {
    font-size: 1.6rem;
  }
  .group {
    justify-content: flex-end;
  }
}
</style>
