<template>
  <div class="aspect-ratio-box" :style="boxStyle">
    <div class="aspect-ratio-box-inside">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "aspect-ratio-box",
    props: ['ratio'],
    computed: {
      boxStyle() {
        return { paddingTop: `${1 / this.ratio * 100}%` };
      },
    },
  };
</script>

<style lang="scss" scoped>

  .aspect-ratio-box {
    height: 0;
    overflow: hidden;
    position: relative;
  }
  .aspect-ratio-box-inside {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
