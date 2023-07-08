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
  btnLabel: {
    type: String,
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
  <ModalWindow :show="show" size="460px" @close="show = false">
    <template #button>
      <button type="button" class="btn" @click.stop="show = true">
        {{ btnLabel ? btnLabel : $t('settings.allowPermission') }}&hellip;
      </button>
    </template>
    <template #window>
      <div class="modal">
        <header class="modalHeader">
          <h1 class="modalTitle">{{ $t('settings.allowCarettabAccessTo', [props.permissionLabel]) }}</h1>
          <button class="modalClose" type="button" :aria-label="$t('common.close')" @click="show = false">
            <fa icon="fa-xmark" />
          </button>
        </header>
        <div class="modalContent">
          <p>{{ props.reason }}</p>
          <div class="group fill">
            <button type="button" class="btn btnText mla" @click="show = false">{{ $t('common.deny') }}</button>
            <button type="button" class="btn" @click="requestPermission()">{{ $t('settings.allowPermission') }}</button>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>
