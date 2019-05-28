<template>
  <div class="result filler d-flex flex-column justify-content-center">
    <template v-if="$subReady.result && $meteor.result">
      <div class="winner-section flexible d-flex flex-column" v-if="$meteor.winner">
        <!--
        <img src="/images/beam.svg" class="beam beam-left">
        <img src="/images/beam.svg" class="beam beam-center">
        <img src="/images/beam.svg" class="beam beam-right">
        -->
        <svg class="beam beam-left" width="539" height="704" viewBox="0 0 539 704" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="56.086%" y1="95.93%" x2="56.086%" y2="-3.835%" id="a"><stop stop-color="#FFF" stop-opacity="0" offset="0%"/><stop stop-color="#FDDAE0" offset="100%"/></linearGradient></defs><path transform="matrix(1 0 0 -1 -2314 2359)" d="M2517.043 1656L2305 2389h557l-219.485-733z" fill="url(#a)" fill-rule="evenodd" opacity=".127"/></svg>
        <svg class="beam beam-center" width="539" height="704" viewBox="0 0 539 704" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="56.086%" y1="95.93%" x2="56.086%" y2="-3.835%" id="a"><stop stop-color="#FFF" stop-opacity="0" offset="0%"/><stop stop-color="#FDDAE0" offset="100%"/></linearGradient></defs><path transform="matrix(1 0 0 -1 -2314 2359)" d="M2517.043 1656L2305 2389h557l-219.485-733z" fill="url(#a)" fill-rule="evenodd" opacity=".127"/></svg>
        <svg class="beam beam-right" width="539" height="704" viewBox="0 0 539 704" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="56.086%" y1="95.93%" x2="56.086%" y2="-3.835%" id="a"><stop stop-color="#FFF" stop-opacity="0" offset="0%"/><stop stop-color="#FDDAE0" offset="100%"/></linearGradient></defs><path transform="matrix(1 0 0 -1 -2314 2359)" d="M2517.043 1656L2305 2389h557l-219.485-733z" fill="url(#a)" fill-rule="evenodd" opacity=".127"/></svg>

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
          <!--<img src="/images/winner.svg" class="d-block mx-auto">-->
          <img src="/images/winner.png" class="d-block mx-auto">
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
            <img :src="$meteor.winner.dressedMedal" class="title" :style="{ opacity: $meteor.winner.dressedMedal ? '1' :  '0' }">
            <img :src="($meteor.winner.avatar && $meteor.winner.avatar.full) || '/images/default-avatar.png'" class="winner-avatar">
            <div class="winner-name-bar w-100 d-flex justify-content-center">
              <div class="winner-name d-flex align-items-center">
                <!--<img src="/images/crown.svg" class="rotated-crown">-->
                <svg v-if="$meteor.winner.diamond && $meteor.winner.diamond.level > 0" class="rotated-crown" width="40" height="34" viewBox="0 0 40 34" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M28.368 13.552L15.122 5.575l.285 15.46-11.747-.52 12.49 12.77c.199.203.51.246.757.104l21.41-12.361a.623.623 0 0 0 .288-.708L33.791 3.12l-5.423 10.433z" fill="#E6AE03" fill-rule="nonzero"/><path fill="#FAC501" d="M2.935 19.408l22.869 8.85-10.392 6zM33.234 1.915l-1.972 12.672-1.799 11.558 10.392-6z"/><path fill="#FFD63C" d="M15.053 5.58l24.802 14.565-24.443 14.113z"/><text font-family="PingFangSC-Medium, PingFang SC" font-size="18" font-weight="400" fill="#FFF" transform="rotate(-30 22.866 13.268)"><tspan x="14.739" y="26.443">5</tspan></text><path d="M1.37 21.767a2.547 2.547 0 1 0 4.412-2.547 2.547 2.547 0 0 0-4.413 2.547zM31.5 4.37a2.548 2.548 0 1 0 4.414-2.547A2.548 2.548 0 0 0 31.5 4.37zM12.692 6.835a2.6 2.6 0 0 0 2.287 1.29 2.726 2.726 0 0 0 2.314-1.337 2.6 2.6 0 0 0 .027-2.625 2.6 2.6 0 0 0-2.287-1.29c-.95.01-1.831.52-2.314 1.336a2.6 2.6 0 0 0-.027 2.626z" fill="#FFD942" fill-rule="nonzero"/></g></svg>
                <span class="no-break">{{ $meteor.winner.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <template v-for="n in 4">
          <div class="ribbon" style="background: url(/images/ribbons.png) -55px -9px; width: 15px; height: 26px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -33px -56px; width: 15px; height: 13px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) 0 -81px; width: 10px; height: 10px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -50px -79px; width: 10px; height: 10px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -236px -27px; width: 24px; height: 6px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -193px -57px; width: 12px; height: 12px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -263px -72px; width: 10px; height: 17px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -207px -111px; width: 23px; height: 6px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -212px -174px; width: 7px; height: 7px"></div>
          <div class="ribbon" style="background: url(/images/ribbons.png) -60px -133px; width: 15px; height: 13px"></div>
        </template>
      </div>

      <div class="flexible no-winner" v-else>
        <div class="prompt-box filler d-flex align-items-center justify-content-center"><img src="/images/no-winner.svg"></div>
      </div>

      <div class="own-result inflexible">
        <styled-rounded-card class="inflexible result-card" bottom-color="rgba(0,0,0,.5)">
          <div class="result-card-body">
            <!--
            <div class="rank d-flex align-items-center">
              <div class="rounded-circle rank-number inflexible d-flex justify-content-center align-items-center"><span>4</span></div>
              <avatar :user="ownAccount" :show-vip="true" class="inflexible" />
              <span class="user-name flexible">{{ ownAccount.name }}</span>
              <span class="score inflexible lead">6分</span>
            </div>
            -->
            <rank :user="ownAccount" :rank="ownRank" unit="分" />
            <div class="exp-gain">
              <p>经验值</p>
              <p class="lead d-flex justify-content-start align-items-center"><span>+{{ ownRank.expGain }}</span><span class="double-exp-badge" v-if="ownRank.doubleExp">双倍</span></p>
            </div>
            <hr>
            <div class="streak" v-if="ownAccount.streaks">
              <p>恭喜你当前连胜次数为：{{ ownRank.wins }}次</p>
              <template v-if="ownRank.remainingWins">
                <p class="lead">再胜<span class="red">{{ ownRank.remainingWins }}场</span>可获得</p>
                <div class="next-awards">
                  <div v-for="award in ownRank.nextAwards" :key="award.name">
                    <img :src="award.icon" class="item-icon">
                    <p class="item-name">{{ award.name }}<wbr><span class="no-break">&times;{{ award.amount }}</span></p>
                  </div>
                  <!--
                  <div>
                    <img src="/images/diamond.svg" class="item-icon">
                    <p class="item-name">钻石<wbr><span class="no-break">&times;100</span></p>
                  </div>
                  <div>
                    <img src="/images/diamond.svg" class="item-icon">
                    <p class="item-name">钻石钻<wbr><span class="no-break">&times;3</span></p>
                  </div>
                  -->
                </div>
              </template>
              <p class="lead" style="line-height: 1.4; margin-bottom: 0" v-else>你的连胜将会继续记录<br>敬请期待，下一阶段连胜的奖励</p>
            </div>
            <div class="streak" v-else-if="ownRank.wins">
              <p>很遗憾，你的{{ ownRank.wins }}场连胜被终结！</p>
              <template v-if="cancelDefeatItem">
                <p class="lead">是否使用<span class="red">败绩抹除卡</span></p>
                <div class="d-flex align-items-center cancel-defeat">
                  <img :src="cancelDefeatItem.icon" class="inflexible">
                  <div class="flexible">
                    <p>败绩抹除卡</p>
                    <p class="small" v-if="cancelDefeatItemAmount">拥有{{ cancelDefeatItemAmount }}个</p>
                    <p class="small" v-else>{{ cancelDefeatItem.price }}钻/次</p>
                  </div>
                  <styled-pill-button :bg-color="cancelingDefeat ? '#a0a0a0' : 'rgb(64,197,255)'" class="inflexible" :disabled="cancelingDefeat" @click.native="cancelDefeat">立即使用</styled-pill-button>
                </div>
              </template>
            </div>
            <div class="streak" v-else>
              <p>你暂未获得连胜</p>
              <p class="lead">再胜<span class="red">{{ ownRank.remainingWins }}场</span>可获得</p>
              <div class="next-awards">
                <div v-for="award in ownRank.nextAwards" :key="award.name">
                  <img :src="award.icon" class="item-icon">
                  <p class="item-name">{{ award.name }}<wbr><span class="no-break">&times;{{ award.amount }}</span></p>
                </div>
                <!--
                <div>
                  <img src="/images/diamond.svg" class="item-icon">
                  <p class="item-name">钻石<wbr><span class="no-break">&times;100</span></p>
                </div>
                <div>
                  <img src="/images/diamond.svg" class="item-icon">
                  <p class="item-name">钻石钻<wbr><span class="no-break">&times;3</span></p>
                </div>
                -->
              </div>
            </div>
          </div>
        </styled-rounded-card>
      </div>
      <div class="button-bar inflexible d-flex">
        <styled-pill-button bottom-color="rgb(166,165,229)" @click.native="leaveAndClose">返回大厅</styled-pill-button>
        <styled-pill-button bg-color="rgb(250,75,127)" @click.native="close">再玩一局</styled-pill-button>
        <styled-pill-button bg-color="rgb(255,207,37)" @click.native="share">分享战绩</styled-pill-button>
        <!--<div class="prompt">今日首次分享可得奖励</div>-->
      </div>
    </template>
    <spinner-box v-else />
  </div>
</template>

<script>
  import find from 'lodash/find';
  import { TweenMax, Sine, Linear } from 'gsap/umd/TweenMax';

  import { UserAccounts } from '../../api/account/collections.js';
  import { Results } from '../../api/game/collections.js';

  import { leaveRoom, ready } from '../../api/game/methods.js';
  import { useItem } from '../../api/item/methods.js';

  import query from '../../modules/client/parsed-query.js';
  import bridge from '../../modules/client/js-bridge.js';

  import { cancelDefeatItem } from '../../domain/client/items.js';

  import StyledRoundedCard from './general/StyledRoundedCard2.vue';
  import Avatar from './user/Avatar.vue';
  import StyledPillButton from './general/StyledPillButton2.vue';
  import Rank from './lobby/Rank.vue';
  import SpinnerBox from './general/SpinnerBox.vue';

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
    /*
    TweenMax.to(e, random(1, 5), {
      rotationX: random(0, 360),
      rotationY: random(0, 360),
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
      delay: -3,
    });
    */
  }

  export default {
    name: "result",
    components: { SpinnerBox, Rank, StyledPillButton, Avatar, StyledRoundedCard },
    props: ['ownAccount', 'roomId', 'session'],
    data() {
      return {
        cancelingDefeat: false,
      };
    },
    created() {
      // console.log(this.roomId, this.session);
      this.$subscribe('result', { name: 'game.result', args: [{ roomId: this.roomId, session: this.session }] });
    },
    computed: {
      ownRank() {
        if (this.$meteor.result) {
          const { rankings = [] } = this.$meteor.result;
          return find(rankings, ({ userId }) => userId === this.ownAccount._id);
        }
        return undefined;
      },
      /*
      winner() {
        if (this.$meteor.result) {
          if (this.ownRank && this.ownRank.place === 1) return this.ownAccount;

          const { rankings = [] } = this.$meteor.result;
          const { userId } = find(rankings, ({ place }) => place === 1) || {};
          if (userId) return UserAccounts.findOne(userId);
        }
        return undefined;
      }
      */
      cancelDefeatItem,
      cancelDefeatItemAmount() {
        return this.ownAccount.itemAmount(this.cancelDefeatItem.id);
      },
    },

    mounted() {
      this.$watch('$meteor.result', function (val) {
        if (val) {
          this.$el.querySelectorAll('.ribbon').forEach((e) => {
            TweenMax.set(e, {
              x: random(vw(15), vw(85)),
              y: random(-vh(50), -50),
              // z: random(0, 100),
            });
            fallAnimate(e);
          });
        }
      });
    },
    /*
    watch: {
      '$meteor.result'(val) {
        console.log(val);
      },
    },
    */
    meteor: {
      result() {
        return Results.findOne({ roomId: this.roomId, session: this.session });
        /*
        return {
          roomId: this.roomId,
          session: this.session,
          rankings: [{
            place: 1,
            userId: this.ownAccount._id,
            score: 0,
            expGain: 0,
            doubleExp: false,
            remainingWins: 1,
            wins: 1,
            nextAwards: [{
              name: '屎粑粑',
              amount: 1,
              icon: '/images/diamond.png',
            }],
          }],
        };
        */
      },
      winner() {
        if (this.$meteor.result) {
          if (this.ownRank && this.ownRank.place === 1) return this.ownAccount;

          const { rankings = [] } = this.$meteor.result;
          const { userId } = find(rankings, ({ place }) => place === 1) || {};
          if (userId) return UserAccounts.findOne(userId);
        }
        return undefined;
      },
    },
    methods: {
      async close() {
        // if (this.room) {
        try {
          await ready.callAsync({ roomId: this.roomId, session: this.session + 1 });
        } finally {
          this.$emit('close');
        }
        // }
      },
      async leaveAndClose() {
        // if (this.room) {
        this.$emit('leave');
        try {
          await leaveRoom.callAsync({ roomId: this.roomId });
        } finally {
          this.$emit('close');
        }
        // }
      },
      share() {
        bridge.gameShare({ roomId: this.roomId, session: this.session });
      },
      async cancelDefeat() {
        if (this.cancelDefeatItemAmount || this.ownAccount.diamondAmount() >= this.cancelDefeatItem.price) {
          this.cancelingDefeat = true;
          try {
            await useItem.callAsync({ id: this.cancelDefeatItem.id, osType: query.osType });
          } catch (e) {
            // TODO: 显示异常信息
          } finally {
            this.cancelingDefeat = false;
          }
        } else {
          bridge.gameFastRecharge({ showMessage: true });
        }
      },
    },
  };
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

      .winner-title {
        /*height: 18%;*/
        padding: .8rem 0 .2rem;
        position: relative;
        > * {
          width: 50%;
        }
      }

      .winner {
        /*height: 82%;*/
        position: relative;

        .title {
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
            width: auto;
            margin-right: .5rem;
            transform: rotate(30deg);
          }
        }
      }

      .ribbon {
        background-size: 277px 181px !important;
        position: absolute;
        opacity: 1;
      }
    }

    .no-winner {
      position: relative;
      background-image: url(/images/no-winner-bg.png);
      background-repeat: repeat;
      padding: 4rem .8rem 0;
      background-clip: content-box;
      background-position: .8rem 4rem;
      // background-size: 2rem;
      background-size: 2.5rem;

      img {
        width: 75%;
      }
    }

    .own-result {
      padding: 0 .8rem;
      position: relative;
      /*z-index: 1;*/

      .result-card .result-card-body {
        color: #0b0b0b;
        padding: 1.1rem 1.2rem;

/*
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
*/
        .rank {
          margin-bottom: 1rem;
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

        .exp-gain {
          p.lead {
            margin-top: .5rem;
            .double-exp-badge {
              margin-left: .4rem;
              background-color: rgb(255,207,37);
              font-size: .75rem;
              color: rgb(11,11,11);
              height: 1.125rem;
              line-height: 1.125rem;
              padding: 0 .4rem;
              border-radius: .3rem;
            }
          }
        }

        hr {
          margin: 1rem 0;

        }

        .streak {
          min-height: 7.5rem;
          p.lead {
            margin-bottom: 1.2rem;
          }
          .next-awards {
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
          .cancel-defeat {
            height: 3.8rem;

            img {
              height: 3.6rem;
              width: auto;
            }

            > div {
              padding: 0 .5rem;

              p.small {
                margin-bottom: 0;
                color: rgb(91,78,212);
                font-size: .75rem;
              }
            }

            > button {
              /deep/ .button-content {
                padding: .3rem 1.2rem;
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
        height: 2.8rem;
        font-size: 1.125rem;
        line-height: 1.2;
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
