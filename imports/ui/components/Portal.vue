<template>
  <div class="portal filler d-flex flex-column justify-content-start" :class="{ scrollable: !modal }">

    <button class="btn rounded-circle exit-btn" @click="exitGame">
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#363666" opacity=".4" cx="25" cy="25" r="25"/><rect fill="#FFF" transform="rotate(90 25 14)" x="18" y="12" width="14" height="4" rx="2"/><path d="M14.73 14.068A14.958 14.958 0 0 0 10 25c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15a14.96 14.96 0 0 0-4.842-11.037" stroke="#FFF" stroke-width="4" stroke-linecap="round"/></g></svg>
    </button>

    <div class="account-section inflexible d-flex align-items-center justify-content-start">
      <big-head :user="ownAccount" />
      <div class="account-details">
        <h3 class="text-truncate">{{ ownAccount.name }}</h3>
        <div class="exp">
          <p class="d-flex align-items-center"><span class="mr-auto">LV{{ (ownAccount.exp && ownAccount.exp.level) || '?' }}</span><span class="small" v-if="ownAccount.exp">差{{ ownAccount.exp.maxLevelPoints - ownAccount.exp.levelPoints }}经验升级</span></p>
          <div class="progress-bar" v-if="ownAccount.exp">
            <div class="progress" :style="{ width: `${ownAccount.exp.levelPoints * 100 / (ownAccount.exp.maxLevelPoints || ownAccount.exp.levelPoints || 1 )}%` }"></div>
          </div>
          <div class="progress-bar" v-else>
            <div class="progress" :style="{ width: '0' }"></div>
          </div>
        </div>
        <diamond-inline :diamond-amount="ownAccount.diamondAmount()" :bordered="true" />
      </div>
    </div>

    <div class="actions-section inflexible d-flex">
      <a href="#" @click.prevent="modal = 'search-room-modal'">
        <img class="d-block w-100" alt="search" src="data:image/png;base64,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">
      </a>
      <a href="#" @click.prevent="$emit('show', { page: 'create-room' })">
        <img class="d-block w-100" alt="create-room" src="data:image/png;base64,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">
      </a>
      <a href="#" @click.prevent="invite" class="disabled">
        <img class="d-block w-100" alt="invite" src="data:image/png;base64,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">
      </a>
      <a href="#" @click.prevent="modal = 'broadcast-modal'">
        <img class="d-block w-100" alt="broadcast" src="data:image/png;base64,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">
      </a>
    </div>

    <div class="games-section inflexible d-flex flex-column align-items-stretch">
      <a href="#" @click.prevent="$emit('show', { page: 'select-room', params: { type: 0 } })">
        <img src="/images/game1.png" class="w-100 d-block">
      </a>
      <a href="#" @click.prevent="$emit('show', { page: 'select-room', params: { type: 1 } })">
        <img src="/images/game2.png" class="w-100 d-block">
      </a>
    </div>

    <broadcast />

    <component v-if="modal" :is="modal" @close="modal = ''" :own-account="ownAccount" />
  </div>
</template>

<script>
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';

  import bridge from '../../modules/client/js-bridge.js';
  import { getStarPlayerId } from '../../api/general/client/service-methods.js';

  import BigHead from './user/BigHead.vue';
  import DiamondInline from './user/DiamondInline.vue';
  import SearchRoomModal from './SearchRoomModal.vue';
  import Broadcast from './Broadcast2.vue';
  import BroadcastModal from './BroadcastModal.vue';
  import { UserAccounts } from '../../api/account/collections.js';
  import AspectRatioImg from './general/AspectRatioImg.vue';

  export default {
    name: 'portal',
    components: { AspectRatioImg, BroadcastModal, Broadcast, SearchRoomModal, DiamondInline, BigHead },
    props: ['ownAccount'],
    data() {
      return {
        modal: '',
        starPlayerId: '',
      };
    },
    meteor: {
      starPlayer() {
        return !!this.starPlayerId && UserAccounts.findOne(this.starPlayerId);
      },
    },
    async created() {
      await this.fetchStarPlayer();
    },
    mounted() {
      TweenMax.to(this.$el, 10, {
        backgroundPosition: '-20rem 12.55rem',
        repeat: -1,
        ease: Linear.easeNone,
      });
    },
    methods: {
      exitGame() {
        // window.app.gameExit();
        bridge.gameExit();
      },
      invite() {
        bridge.gameInvite();
      },
      async fetchStarPlayer() {
        this.starPlayerId = await getStarPlayerId();
        if (this.starPlayerId) {
          this.$subscribe('starPlayer', { name: 'account.accounts', args: [[this.starPlayerId]] });
        }
      },
    },
    activated() {
      this.modal = '';
    },
  };
</script>

<style lang="scss" scoped>
  .portal {
    padding-top: 2rem;
    /*
    width: 100%;
    height: 100%;
    position: relative;
    */
    background-image: url("/images/bg.png");
    /*background-image: url("/images/bg.svg");*/
    background-repeat: repeat;
    background-size: 20rem;

    &.scrollable {
      overflow: auto;
    }

    .rounded {
      border-radius: .5rem;
      overflow: hidden;
      padding: 0;
    }

    .rounded-circle {
      overflow: hidden;
      padding: 0;
    }

    .bordered {
      border: .2rem rgb(51,51,51) solid;
    }

    .broadcast {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .exit-btn {
      position: absolute;
      right: .8rem;
      top: 2.5rem;
      height: 2rem;
      width: 2rem;
    }

    .account-section {
      padding: .5rem .6rem 0;
      .big-head {
        width: 23%;
        margin-right: .6rem;
      }

      .account-details {
        color: #0b0b0b;
        width: 40%;
        > h3 {
          font-weight: 600;
          margin: 0 0 .3rem;
          font-size: 1.125rem;
        }

        .exp {
          margin-bottom: .5rem;
          > p {
            margin: 0 0 .2rem;
          }

          .progress-bar {
            border-radius: 50rem;
            background-color: rgba(81,77,207,.2);
            height: .5rem;
            overflow: hidden;

            .progress {
              background-color: rgb(85,66,237);
              height: 100%;
            }
          }
        }

        .diamond-inline {
          float: left;
        }
      }
    }

    .achievements-section {
      padding: 0 .6rem;
      /*margin-bottom: .5rem;*/
      .nav {
        width: 52%;
        margin-right: .6rem;

        .nav-link {
          &:first-child {
            margin-top: 2.6rem;
          }

          & + .nav-link {
            margin-top: .6rem;
            margin-bottom: .1rem;
          }
        }
      }

      .star-player {
        position: relative;

        .star-avatar {
          position: absolute;
          height: 96%;
          top: -8%;
        }

        .star-player-badge {
          height: 18%;
          width: auto;
          margin-top: auto;
          position: relative;
        }
      }
    }

    .games-section {
      padding: 0 .6rem 1rem;
      margin-bottom: auto;
      margin-left: -.6rem;

      > a {
        padding-left: .6rem;
        flex: 1 1 0;
        & + * {
          margin-top: 1.125rem;
        }
      }
    }

    .actions-section {
      padding: 1.125rem .6rem 1.125rem;
      /*margin-bottom: auto;*/
      > * {
        flex: 1 1 0;
        & + * {
          margin-left: .6rem;
        }
      }

      > a {
        img, svg {
          /*width: 75%;*/
          display: block;
          margin-left: auto;
          margin-right: auto;
          /*margin-bottom: .5rem;*/
        }

        p {
          margin: 0;
          color: rgb(48,46,115);
          /*letter-spacing: .2rem;*/
          font-size: .875rem;
          text-align: center;
        }
      }
    }

    /*
    .search-room-dialog {
      top: 20vh;
      input {
        margin-bottom: .875rem;
      }

      button {
        background-color: rgb(36,165,229);
        color: #fff;
      }
    }
    */
  }
</style>
