<template>
  <div class="diamond-inline d-flex" :style="style">
    <span class="diamond-inline-prepend inflexible d-flex align-items-center" :style="spanStyle">
      <!--
      <svg class="mx-auto" width="28" height="23" viewBox="0 0 28 23" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M14.098 21.224L26.194 8.277a.415.415 0 0 0 .001-.557l-5.927-6.406a.358.358 0 0 0-.262-.117H7.594c-.099 0-.194.043-.263.12L1.474 7.72a.415.415 0 0 0 .003.555l12.1 12.949a.352.352 0 0 0 .52 0" fill="#00AEEF"/><path d="M14.098 21.224L26.194 8.277a.415.415 0 0 0 .001-.557l-5.927-6.406a.358.358 0 0 0-.262-.117H7.594c-.099 0-.194.043-.263.12L1.474 7.72a.415.415 0 0 0 .003.555l12.1 12.949a.352.352 0 0 0 .52 0z" stroke="#00AEEF" stroke-width="1.844"/><path d="M26.67 13.838h-.032" fill="#FFF200"/><path fill="#0194FF" d="M13.837 21.42l-6.293-6.735-.032-.032L1.22 7.917l6.325-6.77.11.12 1.481 6.616.011.034 1.263 3.635.017.048z"/><path fill="#FFF200" d="M11.145 5.004l-2.01 2.88-1.48-6.616"/><path fill="#07DBFC" d="M13.837 1.147l-2.692 3.857-2.01 2.88L7.47 1.267l-.026-.12zM13.837 1.147h6.294l.03-.031.029.031-1.844 6.736"/><path fill="#0194FF" d="M26.454 7.917l-6.294 6.736-6.323 6.768 3.323-9.979 1.175-3.525z"/><path fill="#32F4FE" d="M26.485 7.883l-.031.034h-8.12l.012-.034 1.814-6.767.03.031h.001zM1.115 7.883l.031.034h8.119l-.011-.034-1.815-6.767-.03.031z"/><path d="M9.146 7.917H1.234" fill="#FFF200"/><path fill="#00CCFE" d="M13.837 1.147l-2.692 3.857-2.01 2.88.011.033 1.263 3.636.017.047 3.411 9.82 3.323-9.978 1.175-3.525z"/><path fill="#32F4FE" d="M15.404 7.917h2.93l-4.497-6.77-2.692 3.857-2.01 2.88.01.033z"/><path fill="#0194FF" d="M13.837 21.42l-6.293-6.735-.032-.032L1.22 7.917l6.325-6.77.11.12 1.481 6.616.011.034 1.263 3.635.017.048z"/><path fill="#FFF200" d="M11.145 5.004l-2.01 2.88-1.48-6.616"/><path fill="#07DBFC" d="M13.837 1.147l-2.692 3.857-2.01 2.88L7.47 1.267l-.026-.12zM13.837 1.147h6.294l.03-.031.029.031-1.844 6.736"/><path fill="#0194FF" d="M26.454 7.917l-6.294 6.736-6.323 6.768 3.323-9.979 1.175-3.525z"/><path fill="#32F4FE" d="M26.485 7.883l-.031.034h-8.12l.012-.034 1.814-6.767.03.031h.001zM1.115 7.883l.031.034h8.119l-.011-.034-1.815-6.767-.03.031z"/><path d="M9.146 7.917H1.234" fill="#FFF200"/><path fill="#00CCFE" d="M13.837 1.147l-2.692 3.857-2.01 2.88.011.033 1.263 3.636.017.047 3.411 9.82 3.323-9.978 1.175-3.525z"/><path fill="#32F4FE" d="M15.404 7.917h2.93l-4.497-6.77-2.692 3.857-2.01 2.88.01.033z"/></g></svg>
      -->
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
