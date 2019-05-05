<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog broadcast-dialog d-flex flex-column align-items-center">
      <form class="w-100" @submit.prevent="">
        <div class="input-area">
          <textarea class="d-block w-100" placeholder="请输入喇叭内容" v-model="message"></textarea>
        </div>
        <button class="btn d-block w-100" type="submit">
          <span>发送喇叭</span>
          <span class="small">10钻石/条</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "broadcast-modal",
    data() {
      return {
        message: '',
        submitting: false,
      };
    },
    mounted() {
      this.autofocus();
    },
    methods: {
      autofocus() {
        this.$el.querySelector('textarea').focus();
      },
    },
  };
</script>

<style lang="scss" scoped>

  .broadcast-dialog {
    top: 15vh;
    animation: none;

    textarea {
      resize: none;
    }

    button {
      background-color: rgb(36,165,229);
      color: #fff;
      margin-top: .875rem;

      &[disabled] {
        background-color: #a0a0a0;
      }
    }
  }
</style>
