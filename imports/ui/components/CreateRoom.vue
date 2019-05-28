<template>
  <div class="create-room filler d-flex flex-column justify-content-center">
    <categories-header class="inflexible">
      <!--
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
      -->

      <header-bar name="创建房间" v-on="$listeners">
        <button class="btn private-btn ml-auto inflexible d-flex align-items-center" @click="privateChecked = !privateChecked">

          <svg v-if="privateChecked" width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 2)" stroke="#FFF" stroke-width="4" fill="none" fill-rule="evenodd"><circle cx="15" cy="15" r="15"/><path stroke-linecap="round" stroke-linejoin="round" d="M21.364 11.879l-8.485 8.485-4.13-4.356"/></g></svg>
          <!--<img v-if="privateChecked" src="/images/private-checked.svg">-->
          <svg v-else width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="15" transform="translate(2 2)" stroke="#FFF" stroke-width="4" fill="none" fill-rule="evenodd"/></svg>
          <!--<img v-else src="/images/private-unchecked.svg">-->
          <p class="no-break">私密</p>
        </button>
      </header-bar>
      <div class="type-tags d-flex align-items-end justify-content-start">
        <a href="#" :class="{ selected: selectedType === 0 }" @click="selectedType = 0">猜歌名</a>
        <a href="#" :class="{ selected: selectedType === 1 }" @click="selectedType = 1">猜电影</a>
      </div>
    </categories-header>
    <div class="category-list flexible">
      <!--
      <a href="#" class="d-block" v-for="i in 3" @click="createRoom">
        <img :src="`/images/cat${i}.png`" class="d-block w-100">
      </a>
      -->
      <a href="#" class="d-block" v-for="category in categories" :key="category.id" @click.prevent="createRoom(category.id, category.name)">
        <img :src="category.coverUrl" class="d-block w-100">
      </a>
    </div>
    <spinner-box text="创建中" v-if="submitting" />
  </div>
</template>

<script>
  import { Meteor } from 'meteor/meteor';
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';
  import { createRoom } from '../../api/game/methods.js';

  import { getCategories } from '../../api/game/client/service-methods.js';

  import CategoriesHeader from './CategoriesHeader.vue';
  import HeaderBar from './lobby/HeaderBar.vue';
  import SpinnerBox from './general/SpinnerBox.vue';

  const tid = Symbol('tid');

  export default {
    name: "create-room",
    components: { SpinnerBox, HeaderBar, CategoriesHeader },
    data() {
      return {
        privateChecked: false,
        selectedType: 0,
        categories: [],
        submitting: false,
      };
    },
    async created() {
      await this.fetchData();
    },
    watch: {
      selectedType() {
        this.fetchData();
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
        this.categories = await getCategories(this.selectedType);
      },
      stopTimeout() {
        if (this[tid]) {
          Meteor.clearTimeout(this[tid]);
          this[tid] = undefined;
        }
      },
      async createRoom(categoryId, categoryName) {
        this.submitting = true;
        /*
        this.stopTimeout();
        this[tid] = Meteor.setTimeout(async () => await createRoom.callAsync({}), 0);
        */
        // await createRoom.callAsync({});
        await createRoom.callAsync({
          type: this.selectedType,
          categoryId,
          categoryName,
          pvt: this.privateChecked,
        });
        // await createRoom(this.selectedType, categoryId, this.privateChecked);
      },
    },
  };
</script>

<style lang="scss" scoped>

  .create-room {

    background-image: url("/images/bg.png");
    background-repeat: repeat;
    background-size: 20rem;

    .categories-header {
      .header-bar {
        .private-btn {
          margin-right: .5rem;
          height: 1.6rem;
          padding: 0 .3rem;
          img, svg {
            height: 1.2rem;
            width: auto;
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
      -webkit-overflow-scrolling: touch;

      > a {
        & + a {
          margin-top: .6rem;
        }
      }
    }
  }
</style>
