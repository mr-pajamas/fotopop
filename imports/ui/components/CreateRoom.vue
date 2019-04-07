<template>
  <div class="create-room filler d-flex flex-column">
    <categories-header class="inflexible">
      <div class="header-bar d-flex align-items-center justify-content-center">
        <h3>创建房间</h3>
        <div class="filler d-flex align-items-center justify-content-start">
          <button class="btn back-btn" @click="$emit('back')"><img src="/images/back.svg"></button>
          <button class="btn private-btn ml-auto d-flex align-items-center" @click="privateChecked = !privateChecked">
            <img v-if="privateChecked" src="/images/private-checked.svg">
            <img v-else src="/images/private-unchecked.svg">
            <p>私密</p>
          </button>
        </div>
      </div>
      <div class="type-tags d-flex align-items-end justify-content-start">
        <a href="#" :class="{ selected: selectedType === 0 }" @click="selectedType = 0">猜歌名</a>
        <a href="#" :class="{ selected: selectedType === 1 }" @click="selectedType = 1">猜电影</a>
      </div>
    </categories-header>
    <div class="category-list flexible">
      <a href="#" class="d-block" v-for="i in 3" @click="createRoom">
        <img :src="`/images/cat${i}.png`" class="d-block w-100">
      </a>
    </div>
  </div>
</template>

<script>
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';
  import { createRoom } from '../../api/game/methods.js';
  import CategoriesHeader from './CategoriesHeader.vue';
  export default {
    name: "create-room",
    components: { CategoriesHeader },
    data() {
      return {
        privateChecked: false,
        selectedType: 0,
      };
    },
    mounted() {
      TweenMax.to(this.$el, 10, {
        backgroundPosition: '-325px 204px',
        repeat: -1,
        ease: Linear.easeNone,
      });
    },

    methods: {
      async createRoom() {
        await createRoom.callAsync({});
      },
    },
  };
</script>

<style lang="scss" scoped>

  .create-room {
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

        .private-btn {
          margin-right: .5rem;
          height: 1.6rem;
          padding: 0 .3rem;
          img {
            height: 1.2rem;
            margin-right: .3rem;
          }

          p {
            margin: 0;
            line-height: 1;
            font-size: 1rem;
            color: #fff;
          }
        }
      }

      .type-tags {
        padding: .6rem .8rem .3rem .8rem;

        > a {
          text-decoration: none;
          padding: .2rem .5rem;
          border-bottom: .2rem transparent solid;
          opacity: .5;

          &.selected {
            border-bottom-color: #fff;
            opacity: 1;
          }

          & + a {
            margin-left: 1rem;
          }
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
