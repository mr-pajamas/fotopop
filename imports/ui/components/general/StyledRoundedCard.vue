<template>
  <div class="styled-rounded-card" :style="{ backgroundColor: computedBottomColor }">
    <div class="card-layer" :style="{ backgroundColor: bgColor }"></div>
    <div class="card-content w-100">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Color from 'color';
  export default {
    name: "styled-rounded-card",
    props: {
      bgColor: {
        type: String,
        default: '#fff',
      },
      bottomColor: {
        type: String,
      },
    },
    computed: {
      computedBottomColor() {
        return this.bottomColor || Color(this.bgColor).darken(.5).hex();
      },
    },
  }
</script>

<style lang="scss" scoped>

  .styled-rounded-card {
    border-radius: .8rem;
    position: relative;
    overflow: hidden;
    padding: 0;

    .card-layer {
      height: 100%;
      position: absolute;
      top: -.3rem;
      left: -.1rem;
      right: -.1rem;
      border-radius: .9rem;
      /*z-index: 1;*/
      background-image: url("/images/bg.svg");
      background-repeat: repeat;
      background-size: 325px;
    }

    .card-content {
      position: relative;
      /*z-index: 2;*/
      top: -.1.5rem;
      /*text-shadow: 0 .05rem 0 rgba(0,0,0,.5);*/
    }
  }
</style>
