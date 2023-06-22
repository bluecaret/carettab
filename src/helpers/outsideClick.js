import { onBeforeUnmount, onMounted } from 'vue'

export function useDetectOutsideClick(component, callback, component2 = null) {
  if (!component && !component2) return
  const listener = (event) => {
    if (
      (!component || event.target !== component.value) &&
      (!component2 || event.target !== component2.value) &&
      ((component && event.composedPath().includes(component.value)) ||
        (component2 && event.composedPath().includes(component2.value)))
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
