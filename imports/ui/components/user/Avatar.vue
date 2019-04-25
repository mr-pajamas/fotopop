<template>
  <div class="avatar">
    <aspect-ratio-box class="w-100" :ratio="1">
      <div class="img w-100 h-100" :style="imgStyle"></div>
    </aspect-ratio-box>
    <img src="/images/vip1.png" v-if="showCrown" class="crown">
    <!--
    <svg v-if="showCrown" class="crown" width="40" height="34" viewBox="0 0 40 34" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M28.368 13.552L15.122 5.575l.285 15.46-11.747-.52 12.49 12.77c.199.203.51.246.757.104l21.41-12.361a.623.623 0 0 0 .288-.708L33.791 3.12l-5.423 10.433z" fill="#E6AE03" fill-rule="nonzero"/><path fill="#FAC501" d="M2.935 19.408l22.869 8.85-10.392 6zM33.234 1.915l-1.972 12.672-1.799 11.558 10.392-6z"/><path fill="#FFD63C" d="M15.053 5.58l24.802 14.565-24.443 14.113z"/><text font-family="PingFangSC-Medium, PingFang SC" font-size="18" font-weight="400" fill="#FFF" transform="rotate(-30 22.866 13.268)"><tspan x="14.739" y="26.443">5</tspan></text><path d="M1.37 21.767a2.547 2.547 0 1 0 4.412-2.547 2.547 2.547 0 0 0-4.413 2.547zM31.5 4.37a2.548 2.548 0 1 0 4.414-2.547A2.548 2.548 0 0 0 31.5 4.37zM12.692 6.835a2.6 2.6 0 0 0 2.287 1.29 2.726 2.726 0 0 0 2.314-1.337 2.6 2.6 0 0 0 .027-2.625 2.6 2.6 0 0 0-2.287-1.29c-.95.01-1.831.52-2.314 1.336a2.6 2.6 0 0 0-.027 2.626z" fill="#FFD942" fill-rule="nonzero"/></g></svg>
    -->
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
        style.backgroundImage = `url("${src || '/images/default-avatar.png'}")`;
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
      bottom: 77%;
      right: 54%;
      display: block;
    }
  }
</style>
