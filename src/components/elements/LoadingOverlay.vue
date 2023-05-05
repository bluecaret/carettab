<template>
  <div class="app-loading">
    <div class="loading" :aria-label="$t('options.common.loadingPleaseWait')">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  background: hsl(0deg 0% 0% / 0.7);
  color: hsl(0deg, 0%, 80%);
  pointer-events: none;
}

.loading {
  display: block;
  margin-inline: auto;
  position: relative;
  width: 8rem;
  height: 8rem;
  div {
    position: absolute;
    top: 3.3rem;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    background: currentColor;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    &:nth-child(1) {
      left: 0.8rem;
      animation: loading-ellipsis1 0.6s infinite;
    }
    &:nth-child(2) {
      left: 0.8rem;
      animation: loading-ellipsis2 0.6s infinite;
    }
    &:nth-child(3) {
      left: 3.2rem;
      animation: loading-ellipsis2 0.6s infinite;
    }
    &:nth-child(4) {
      left: 5.6rem;
      animation: loading-ellipsis3 0.6s infinite;
    }
  }
}
@keyframes loading-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes loading-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(2.4rem, 0);
  }
}
@keyframes loading-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
