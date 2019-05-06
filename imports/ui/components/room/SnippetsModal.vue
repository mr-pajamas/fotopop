<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog snippets-dialog">
      <div class="snippet-list d-flex flex-column align-items-stretch">
        <button class="btn snippet d-block inflexible" v-for="s in snippets" @click="sendMessage(s)">{{ s }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { sendMessage } from '../../../api/game/methods.js';

  const snippets = [
    '稍等下，马上开',
    '快点答题啊，是不是在挂机啊！',
    '这是什么鬼！ᓫ(°⌑°)ǃ',
    '请收下我的膝盖m(_ _)m',
    '233333333',
    '加个足记好友吧',
    '你的衣服好好看阿',
    '你就是弟弟',
    '还有谁？',
    '我不服，再来一局',
    '6666666',
    '我要举报，这里有人开挂！',
  ];

  export default {
    name: "snippets-modal",
    props: ['room'],
    computed: {
      snippets() {
        return snippets;
      },
    },
    methods: {
      async sendMessage(text) {
        await sendMessage.callAsync({ roomId: this.room._id, messageText: text });
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss" scoped>

  .snippets-dialog {
    width: 100%;
    bottom: 0;
    height: 45%;
    background-color: rgb(66,65,117);
    border-radius: .8rem .8rem 0 0;

    .snippet-list {
      overflow: auto;
      height: 100%;

      > button {
        border-radius: .3rem;
        background-color: rgba(31,30,72,.48);
        padding: .4rem .5rem;
        margin: 0;
        font-size: .875rem;
        color: #fff;
        text-align: left;

        & + button {
          margin-top: .5rem;
        }
      }
    }
  }
</style>
