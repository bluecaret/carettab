<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const previousOperand = ref('')
const currentOperand = ref('')
const previousComputeResult = ref('')
const operation = ref(null)
const calcPanel = ref(null)

onMounted(() => {
  calcPanel.value.focus()
  document.addEventListener('keydown', handleKeyup)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyup)
})

const clearCalc = () => {
  operation.value = undefined
  previousComputeResult.value = ''
  previousOperand.value = ''
  currentOperand.value = ''
}

const deleteDigit = () => {
  currentOperand.value = currentOperand.value.toString().slice(0, -1)
}

const appendNumber = (number) => {
  if (number === '.' && currentOperand.value.includes('.')) return
  currentOperand.value = currentOperand.value.toString() + number.toString()
}

const chooseOperation = (op) => {
  if (currentOperand.value === '' && previousOperand.value === '') return
  if (currentOperand.value !== '' && previousOperand.value !== '') {
    compute()
  }
  if (currentOperand.value !== '' && previousOperand.value === '') {
    previousOperand.value = currentOperand.value
    currentOperand.value = ''
  }
  operation.value = op
}

const compute = () => {
  let computation, previousCompute
  const prev = parseFloat(previousOperand.value)
  const current = parseFloat(currentOperand.value)
  if (isNaN(prev) || isNaN(current)) return
  switch (operation.value) {
    case '+':
      computation = prev + current
      previousCompute = `${prev} + ${current} =`
      break
    case '-':
      computation = prev - current
      previousCompute = `${prev} - ${current} =`
      break
    case '*':
      computation = prev * current
      previousCompute = `${prev} * ${current} =`
      break
    case '÷':
      computation = prev / current
      previousCompute = `${prev} ÷ ${current} =`
      break
    default:
      return
  }
  previousComputeResult.value = previousCompute
  currentOperand.value = computation
  operation.value = undefined
  previousOperand.value = ''
}

const getPreviousDisplayNumber = computed(() => {
  const stringNumber = previousOperand.value.toString()
  const integerDigits = parseFloat(stringNumber.split('.')[0])
  const decimalDigits = stringNumber.split('.')[1]
  let integerDisplay
  if (isNaN(integerDigits)) {
    integerDisplay = ''
  } else {
    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
  }
  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}${operation.value ? ' ' + operation.value : ''}`
  } else {
    return `${integerDisplay}${operation.value ? ' ' + operation.value : ''}`
  }
})

const getCurrentDisplayNumber = computed(() => {
  const stringNumber = currentOperand.value.toString()
  const integerDigits = parseFloat(stringNumber.split('.')[0])
  const decimalDigits = stringNumber.split('.')[1]
  let integerDisplay
  if (isNaN(integerDigits)) {
    integerDisplay = ''
  } else {
    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
  }
  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}`
  } else {
    return integerDisplay
  }
})

const handleKeyup = (e) => {
  const key = e.key
  if (key === 'Backspace') {
    deleteDigit()
  } else if (key === 'Delete') {
    deleteDigit()
  } else if (key === 'Escape') {
    clearCalc()
  } else if (key === 'Enter' || key === '=') {
    compute()
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    chooseOperation(key)
  } else if (key === '.') {
    appendNumber(key)
  } else if (
    key === '0' ||
    key === '1' ||
    key === '2' ||
    key === '3' ||
    key === '4' ||
    key === '5' ||
    key === '6' ||
    key === '7' ||
    key === '8' ||
    key === '9'
  ) {
    appendNumber(key)
  }
}
</script>

<template>
  <div class="toolbarToolPanel panel">
    <div class="page">
      <h2 class="title">Calculator</h2>
      <div ref="calcPanel" class="calculator" tabindex="-1">
        <div class="display">
          <div class="previous-operand">
            {{
              getPreviousDisplayNumber ? getPreviousDisplayNumber : previousComputeResult ? previousComputeResult : ''
            }}
          </div>
          <div class="current-operand">{{ getCurrentDisplayNumber }}</div>
        </div>

        <button class="calcBtn calcBtnSecondary calcBtnSpan" @click="clearCalc()">AC</button>
        <button class="calcBtn calcBtnSecondary" @click="deleteDigit()">DEL</button>
        <button class="calcBtn calcBtnSecondary" @click="chooseOperation('÷')"><fa icon="fa-divide" /></button>
        <button class="calcBtn" @click="appendNumber('1')">1</button>
        <button class="calcBtn" @click="appendNumber('2')">2</button>
        <button class="calcBtn" @click="appendNumber('3')">3</button>
        <button class="calcBtn calcBtnSecondary" @click="chooseOperation('*')"><fa icon="fa-xmark" /></button>
        <button class="calcBtn" @click="appendNumber('4')">4</button>
        <button class="calcBtn" @click="appendNumber('5')">5</button>
        <button class="calcBtn" @click="appendNumber('6')">6</button>
        <button class="calcBtn calcBtnSecondary" @click="chooseOperation('+')"><fa icon="fa-plus" /></button>
        <button class="calcBtn" @click="appendNumber('7')">7</button>
        <button class="calcBtn" @click="appendNumber('8')">8</button>
        <button class="calcBtn" @click="appendNumber('9')">9</button>
        <button class="calcBtn calcBtnSecondary" @click="chooseOperation('-')"><fa icon="fa-minus" /></button>
        <button class="calcBtn calcBtnSecondary" @click="appendNumber('.')">.</button>
        <button class="calcBtn" @click="appendNumber('0')">0</button>
        <button class="calcBtn calcBtnSecondary calcBtnSpan" @click="compute()"><fa icon="fa-equals" /></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  width: 36rem;
}

.calculator {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto repeat(5, 1fr);
  align-content: center;
  justify-content: center;
  gap: 0.8rem;
  &:focus-visible {
    outline-offset: 0.8rem;
  }
}

.display {
  grid-column: 1 / -1;
  background-color: hsl(var(--g1H) var(--g1S) calc(var(--g1L) - 3%));
  display: grid;
  grid-template: auto auto / 1fr;
  align-items: end;
  justify-content: end;
  gap: 0.2em;
  padding: var(--s4);
  word-wrap: break-word;
  word-break: break-all;
  border-radius: var(--s4);
  .previous-operand {
    display: grid;
    place-items: end;
    color: rgba(255, 255, 255, 0.75);
    font-size: 1.8rem;
    min-height: 2.4rem;
    text-align: right;
  }
  .current-operand {
    display: grid;
    place-items: end;
    color: white;
    font-size: 3.8rem;
    min-height: 4.4rem;
    text-align: right;
  }
}

.calcBtn {
  display: grid;
  place-items: center;
  font-size: 1.6em;
  height: 6rem;
  cursor: pointer;
  background-color: hsl(var(--g3H) var(--g3S) calc(var(--g3L) + 2%));
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 400;
  border: 0;
  border-radius: var(--s4);
  color: #fff;
  &:hover {
    background-color: hsl(var(--g3H) var(--g3S) calc(var(--g3L) + 4%));
  }
  &:nth-child(2),
  &:nth-child(3) {
    font-size: 1em;
  }
  .svg-inline--fa {
    font-size: 0.8em;
  }
}

.calcBtnSecondary {
  background-color: var(--g3);
  color: var(--cTextSubtle);
  font-weight: 600;
}

.calcBtnSpan {
  grid-column: span 2;
}
</style>
