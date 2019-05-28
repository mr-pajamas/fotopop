<template>
  <div class="select-room filler d-flex flex-column justify-content-center">
    <categories-header class="inflexible">
      <!--
      <div class="header-bar d-flex align-items-center justify-content-center">
        <h3>加入房间</h3>
        <div class="filler d-flex align-items-center justify-content-start">
          <button class="btn back-btn" @click="$emit('back')"><img src="/images/back.svg"></button>
        </div>
      </div>
      -->
      <header-bar name="加入房间" v-on="$listeners" />
      <div class="type-name d-flex align-items-center">
        <img src="/images/song.svg" class="inflexible" v-if="type === 0">
        <img src="/images/film.png" class="inflexible" v-if="type === 1">
        <p class="flexible">{{ typeName }}分类</p>
      </div>
    </categories-header>
    <div class="category-list flexible">
      <a href="#" class="d-block" v-for="category in categories" :key="category.id" @click.prevent="findAndJoinRoom(category.id, category.name)">
        <img :src="category.coverUrl" class="d-block w-100">
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

    <div class="filler d-flex justify-content-center align-items-center" v-if="submitting">
      <spinner-box text="匹配中" />
    </div>
  </div>
</template>

<script>
  import { Meteor } from 'meteor/meteor';
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';

  import { findAndJoinRoom, createRoom } from '../../api/game/methods.js';

  import { getCategories } from '../../api/game/client/service-methods.js';

  import CategoriesHeader from './CategoriesHeader.vue';
  import HeaderBar from './lobby/HeaderBar.vue';
  import SpinnerBox from './general/SpinnerBox.vue';

  const tid = Symbol('tid');

  const typeNames = ['歌曲', '影视'];

  export default {
    name: "select-room",
    components: { SpinnerBox, HeaderBar, CategoriesHeader },
    props: ['type'],
    data() {
      return {
        submitting: false,
        categories: [],
      };
    },
    async created() {
      await this.fetchData();
    },
    computed: {
      typeName() {
        return typeNames[this.type];
      },
    },
    mounted() {
      TweenMax.to(this.$el, 10, {
        backgroundPosition: '-20rem 12.55rem',
        repeat: -1,
        ease: Linear.easeNone,
      });
    },
    destroyed() {
      this.stopTimeout();
    },
    activated() {
      this.submitting = false;
    },
    deactivated() {
      this.stopTimeout();
    },
    methods: {
      async fetchData() {
        this.categories = await getCategories(this.type);
      },

      stopTimeout() {
        if (this[tid]) {
          Meteor.clearTimeout(this[tid]);
          this[tid] = undefined;
        }
      },
      async findAndJoinRoom(categoryId, categoryName) {
        this.submitting = true;
        this.stopTimeout();
        this[tid] = Meteor.setTimeout(async () => {
          this[tid] = Meteor.setTimeout(
            // TODO: 此处失败率很高，需要做错误处理否则用户界面将死
            async () => await createRoom.callAsync({ type: this.type, categoryId, categoryName }),
            5000,
          );
          await findAndJoinRoom.callAsync({ type: this.type, categoryId });
          /*
          if (!joined) {
            await createRoom(this.type, categoryId);
          }
          */
        }, 2000);
        // await enterRoom.callAsync({});
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

    background-image: url("/images/bg.png");
    background-repeat: repeat;
    background-size: 20rem;

    .categories-header {
      /*
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
      */

      .type-name {
        padding: .8rem;
        img {
          height: 2.8rem;
        }

        p {
          margin: 0 0 0 .5rem;
          font-size: 1.125rem;
        }
      }
    }

    .category-list {
      padding: .8rem;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      > a {
        & + a {
          margin-top: .6rem;
        }
      }
    }
  }

</style>
