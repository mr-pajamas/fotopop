<template>
  <button class="styled-rounded-button" :style="{ backgroundColor: computedBottomColor }">
    <div class="button-layer" :style="{ backgroundColor: bgColor }"></div>
    <div class="button-content w-100" :style="{ color: fontColor }">
      <slot></slot>
    </div>
  </button>
</template>

<script>
  import Color from 'color';
  export default {
    name: 'styled-rounded-button',
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

  .styled-rounded-button {
    border-radius: .5rem;
    border: .2rem #0b0b0b solid;
    position: relative;
    overflow: hidden;
    padding: 0;

    .button-layer {
      height: 100%;
      position: absolute;
      top: -10%;
      left: -.2rem;
      right: -.2rem;
      border-radius: .55rem;
      /*z-index: 1;*/
    }

    .button-content {
      position: relative;
      /*z-index: 2;*/
      display: flex;
      align-items: center;
      justify-content: center;
      top: -2%;
      /*text-shadow: 0 .05rem 0 rgba(0,0,0,.5);*/
    }
  }
</style>
