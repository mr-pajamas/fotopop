<template>
  <div class="diamond-inline d-flex" :style="style">
    <span class="diamond-inline-prepend inflexible" style="background-image: url(/images/diamond.svg)" :style="spanStyle"></span>
    <span class="diamond-inline-content" :style="spanStyle">{{ amount }}</span>
    <button class="btn rounded-circle diamond-inline-append" style="background-image: url(/images/add.svg);"></button>
  </div>
</template>

<script>
  import ua from '../../../modules/client/ua.js';

  export default {
    name: 'diamond-inline',
    props: ['diamond', 'bgColor', 'bordered'],
    computed: {
      amount() {
        const { amount } = this.diamond;
        if (ua.isAndroid) return amount.common + amount.android;
        if (ua.isIOS) return amount.common + amount.ios;
        return amount.common;
      },
      style() {
        if (this.bordered) {
          return { border: '1px rgb(84,84,84) solid' };
        }
        return { padding: '.1rem' };
      },
      spanStyle() {
        if (this.bgColor) return { backgroundColor: this.bgColor };
        return {};
      },
    },
  };
</script>

<style lang="scss" scoped>
  .diamond-inline {
    /*padding: .1rem;*/
    align-items: center;
    position: relative;
    border-radius: 50rem;

    span {
      /*background-color: #1f1e48;*/
      display: block;
      padding: .2rem;
      height: 1.4rem;
    }

    .diamond-inline-prepend {
      width: 1.4rem;
      background-size: 1rem;
      background-repeat: no-repeat;
      background-position: center;
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
    }

    .diamond-inline-content {
      font-size: 1rem;
      line-height: 1;
      padding-right: 1.1rem;
      margin-right: .8rem;
      min-width: 3em;
      text-align: right;
    }

    .diamond-inline-append {
      height: 1.6rem;
      width: 1.6rem;
      position: absolute;
      top: -.1rem;
      right: -.1rem;
    }
  }
</style>
