<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog message-dialog d-flex flex-column align-items-center">
      <form class="w-100" @submit.prevent="sendMessage">
        <div class="input">
          <textarea class="d-block w-100" placeholder="请输入消息内容" v-model="message" rows="4"></textarea>
          <p class="small" style="text-align: right">{{ messageLength }}/50</p>
        </div>
        <p v-if="errMsg" class="w-100 text-center feedback">{{ errMsg }}</p>
        <button class="btn w-100 d-block" type="submit" :disabled="!message || submitting">{{ submitting ? '发送中...' : '发送' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
  import { sendMessage } from '../../../api/game/methods.js';

  export default {
    name: "message-modal",
    props: ['room'],
    data() {
      return {
        message: '',
        errMsg: '',
        submitting: false,
      };
    },
    computed: {
      messageLength() {
        return this.message.replace(/(\r\n|\n|\r)/gm, ' ').length;
      },
    },
    mounted() {
      this.autofocus();
    },
    watch: {
      message(val, oldVal) {
        if (val.replace(/(\r\n|\n|\r)/gm, ' ').length > 50) {
          this.message = oldVal;
        } else {
          this.errMsg = '';
        }
      },
    },
    methods: {
      async sendMessage() {
        this.submitting = true;
        try {
          await sendMessage.callAsync({ roomId: this.room._id, messageText: this.message });
          this.$emit('close');
        } catch (e) {
          this.errMsg = e.reason || e.message;
        } finally {
          this.submitting = false;
        }
      },
      autofocus() {
        this.$el.querySelector('textarea').focus();
      },
    },
  };
</script>

<style lang="scss" scoped>

  .message-dialog {
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

    p.feedback {
      color: red;
      font-size: .875rem;
      margin-top: .5rem;
      line-height: 1.4;
    }

    button {
      background-color: rgb(36,165,229);
      color: #fff;
      margin-top: .875rem;
      /*padding: .5rem 0;*/

      &[disabled] {
        background-color: #a0a0a0;
      }
    }
  }
</style>
