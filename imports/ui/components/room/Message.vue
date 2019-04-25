<template>
  <div class="message d-flex align-items-start">
    <div class="message-icon inflexible">
      <slot name="icon"></slot>
    </div>
    <div class="message-area flexible d-flex">
      <message-box :style="{ color: color || '#fff' }"><slot></slot></message-box>
    </div>
  </div>
</template>

<script>
  import MessageBox from './MessageBox.vue';
  export default {
    name: "message",
    components: { MessageBox },
    props: ['color'],
  };
</script>

<style lang="scss" scoped>

  .message {
    padding: .5rem .8rem;

    .message-icon {
      width: 2.4rem;
      height: 2.4rem;
      overflow: hidden;
      margin-right: .6rem;
    }

    .message-area {
      padding: .1rem 0 0;
      .message-box {
        max-width: 80%;
        min-height: 2.225rem;
      }
    }
  }
</style>
