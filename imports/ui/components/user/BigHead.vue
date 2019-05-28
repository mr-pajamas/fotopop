<template>
  <div class="big-head">
    <aspect-ratio-box class="w-100" :ratio="1">
      <div class="img w-100 h-100" :style="imgStyle"></div>
    </aspect-ratio-box>
    <!--<img src="/images/crown.svg" v-if="hasCrown" class="crown">-->
    <img :src="crownImg" v-if="hasCrown" class="crown">
  </div>
</template>

<script>
  import AspectRatioBox from '../general/AspectRatioBox2.vue';
  export default {
    name: "big-head",
    components: { AspectRatioBox },
    props: ['user'],
    computed: {
      imgStyle() {
        const style = {
          backgroundColor: '#fff',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
        const src = this.user && this.user.avatar && this.user.avatar.head;
        style.backgroundImage = `url("${src || '/images/default-head.jpg'}")`;
        if (this.hasCrown) style.border = '.15rem rgb(250,197,1) solid';
        return style;
      },
      hasCrown() {
        return this.user && this.user.diamond && this.user.diamond.level > 0;
      },
      crownImg() {
        if (this.hasCrown) {
          const level = Math.min(this.user.diamond.level, 8);
          return `/images/vip${level}.png`;
        }
        return undefined;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .big-head {
    display: block;
    position: relative;
    border-radius: 50%;

    .img {
      border-radius: 50%;
      position: relative;

      &:after {
        position: absolute;
        top: 0;
        left: 0;
        content: " ";
        width: 100%;
        height: 100%;
        display: block;
        box-shadow: inset 0 0 3.75em rgba(0,0,0,.05);
        border-radius: 50%;
      }
    }

    .crown {
      width: 48%;
      position: absolute;
      bottom: 78%;
      right: 54%;
      display: block;
    }
  }
</style>
