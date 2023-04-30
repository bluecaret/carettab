import { onBeforeUnmount, onMounted } from 'vue'

export function useDetectOutsideClick(component, callback) {
  if (!component) return
  const listener = (event) => {
    if (event.target !== component.value && event.composedPath().includes(component.value)) {
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
