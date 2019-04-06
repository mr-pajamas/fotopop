<template>
  <div class="bottom-bar d-flex align-items-center">
    <div class="input-group flexible d-flex align-items-center">
      <!--<input type="text" placeholder="输入文字" class="flexible">-->
      <span class="flexible">输入文字</span>
      <span class="input-append inflexible small">0/60</span>
    </div>
    <button class="btn inflexible">
      <img src="/images/snippets.svg" class="d-block mx-auto">
      <span class="small d-block text-center">快捷输入</span>
    </button>
    <button class="btn inflexible">
      <img src="/images/gift.svg" class="d-block mx-auto">
      <span class="small d-block text-center">礼物</span>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'bottom-bar',
  }
</script>

<style lang="scss" scoped>
  .bottom-bar {
    padding: .6rem .6rem 1rem;
    background-color: #2d2c66;
    /*z-index: 3;*/
    position: relative;

    .input-group {
      border-radius: .5rem;
      color: #a0a0a0;
      background-color: #f5f5f5;
      padding: .6rem .7rem;
      input {
        background-color: inherit;
        border: none;
        box-shadow: none;
        outline: 0;
        line-height: 1;
        padding: 0;
        margin: 0;
      }
    }
    .btn {
      margin-left: .6rem;
      color: #fff;
      padding: .1rem;
      img {
        height: 1.6rem;
        margin-bottom: .2rem;
      }
      .small {
        font-size: 70%;
        min-width: 2.4rem;
      }
    }
  }
</style>
