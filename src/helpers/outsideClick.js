import { onBeforeUnmount, onMounted } from 'vue'

export function useDetectOutsideClick(component, callback, component2 = null) {
  if (!component && !component2) return
  const listener = (event) => {
    if (
      event.target !== component.value &&
      event.target !== component2.value &&
      (event.composedPath().includes(component.value) || event.composedPath().includes(component2.value))
    ) {
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
  onMounted(() => {
    window.addEventListener('click', listener)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })

  return { listener }
}
