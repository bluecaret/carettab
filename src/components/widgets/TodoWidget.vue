<script setup>
import { ref, computed, inject, toRaw, onMounted, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore, generateUID, setStorage } from '@/store.js'
import { setWidgetContainerStyles, hsl } from '@/helpers/widgets.js'
import { TodoItem } from '@/components/widgets/Todo.js'

const store = useSettingsStore()
const user = inject('user')
const newNameEl = ref(null)
const taskMenuEl = ref(null)
const addTaskMenuEl = ref(null)
const editing = ref(null)
const editingName = ref('')
const newModal = ref(false)
const newName = ref('')
const filteredList = ref([])

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

onMounted(() => {
  handleFilterSet()
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const getFilterName = computed(() => {
  switch (props.widget.filter) {
    case 'all':
      return 'All'
    case 'done':
      return 'Done'
    case 'undone':
      return 'Not done'
    case 'flag':
      return 'Flag'
    case 'noflag':
      return 'No Flag'

    default:
      return 'All'
  }
})

const handleFlag = (task) => {
  props.widget.list.find((t) => t.id === task.id).flag = !task.flag
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleMarkDone = (task) => {
  props.widget.list.find((t) => t.id === task.id).done = !task.done
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleDelete = (task) => {
  let index = props.widget.list.findIndex((t) => t.id === task.id)
  store.config.todos.find((t) => t.id === props.widget.id).list.splice(index, 1)
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleEditOpen = (task) => {
  editingName.value = props.widget.list.find((t) => t.id === task.id).name
  editing.value = task.id
}

const handleEditSave = (task) => {
  const item = props.widget.list.find((t) => t.id === task.id)
  item.name = editingName.value
  editing.value = null
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
}

const handleAddModalOpen = () => {
  newModal.value = true
  newName.value = ''
  nextTick(() => {
    newNameEl.value.focus()
  })
}

const handleAddModalClose = () => {
  newName.value = ''
  newModal.value = false
}

const handleAddTask = () => {
  let newTask = new TodoItem()
  newTask.id = 'tdi-' + generateUID()
  newTask.name = newName.value
  store.config.todos.find((t) => t.id === props.widget.id).list.push(newTask)
  handleAddModalClose()
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleClearFlags = () => {
  addTaskMenuEl.value.close()
  store.config.todos
    .find((t) => t.id === props.widget.id)
    .list.forEach((t) => {
      t.flag = false
    })
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleMarkAllDone = () => {
  addTaskMenuEl.value.close()
  store.config.todos
    .find((t) => t.id === props.widget.id)
    .list.forEach((t) => {
      t.done = true
    })
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleMarkAllUndone = () => {
  addTaskMenuEl.value.close()
  store.config.todos
    .find((t) => t.id === props.widget.id)
    .list.forEach((t) => {
      t.done = false
    })
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleDeleteDone = () => {
  addTaskMenuEl.value.close()
  const newList = props.widget.list.filter((t) => t.done === false)
  store.config.todos.find((t) => t.id === props.widget.id).list = [...newList]
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
  handleFilterSet()
}

const handleDeleteAll = () => {
  if (confirm('Delete all Todo items?')) {
    addTaskMenuEl.value.close()
    store.config.todos.find((t) => t.id === props.widget.id).list = []
    setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
    handleFilterSet()
  }
}

const handleListReorder = () => {
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
}

const handleFilterSet = (filter = props.widget.filter) => {
  switch (filter) {
    case 'all':
      filteredList.value = [...props.widget.list]
      break
    case 'done':
      filteredList.value = [...props.widget.list.filter((t) => t.done)]
      break
    case 'undone':
      filteredList.value = [...props.widget.list.filter((t) => !t.done)]
      break
    case 'flag':
      filteredList.value = [...props.widget.list.filter((t) => t.flag)]
      break
    case 'noflag':
      filteredList.value = [...props.widget.list.filter((t) => !t.flag)]
      break

    default:
      filteredList.value = [...props.widget.list]
      break
  }
}

const handleFilterChange = () => {
  let todo = store.config.todos.find((t) => t.id === props.widget.id)
  switch (props.widget.filter) {
    case 'all':
      todo.filter = 'done'
      break
    case 'done':
      todo.filter = 'undone'
      break
    case 'undone':
      todo.filter = 'flag'
      break
    case 'flag':
      todo.filter = 'noflag'
      break
    case 'noflag':
      todo.filter = 'all'
      break

    default:
      todo.filter = 'all'
      break
  }
  handleFilterSet(todo.filter)
  setStorage({ [props.widget.id]: { ...toRaw(props.widget) } }, 'sync')
}

const strikethrough = computed(() => {
  return props.widget.done.strikethrough ? 'line-through' : 'none'
})

const doneColor = computed(() => {
  return props.widget.done.overrideColor
    ? hsl(props.widget.done.color)
    : hsl(store.config.global.element.secondaryColor)
})
</script>

<template>
  <div
    class="todo widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner">
      <div class="heading">
        <h2 class="title">Todo</h2>
      </div>

      <draggable
        class="list"
        :list="filteredList"
        item-key="id"
        ghost-class="dragGhost"
        chosen-class="dragChosen"
        drag-class="dragMove"
        handle=".drag"
        @start="drag = true"
        @end="drag = false"
        @change="handleListReorder()"
      >
        <template #item="{ element }">
          <li class="task" :class="{ done: element.done }">
            <DropdownMenu ref="taskMenuEl" :close-on-click="true">
              <template #button>
                <button type="button" class="menuBtn">
                  <fa icon="fa-ellipsis" fixed-width />
                </button>
              </template>
              <template #menu>
                <ul class="taskMenu">
                  <li>
                    <button
                      class="btn btnBlock"
                      :class="{ active: element.flag }"
                      type="button"
                      @click="handleFlag(element)"
                    >
                      <fa icon="fa-flag" fixed-width />Flag
                    </button>
                  </li>
                  <li>
                    <ModalWindow :show="editing === element.id" size="460px">
                      <template #button>
                        <button class="btn btnBlock" type="button" @click="handleEditOpen(element)">
                          <fa icon="fa-pen" fixed-width />Edit
                        </button>
                      </template>
                      <template #window>
                        <div class="block editModal">
                          <div class="fill">
                            <button class="btn btnText close" type="button" aria-label="Close" @click="editing = null">
                              <fa icon="fa-close" />
                            </button>
                            <h3>Edit task</h3>
                          </div>
                          <div class="group fill compact">
                            <input v-model="editingName" type="text" class="input" />
                            <button type="button" class="btn" @click="handleEditSave(element)">Save</button>
                          </div>
                        </div>
                      </template>
                    </ModalWindow>
                  </li>
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleDelete(element)">
                      <fa icon="fa-trash" fixed-width />Delete
                    </button>
                  </li>
                </ul>
              </template>
            </DropdownMenu>
            <button type="button" class="taskToggle" @click="handleMarkDone(element)">
              <div class="check">
                <fa v-if="!element.done" icon="fa-circle" fixed-width />
                <fa v-else icon="fa-circle-check" fixed-width />
              </div>
              <div v-if="element.flag" class="flag"><fa icon="fa-flag" fixed-width /></div>
              <div class="name">{{ element.name }}</div>
            </button>
            <div type="button" class="drag fit">
              <fa icon="fa-grip-vertical" size="xs"></fa>
            </div>
          </li>
        </template>
        <template #footer>
          <li class="task">
            <DropdownMenu ref="addTaskMenuEl">
              <template #button>
                <button type="button" class="menuBtn">
                  <fa icon="fa-ellipsis" fixed-width />
                </button>
              </template>
              <template #menu>
                <ul class="taskMenu">
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleFilterChange()">
                      <fa icon="fa-filter" fixed-width /> Filter: {{ getFilterName }}
                    </button>
                  </li>
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleMarkAllDone()">
                      <fa icon="fa-circle-check" fixed-width />Mark all as done
                    </button>
                  </li>
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleMarkAllUndone()">
                      <fa icon="fa-circle" fixed-width />Mark all as undone
                    </button>
                  </li>
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleClearFlags()">
                      <fa icon="fa-flag" fixed-width />Clear all flags
                    </button>
                  </li>
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleDeleteDone()">
                      <fa icon="fa-trash" fixed-width />Delete done tasks
                    </button>
                  </li>
                  <li>
                    <button class="btn btnBlock" type="button" @click="handleDeleteAll()">
                      <fa icon="fa-trash" fixed-width />Delete all tasks
                    </button>
                  </li>
                </ul>
              </template>
            </DropdownMenu>
            <ModalWindow :show="newModal" size="460px">
              <template #button>
                <button type="button" class="taskToggle" @click="handleAddModalOpen()">
                  <div class="check">
                    <fa icon="fa-circle-plus" fixed-width />
                  </div>
                  <div class="addTaskName">Add task...</div>
                </button>
              </template>
              <template #window>
                <div class="block editModal">
                  <div class="fill">
                    <button class="btn btnText close" type="button" aria-label="Close" @click="handleAddModalClose()">
                      <fa icon="fa-close" />
                    </button>
                    <h3>Add task</h3>
                  </div>
                  <form novalidate class="group fill compact" @submit.prevent="handleAddTask()">
                    <input ref="newNameEl" v-model="newName" type="text" class="input" />
                    <button type="submit" class="btn">Save</button>
                  </form>
                </div>
              </template>
            </ModalWindow>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo {
  grid-template-columns: 1fr;
}

.heading {
  display: flex;
  // justify-content: space-between;
  gap: 0.6em;
  align-items: center;
  margin-block-end: 0.4em;
  padding-inline: 0.3em;
}

.title {
  font-size: 1.4em;
  margin: 0;
}

.filter,
.menuBtn,
.taskToggle {
  background: transparent;
  color: currentColor;
  border: none;
  padding: 0;
  cursor: pointer;
}

.taskToggle {
  display: flex;
  gap: 0.3em;
  margin-inline-end: auto;
  align-items: center;
  text-align: inherit;
}

.list {
  display: grid;
  grid-template: auto / 1fr;
  gap: 0.2em;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.3em;
  .drag {
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover,
  &.focus-within {
    .drag {
      opacity: 0.6;
    }
  }
}

.done {
  .check .svg-inline--fa {
    color: v-bind(doneColor);
  }
  .flag .svg-inline--fa {
    color: v-bind(doneColor);
  }
  .name {
    text-decoration: v-bind(strikethrough);
    color: v-bind(doneColor);
  }
}

.addTaskName {
  opacity: 0.7;
}

.taskMenu {
  list-style: none;
  display: grid;
  grid-template: auto / 1fr;
  margin: 0;
  gap: var(--s4);
  padding: var(--s4);
}

.editModal {
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

.dragGhost {
  background: transparent;
  outline: 2px solid currentColor;
  outline-offset: 0;
}
</style>
