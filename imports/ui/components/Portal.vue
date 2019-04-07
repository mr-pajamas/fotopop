<template>
  <div class="portal filler d-flex flex-column justify-content-start">
    <!-- TODO: Marquee -->

    <button class="btn rounded-circle exit-btn" style="background-image: url(/images/exit.svg);"></button>

    <div class="account-section inflexible d-flex align-items-center justify-content-start">
      <big-head :user="ownAccount" />
      <div class="account-details">
        <h3>{{ ownAccount.name }}</h3>
        <div class="exp">
          <p class="d-flex align-items-center"><span class="mr-auto">LV1</span><span class="small">差49经验升级</span></p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: '40%' }"></div>
          </div>
        </div>
        <diamond-inline :diamond="ownAccount.diamond" :bordered="true" />
      </div>
    </div>

    <div class="achievements-section inflexible d-flex align-items-stretch">
      <div class="nav d-flex flex-column justify-content-end inflexible">
        <a class="nav-link d-block rounded bordered" href="#">
          <img src="/images/leaderboard.svg" class="d-block w-100">
        </a>
        <a class="nav-link d-block rounded bordered" href="#">
          <img src="/images/achievements.svg" class="d-block w-100">
        </a>
      </div>
      <div class="star-player flexible">
        <div class="filler d-flex flex-column align-items-center">
          <img src="/images/avatar-full.svg" class="star-avatar">
          <img src="/images/star-player.svg" class="star-player-badge">
        </div>
      </div>
    </div>

    <div class="games-section inflexible d-flex">
      <a href="#" class="d-block rounded bordered flexible" @click="$emit('join', 0)">
        <img src="/images/game1.svg" class="w-100 d-block">
      </a>
    </div>

    <div class="actions-section inflexible d-flex">
      <a href="#">
        <img src="/images/search.svg" class="rounded-circle bordered d-block">
        <p>搜索房间</p>
      </a>
      <a href="#">
        <img src="/images/create-room.svg" class="rounded-circle bordered d-block" @click="$emit('create')">
        <p>创建房间</p>
      </a>
      <a href="#">
        <img src="/images/invite.svg" class="rounded-circle bordered d-block">
        <p>邀请好友</p>
      </a>
      <a href="#">
        <img src="/images/broadcast.svg" class="rounded-circle bordered d-block">
        <p>全服喇叭</p>
      </a>
    </div>
  </div>
</template>

<script>
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';

  import BigHead from './user/BigHead.vue';
  import DiamondInline from './user/DiamondInline.vue';

  export default {
    name: 'portal',
    components: { DiamondInline, BigHead },
    props: ['ownAccount'],
    mounted() {
      TweenMax.to(this.$el, 10, {
        backgroundPosition: '-325px 204px',
        repeat: -1,
        ease: Linear.easeNone,
      });
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
    overflow: scroll;

    background-image: url("/images/bg.svg");
    background-repeat: repeat;
    background-size: 325px;

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
      margin-bottom: .5rem;
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
          margin-top: auto;
          position: relative;
        }
      }
    }

    .games-section {
      padding: 0 .6rem;
    }

    .actions-section {
      padding: 1rem .6rem 1rem;
      margin-bottom: auto;
      > * {
        flex: 1 1 0;
        & + * {
          margin-left: .6rem;
        }
      }

      > a {
        img {
          width: 75%;
          display: block;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: .5rem;
        }

        p {
          margin: 0;
          color: rgb(48,46,115);
          letter-spacing: .2rem;
          font-size: .875rem;
          text-align: center;
        }
      }
    }
  }
</style>
