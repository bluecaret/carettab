<script setup>
import { computed, inject, ref, onMounted, onBeforeUnmount, nextTick, watch, toRaw } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { setWidgetContainerStyles, hsl, shadow } from '@/helpers/widgets.js'

const store = useSettingsStore()
const user = inject('user')

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

// Game config
const defaultSnake = [
  { x: 3, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 1 },
]
const defaultApple = { x: 2, y: 3 }
const defaultDirection = 'RIGHT'
const gameSize = ref({ rows: 20, cols: 20 })
const snake = ref([...defaultSnake])
const apple = ref({ ...defaultApple })
const fontSize = ref(10)

// Game vars
let intervalId
let ctx, ctxBoard
const score = ref(0)
const highScore = ref(props.widget.highScore)
const newHighScore = ref(false)
const gameWon = ref(false)
const gameInProgress = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const direction = ref(defaultDirection + '')
const directionQueue = ref([])
const widgetRef = ref(null)
const canvasContainer = ref(null)
const canvasBoard = ref(null)
const canvas = ref(null)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
  widgetRef.value.addEventListener('focusout', handleFocusOut)
  nextTick(() => {
    prepBoardDisplay()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  widgetRef.value.removeEventListener('focusout', handleFocusOut)
  clearInterval(intervalId)
})

watch([props.widget], () => {
  resetGame()
  nextTick(() => {
    prepBoardDisplay()
  })
})

const gameStyleVars = computed(() => {
  return `
    --fontSize: ${fontSize.value}px;
    --gameShadow: ${shadow(
      props.widget.base.font.override ? props.widget.base.font.shadow : store.config.global.font.shadow
    )}
  `
})

const prepBoardDisplay = () => {
  // Reset canvas to zero first otherwise it prevents the container from being able to get smaller.
  canvasBoard.value.width = 0
  canvasBoard.value.height = 0
  canvas.value.width = 0
  canvas.value.height = 0
  canvasBoard.value.width = canvasContainer.value.clientWidth
  canvasBoard.value.height = canvasContainer.value.clientHeight
  canvas.value.width = canvasContainer.value.clientWidth
  canvas.value.height = canvasContainer.value.clientHeight
  const initialNumberOfCells = (canvasBoard.value.width - 2) / props.widget.grid.cellSize
  const remainingWidth = canvasBoard.value.width - 2 - initialNumberOfCells * props.widget.grid.cellSize
  const additionalCellWidth = remainingWidth / initialNumberOfCells
  const adjustedCellSize = Number(props.widget.grid.cellSize) + Number(additionalCellWidth)
  gameSize.value.cols = Math.floor((canvasBoard.value.width - 2) / adjustedCellSize)
  gameSize.value.rows = Math.floor((canvasBoard.value.height - 2) / adjustedCellSize)
  ctxBoard = canvasBoard.value.getContext('2d')
  ctx = canvas.value.getContext('2d')
  drawGame()
  const calcFontSize = canvasContainer.value.clientWidth * 0.03
  fontSize.value = calcFontSize < 32 ? calcFontSize : 32
}

const startGame = () => {
  clearInterval(intervalId)
  widgetRef.value.focus()
  score.value = 0
  newHighScore.value = false
  gameWon.value = false
  gamePaused.value = false
  gameOver.value = false
  gameInProgress.value = true
  intervalId = setInterval(move, 200)
}

const restartGame = () => {
  snake.value = [...defaultSnake]
  apple.value = { ...defaultApple }
  direction.value = defaultDirection
  startGame()
}

const resetGame = () => {
  clearInterval(intervalId)
  snake.value = [...defaultSnake]
  apple.value = { ...defaultApple }
  score.value = 0
  direction.value = defaultDirection
  newHighScore.value = false
  gameWon.value = false
  gamePaused.value = false
  gameOver.value = false
  gameInProgress.value = false
}

const resumeGame = () => {
  togglePause()
}

const togglePause = () => {
  if (gamePaused.value) {
    // Game is paused, resume it
    widgetRef.value.focus()
    intervalId = setInterval(move, 200)
  } else {
    // Game is running, pause it
    clearInterval(intervalId)
  }
  gamePaused.value = !gamePaused.value
}

const handleFocusOut = (event) => {
  if (!widgetRef.value.contains(event.activeElement) && !gameOver.value && gameInProgress.value && !gamePaused.value) {
    togglePause()
  }
}

const handleKeydown = (event) => {
  if (!widgetRef.value.contains(document.activeElement)) return
  if (gameOver.value) return
  if (!gameInProgress.value) return

  if (event.key === 'P' || event.key === 'p' || event.key === 'Escape') {
    togglePause()
    return
  }

  let newDirection = null
  switch (event.key) {
    case 'ArrowUp':
    case 'W':
    case 'w':
      if (direction.value !== 'DOWN') newDirection = 'UP'
      break
    case 'ArrowDown':
    case 'S':
    case 's':
      if (direction.value !== 'UP') newDirection = 'DOWN'
      break
    case 'ArrowLeft':
    case 'A':
    case 'a':
      if (direction.value !== 'RIGHT') newDirection = 'LEFT'
      break
    case 'ArrowRight':
    case 'D':
    case 'd':
      if (direction.value !== 'LEFT') newDirection = 'RIGHT'
      break
  }

  // Push the new direction to the queue if it's valid
  const maxQueueSize = 2
  if (newDirection && directionQueue.value.length < maxQueueSize) {
    directionQueue.value.push(newDirection)
  }
}

const move = () => {
  if (gameOver.value || gamePaused.value || !gameInProgress.value) return

  if (directionQueue.value.length > 0) {
    // Set the current direction to the next item in the queue and remove it
    direction.value = directionQueue.value.shift()
  }

  const head = { ...snake.value[0] }

  switch (direction.value) {
    case 'UP':
      head.y--
      break
    case 'DOWN':
      head.y++
      break
    case 'LEFT':
      head.x--
      break
    case 'RIGHT':
      head.x++
      break
  }

  // Boundary and self-collision checks
  if (
    head.x < 0 ||
    head.x >= gameSize.value.cols ||
    head.y < 0 ||
    head.y >= gameSize.value.rows ||
    snake.value.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver.value = true
    gameInProgress.value = false
    return
  }

  snake.value = [head, ...snake.value.slice(0, -1)]

  // Check apple collision
  if (head.x === apple.value.x && head.y === apple.value.y) {
    snake.value = [head, ...snake.value]
    getPoint()
    placeApple()
  }

  drawGame()
}

const placeApple = () => {
  // Generate all positions
  const allPositions = []
  for (let i = 0; i < gameSize.value.rows; i++) {
    for (let j = 0; j < gameSize.value.cols; j++) {
      allPositions.push({ x: j, y: i })
    }
  }

  // Filter out positions occupied by the snake
  const availablePositions = allPositions.filter(
    (pos) => !snake.value.some((segment) => segment.x === pos.x && segment.y === pos.y)
  )

  // Randomly pick one of the available positions for the apple
  if (availablePositions.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePositions.length)
    apple.value = availablePositions[randomIndex]
  } else {
    // No available position for apple (this would happen if the snake occupies the whole board)
    gameOver.value = true
    gameInProgress.value = false
    gameWon.value
  }
}

const getPoint = () => {
  score.value = score.value + 10
  if (score.value > highScore.value) {
    newHighScore.value = true
    highScore.value = score.value
    let widgetCopy = JSON.parse(JSON.stringify(props.widget))
    widgetCopy.highScore = score.value
    setStorage({ [props.widget.id]: { ...toRaw(widgetCopy) } }, 'sync')
  }
}

const handleResize = () => {
  resetGame()
  prepBoardDisplay()
}

const drawGame = () => {
  // (x, y, width, height)
  ctxBoard.clearRect(0, 0, canvasBoard.value.width, canvasBoard.value.height)

  // Draw the grid
  const cellSize = Math.floor((canvasBoard.value.width - 2) / gameSize.value.cols)

  for (let x = 0; x < gameSize.value.cols; x++) {
    for (let y = 0; y < gameSize.value.rows; y++) {
      const xPos = x * cellSize + 1
      const yPos = y * cellSize + 1
      ctxBoard.lineWidth = 1
      ctxBoard.strokeStyle = hsl(props.widget.grid.borderColor)
      ctxBoard.strokeRect(xPos, yPos, cellSize, cellSize)
      ctxBoard.fillStyle = hsl(props.widget.grid.cellColor)
      ctxBoard.fillRect(xPos, yPos, cellSize, cellSize)
    }
  }

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw the snake
  snake.value.forEach((segment, index) => {
    const xPos = segment.x * cellSize + 1
    const yPos = segment.y * cellSize + 1
    const radius = cellSize * 0.4

    ctx.fillStyle = hsl(props.widget.snake.color)

    const isSamePlaceAsHeadOrTail = () => {
      if (
        (segment.x === snake.value[0].x && segment.y === snake.value[0].y) ||
        (segment.x === snake.value[snake.value.length - 1].x && segment.y === snake.value[snake.value.length - 1].y)
      ) {
        return true
      }
      return false
    }

    const getDirection = (a, b) => {
      if (a.x < b.x) return 'RIGHT'
      if (a.x > b.x) return 'LEFT'
      if (a.y < b.y) return 'DOWN'
      if (a.y > b.y) return 'UP'
      return null
    }

    const prevSegment = snake.value[index - 1]
    const nextSegment = snake.value[index + 1]

    const prevDirection = prevSegment ? getDirection(segment, prevSegment) : null
    const nextDirection = nextSegment ? getDirection(segment, nextSegment) : null

    ctx.beginPath()

    if (index === 0) {
      if (direction.value === 'UP') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, radius, 0, 0])
      } else if (direction.value === 'DOWN') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, 0, radius, radius])
      } else if (direction.value === 'LEFT') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, 0, 0, radius])
      } else if (direction.value === 'RIGHT') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, radius, radius, 0])
      }
    } else if (index === snake.value.length - 1) {
      if (prevDirection === 'DOWN') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, radius, 0, 0])
      } else if (prevDirection === 'LEFT') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, radius, radius, 0])
      } else if (prevDirection === 'UP') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, 0, radius, radius])
      } else if (prevDirection === 'RIGHT') {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, 0, 0, radius])
      }
    } else if (isSamePlaceAsHeadOrTail()) {
      ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, radius, radius, radius])
    } else if (prevDirection !== null && nextDirection !== null) {
      if (
        (nextDirection === 'LEFT' && prevDirection === 'UP') ||
        (nextDirection === 'UP' && prevDirection === 'LEFT')
      ) {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, 0, radius, 0])
      } else if (
        (nextDirection === 'RIGHT' && prevDirection === 'UP') ||
        (nextDirection === 'UP' && prevDirection === 'RIGHT')
      ) {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, 0, 0, radius])
      } else if (
        (nextDirection === 'RIGHT' && prevDirection === 'DOWN') ||
        (nextDirection === 'DOWN' && prevDirection === 'RIGHT')
      ) {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, 0, 0, 0])
      } else if (
        (nextDirection === 'LEFT' && prevDirection === 'DOWN') ||
        (nextDirection === 'DOWN' && prevDirection === 'LEFT')
      ) {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [0, radius, 0, 0])
      } else if (
        (nextDirection === 'UP' && prevDirection === 'DOWN') ||
        (nextDirection === 'DOWN' && prevDirection === 'UP') ||
        (nextDirection === 'LEFT' && prevDirection === 'RIGHT') ||
        (nextDirection === 'RIGHT' && prevDirection === 'LEFT')
      ) {
        ctx.rect(xPos, yPos, cellSize, cellSize)
      } else {
        ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, radius, radius, radius])
      }
    } else {
      ctx.roundRect(xPos, yPos, cellSize, cellSize, [radius, radius, radius, radius])
    }

    ctx.closePath()
    ctx.fill()
  })

  // Draw the apple
  ctx.fillStyle = hsl(props.widget.fruit.color)
  ctx.beginPath()
  ctx.roundRect(
    apple.value.x * cellSize + cellSize * 0.05,
    apple.value.y * cellSize + cellSize * 0.05,
    cellSize * 0.9,
    cellSize * 0.9,
    cellSize * 0.4
  )
  ctx.fill()
  ctx.closePath()

  // Create leaf cutout
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  snake.value.forEach((segment, index) => {
    const xPos = segment.x * cellSize
    const yPos = segment.y * cellSize

    if (index === 0) {
      if (direction.value === 'DOWN') {
        // Two eyes for up or down
        ctx.beginPath()
        ctx.arc(xPos + cellSize / 4, yPos + cellSize / 1.3, cellSize / 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(xPos + (3 * cellSize) / 4, yPos + cellSize / 1.3, cellSize / 8, 0, 2 * Math.PI)
        ctx.fill()
      } else if (direction.value === 'UP') {
        // Two eyes for up or down
        ctx.beginPath()
        ctx.arc(xPos + cellSize / 4, yPos + cellSize / 4, cellSize / 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(xPos + (3 * cellSize) / 4, yPos + cellSize / 4, cellSize / 8, 0, 2 * Math.PI)
        ctx.fill()
      } else if (direction.value === 'LEFT') {
        ctx.beginPath()
        ctx.arc(xPos + (1 * cellSize) / 4, yPos + cellSize / 4, cellSize / 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.beginPath()
        ctx.roundRect(xPos, yPos + 0.6 * cellSize, cellSize * 0.7, cellSize * 0.12, [
          0,
          cellSize * 0.06,
          cellSize * 0.06,
          0,
        ])
        ctx.fill()
      } else {
        // One eye for left or right
        ctx.beginPath()
        ctx.arc(xPos + (3 * cellSize) / 4, yPos + cellSize / 4, cellSize / 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.beginPath()
        ctx.roundRect(xPos + 0.3 * cellSize, yPos + 0.6 * cellSize, cellSize * 0.7, cellSize * 0.12, [
          cellSize * 0.06,
          0,
          0,
          cellSize * 0.06,
        ])
        ctx.fill()
      }
    }
  })
  ctx.beginPath()
  ctx.moveTo(apple.value.x * cellSize + cellSize / 2.2, apple.value.y * cellSize)
  ctx.lineTo(apple.value.x * cellSize + (3 * cellSize) / 4, apple.value.y * cellSize + cellSize / 3)
  ctx.lineTo(apple.value.x * cellSize + (3 * cellSize) / 4, apple.value.y * cellSize)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
</script>

<template>
  <div
    ref="widgetRef"
    tabindex="-1"
    class="snake widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles"
  >
    <link
      :id="`google-font-link-${props.widget.id}`"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400&amp;display=swap"
    />
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <div class="widgetInner" :style="gameStyleVars">
      <aside class="stats">
        <div class="score" :title="$t('widget.score')"><fa icon="fa-worm" /> {{ score }}</div>
        <div class="score highScore" :title="$t('widget.highScore')"><fa icon="fa-crown" /> {{ highScore }}</div>
        <div class="score highScore" :title="$t('widget.gameSize')">
          <fa icon="fa-border-all" /> {{ gameSize.cols }}/{{ gameSize.rows }}
        </div>
      </aside>
      <div ref="canvasContainer" class="canvasContainer" :style="`color: ${hsl(props.widget.snake.color)}`">
        <canvas ref="canvasBoard"></canvas>
        <canvas
          ref="canvas"
          :class="{ canvasContainerHasOverlay: (gameInProgress && gamePaused) || !gameInProgress }"
        ></canvas>
        <div v-if="gameOver && gameWon && !gameInProgress" class="gameOverlay" @click="restartGame">
          <div>
            <p>{{ $t('widget.youWon') }}</p>
            <p v-if="!newHighScore" class="gameOverlaySmallText">{{ $t('widget.scoreColon') }} {{ score }}</p>
            <p v-if="newHighScore" class="gameOverlaySmallText">
              <span>* {{ $t('widget.newHighScore') }} *</span><br />{{ $t('widget.scoreColon') }} {{ score }}
            </p>
            <button type="submit">{{ $t('widget.restart') }}</button>
          </div>
        </div>
        <div v-if="gameOver && !gameWon && !gameInProgress" class="gameOverlay" @click="restartGame">
          <div>
            <p>{{ $t('widget.gameOver') }}</p>
            <p v-if="!newHighScore" class="gameOverlaySmallText">{{ $t('widget.scoreColon') }} {{ score }}</p>
            <p v-if="newHighScore" class="gameOverlaySmallText">
              <span>* {{ $t('widget.newHighScore') }} *</span><br />{{ $t('widget.scoreColon') }} {{ score }}
            </p>
            <button type="submit">{{ $t('widget.restart') }}</button>
          </div>
        </div>
        <div v-if="!gameOver && !gameInProgress" class="gameOverlay" @click="startGame">
          <div>
            <p>{{ $t('widget.playerReady') }}</p>
            <button>{{ $t('widget.start') }}</button>
          </div>
        </div>
        <div v-if="!gameOver && gameInProgress && gamePaused" class="gameOverlay" @click="resumeGame">
          <div>
            <p>{{ $t('widget.gamePaused') }}</p>
            <button>{{ $t('widget.resume') }}</button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.snake {
  grid-template: 1fr / 1fr;
  cursor: crosshair;
}
.snake:focus {
  outline: none;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-block-end: 0.4em;
  border-radius: 0.4em;
  text-shadow: inherit;
  overflow: hidden;
  .svg-inline--fa {
    filter: drop-shadow(var(--gameShadow));
  }
}

.score {
  display: flex;
  gap: 0.4em;
  font-size: 1em;
  min-width: 4em;
}

.widgetInner {
  display: grid;
  grid-template: auto 1fr / 1fr;
  height: 100%;
  font-family: 'Silkscreen', sans-serif;
  line-height: 1;
}

.canvasContainer {
  position: relative;
  display: grid;
  grid-template: 1fr / 1fr;
  overflow: hidden;
  .canvasContainerHasOverlay {
    // opacity: 0.2;
  }
  canvas {
    grid-area: 1 / 2 / 1 / 2;
  }
}

.gameOverlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-size: var(--fontSize);
  line-height: 1;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    place-items: center;
    gap: 0.4em;
    background: hsl(0deg 0% 0% / 0.6);
    border-radius: 1em;
    padding: 1em 1em 1.4em 1em;
  }
  button {
    display: grid;
    place-items: center;
    border: 2px solid currentColor;
    background: transparent;
    color: currentColor;
    padding: 0.2em 1em;
    border-radius: 3em;
    font-family: 'Silkscreen', sans-serif;
    line-height: 1;
    font-size: 1.4em;
    cursor: pointer;
    text-shadow: 0 0 0.3em hsl(0deg 0% 0% / 0.8);
    box-shadow: 0 0 0.3em hsl(0deg 0% 0% / 0.8);
  }
  p {
    margin: 0;
    font-size: 1.8em;
    font-weight: inherit;
    color: currentColor;
    text-shadow: 0 0 0.3em hsl(0deg 0% 0% / 0.8);
  }
  .gameOverlaySmallText {
    font-size: 1.2em;
  }
}
</style>
