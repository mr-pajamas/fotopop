<template>
  <div class="img-box">
    <aspect-ratio-box class="w-100" :ratio="ratio">
      <div class="img w-100 h-100" :style="imgStyle"></div>
    </aspect-ratio-box>
  </div>
</template>

<script>
  import AspectRatioBox from './AspectRatioBox.vue';
  import { randomColor } from '../../../modules/client/colors.js';

  export default {
    components: { AspectRatioBox },
    name: "aspect-ratio-img-box",
    props: ['ratio', 'src', 'randomBgColor'],
    computed: {
      imgStyle() {
        const style = {
          // backgroundColor: this.randomColor(),
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
        if (this.src) style.backgroundImage = `url("${this.src}")`;
        if (this.randomBgColor) style.backgroundColor = this.randomColor();
        return style;
      },
    },
    methods: {
      randomColor,
    },
  };
</script>

<style lang="scss" scoped>
</style>
