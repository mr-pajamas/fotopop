<template>
  <div class="leaderboard filler d-flex flex-column">

    <template v-if="!loading">
      <header-bar class="inflexible" name="排行榜" v-on="$listeners" />
      <div class="winner-section inflexible d-flex flex-column align-items-center">

        <div class="winner flexible">
          <div class="filler d-flex flex-column justify-content-start align-items-center">

            <svg class="beam beam-left" width="539" height="704" viewBox="0 0 539 704" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="56.086%" y1="95.93%" x2="56.086%" y2="-3.835%" id="a"><stop stop-color="#FFF" stop-opacity="0" offset="0%"/><stop stop-color="#FDDAE0" offset="100%"/></linearGradient></defs><path transform="matrix(1 0 0 -1 -2314 2359)" d="M2517.043 1656L2305 2389h557l-219.485-733z" fill="url(#a)" fill-rule="evenodd" opacity=".127"/></svg>

            <svg class="beam beam-center" width="539" height="704" viewBox="0 0 539 704" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="56.086%" y1="95.93%" x2="56.086%" y2="-3.835%" id="a"><stop stop-color="#FFF" stop-opacity="0" offset="0%"/><stop stop-color="#FDDAE0" offset="100%"/></linearGradient></defs><path transform="matrix(1 0 0 -1 -2314 2359)" d="M2517.043 1656L2305 2389h557l-219.485-733z" fill="url(#a)" fill-rule="evenodd" opacity=".127"/></svg>
            <svg class="beam beam-right" width="539" height="704" viewBox="0 0 539 704" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="56.086%" y1="95.93%" x2="56.086%" y2="-3.835%" id="a"><stop stop-color="#FFF" stop-opacity="0" offset="0%"/><stop stop-color="#FDDAE0" offset="100%"/></linearGradient></defs><path transform="matrix(1 0 0 -1 -2314 2359)" d="M2517.043 1656L2305 2389h557l-219.485-733z" fill="url(#a)" fill-rule="evenodd" opacity=".127"/></svg>

            <img :src="winner && winner.user.dressedMedal" class="title" :style="{ opacity: (winner && winner.user.dressedMedal) ? '1' :  '0' }">

            <img :src="(winner && winner.user.avatar && winner.user.avatar.full) || '/images/default-avatar.png'" class="winner-avatar" :style="{ opacity: (winner && winner.user.avatar && winner.user.avatar.full) ? '1' : '0' }">
          </div>
        </div>
        <styled-rounded-card class="w-100 inflexible winner-card" bottom-color="rgba(82,40,167,.4)" :bg="false">
          <div class="winner-card-body">
            <!--
            <div class="rank d-flex align-items-center">
              <div class="rounded-circle rank-number inflexible d-flex justify-content-center align-items-center"><span>4</span></div>
              <avatar :user="ownAccount" :show-vip="true" class="inflexible" />
              <span class="user-name flexible">{{ ownAccount.name }}</span>
              <span class="score inflexible">48240</span>
            </div>
            -->
            <rank :user="winner.user" :rank="winner.rank" v-if="winner" />
          </div>
        </styled-rounded-card>
      </div>

      <div class="ranking-lists flexible d-flex flex-column">
        <div class="tabs d-flex align-items-end justify-content-center inflexible">
          <!--<a href="#" class="tab" @click.prevent="type = 0" :class="{ selected: type === 0 }">土豪榜</a>-->
          <!--<a href="#" class="tab" @click.prevent="type = 1" :class="{ selected: type === 1 }">魅力榜</a>-->
          <a href="#" class="tab" @click.prevent="type = 2" :class="{ selected: type === 2 }">等级榜</a>
        </div>
        <div class="rounded-card flexible">
          <div class="filler">
            <div class="sub-tabs d-flex align-items-stretch">
              <div class="grid flexible d-flex justify-content-center">
                <a href="#" class="sub-tab" :class="{ selected: scope === 0 }" @click.prevent="scope = 0">今日</a>
              </div>
              <div class="grid flexible d-flex justify-content-center align-items-stretch">
                <a href="#" class="sub-tab" :class="{ selected: scope === 1 }" @click.prevent="scope = 1">昨日</a>
              </div>
              <div class="grid flexible d-flex justify-content-center align-items-stretch">
                <a href="#" class="sub-tab" :class="{ selected: scope === 2 }" @click.prevent="scope = 2">本月</a>
              </div>
              <div class="grid flexible d-flex justify-content-center align-items-stretch">
                <a href="#" class="sub-tab" :class="{ selected: scope === 3 }" @click.prevent="scope = 3">总榜</a>
              </div>
            </div>

            <div class="ranking-list">
              <rank v-for="rank in remainingRankList" :key="rank.rank.place" :user="rank.user" :rank="rank.rank" />
              <div class="ranking-list-shim"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="my-rank">
        <div class="my-rank-content d-flex align-items-center">
          <avatar :user="ownAccount" :show-vip="true" class="inflexible" />
          <div class="name-and-rank flexible" style="overflow: hidden">
            <p class="name text-truncate">{{ ownAccount.name }}</p>
            <p class="rank" v-if="myRank.score && myRank.place">第{{ myRank.place }}名</p>
            <p class="rank" v-else>你未上榜</p>
          </div>
          <span class="score inflexible">{{ myRank.score }}</span>
        </div>
      </div>

    </template>

    <div class="filler d-flex justify-content-center align-items-center" v-else>
      <spinner-box text="加载中" />
    </div>
  </div>
</template>

<script>
  import { TweenMax, Sine } from 'gsap/umd/TweenMax';
  import map from 'lodash/map';
  import tail from 'lodash/tail';

  import HeaderBar from './lobby/HeaderBar.vue';
  import StyledRoundedCard from './general/StyledRoundedCard2.vue';
  import Avatar from './user/Avatar.vue';
  import Rank from './lobby/Rank.vue';
  import SpinnerBox from './general/SpinnerBox.vue';
  import { getRankings } from '../../api/game/client/service-methods.js';
  import { UserAccounts } from '../../api/account/collections.js';
  export default {
    name: "leaderboard",
    components: { SpinnerBox, Rank, Avatar, StyledRoundedCard, HeaderBar },
    props: ['ownAccount'],
    data() {
      return {
        loading: true,
        type: 2,
        scope: 0,
        myRank: {},
        rankList: [],
      };
    },
    computed: {
      winner() {
        return this.$meteor.userRankList && this.$meteor.userRankList[0];
      },
      remainingRankList() {
        return tail(this.$meteor.userRankList);
      },
    },
    watch: {
      async type() {
        await this.fetchData();
      },
      async scope() {
        await this.fetchData();
      },
      '$subReady.accounts'(val) {
        if (val) {
          this.loading = false;
        }
      },
    },
    async created() {
      await this.fetchData();
    },

    meteor: {
      userRankList() {
        if (this.rankList && this.rankList.length > 0) {
          return map(this.rankList,
            ({ userId, place, score }) => ({ rank: { place, score }, user: UserAccounts.findOne(userId) || {} }));
        }
        return [];
      },
    },

    mounted() {
      this.$watch('loading', function (val) {
        if (!val) {
          TweenMax.to(this.$el.querySelector('.my-rank'), .3, {
            y: 0,
            ease: Sine.easeOut,
            repeat: 0,
            delay: .5,
          });
        }
      });
    },
    methods: {
      async fetchData() {
        this.loading = true;
        Object.assign(this, await getRankings(this.type, this.scope));
        const userIds = map(this.rankList, ({ userId }) => userId);
        this.$subscribe('accounts', { name: 'account.accounts', args: [userIds] });
      },
    },
  };
</script>

<style lang="scss" scoped>

  .leaderboard {
    background-image: linear-gradient(rgb(81,77,207), rgb(171,90,252));
    position: relative;

/*
    .rank {
      font-weight: 500;
      font-size: .875rem;

      .rank-number {
        height: 1.5rem;
        width: 1.5rem;
        font-size: .875rem;
        line-height: 1;
        background-color: rgb(216,216,216);
        font-weight: bolder;
        margin-right: .65rem;
      }
      .avatar {
        width: 2.4rem;
      }

      .user-name {
        padding: 0 .5rem;
      }

      .score {
        font-weight: 600;
        font-size: 1rem;
      }
    }
*/

    .winner-section {
      /*overflow: hidden;*/
      /*height: 36%;*/
      height: 16rem;
      padding: 0 .8rem;
      margin-bottom: .8rem;

      .winner {
        position: relative;

        .beam {
          position: absolute;
          height: 100%;
          width: auto;
          bottom: -10%;

          transform-origin: center 120%;

          &.beam-left {
            left: 5%;
            animation: swing ease-in-out 3s infinite alternate;
          }

          &.beam-center {
            align-self: center;
          }

          &.beam-right {
            right: 5%;
            animation: swing ease-in-out 3s infinite alternate-reverse;
          }
        }

        .title {
          position: relative;
          height: 13%;
          z-index: 1;
        }
        .winner-avatar {
          height: 90%;
          position: absolute;
          bottom: 0;
        }
      }

      .winner-card .winner-card-body {
        padding: 0;

        .rank {
          padding: .8rem 1rem;
        }
      }
    }

    .ranking-lists {
      padding: 0 .8rem;

      .tabs {
        padding: 0 1rem;

        .tab {
          padding: .4rem .6rem;
          border-top-left-radius: .8rem;
          border-top-right-radius: .8rem;
          color: #fff;
          font-size: .875rem;

          &.selected {
            background-color: rgb(250,75,127);
          }

          & + .tab {
            margin-left: auto;
          }
        }
      }

      .rounded-card {
        border-top-left-radius: .8rem;
        border-top-right-radius: .8rem;

        background-color: #fff;
        background-image: url("/images/bg.png");
        background-repeat: repeat;
        background-size: 20rem;
        position: relative;

        > .filler {
          padding: 3rem 0 0;
        }

        .sub-tabs {
          height: 3rem;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;

          .grid {
            padding: 1rem 0 .4rem;
          }

          .sub-tab {
            padding: .2rem .4rem;
            border-bottom: .2rem transparent solid;
            color: rgb(160,160,160);
            font-size: .875rem;
            line-height: 1rem;
            letter-spacing: .1rem;

            &.selected {
              color: #0b0b0b;
              border-bottom: .2rem rgb(250,75,127) solid;
            }
          }
        }

        .ranking-list {
          height: 100%;
          overflow: auto;

          .rank {
            padding: .5rem 1rem;

            /*
            &:last-child {
              margin-bottom: 4.2rem;
            }
            */
          }
          .ranking-list-shim {
            height: 4.2rem;
          }
        }
      }
    }

    .my-rank {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      /*height: 4rem;*/
      background-image: linear-gradient(rgb(255,232,26), rgb(255,204,11));
      border-top-left-radius: .8rem;
      border-top-right-radius: .8rem;
      transform: translateY(100%);
      padding: .8rem 1.8rem 1rem;
      color: #0b0b0b;

      .my-rank-content {
        .avatar {
          width: 2.4rem;
        }

        .name, .rank {
          margin: 0;
          font-size: .875rem;
          line-height: 1;
          padding: 0 .5rem;
        }
        .name {
          margin-bottom: .3rem;
        }

        .rank {
          color: rgb(84,84,84);
        }

        .score {
          font-weight: 600;
        }
      }
    }
  }
</style>
