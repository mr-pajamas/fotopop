<template>
  <div class="avatar">
    <aspect-ratio-box class="w-100" :ratio="1">
      <div class="img w-100 h-100" :style="imgStyle"></div>
    </aspect-ratio-box>
    <img :src="crownImg" v-if="showCrown" class="crown">
    <div class="offline-mask filler" v-if="offline"></div>
    <div class="bot-mask filler d-flex justify-content-center align-items-center" v-if="showBot && user.bot">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="robot" class="svg-inline--fa fa-robot fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M0 256v128c0 17.7 14.3 32 32 32h32V224H32c-17.7 0-32 14.3-32 32zM464 96H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H176c-44.2 0-80 35.8-80 80v272c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V176c0-44.2-35.8-80-80-80zM256 416h-64v-32h64v32zm-32-120c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm128 120h-64v-32h64v32zm96 0h-64v-32h64v32zm-32-120c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm192-72h-32v192h32c17.7 0 32-14.3 32-32V256c0-17.7-14.3-32-32-32z"></path></svg>
    </div>
  </div>
</template>

<script>
  import AspectRatioBox from '../general/AspectRatioBox2.vue';
  export default {
    name: 'avatar',
    components: { AspectRatioBox },
    props: ['user', 'showVip', 'offline', 'showBot'],
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
        if (this.showCrown) style.border = '.1rem rgb(250,197,1) solid';
        return style;
      },
      showCrown() {
        return this.showVip && this.user && this.user.diamond && this.user.diamond.level > 0;
      },
      crownImg() {
        if (this.showCrown) {
          const level = Math.min(this.user.diamond.level, 8);
          return `/images/vip${level}.png`;
        }
        return undefined;
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
      width: 60%;
      position: absolute;
      bottom: 74%;
      right: 49%;
      display: block;
    }

    .offline-mask {
      background-color: rgba(255,255,255,.6);
      border-radius: 50%;
    }

    .bot-mask {
      border-radius: 50%;
      color: rgb(159,193,55);
      background-color: rgba(0,0,0,.5);

      > svg {
        width: 60%;
        height: auto;
      }
    }
  }
</style>
