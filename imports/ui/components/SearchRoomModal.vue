<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog search-room-dialog d-flex flex-column align-items-center">
      <form class="w-100" @submit.prevent="searchAndJoin">
        <input type="text" class="d-block w-100" placeholder="请输入房间ID" autofocus v-model="searchId">
        <p v-if="errMsg" class="w-100 text-center">{{ errMsg }}</p>
        <button class="btn d-block w-100" type="submit" :disabled="!searchIdValid || submitting">{{ submitting ? '查找中...' : '进入房间' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
  import { searchAndJoinRoom } from '../../api/game/methods.js';

  export default {
    name: "search-room-modal",
    data() {
      return {
        searchId: '',
        errMsg: '',
        submitting: false,
      };
    },
    computed: {
      searchIdValid() {
        return /^\d{6}$/.test(this.searchId);
      }
    },
    watch: {
      searchId() {
        this.errMsg = '';
      },
    },
    mounted() {
      this.$el.querySelector('input').focus();
    },
    methods: {
      async searchAndJoin() {
        this.submitting = true;
        try {
          await searchAndJoinRoom.callAsync({ searchId: this.searchId });
        } catch (e) {
          this.errMsg = e.reason || e.message;
        } finally {
          this.submitting = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search-room-dialog {
    top: 20vh;
    input {
    }

    p {
      color: red;
      font-size: .875rem;
      margin-top: .5rem;
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
