<template>
  <div class="room">
    <template v-if="room.questions">
      <audio v-for="(question, index) in room.questions" :src="question.audio" preload="auto" :class="{ playing: index === room.currentRoundNumber() - 1 }"></audio>
    </template>

    <div class="room-top">
      <div class="room-head-bar">
        <template v-if="!room.inGame()">
          <button class="btn rounded-circle inflexible leave-btn" style="background-image: url(/images/leave.svg);"></button>
          <div class="room-title flexible">
            <p class="room-name">{{ room.typeName() }} - {{ room.categoryName }}</p>
            <p class="small">房间ID：{{ room.searchId }}</p>
          </div>
        </template>

        <message-box v-else class="question-counter">
          <span v-if="countdown">即将播放第{{ room.currentRoundNumber() }}题</span>
          <template v-else>
            <span>{{ room.currentRoundNumber() }}/10题<span v-if="elapsedTime !== undefined" style="margin-left: .5rem">{{ 23 - elapsedTime }}s</span></span>
            <sound-icon class="ml-auto sound-icon" />
          </template>
        </message-box>

        <diamond-inline :diamond="ownAccount.diamond" class="ml-auto" bg-color="#1f1e48" />
      </div>
      <div class="room-users">
        <div v-for="(user, index) in $meteor.roomUsers" :key="user.id">
          <div class="avatar-box">
            <avatar :user="user" :show-vip="true" />
            <div v-if="index === 0" class="host-label">房主</div>
            <div v-if="!room.inGame() && user.ready" class="avatar-label ready-label"><span>准备</span></div>
            <transition name="inc">
              <div v-if="room.inGame() && incs[user.id]" :key="incs[user.id].c" class="avatar-label inc-label"><span>+{{ incs[user.id].d }}</span></div>
            </transition>
            <div v-if="room.inGame()" class="avatar-label score-label"><span>{{ room.scores()[user.id] || 0 }}分</span></div>
          </div>
          <p class="text-truncate small text-center mt-0 mb-0 w-100">{{ user.name }}</p>
        </div>
        <div v-for="emptySlot in emptySlots">
          <empty-slot />
        </div>
      </div>
    </div>
    <div class="room-bottom d-flex flex-column">
      <div class="broadcast-bar inflexible">
        <div>测试消息</div>
      </div>
      <div class="messages flexible">

      </div>

      <transition name="slide-up">
        <answer-sheet v-if="inQuestion" class="inflexible" v-bind="room.currentQuestion()" @answerCorrect="submitAnswer($event)" />
      </transition>

      <div v-if="!room.inGame()" class="button-group inflexible d-flex">
        <styled-pill-button class="btn-lg fast-match-btn" bg-color="rgb(64,197,255)" color="#fff" :text-shadow="true">
          <span>快速匹配</span><span class="fast-match-price"><img src="/images/diamond.svg"><span>10</span></span>
        </styled-pill-button>
        <styled-pill-button class="btn-lg" v-if="room.host().id === ownAccount._id" bg-color="rgb(250,75,127)" color="#fff" :text-shadow="true" @click.native="startGame">开始游戏</styled-pill-button>
      </div>

      <bottom-bar class="inflexible" />
    </div>

    <transition name="countdown">
      <img v-if="countdown > 1" :key="countdown" :src="`/images/${countdown}.svg`" class="countdown">
    </transition>
    <transition name="countdown-last">
      <img v-if="countdown === 1" src="/images/1.svg" class="countdown">
    </transition>
  </div>
</template>

<script>
  import fill from 'lodash/fill';
  import find from 'lodash/find';
  import filter from 'lodash/filter';
  import reject from 'lodash/reject';
  import reduce from 'lodash/reduce';
  import forEach from 'lodash/forEach';
  import { Meteor } from 'meteor/meteor';

  import { UserAccounts } from '../../api/account/collections.js';
  import * as GameMethods from '../../api/game/methods.js';

  import Bot from '../../api/game/bot.js';

  import MessageBox from './room/MessageBox.vue';
  import DiamondInline from './user/DiamondInline.vue';
  import Avatar from './user/Avatar.vue';
  import EmptySlot from './user/EmptySlot.vue';
  import StyledPillButton from './general/StyledPillButton.vue';
  import BottomBar from './room/BottomBar.vue';
  import SoundIcon from './room/SoundIcon.vue';
  import AnswerSheet from './room/AnswerSheet';

  const tid = Symbol('tid');
  // const atid = Symbol('atid');

  export default {
    name: 'room',
    components: { AnswerSheet, SoundIcon, BottomBar, StyledPillButton, EmptySlot, Avatar, DiamondInline, MessageBox },
    props: ['ownAccount', 'room'],
    data() {
      return {
        elapsedTime: undefined,
        bots: {},
        incs: {}, // { uid2: { c: 1, value: 5, ttl: 2 } }
      };
    },
    computed: {
      emptySlots() {
        return fill(Array(6 - this.room.users.length), undefined);
      },
      /*
      ownRoom() {
        return this.room.host().id === this.ownAccount._id;
      },
      */
      countdown() {
        const cd = 3 - this.elapsedTime;
        return cd > 0 ? cd : 0;
      },
      inQuestion() {
        return this.room.inGame() && !this.countdown;
      },
    },
    meteor: {
      roomUsers() {
        // 房主提前
        const { users } = this.room;
        const host = this.room.host();
        return [host, ...reject(users, u => u.id === host.id)]
          .map(user => Object.assign({}, UserAccounts.findOne(user.id), user));
        // return users.map(user => Object.assign({}, UserAccounts.findOne(user.id), user));
      },
    },

    created() {
      // TODO: 注意ownership的转换
      /*
      this.$watch('room.rounds.length', function (val) {
        this.stopCountdown();
        if (val) {
          const { elapsedTime } = _.last(this.room.rounds);

          if (elapsedTime < 23) {
            this.timeRemaining = 23 - elapsedTime;
            this[tid] = Meteor.setInterval(() => {
              if (this.timeRemaining > 0) this.timeRemaining -= 1;
              if (this.timeRemaining === 0) {
                this.stopCountdown();
              }
            }, 1000);
          } else {
            this.timeRemaining = 0;
          }
        } else {
          this.timeRemaining = 0;
        }
      }, { immediate: true });
      */
      // 还要watch session
      this.$watch(function () {
        return filter(this.room.users, u => !!u.botLevel);
      }, function (bots) {
        this.bots = reduce(
          bots,
          (map, b) => {
            const bot = new Bot(b.id, b.botLevel, this.room._id);
            bot.init(this.room.session);
            map[b.id] = bot;
            return map;
          },
          {},
        );
      }, { immediate: true });

      /*
      this.$watch(function () {
        return this.room.inGame();
      }, function (val) {
        if (val) {

        } else {

        }
      }, { immediate: true });
      */

      // 进来的时候，看看要不要倒计时（意味着断线重连）
      this.$watch(function () {
        return this.room.inGame() && this.room.users;
      }, async function (users) {
        if (users) { // 如果是inGame
          // 看看是别人还是自己
          if (this.elapsedTime === undefined) { // 自己恢复计时
            const { roundElapsedTime } = find(users, user => user.id === this.ownAccount._id);
            if (roundElapsedTime !== undefined) {
              this.elapsedTime = roundElapsedTime;
              if (this.elapsedTime < 23) this.startCountdown();
            } else {
              // 如果没人知道时间，就假定该回合结束
              const user = find(users, (user) => {
                return user.id !== this.ownAccount._id && !user.botLevel && user.roundElapsedTime !== undefined;
              });
              if (!user) {
                await GameMethods.tellElapsedTime.callAsync({
                  roomId: this.room._id,
                  session: this.room.session,
                  roundNumber: this.room.currentRoundNumber(),
                  elapsedTime: 23,
                });
              }
              return;
            }
          }

          // 看别人
          // assert this.timeRemaining !== undefined
          const user = find(users, (user) => {
            return user.id !== this.ownAccount._id && !user.offline && user.roundElapsedTime === undefined;
          });
          if (user) {
            await GameMethods.tellElapsedTime.callAsync({
              roomId: this.room._id,
              session: this.room.session,
              roundNumber: this.room.currentRoundNumber(),
              elapsedTime: this.elapsedTime,
            });
          }
        }
      }, { immediate: true });

      this.$watch(function () {
        return this.room.scores();
      }, function (scores, oldScores) {
        const incs = reduce(Object.entries(scores), (result, [uid, score]) => {
          const d = oldScores[uid] ? score - oldScores[uid] : score;

          if (d > 0) {
            const c = (this.incs[uid] ? this.incs[uid].c + 1 : 0);
            result[uid] = { c, d };
          }
          return result;
        }, {});

        this.incs = Object.assign({}, this.incs, incs);
      });
    },

    mounted() {
      this.$watch('inQuestion', async function (val) {
        if (val) {
          this.$el.querySelectorAll('audio:not(.playing)').forEach(e => e.pause());
          await this.$el.querySelector('audio.playing').play();
        } else {
          this.$el.querySelectorAll('audio').forEach(e => e.pause());
        }
      }, { immediate: true });
    },

    watch: {
      'room.session'(session) {
        this.incs = {};
        forEach(this.bots, bot => bot.init(session));
      },
      'room.rounds.length'(val) {
        this.stopCountdown();
        if (val) {
          this.elapsedTime = 0;
          this.startCountdown();
        } else {
          this.elapsedTime = undefined;
        }
      },
      async elapsedTime(val) { // TODO: 此处还要回收加分动效
        if (val >= 3) {
          const bots = filter(Object.entries(this.bots), ([id, bot]) => {
            return bot.solve(this.room.currentRoundNumber(), val - 3); // 从第三秒开始算起
          }).map(([id]) => id);
          if (bots.length) {
            await GameMethods.tellWinningBots.callAsync({
              roomId: this.room._id,
              session: this.room.session,
              roundNumber: this.room.currentRoundNumber(), // TODO: 这里可能有问题，已经到下一轮
              bots,
            });
          }
        }
        if (val === 23) {
          await GameMethods.tellElapsedTime.callAsync({
            roomId: this.room._id,
            session: this.room.session,
            roundNumber: this.room.currentRoundNumber(), // TODO: 这里可能有问题，已经到下一轮
            elapsedTime: 23,
          });
        }
      },
    },

    destroyed() {
      this.stopCountdown();
    },

    methods: {
      stopCountdown() {
        if (this[tid]) {
          Meteor.clearInterval(this[tid]);
          this[tid] = undefined;
        }
      },
      startCountdown() {
        this[tid] = Meteor.setInterval(() => {
          if (this.elapsedTime < 23) this.elapsedTime += 1;
          if (this.elapsedTime === 23) {
            this.stopCountdown();
          }
        }, 1000);
      },
      /*
      stopTicker() {
        if (this[atid]) {
          Meteor.clearInterval(this[atid]);
          this[atid] = undefined;
        }
      },
      startTicker() {
        this[atid] = Meteor.setInterval(() => {

        }, 500);
      },
      */
      /*
      isCountingDown() {
        return !!this[tid];
      },
      */
      async startGame() {
        await GameMethods.startGame.callAsync({});
      },
      async submitAnswer(answer) {
        await GameMethods.submitAnswer.callAsync({
          roomId: this.room._id,
          session: this.room.session,
          roundNumber: this.room.currentRoundNumber(),
          answer,
        });
      }
    },
  };
</script>

<style lang="scss" scoped>

  .room {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #2d2c66;
    justify-content: center;
    position: relative;

    audio {
      display: none;
    }

    .room-top {
      background-color: #272651;
      flex: 0 0 auto;
    }

    .room-head-bar {
      height: 3.2rem;
      display: flex;
      align-items: center;
      padding: 0 .6rem;
      margin: 0;
      border: 0;


      .leave-btn {
        height: 2rem;
        width: 2rem;
      }

      .room-title {
        color: #fff;
        padding: 0 .5rem;

        p {
          margin: 0;
        }

        .room-name {
          margin-bottom: .2rem;
        }

        .small {
          font-size: 70%;
          color: rgba(255,255,255,.8);
        }
      }

      .question-counter {
        color: rgb(48,255,234);
        min-width: 50%;
        display: flex;
        align-items: center;

        .sound-icon {
          height: 1.2rem;
        }
      }
    }

    .room-users {
      display: flex;
      align-items: stretch;
      justify-content: center;
      flex-wrap: nowrap;
      padding: 1rem .6rem;
      margin: 0;
      border: 0;
      margin-left: -.5rem;

      > div {
        flex: 0 0 auto;
        padding-left: .5rem;
        width: 16.666%;

        .avatar-box, .empty-slot {
          width: 75%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: .5rem;
          position: relative;

          .avatar-label {
            position: absolute;
            bottom: -5%;
            width: 100%;
            display: flex;
            align-items: stretch;
            justify-content: center;

            span {
              border-radius: .45rem;
              font-size: .6rem;
              line-height: .6rem;
              height: .9rem;
              padding: .2rem .3rem .1rem;
              margin-left: auto;
              margin-right: auto;
              border: 0;
            }
          }

          .ready-label span {
            background-color: #8b8aaf;
            color: #272651;
          }

          .score-label span,
          .inc-label span {
            background-color: rgb(250,75,127);
            color: #fff;
          }

          .inc-label {
            opacity: 0;
          }

          .host-label {
            position: absolute;
            top: -5%;
            right: -15%;
            border-radius: .45rem;
            font-size: .6rem;
            height: .9rem;
            line-height: .6rem;
            padding: .2rem .3rem .1rem;
            border: 0;
            background-color: #5542ed;
            color: #fff;
            display: inline-block;
          }
        }
      }
    }

    .broadcast-bar {
      height: 2rem;

      div {
        height: 100%;
        padding: .4rem .7rem;
        font-size: .875rem;
        line-height: 1.37142857;
        background-color: rgb(54,54,102);
      }
    }

    .button-group {
      padding: .6rem;
      > * {
        flex: 1 1 0;
        & + * {
          margin-left: .5rem;
        }
      }

      .fast-match-btn {
        .fast-match-price {
          margin-left: .8rem;
          font-size: .8rem;
          line-height: 1;
          display: flex;
          align-items: center;
          text-shadow: none;

          img {
            margin-right: .2rem;
            height: .8rem;
          }
        }
      }
    }

    .room-bottom {
      background-color: #2d2c66;
      flex: 1 1 auto;
    }

    .countdown {
      width: 5rem;
      position: absolute;
      align-self: center;
      margin-top: auto;
      margin-bottom: auto;
    }
  }
</style>
