<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog broadcast-dialog d-flex flex-column align-items-center">
      <form class="w-100" @submit.prevent="">
        <div class="input">
          <textarea class="d-block w-100" placeholder="请输入喇叭内容" v-model="message" maxlength="50" rows="4"></textarea>
          <p class="small" style="text-align: right">{{ message.length }}/50</p>
        </div>
        <button class="btn w-100 d-flex flex-column align-items-center" type="submit">
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
    watch: {
      message(val) {
        this.message = val.replace(/(\r\n|\n|\r)/gm, ' ');
      },
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



    .input {
      textarea {
        resize: none;
        display: block;
        height: auto;
        width: 100%;
        font-weight: 400;
        line-height: 1.5;
        background-color: transparent;
        background-clip: padding-box;
        border: none;
        padding: .5rem;
      }

      p {
        color: rgb(160,160,160);
        text-align: right;
        padding: .5rem;
        margin: 0;
      }
    }

    button {
      background-color: rgb(36,165,229);
      color: #fff;
      margin-top: .875rem;
      padding: .5rem 0;

      span + span {
        margin-top: .2rem;
        color: rgba(255,255,255,.5);
      }

      &[disabled] {
        background-color: #a0a0a0;
      }
    }
  }
</style>
