<template>
  <div class="diamond-inline d-flex" :style="style">
    <span class="diamond-inline-prepend inflexible d-flex align-items-center" :style="spanStyle">
      <img src="/images/diamond.png" class="d-block mx-auto">
    </span>
    <span class="diamond-inline-content d-flex align-items-center justify-content-end" :style="spanStyle"><span>{{ diamondAmount }}</span></span>
    <button class="btn rounded-circle diamond-inline-append" @click="purchaseDiamonds">
      <!--<img src="/images/add.png" class="d-block w-100">-->
      <svg width="37" height="37" viewBox="0 0 37 37" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle stroke="#333" fill="#FFF" cx="18.5" cy="18.5" r="18"/><rect fill="#FA4B7F" x="9" y="16" width="20" height="4" rx="2"/><rect fill="#FA4B7F" transform="rotate(90 18.5 18.5)" x="8.5" y="16.5" width="20" height="4" rx="2"/></g></svg>
    </button>
  </div>
</template>

<script>
  // import query from '../../../modules/client/parsed-query.js';
  import bridge from '../../../modules/client/js-bridge.js';

  export default {
    name: 'diamond-inline',
    props: ['bgColor', 'bordered', 'diamondAmount'],
    computed: {
      /*
      amount() {
        const { amount } = this.diamond;
        if (query.isAndroid) return amount.common + amount.android;
        if (query.isIOS) return amount.common + amount.ios;
        return amount.common;
      },
      */
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
    methods: {
      purchaseDiamonds() {
        bridge.gameFastRecharge();
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

    > span {
      /*background-color: #1f1e48;*/
      display: block;
      padding: .2rem;
      height: 1.4rem;
    }

    .diamond-inline-prepend {
      width: 1.5rem;
      padding-left: .3rem;
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;

      img, svg {
        width: 1rem;
      }
    }

    .diamond-inline-content {
      padding-top: 0;
      padding-bottom: 0;
      padding-right: 1.1rem;
      margin-right: .8rem;
      min-width: 3em;
      font-size: 1rem;
      line-height: 1;
      /*text-align: right;*/
    }

    .diamond-inline-append {
      height: 1.6rem;
      width: 1.6rem;
      position: absolute;
      /*top: -.1rem;*/
      right: -.1rem;
    }
  }
</style>
