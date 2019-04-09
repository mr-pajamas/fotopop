<template>
  <div class="bottom-bar d-flex align-items-center">
    <div class="input-group flexible d-flex align-items-center">
      <!--<input type="text" placeholder="输入文字" class="flexible">-->
      <span class="flexible">输入文字</span>
      <span class="input-append inflexible small">0/60</span>
    </div>
    <button class="btn inflexible">
      <!--<img src="/images/snippets.svg" class="d-block mx-auto">-->
      <svg class="mx-auto" width="50" height="40" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M4.444 1.5A2.944 2.944 0 0 0 1.5 4.444v20C1.5 32.207 7.793 38.5 15.556 38.5h18.888c7.763 0 14.056-6.293 14.056-14.056v-8.888C48.5 7.793 42.207 1.5 34.444 1.5h-30z" stroke="#030303" stroke-width="3" fill="#FFF"/><rect fill="#030303" x="12" y="13" width="26.858" height="4" rx="2"/><rect fill="#030303" x="12" y="23" width="14.518" height="4" rx="2"/></g></svg>
      <span class="small d-block text-center">快捷输入</span>
    </button>
    <button class="btn inflexible">
      <!--<img src="/images/gift.svg" class="d-block mx-auto">-->
      <svg class="mx-auto" width="45" height="44" viewBox="0 0 45 44" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-14 -9)" stroke="#030303" stroke-width="3" fill="none" fill-rule="evenodd"><path d="M35 17.5L21 26V12.554a2 2 0 0 1 3.038-1.71L35 17.5zM37 17.5L51 26V12.554a2 2 0 0 0-3.038-1.71L37 17.5z" fill="#FFCF25"/><circle fill="#FFCF25" cx="37" cy="17" r="4"/><rect fill="#FA4B7F" x="17.5" y="22.5" width="38" height="29" rx="2"/><rect fill="#FFF" x="15.5" y="18.5" width="42" height="6" rx="2"/><path fill="#FFF" d="M34.5 18.5h5v33h-5z"/></g></svg>
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
      img, svg {
        height: 1.6rem;
        width: auto;
        margin-bottom: .2rem;
      }
      .small {
        font-size: 70%;
        min-width: 2.4rem;
      }
    }
  }
</style>
