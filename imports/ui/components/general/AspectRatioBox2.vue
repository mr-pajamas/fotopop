<template>
  <div class="aspect-ratio-box">
    <img :src="imgSrc" :class="{ 'height-based': !!heightBased }">
    <!--<svg xmlns="http://www.w3.org/2000/svg" :viewBox="shimSvgViewBox" :class="{ 'height-based': !!heightBased }"></svg>-->
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
      imgSrc() {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='${[0, 0, (this.ratio ? this.ratio * 100 : 100), 100].join(' ')}'%3E%3C/svg%3E`;
      },
    },
  };
</script>

<style lang="scss" scoped>

  .aspect-ratio-box {
    position: relative;

    > img {
      display: block;
      width: 100% !important;
      height: auto !important;

      &.height-based {
        height: 100% !important;
        width: auto !important;
      }
    }

    > .aspect-ratio-box-inside {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
