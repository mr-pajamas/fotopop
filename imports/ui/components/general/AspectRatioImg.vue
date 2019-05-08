<template>
  <aspect-ratio-box :ratio="ratio" :height-based="heightBased">
    <div class="w-100 h-100" :style="imgStyle"></div>
  </aspect-ratio-box>
</template>

<script>
  import AspectRatioBox from './AspectRatioBox2.vue';
  import { randomColor } from '../../../modules/client/colors.js';
  export default {
    name: "aspect-ratio-img",
    components: { AspectRatioBox },
    props: ['ratio', 'heightBased', 'src', 'randomBgColor'],
    computed: {
      imgStyle() {
        const style = {
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
        if (this.src) style.backgroundImage = `url("${this.src}")`;
        if (this.randomBgColor) style.backgroundColor = randomColor();
        return style;
      },
    },
  };
</script>
