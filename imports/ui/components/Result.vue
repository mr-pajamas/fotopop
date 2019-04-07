<template>
  <div class="result filler d-flex flex-column">
    <div class="winner-section flexible d-flex flex-column">
      <img src="/images/beam.svg" class="beam beam-left">
      <img src="/images/beam.svg" class="beam beam-center">
      <img src="/images/beam.svg" class="beam beam-right">
      <!--
      <div class="filler d-flex flex-column">
        <div class="winner-title">
          <img src="/images/winner.svg" class="d-block mx-auto">
        </div>
        <div class="winner d-flex flex-column justify-content-center align-items-center">
          <img src="/images/medal.png" class="medal">
          <img src="/images/avatar-full.svg" class="winner-avatar">
          &lt;!&ndash;<div class="winner-avatar" style="background: url(/images/avatar-full.svg) no-repeat center; background-size: contain"></div>&ndash;&gt;
          <div class="winner-name d-flex align-items-center">
            <img src="/images/crown.svg" class="rotated-crown">
            <span>渣渣辉</span>
          </div>
        </div>
      </div>
      -->
      <div class="winner-title inflexible">
        <img src="/images/winner.svg" class="d-block mx-auto">
      </div>
      <!--
      <div class="winner flexible d-flex flex-column justify-content-center align-items-center" style="background: gray !important;">
        <img src="/images/medal.png" class="d-block medal">
        <img src="/images/avatar-full.svg" class="d-block winner-avatar">
        <div class="winner-name d-flex align-items-center">
          <img src="/images/crown.svg" class="rotated-crown">
          <span>渣渣辉</span>
        </div>
      </div>
      -->
      <div class="winner flexible">
        <div class="filler d-flex flex-column justify-content-center align-items-center">
          <img src="/images/medal.png" class="medal">
          <img src="/images/avatar-full.svg" class="winner-avatar">
          <div class="winner-name-bar w-100 d-flex justify-content-center">
            <div class="winner-name d-flex align-items-center">
              <img src="/images/crown.svg" class="rotated-crown">
              <span class="no-break">渣渣辉</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-for="n in 4">
      <div class="ribbon" style="background: url(/images/ribbons.svg) -55px -9px; width: 15px; height: 26px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -33px -56px; width: 15px; height: 13px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) 0 -81px; width: 10px; height: 10px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -50px -79px; width: 10px; height: 10px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -236px -27px; width: 24px; height: 6px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -193px -57px; width: 12px; height: 12px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -263px -72px; width: 10px; height: 17px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -207px -111px; width: 23px; height: 6px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -212px -174px; width: 7px; height: 7px"></div>
      <div class="ribbon" style="background: url(/images/ribbons.svg) -60px -133px; width: 15px; height: 13px"></div>
    </template>
<!--
    <div class="ribbon" style="background: url(/images/ribbons.svg) -55px -9px; width: 15px; height: 26px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -33px -56px; width: 15px; height: 13px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) 0 -81px; width: 10px; height: 10px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -50px -79px; width: 10px; height: 10px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -236px -27px; width: 24px; height: 6px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -193px -57px; width: 12px; height: 12px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -263px -72px; width: 10px; height: 17px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -207px -111px; width: 23px; height: 6px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -212px -174px; width: 7px; height: 7px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -60px -133px; width: 15px; height: 13px"></div>

    <div class="ribbon" style="background: url(/images/ribbons.svg) -55px -9px; width: 15px; height: 26px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -33px -56px; width: 15px; height: 13px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) 0 -81px; width: 10px; height: 10px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -50px -79px; width: 10px; height: 10px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -236px -27px; width: 24px; height: 6px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -193px -57px; width: 12px; height: 12px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -263px -72px; width: 10px; height: 17px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -207px -111px; width: 23px; height: 6px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -212px -174px; width: 7px; height: 7px"></div>
    <div class="ribbon" style="background: url(/images/ribbons.svg) -60px -133px; width: 15px; height: 13px"></div>
-->

    <div class="own-result inflexible">
      <styled-rounded-card class="inflexible result-card" bottom-color="rgba(0,0,0,.5)">
        <div class="rank d-flex align-items-center">
          <div class="rounded-circle rank-number inflexible d-flex justify-content-center align-items-center"><span>4</span></div>
          <avatar :user="ownAccount" :show-vip="true" class="inflexible" />
          <span class="user-name flexible">{{ ownAccount.name }}</span>
          <span class="score inflexible lead">6分</span>
        </div>
        <div class="exp-gain">
          <p>经验值</p>
          <p class="lead"><span>+1.2W</span></p>
        </div>
        <hr>
        <div class="streak">
          <p>恭喜你当前连胜次数为：5次</p>
          <p class="lead">还剩<span class="red">1场</span>可获得</p>
          <div class="rewards">
            <div>
              <img src="/images/diamond.svg" class="item-icon">
              <p class="item-name">钻石钻<wbr><span class="no-break">&times;3</span></p>
            </div>
            <div>
              <img src="/images/diamond.svg" class="item-icon">
              <p class="item-name">钻石<wbr><span class="no-break">&times;100</span></p>
            </div>
            <div>
              <img src="/images/diamond.svg" class="item-icon">
              <p class="item-name">钻石钻<wbr><span class="no-break">&times;3</span></p>
            </div>
          </div>
        </div>
      </styled-rounded-card>
    </div>
    <div class="button-bar inflexible d-flex">
      <styled-pill-button class="btn-md" bottom-color="rgb(166,165,229)">返回大厅</styled-pill-button>
      <styled-pill-button class="btn-md" bg-color="rgb(250,75,127)" @click.native="$emit('close')">再玩一局</styled-pill-button>
      <styled-pill-button class="btn-md" bg-color="rgb(255,207,37)">分享战绩</styled-pill-button>
      <!--<div class="prompt">今日首次分享可得奖励</div>-->
    </div>
  </div>
</template>

<script>
  import { TweenMax, Sine, Linear } from 'gsap/umd/TweenMax';
  import StyledRoundedCard from './general/StyledRoundedCard.vue';
  import Avatar from './user/Avatar.vue';
  import StyledPillButton from './general/StyledPillButton';

  function random(min = 0, max = 1) {
    return min + Math.random() * (max - min);
  }

  function vw(val) {
    return window.innerWidth * (val / 100);
  }

  function vh(val) {
    return window.innerHeight * (val / 100);
  }

  function fallAnimate(e) {
    const fallTime = random(4, 10);
    TweenMax.to(e, fallTime, {
      y: vh(50),
      ease: Linear.easeNone,
      repeat: -1,
      // delay: -10,
    });
    TweenMax.to(e, random(2, 5), {
      x: `+=${vw(5)}`,
      rotationZ: random(0, 180),
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
    });
    TweenMax.to(e, random(1, 5), {
      rotationX: random(0, 360),
      rotationY: random(0, 360),
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
      delay: -3,
    })
  }

  export default {
    name: "result",
    components: { StyledPillButton, Avatar, StyledRoundedCard },
    props: ['ownAccount'],
    mounted() {
      this.$el.querySelectorAll('.ribbon').forEach((e) => {
        TweenMax.set(e, {
          x: random(vw(15), vw(85)),
          y: random(-vh(50), -50),
          z: random(0, 100),
        });
        fallAnimate(e);
      });
    },
  }
</script>

<style lang="scss" scoped>

  .result {
    background-image: linear-gradient(rgb(81,77,207), rgb(171,90,252));
    perspective: 1000px;
    overflow: hidden;

    .winner-section {
      position: relative;
      overflow: hidden;
      padding-bottom: .5rem;

      > .filler {
        padding-bottom: .5rem;
      }

      .beam {
        position: absolute;
        height: 100%;
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

      .winner-title {
        /*height: 18%;*/
        padding: .8rem 0 .2rem;
        position: relative;
        > img {
          width: 50%;
        }
      }
      .winner {
        /*height: 82%;*/
        position: relative;

        .medal {
          position: relative;
          bottom: -3%;
          height: 12%;
        }
        .winner-avatar {
          height: 76%;
        }
        .winner-name-bar {
          height: 12%;
          position: relative;
          top: -2%;
        }
        .winner-name {
          font-size: 1rem;
          line-height: 1;
          color: #fff;
          border-radius: 50rem;
          background-color: rgba(0,0,0,.5);
          padding: 0 1.1rem 0 .8rem;

          .rotated-crown {
            height: 1.2rem;
            margin-right: .5rem;
            transform: rotate(30deg);
          }
        }
      }
    }

    .ribbon {
      background-size: 277px 181px !important;
      position: absolute;
      opacity: 1;
    }

    .own-result {
      padding: 0 .8rem;

      .result-card {
        color: #0b0b0b;
        padding: 1.1rem 1.2rem;

        .rank {
          font-weight: 500;
          margin-bottom: 1rem;

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
            width: 2.5rem;
          }

          .user-name {
            padding: 0 .5rem;
          }

          .score {
            font-weight: bold;
          }
        }

        .exp-gain, .streak {
          p {
            font-size: .875rem;
            font-weight: 600;
            margin: 0 0 .3rem;

            &.lead {
              font-size: 1.125rem;
              /*font-weight: bold;*/
              margin: 0;
            }
          }
        }

        hr {
          margin: 1rem 0;

        }

        .streak {
          p.lead {
            margin-bottom: 1.2rem;
          }
          .rewards {
            display: flex;
            align-items: stretch;
            justify-content: flex-start;
            margin-left: -.5rem;

            > div {
              flex: 0 0 auto;
              padding-left: .5rem;
              width: 20%;

              .item-icon {
                width: 70%;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: .5rem;
                display: block;
              }
              .item-name {
                font-weight: normal;
                font-size: .75rem;
                text-align: center;
                line-height: 1.4;
                margin-bottom: .3rem;
              }
            }
          }
        }
      }
    }

    .button-bar {
      padding: .8rem .8rem 1rem;
      position: relative;
      > button {
        flex: 1 1 0;
        & + button {
          margin-left: .5rem;
        }
      }

      .prompt {
        background-color: rgb(132,115,225);
        color: #fff;
        font-size: .75rem;
        line-height: 1;
        padding: .375rem .75rem;
        border-radius: .2rem;
        position: absolute;
        right: .8rem;
        top: -.5rem;
      }
    }

    .red {
      color: rgb(250,75,127);
    }
  }
</style>
