<template>
  <div class="message-box"><slot></slot></div>
</template>

<script>
  export default {
    name: 'message-box',
  }
</script>

<style lang="scss" scoped>

  .message-box {
    background-color: rgba(255,255,255,.1);
    border: .1rem rgb(3,3,3) solid;
    border-radius: .4rem;
    border-top-left-radius: 0;
    padding: .4rem .6rem;
    font-size: .875rem;
    line-height: 1.4;
  }
</style>
