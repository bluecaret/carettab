<script setup>
import { ref, computed, nextTick } from 'vue'
import convert from 'convert'
import { useConverterStore } from '@/components/tools/toolStore.js'

const store = useConverterStore()
const group = ref(store.group)
const loading = ref(false)
let timer = null

const openConverter = async (id) => {
  loading.value = true
  await nextTick()
  store.group = id.target.value
  store.fromValue = null
  store.toValue = null
  store.fromUnit = null
  store.toUnit = null
  loading.value = false
}

const swapUnits = () => {
  const from = store.fromUnit
  const to = store.toUnit
  store.fromUnit = to
  store.toUnit = from
  calc()
}

const calc = () => {
  if (!store.group || !store.fromUnit || !store.toUnit || !store.fromValue) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    let tempFrom = Number(store.fromValue.replace(/,/g, ''))
    store.toValue = convert(tempFrom, store.fromUnit).to(store.toUnit)
  }, 20)
}

const converters = [
  {
    id: 'area',
    label: 'Area',
    units: [
      { id: 'mm2', symbol: 'mm²', label: 'Square Millimeter (mm²)' },
      { id: 'cm2', symbol: 'cm²', label: 'Square Centimeter (cm²)' },
      { id: 'm2', symbol: 'm²', label: 'Square Meter (m²)' },
      { id: 'km2', symbol: 'km²', label: 'Square Kilometer (km²)' },
      { id: 'ha', symbol: 'ha', label: 'Hectare (ha)' },
      { id: 'acre', symbol: 'Acres', label: 'Acre' },
      { id: 'in2', symbol: 'in²', label: 'Square Inch (in²)' },
      { id: 'ft2', symbol: 'ft²', label: 'Square Foot (ft²)' },
      { id: 'yd2', symbol: 'yd²', label: 'Square Yard (yd²)' },
      { id: 'mi2', symbol: 'mi²', label: 'Square Mile (mi²)' },
    ],
  },
  {
    id: 'bytes',
    label: 'Data Sizes',
    units: [
      { id: 'bit', symbol: 'b', label: 'Bits (b)' },
      { id: 'nibble', symbol: 'Nibbles', label: 'Nibbles' },
      { id: 'byte', symbol: 'B', label: 'Bytes (B)' },
      { id: 'kilobit', symbol: 'Kb', label: 'Kilobits (Kb)' },
      { id: 'kilobyte', symbol: 'KB', label: 'Kilobytes (KB)' },
      { id: 'megabit', symbol: 'Mb', label: 'Megabits (Mb)' },
      { id: 'megabyte', symbol: 'MB', label: 'Megabytes (MB)' },
      { id: 'gigabit', symbol: 'Gb', label: 'Gigabits (Gb)' },
      { id: 'gigabyte', symbol: 'GB', label: 'Gigabytes (GB)' },
      { id: 'terabit', symbol: 'Tb', label: 'Terabits (Tb)' },
      { id: 'terabyte', symbol: 'TB', label: 'Terabytes (TB)' },
      { id: 'petabit', symbol: 'Pb', label: 'Petabits (Pb)' },
      { id: 'petabyte', symbol: 'PB', label: 'Petabytes (PB)' },
    ],
  },
  {
    id: 'length',
    label: 'Length',
    units: [
      { id: 'millimeter', symbol: 'mm', label: 'Millimeter (mm)' },
      { id: 'centimeter', symbol: 'cm', label: 'Centimeter (cm)' },
      { id: 'meter', symbol: 'm', label: 'Meter (m)' },
      { id: 'kilometer', symbol: 'km', label: 'Kilometer (km)' },
      { id: 'inch', symbol: 'in', label: 'Inch (in)' },
      { id: 'foot', symbol: 'ft', label: 'Foot (ft)' },
      { id: 'yard', symbol: 'yd', label: 'Yard (yd)' },
      { id: 'mile', symbol: 'mi', label: 'Mile (mi)' },
      { id: 'nmi', symbol: 'nmi', label: 'Nautical Mile (nmi)' },
      { id: 'micrometer', symbol: 'µm', label: 'Micrometer (µm)' },
      { id: 'nanometer', symbol: 'nm', label: 'Nanometer (nm)' },
      { id: 'picometer', symbol: 'pm', label: 'Picometer (pm)' },
      { id: 'light-year', symbol: 'light-years', label: 'Light Year' },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    units: [
      { id: 'celsius', symbol: '°C', label: 'Celsius (C)' },
      { id: 'fahrenheit', symbol: '°F', label: 'Fahrenheit (F)' },
      { id: 'kelvin', symbol: 'K', label: 'Kelvin (K)' },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    units: [
      { id: 'nanosecond', symbol: 'ns', label: 'Nanosecond (ns)' },
      { id: 'millisecond', symbol: 'ms', label: 'Millisecond (ms)' },
      { id: 'second', symbol: 'seconds', label: 'Second' },
      { id: 'minute', symbol: 'minutes', label: 'Minute' },
      { id: 'hour', symbol: 'hours', label: 'Hour' },
      { id: 'day', symbol: 'days', label: 'Day' },
      { id: 'week', symbol: 'weeks', label: 'Week' },
      { id: 'fortnight', symbol: 'fortnights', label: 'Fortnight' },
      { id: 'month', symbol: 'months', label: 'Month' },
      { id: 'year', symbol: 'years', label: 'Year' },
      { id: 'decade', symbol: 'decades', label: 'Decade' },
      { id: 'century', symbol: 'centuries', label: 'Century' },
      { id: 'millennium', symbol: 'millennia', label: 'Millennium' },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    units: [
      { id: 'mm3', symbol: 'mm³', label: 'Cubic Millimeter (mm³)' },
      { id: 'cm3', symbol: 'cm³', label: 'Cubic Centimeter (cm³)' },
      { id: 'milliliter', symbol: 'mL', label: 'Milliliter (mL)' },
      { id: 'liter', symbol: 'L', label: 'Liter (L)' },
      { id: 'm3', symbol: 'm³', label: 'Cubic Meter (m³)' },
      { id: 'km3', symbol: 'km³', label: 'Cubic Kilometer (km³)' },
      { id: 'in3', symbol: 'in³', label: 'Cubic Inch (in³)' },
      { id: 'ft3', symbol: 'ft³', label: 'Cubic Foot (ft³)' },
      { id: 'yd3', symbol: 'yd³', label: 'Cubic Yard (yd³)' },
      { id: 'fl oz', symbol: 'fl oz', label: 'Fluid Ounce - US (fl oz)' },
      { id: 'imp fl oz', symbol: 'fl oz', label: 'Fluid Ounce - Imperial (fl oz)' },
      { id: 'cup', symbol: 'cups', label: 'Cup' },
      { id: 'pint', symbol: 'pt', label: 'Pint - US (pt)' },
      { id: 'imperial pint', symbol: 'pt', label: 'Pint - Imperial (pt)' },
      { id: 'quart', symbol: 'qt', label: 'Quart - US (qt)' },
      { id: 'imperial quart', symbol: 'qt', label: 'Quart - Imperial (qt)' },
      { id: 'gallon', symbol: 'gal', label: 'Gallon - US (gal)' },
      { id: 'imperial gallon', symbol: 'gal', label: 'Gallon - Imperial (gal)' },
    ],
  },
  {
    id: 'weight',
    label: 'Weight (Mass)',
    units: [
      { id: 'milligram', symbol: 'mg', label: 'Milligram (mg)' },
      { id: 'gram', symbol: 'g', label: 'Gram (g)' },
      { id: 'kilogram', symbol: 'kg', label: 'Kilogram (kg)' },
      { id: 'metric ton', symbol: 't', label: 'Metric Tonne (t)' },
      { id: 'ounce', symbol: 'oz', label: 'Ounce (oz)' },
      { id: 'pound', symbol: 'lb', label: 'Pound (lb)' },
      { id: 'stone', symbol: 'st', label: 'Stone (st)' },
      { id: 'US ton', symbol: 'ton', label: 'Ton - US' },
      { id: 'imperial ton', symbol: 'ton', label: 'Ton - Imperial' },
    ],
  },
]

const getUnit = computed(() => {
  return store.group && store.toUnit
    ? converters.find((g) => g.id === store.group).units.find((u) => u.id === store.toUnit).symbol
    : ''
})
</script>

<template>
  <div class="toolbarToolPanel panel">
    <div class="page">
      <h2 class="title">Unit Converter</h2>
      <div class="blockContainer">
        <div class="block stack">
          <label for="type" class="label">Select a type of unit</label>
          <select id="type" v-model="group" name="type" class="select fill" @change="openConverter($event)">
            <option v-for="converter in converters" :key="converter.id" :value="converter.id">
              {{ converter.label }}
            </option>
          </select>
        </div>
        <div v-if="!loading && store.group" class="block stack">
          <label for="fromValue" class="label">From</label>
          <input
            id="fromValue"
            v-model="store.fromValue"
            type="text"
            class="input fill"
            placeholder="0"
            @keyup="calc()"
            @paste="calc()"
          />
          <select
            id="fromUnit"
            v-model="store.fromUnit"
            name="fromUnit"
            aria-label="From unit"
            class="select fill"
            @change="calc()"
          >
            <option v-for="unit in converters.find((g) => g.id === store.group).units" :key="unit.id" :value="unit.id">
              {{ unit.label }}
            </option>
          </select>
        </div>
        <div v-if="!loading && store.group" class="block stack">
          <label for="toUnit" class="label">To</label>
          <div class="group fill compact">
            <select id="toUnit" v-model="store.toUnit" name="toUnit" class="select fill" @change="calc()">
              <option
                v-for="unit in converters.find((g) => g.id === store.group).units"
                :key="unit.id"
                :value="unit.id"
              >
                {{ unit.label }}
              </option>
            </select>
            <button
              class="btn"
              type="button"
              style="justify-content: center"
              aria-label="Swap units"
              title="Swap units"
              @click="swapUnits()"
            >
              <fa icon="fa-right-left" />
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="store.group && store.fromValue && store.fromUnit && store.toUnit && store.toValue"
        class="convertedValue"
      >
        <h3>Your new value is:</h3>
        <pre>{{ store.toValue ? store.toValue.toLocaleString() : '' }} {{ getUnit }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  width: 36rem;
}

.convertedValue {
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
