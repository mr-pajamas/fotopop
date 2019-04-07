<template>
  <div class="select-room filler d-flex flex-column">
    <categories-header class="inflexible">
      <div class="header-bar d-flex align-items-center justify-content-center">
        <h3>加入房间</h3>
        <div class="filler d-flex align-items-center justify-content-start">
          <button class="btn back-btn" @click="$emit('back')"><img src="/images/back.svg"></button>
        </div>
      </div>
      <div class="type-name d-flex align-items-center">
        <img src="/images/song.svg" class="inflexible">
        <p class="flexible">歌曲分类</p>
      </div>
    </categories-header>
    <div class="category-list flexible">
      <a href="#" class="d-block" v-for="i in 3" @click="joinRoom">
        <img :src="`/images/cat${i}.png`" class="d-block w-100">
      </a>
      <!--
      <a href="#" class="d-block">
        <img src="/images/cat2.png" class="d-block w-100">
      </a>
      <a href="#" class="d-block">
        <img src="/images/cat3.png" class="d-block w-100">
      </a>
      -->
    </div>
  </div>
</template>

<script>
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';

  import { enterRoom } from '../../api/game/methods.js';

  import CategoriesHeader from './CategoriesHeader.vue';


  export default {
    name: "select-room",
    components: { CategoriesHeader },
    mounted() {
      TweenMax.to(this.$el, 10, {
        backgroundPosition: '-325px 204px',
        repeat: -1,
        ease: Linear.easeNone,
      });
    },
    methods: {
      async joinRoom() {
        await enterRoom.callAsync({});
      },
    },
  };
</script>

<style lang="scss" scoped>
  .select-room {
    /*
    width: 100%;
    height: 100%;
    position: relative;
    */
    /*overflow: scroll;*/

    background-image: url("/images/bg.svg");
    background-repeat: repeat;
    background-size: 325px;

    .categories-header {
      .header-bar {
        height: 3rem;
        position: relative;
        h3 {
          margin: 0;
          font-weight: 600;
          line-height: 1;
          font-size: 1rem;
        }

        .back-btn {
          padding: .2rem;
          margin-left: .2rem;
          img {
            height: 1.2rem;
          }
        }
      }

      .type-name {
        padding: .8rem;
        img {
          height: 2.8rem;
        }

        p {
          margin: 0;
          margin-left: .5rem;
          font-size: 1.125rem;
        }
      }
    }

    .category-list {
      padding: .8rem;
      overflow: scroll;

      > a {
        & + a {
          margin-top: .6rem;
        }
      }
    }
  }

</style>
