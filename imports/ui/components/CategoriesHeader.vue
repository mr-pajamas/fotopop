<template>
  <div class="categories-header">
    <!--
    <div class="g1"></div>
    <div class="g2"></div>
    -->
    <!--<div class="filler"></div>-->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "categories-header",
  }
</script>

<style lang="scss" scoped>

  .categories-header {
    position: relative;
    background-image: url("/images/nav-bg.png"), linear-gradient(rgb(81,77,207), rgb(157,67,246));
    background-size: cover;
    background-position: center;

    /*background-image: linear-gradient(rgb(81,77,207), rgb(157,67,246));*/
    overflow: hidden;
    /*
    .g1, .g2 {
      position: absolute;
      background-image: linear-gradient(rgb(253,218,224), rgba(255,255,255,0));
      transform: rotate(-45deg);
      opacity: .13;
      transform-origin: top right;
    }

    > .filler {
      background-image: linear-gradient(transparent, rgb(157,67,246));
    }

    .g1 {
      right: 0;
      top: -75vw;
      width: 200%;
      height: 100%;
      opacity: .07;
    }

    .g2 {
      right: 0;
      top: -33vw;
      width: 200%;
      height: 100%;
    }

    > .content {
      position: relative;
    }
    */
  }
</style>
