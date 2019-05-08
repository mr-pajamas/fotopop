<template>
  <div class="aspect-ratio-box">
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="shimSvgViewBox" :class="{ 'height-based': !!heightBased }"></svg>
    <div class="aspect-ratio-box-inside">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "aspect-ratio-box",
    props: ['ratio', 'heightBased'],
    computed: {
      shimSvgViewBox() {
        if (!this.ratio) return '0 0 100 100';
        return `0 0 ${this.ratio * 100} 100`;
      },
    },
  };
</script>

<style lang="scss" scoped>

  .aspect-ratio-box {
    position: relative;

    svg {
      width: 100% !important;
      height: auto !important;

      &.height-based {
        height: 100% !important;
        width: auto !important;
      }
    }

    .aspect-ratio-box-inside {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
