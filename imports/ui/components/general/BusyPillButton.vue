<template>
  <button class="busy-pill-button" :style="{ backgroundColor: bgColor }">
    <yoyo-spinner :color1="spinnerColor1" :color2="spinnerColor2" :duration="3" />

    <div class="button-content w-100" :class="{ 'text-shadow': textShadow }" :style="{ color: fontColor, backgroundColor: bgColor }">
      <slot></slot>
    </div>
  </button>
</template>

<script>
  import Color from 'color';
  import YoyoSpinner from './YoyoSpinner.vue';
  export default {
    name: "busy-pill-button",
    components: { YoyoSpinner },
    props: {
      bgColor: {
        type: String,
        default: 'rgb(216,216,216)',
      },
      color: {
        type: String,
      },
      textShadow: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      fontColor() {
        return this.color || (Color(this.bgColor).isDark() ? '#f8f9fa' : '#333333');
      },
      spinnerColor1() {
        return Color(this.spinnerColor2).lighten(.5).hex();
      },
      spinnerColor2() {
        return Color(this.bgColor).lighten(.3).hex();
      },
    },
  };
</script>

<style lang="scss" scoped>

  .busy-pill-button {
    border-radius: 50rem;
    border: .2rem #0b0b0b solid;
    position: relative;
    overflow: hidden;
    padding: .4rem;

    .yoyo-spinner {
      position: absolute;
      top: .2rem;
      left: .2rem;
      right: .2rem;
      bottom: .2rem;
      border-radius: 50rem;
      /*-webkit-mask-image: -webkit-radial-gradient(white, black);*/
    }

    .button-content {
      position: relative;
      /*z-index: 2;*/
      border-radius: 50rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      /*top: -2%;*/

      &.text-shadow {
        text-shadow: 0 .1rem 0 rgba(0,0,0,.5);
      }
    }
  }
</style>
