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
    /*
    background-image: url("data:image/svg+xml,%3Csvg width='750' height='340' viewBox='0 0 750 340' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='0%25' y1='171.296%25' x2='3.831%25' y2='0%25' id='a'%3E%3Cstop stop-color='%23514DCF' offset='0%25'/%3E%3Cstop stop-color='%239D43F6' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='56.086%25' y1='95.93%25' x2='56.086%25' y2='-3.835%25' id='b'%3E%3Cstop stop-color='%23FFF' stop-opacity='0' offset='0%25'/%3E%3Cstop stop-color='%23FDDAE0' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='url(%23a)' d='M0 0h750v340H0z'/%3E%3Cpath fill='url(%23b)' opacity='.127' d='M576.242 0L206 340h544V0z'/%3E%3Cpath fill='%238A45ED' d='M0 0v267.43L270.477 0z'/%3E%3C/g%3E%3C/svg%3E");
    */
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
