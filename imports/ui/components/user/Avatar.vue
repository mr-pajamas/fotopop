<template>
  <div class="avatar">
    <aspect-ratio-box class="w-100" :ratio="1">
      <div class="img w-100 h-100" :style="imgStyle"></div>
    </aspect-ratio-box>
    <img src="/images/crown.svg" v-if="showCrown" class="crown">
  </div>
</template>

<script>
  import AspectRatioBox from '../general/AspectRatioBox.vue';
  export default {
    name: 'avatar',
    components: { AspectRatioBox },
    props: ['user', 'showVip'],
    computed: {
      imgStyle() {
        const style = {
          backgroundColor: '#fff',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
        const src = this.user && this.user.avatar && this.user.avatar.head;
        style.backgroundImage = `url("${src || '/images/default-avatar.svg'}")`;
        if (this.showCrown) style.border = '.1rem rgb(250,197,1) solid';
        return style;
      },
      showCrown() {
        return this.showVip && this.user && this.user.diamond && this.user.diamond.level > 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .avatar {
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
      width: 50%;
      position: absolute;
      top: -20%;
      left: -3%;
      display: block;
    }
  }
</style>
