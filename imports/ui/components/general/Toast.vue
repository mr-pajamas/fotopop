<template>
  <transition name="toast">
    <div class="toast" v-if="toastMessage" :key="toastMessage.id">{{ toastMessage.text }}</div>
  </transition>
</template>

<script>
  import { toastMessage } from '../../../modules/client/toast.js';

  export default {
    name: 'toast',
    computed: { toastMessage },
  };
</script>

<style lang="scss" scoped>
  .toast {
    max-width: 75vw;
    position: absolute;
    top: 62%;
    transform: translateY(-50%);
    background-color: rgba(0,0,0,.5);
    color: #fff;
    font-size: .875rem;
    line-height: 1.4;
    padding: .5rem .75rem;
    border-radius: 1.1125rem;
  }

  .toast-enter-active {
    animation: toast-show .4s ease-out;
  }

  .toast-leave-to {
    opacity: 0;
  }

  .toast-leave-active {
    transition: opacity .2s ease-in;
  }

  @keyframes toast-show {
    0% {
      transform: translateY(20%);
      opacity: .3;
    }
    80% {
      opacity: 1;
      transform: translateY(-60%);
    }
    100% {
      opacity: 1;
      transform: translateY(-50%);
    }
  }
</style>
