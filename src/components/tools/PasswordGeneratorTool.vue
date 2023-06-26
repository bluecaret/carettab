<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const length = ref(12)
const password = ref('')
const uppercase = ref(true)
const lowercase = ref(true)
const numbers = ref(true)
const exclamation = ref(false)
const at = ref(false)
const hashtag = ref(false)
const dollar = ref(false)
const percent = ref(false)
const caret = ref(false)
const ampersand = ref(false)
const asterisk = ref(false)
const parenthesis = ref(false)
const dash = ref(false)
const underscore = ref(false)
const plus = ref(false)
const equals = ref(false)
const pipe = ref(false)
const squarebracket = ref(false)
const curlybracket = ref(false)
const colon = ref(false)
const semicolon = ref(false)
const comma = ref(false)
const period = ref(false)
const fslash = ref(false)
const bslash = ref(false)
const tilde = ref(false)
const question = ref(false)
const any = ref(true)

const generatePassword = () => {
  let chars = ''
  if (uppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers.value) chars += '0123456789'
  if (exclamation.value) chars += '!'
  if (at.value) chars += '@'
  if (hashtag.value) chars += '#'
  if (dollar.value) chars += '$'
  if (percent.value) chars += '%'
  if (caret.value) chars += '^'
  if (ampersand.value) chars += '&'
  if (asterisk.value) chars += '*'
  if (parenthesis.value) chars += '()'
  if (dash.value) chars += '-'
  if (underscore.value) chars += '_'
  if (plus.value) chars += '+'
  if (equals.value) chars += '='
  if (pipe.value) chars += '|'
  if (squarebracket.value) chars += '[]'
  if (curlybracket.value) chars += '{}'
  if (colon.value) chars += ':'
  if (semicolon.value) chars += ';'
  if (comma.value) chars += ','
  if (period.value) chars += '.'
  if (fslash.value) chars += '/'
  if (bslash.value) chars += '\\'
  if (tilde.value) chars += '~'
  if (question.value) chars += '?'
  if (any.value) chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=|[]{}:;,./\\~?'

  let generatedPassword = ''
  for (let i = 0; i < length.value; i++) {
    generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = generatedPassword
}
</script>

<template>
  <div class="toolbarToolPanel panel">
    <div class="page">
      <h2 class="title">Password Generator</h2>
      <div class="blockContainer">
        <div class="block">
          <div class="group fill">
            <label class="label" for="length">Length</label>
            <div class="range fill">
              <output class="output">{{ length }}</output>
              <input id="length" v-model="length" type="range" class="rangeInput" min="8" max="32" />
            </div>
          </div>
        </div>
        <div class="block">
          <div class="group stack fill">
            <div class="group fill">
              <div class="label mra">Allowed characters</div>
              <div class="group compact">
                <label for="any" class="desc">Any</label>
                <ToggleField v-model="any" tag-id="any" />
              </div>
            </div>
            <template v-if="!any">
              <div class="group fill">
                <div class="group fill">
                  <label for="uppercase" class="label mla">A-Z</label>
                  <ToggleField v-model="uppercase" tag-id="uppercase" />
                </div>
                <div class="group fill">
                  <label for="lowercase" class="label mla">a-z</label>
                  <ToggleField v-model="lowercase" tag-id="lowercase" />
                </div>
                <div class="group fill">
                  <label for="numbers" class="label mla">0-9</label>
                  <ToggleField v-model="numbers" tag-id="numbers" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="exclamation" class="label mla">!</label>
                  <ToggleField v-model="exclamation" tag-id="exclamation" />
                </div>
                <div class="group fill">
                  <label for="at" class="label mla">@</label>
                  <ToggleField v-model="at" tag-id="at" />
                </div>
                <div class="group fill">
                  <label for="hashtag" class="label mla">#</label>
                  <ToggleField v-model="hashtag" tag-id="hashtag" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="dollar" class="label mla">$</label>
                  <ToggleField v-model="dollar" tag-id="dollar" />
                </div>
                <div class="group fill">
                  <label for="percent" class="label mla">%</label>
                  <ToggleField v-model="percent" tag-id="percent" />
                </div>
                <div class="group fill">
                  <label for="caret" class="label mla">^</label>
                  <ToggleField v-model="caret" tag-id="caret" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="ampersand" class="label mla">&</label>
                  <ToggleField v-model="ampersand" tag-id="ampersand" />
                </div>
                <div class="group fill">
                  <label for="asterisk" class="label mla">*</label>
                  <ToggleField v-model="asterisk" tag-id="asterisk" />
                </div>
                <div class="group fill">
                  <label for="underscore" class="label mla">_</label>
                  <ToggleField v-model="underscore" tag-id="underscore" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="plus" class="label mla">+</label>
                  <ToggleField v-model="plus" tag-id="plus" />
                </div>
                <div class="group fill">
                  <label for="tilde" class="label mla">~</label>
                  <ToggleField v-model="tilde" tag-id="tilde" />
                </div>
                <div class="group fill">
                  <label for="pipe" class="label mla">|</label>
                  <ToggleField v-model="pipe" tag-id="pipe" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="colon" class="label mla">:</label>
                  <ToggleField v-model="colon" tag-id="colon" />
                </div>
                <div class="group fill">
                  <label for="semicolon" class="label mla">;</label>
                  <ToggleField v-model="semicolon" tag-id="semicolon" />
                </div>
                <div class="group fill">
                  <label for="question" class="label mla">?</label>
                  <ToggleField v-model="question" tag-id="question" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="comma" class="label mla">,</label>
                  <ToggleField v-model="comma" tag-id="comma" />
                </div>
                <div class="group fill">
                  <label for="period" class="label mla">.</label>
                  <ToggleField v-model="period" tag-id="period" />
                </div>
                <div class="group fill">
                  <label for="hafslashshtag" class="label mla">/</label>
                  <ToggleField v-model="fslash" tag-id="fslash" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="bslash" class="label mla">\</label>
                  <ToggleField v-model="bslash" tag-id="bslash" />
                </div>
                <div class="group fill">
                  <label for="dash" class="label mla">-</label>
                  <ToggleField v-model="dash" tag-id="dash" />
                </div>
                <div class="group fill">
                  <label for="equals" class="label mla">=</label>
                  <ToggleField v-model="equals" tag-id="equals" />
                </div>
              </div>
              <div class="group fill">
                <div class="group fill">
                  <label for="parenthesis" class="label mla">( )</label>
                  <ToggleField v-model="parenthesis" tag-id="parenthesis" />
                </div>
                <div class="group fill">
                  <label for="squarebracket" class="label mla">[ ]</label>
                  <ToggleField v-model="squarebracket" tag-id="squarebracket" />
                </div>
                <div class="group fill">
                  <label for="curlybracket" class="label mla">{ }</label>
                  <ToggleField v-model="curlybracket" tag-id="curlybracket" />
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="block">
          <button type="button" class="btn mra mla" @click="generatePassword">Generate password</button>
        </div>
      </div>
      <div v-if="password" class="generated">
        <h3>Your generated password:</h3>
        <pre>{{ password }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  width: 42rem;
}

.generated {
  display: grid;
  font-family: Consolas, monaco, monospace;
  font-weight: 400;
  font-size: 2rem;
  background-color: var(--cBlock);
  border-radius: var(--s4);
  padding: var(--s6) var(--s6);
  overflow-wrap: anywhere;
  h3 {
    font-size: 1.3rem;
    font-weight: 400;
    margin: 0 0 var(--s3) 0;
    opacity: 0.4;
    user-select: none;
    pointer-events: none;
  }
  pre {
    white-space: pre-wrap;
    margin: 0;
  }
}
</style>
