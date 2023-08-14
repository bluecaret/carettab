<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store.js'
import { getDynamicSize } from '@/helpers/widgets.js'

const store = useSettingsStore()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const isDynamicScaling = computed(() => {
  return props.widget.base.container.override
    ? props.widget.base.container.dynamicScaling
    : store.config.global.container.dynamicScaling
})

const getWidth = computed(() => {
  return `${
    props.widget.base.widthUnit === 'auto'
      ? 'max-content'
      : props.widget.base.widthUnit === 'pixels'
      ? getDynamicSize(props.widget.base.width, isDynamicScaling.value)
      : props.widget.base.width + '%'
  }`
})

const getHeight = computed(() => {
  return `${
    props.widget.base.heightUnit === 'auto'
      ? 'max-content'
      : props.widget.base.heightUnit === 'pixels'
      ? getDynamicSize(props.widget.base.height, isDynamicScaling.value)
      : props.widget.base.height + '%'
  }`
})

const getRadius = computed(() => {
  return getDynamicSize(props.widget.base.container.radius, isDynamicScaling.value)
})

const getBorderColor = computed(() => {
  return `hsl(${props.widget.base.container.borderColor[0]}deg ${props.widget.base.container.borderColor[1]}% ${props.widget.base.container.borderColor[2]}% / ${props.widget.base.container.borderColor[3]})`
})

const getBorderSize = computed(() => {
  return getDynamicSize(props.widget.base.container.borderSize, isDynamicScaling.value)
})

const getRotate = computed(() => {
  return `${props.widget.rotate}deg`
})

const getBackground = computed(() => {
  return `hsl(${props.widget.base.container.background[0]}deg ${props.widget.base.container.background[1]}% ${props.widget.base.container.background[2]}% / ${props.widget.base.container.background[3]})`
})

const getShadow = computed(() => {
  return props.widget.base.container.shadow[0]
    ? `${getDynamicSize(props.widget.base.container.shadow[1], isDynamicScaling.value)} ${getDynamicSize(
        props.widget.base.container.shadow[2],
        isDynamicScaling.value
      )} ${getDynamicSize(props.widget.base.container.shadow[3], isDynamicScaling.value)} hsl(${
        props.widget.base.container.shadow[4]
      }deg ${props.widget.base.container.shadow[5]}% ${props.widget.base.container.shadow[6]}% / ${
        props.widget.base.container.shadow[7]
      })`
    : 'none'
})

const getTranslate = computed(() => {
  return `${getDynamicSize(props.widget.base.x, isDynamicScaling.value)} ${getDynamicSize(
    -props.widget.base.y,
    isDynamicScaling.value
  )}`
})
</script>

<template>
  <div
    class="shape widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
  >
    <div class="inner" :class="props.widget.shape"></div>
  </div>
</template>

<style lang="scss" scoped>
.shape {
  width: v-bind(getWidth);
  height: v-bind(getHeight);
  translate: v-bind(getTranslate);
  filter: drop-shadow(v-bind(getShadow));
}
.inner {
  display: grid;
  rotate: v-bind(getRotate);
}
.rectangle,
.circle,
.halfCircle,
.triangle,
.parallelogram,
.pentagon,
.hexagon,
.heptagon,
.octagon,
.nonagon,
.decagon,
.bevel,
.rabbet,
.arrow,
.point,
.chevron,
.star,
.cross,
.plus,
.x,
.chat {
  width: v-bind(getWidth);
  height: v-bind(getHeight);
  background-color: v-bind(getBackground);
}
.rectangle,
.circle,
.halfCircle {
  border: v-bind(getBorderSize) solid v-bind(getBorderColor);
}
.rectangle {
  border-radius: v-bind(getRadius);
}
.circle {
  border-radius: 50%;
}
.halfCircle {
  border-radius: 50% / 100% 100% 0 0;
}
.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
.parallelogram {
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}
.pentagon {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}
.hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}
.heptagon {
  clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);
}
.octagon {
  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
}
.nonagon {
  clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%);
}
.decagon {
  clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%);
}
.bevel {
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
}
.rabbet {
  clip-path: polygon(
    0% 15%,
    15% 15%,
    15% 0%,
    85% 0%,
    85% 15%,
    100% 15%,
    100% 85%,
    85% 85%,
    85% 100%,
    15% 100%,
    15% 85%,
    0% 85%
  );
}
.arrow {
  clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);
}
.point {
  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
}
.chevron {
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
}
.star {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.cross {
  clip-path: polygon(
    10% 25%,
    35% 25%,
    35% 0%,
    65% 0%,
    65% 25%,
    90% 25%,
    90% 50%,
    65% 50%,
    65% 100%,
    35% 100%,
    35% 50%,
    10% 50%
  );
}
.plus {
  clip-path: polygon(
    0% 35%,
    35% 35%,
    35% 0%,
    65% 0%,
    65% 35%,
    100% 35%,
    100% 65%,
    65% 65%,
    65% 100%,
    35% 100%,
    35% 65%,
    0% 65%
  );
}
.x {
  clip-path: polygon(
    20% 0%,
    0% 20%,
    30% 50%,
    0% 80%,
    20% 100%,
    50% 70%,
    80% 100%,
    100% 80%,
    70% 50%,
    100% 20%,
    80% 0%,
    50% 30%
  );
}
.chat {
  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
}
</style>
