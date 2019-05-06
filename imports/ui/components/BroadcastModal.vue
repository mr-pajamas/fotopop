<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog broadcast-dialog d-flex flex-column align-items-center">
      <form class="w-100" @submit.prevent="broadcast">
        <div class="input">
          <textarea class="d-block w-100" placeholder="请输入喇叭内容" v-model="message" maxlength="50" rows="4"></textarea>
          <p class="small" style="text-align: right">{{ message.length }}/50</p>
        </div>
        <p v-if="errMsg" class="w-100 text-center feedback">{{ errMsg }}</p>
        <button class="btn w-100 d-flex flex-column align-items-center justify-content-center" type="submit" :disabled="!message || submitting">
          <span v-if="submitting">发送中...</span>
          <template v-else>
            <span>发送喇叭</span>
            <span class="small" v-if="itemAmount">拥有{{ itemAmount }}个</span>
            <span class="small" v-else>{{ itemPrice }}钻石/条</span>
          </template>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
  import { broadcastItem } from '../../domain/client/items.js';
  import { broadcast } from '../../api/broadcast/methods.js';
  import query from '../../modules/client/parsed-query.js';
  import bridge from '../../modules/client/js-bridge.js';

  export default {
    name: "broadcast-modal",
    props: ['ownAccount'],
    data() {
      return {
        message: '',
        errMsg: '',
        submitting: false,
      };
    },
    computed: {
      itemAmount() {
        return this.ownAccount.itemAmount('40');
      },
      itemPrice() {
        return broadcastItem().price;
      },
    },
    mounted() {
      this.autofocus();
    },
    watch: {
      message(val) {
        this.errMsg = '';
        this.message = val.replace(/(\r\n|\n|\r)/gm, ' ');
      },
    },
    methods: {
      async broadcast() {
        if (this.itemAmount || this.ownAccount.diamondAmount() >= this.itemPrice) {
          this.submitting = true;
          try {
            await broadcast.callAsync({ message: this.message, osType: query.osType });
            this.$emit('close');
          } catch (e) {
            this.errMsg = e.reason || e.message;
          } finally {
            this.submitting = false;
          }
        } else {
          this.$emit('close');
          bridge.gameFastRecharge({ showMessage: true });
        }
      },
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
      padding: 0;
      height: 3.125rem;

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
