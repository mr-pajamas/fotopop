<template>
  <button class="styled-pill-button" :style="{ backgroundColor: computedBottomColor }">
    <div class="button-layer" :style="{ backgroundColor: bgColor }"></div>
    <div class="button-content" :class="{ textShadow: textShadow }" :style="{ color: fontColor }">
      <slot></slot>
    </div>
  </button>
</template>

<script>
  import Color from 'color';
  export default {
    name: 'styled-pill-button',
    props: {
      bgColor: {
        type: String,
        default: '#fff',
      },
      color: {
        type: String,
      },
      bottomColor: {
        type: String,
      },
      textShadow: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      computedBottomColor() {
        return this.bottomColor || Color(this.bgColor).darken(.5).hex();
      },
      fontColor() {
        return this.color || (Color(this.bgColor).isDark() ? '#f8f9fa' : '#333333');
      },
    },
  };
</script>

<style lang="scss" scoped>

  .styled-pill-button {
    border-radius: 999px;
    border: .2rem #0b0b0b solid;
    position: relative;
    overflow: hidden;

    .button-layer {
      height: 110%;
      position: absolute;
      top: -17.5%;
      left: -2%;
      right: -2%;
      width: 104%;
      border-radius: 50rem;
      /*z-index: 1;*/
    }

    .button-content {
      position: relative;
      /*z-index: 2;*/
      display: flex;
      align-items: center;
      justify-content: center;
      top: -2%;

      &.text-shadow {
        text-shadow: 0 .1rem 0 rgba(0,0,0,.5);
      }
    }
  }
</style>
