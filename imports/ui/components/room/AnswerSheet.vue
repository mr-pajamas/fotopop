<template>
  <div class="answer-sheet">
    <div class="button-bar d-flex">
      <button class="btn btn-rounded" @click="excludeWrongChoices" :disabled="!!wrongChoices.length || fetchingWrongChoices || answerCorrect" v-if="excludeItem">
        <div>除&nbsp;&nbsp;&nbsp;错</div>
        <div class="small" v-if="excludeItemAmount">拥有{{ excludeItemAmount }}个</div>
        <div class="small" v-else>{{ excludeItem.price }}钻石</div>
        <!--<img src="/images/exclude.svg" class="btn-append-icon">-->
        <svg class="btn-append-icon" width="40" height="58" viewBox="0 0 40 58" xmlns="http://www.w3.org/2000/svg"><g transform="translate(4 2)" stroke="#030303" stroke-width="4" fill="none" fill-rule="evenodd"><path d="M13 33.757v16.422a3.667 3.667 0 0 0 3.667 3.667h1.416a3.667 3.667 0 0 0 3.667-3.667V33.757c-1.684.964-3.12 1.455-4.375 1.455s-2.69-.491-4.375-1.455z" fill="#FFF"/><ellipse fill="#EB5A6B" cx="17" cy="17.231" rx="17" ry="17.231"/><path d="M9 22.848L26 12" stroke-linecap="round"/></g></svg>
      </button>
      <button class="btn btn-rounded" @click="showTip" :disabled="!!tip || fetchingTip || answerCorrect" style="padding-right: 1.5rem" v-if="tipItem">
        <div>提&nbsp;&nbsp;示</div>
        <div class="small" v-if="tipItemAmount">拥有{{ tipItemAmount }}个</div>
        <div class="small" v-else>{{ tipItem.price }}钻石</div>
        <img src="/images/tip.png" class="btn-append-icon">
        <!--
        <svg class="btn-append-icon" width="40" height="58" viewBox="0 0 40 58" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 2)" stroke-width="4" fill="none" fill-rule="evenodd"><path d="M7.667 33.059v17.274A3.667 3.667 0 0 0 11.333 54h12.75a3.667 3.667 0 0 0 3.667-3.667V33.06c-4.234 1.533-7.56 2.307-10.042 2.307-2.48 0-5.807-.774-10.041-2.307z" stroke="#030303" fill="#FFF"/><path d="M8 41h17M8 47h17" stroke="#030303" stroke-linecap="square"/><ellipse stroke="#030303" fill="#FFCF25" cx="17" cy="17.231" rx="17" ry="17.231"/><path d="M18.271 5.53c5.803 1.408 8.704 4.391 8.704 8.949" stroke="#FFF" stroke-linecap="round"/></g></svg>
        -->
      </button>
    </div>
    <div class="answer-area d-flex" :style="{ flexWrap: !!type ? 'nowrap' : 'wrap' }">
      <template v-if="!type">
        <div class="grid inflexible" v-for="i in model" :class="{ shake: answerIncorrect }">
          <styled-rounded-button class="w-100" bottom-color="rgb(250,75,127)" :color="gridColor" :disabled="(i === undefined) || answerCorrect" @click.native="onChoiceClick(i)">
            <aspect-ratio-box :ratio="1" class="w-100">
              <div class="w-100 h-100 d-flex align-items-center justify-content-center">
                <span v-if="i !== undefined" :class="{ blink: answerCorrect }">{{ choices[i] }}</span>
              </div>
            </aspect-ratio-box>
          </styled-rounded-button>
        </div>
      </template>

      <div v-else class="grid flexible input-grid" :class="{ shake: answerIncorrect }">
        <styled-rounded-button class="w-100" bottom-color="rgb(250,75,127)" disabled :color="gridColor">
          <div class="w-100 text-truncate input" :class="{ blink: answerCorrect }">{{ answer.join('').trim() }}</div>
        </styled-rounded-button>
      </div>

      <div class="grid inflexible d-flex clear-grid">
        <button class="btn" @click="reset" :disabled="answerCorrect">
          <!--<img src="/images/clear.svg" class="w-100 d-block">-->
          <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M10 1.5A8.5 8.5 0 0 0 1.5 10v36a8.5 8.5 0 0 0 8.5 8.5h36a8.5 8.5 0 0 0 8.5-8.5V10A8.5 8.5 0 0 0 46 1.5H10z" stroke="#030303" stroke-width="3" fill-opacity=".1" fill="#FFF"/><g stroke="#FFF" stroke-linecap="round" stroke-width="4"><path d="M17.26 20.61h16.957c5.043 0 9.13 3.975 9.13 8.878 0 4.903-4.087 8.878-9.13 8.878H17.261"/><path d="M22.02 27.976l-7.378-7.378 7.175-7.175"/></g></g></svg>
        </button>
      </div>
    </div>
    <div class="choice-area d-flex">
      <div class="grid inflexible" v-for="(choice, index) in choices">
        <button class="btn w-100 choice" :class="{ pressed: isPressed(index), excluded: isExcluded(index) }" @click="!isExcluded(index) && onChoiceClick(index)" :disabled="isExcluded(index) || answerCorrect">
          <aspect-ratio-box :ratio="7 / 6">
            <div class="w-100 h-100 d-flex align-items-center justify-content-center">
              <span>{{ choice }}</span>
            </div>
          </aspect-ratio-box>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Meteor } from 'meteor/meteor';
  import indexOf from 'lodash/indexOf';
  // import map from 'lodash/map';
  // import forEach from 'lodash/forEach';
  import MD5 from 'crypto-js/md5';
  import query from '../../../modules/client/parsed-query.js';
  import bridge from '../../../modules/client/js-bridge.js';
  import { excludeItem, tipItem } from '../../../domain/client/items.js';

  import { getWrongChoices, getTip } from '../../../api/game/methods.js';

  import AspectRatioBox from '../general/AspectRatioBox2.vue';
  import StyledRoundedButton from '../general/StyledRoundedButton2.vue';

  const tid = Symbol('tid');

  export default {
    name: "answer-sheet",
    components: { StyledRoundedButton, AspectRatioBox },
    props: ['ownAccount', 'room', 'type', 'choices', 'answerFormat', 'answerHash'],
    data() {
      return {
        wrongChoices: [],
        tip: '',
        model: [], // -1 表示空格，undefined表示空位，数字表示序号
        fetchingWrongChoices: false,
        fetchingTip: false,
      };
    },
    computed: {
      /*
      choiceChunks() {
        return chunk(this.choices, 7);
      },
      */
      answer() {
        // return this.model.map(i => i === undefined ? '' : (i === -1 ? ' ' : this.choices[i]));
        return this.model.map((i) => {
          if (i === undefined) {
            return '';
          } else if (i === -1) {
            return ' ';
          }
          return this.choices[i];
        });
      },
      hasAnswer() {
        return indexOf(this.model, undefined) === -1;
      },
      answerCorrect() {
        if (this.hasAnswer) {
          const answer = this.answer.join('').trim();
          const hash = MD5(answer).toString();
          return hash.toLowerCase() === this.answerHash.toLowerCase();
        }
        return false;
      },
      answerIncorrect() {
        return this.hasAnswer && !this.answerCorrect;
      },
      gridColor() {
        if (this.answerCorrect) return '#1ca467';
        if (this.answerIncorrect) return '#ff0000';
        return '#333333';
      },
      excludeItem,
      excludeItemAmount() {
        return this.ownAccount.itemAmount(this.excludeItem.id);
      },
      tipItem,
      tipItemAmount() {
        return this.ownAccount.itemAmount(this.tipItem.id);
      },
    },

    watch: {
      model() {
        this.stopTimeout();
      },
      answerCorrect(val) {
        if (val) {
          this.$emit('answer-correct', this.answer.join('').trim());
        }
      },
      answerIncorrect(val) {
        if (val) {
          this[tid] = Meteor.setTimeout(() => this.reset(), 1000);
        }
      },
      wrongChoices(val) {
        const { hit, newModel } = this.model.reduce((acc, cur) => {
          if (indexOf(val, cur) !== -1) {
            acc.hit = true;
            acc.newModel.push(undefined);
          } else {
            acc.newModel.push(cur);
          }
          return acc;
        }, { hit: false, newModel: [] });

        if (hit) {
          this.model = newModel;
          if (this.type === 1) this.compactModel();
        }
      },
    },

    created() {
      this.reset();
    },
    methods: {
      stopTimeout() {
        if (this[tid]) {
          Meteor.clearTimeout(this[tid]);
          this[tid] = undefined;
        }
      },
      reset() {
        this.model = [...this.answerFormat].map(c => c === ' ' ? -1 : undefined);
      },
      onChoiceClick(index) {
        let i = indexOf(this.model, index);
        if (i !== -1) {
          // 取消选择
          this.model.splice(i, 1, undefined);
          if (this.type === 1) this.compactModel();
        } else {
          // 选择
          i = indexOf(this.model, undefined);
          if (i !== -1) this.model.splice(i, 1, index);
        }
      },
      isPressed(i) {
        return this.model.includes(i);
      },
      isExcluded(i) {
        return this.wrongChoices.includes(i);
      },
      compactModel() { // 仅当英语模式需要用到
        const newModel = [...this.answerFormat].map(c => c === ' ' ? -1 : undefined);
        ({ newModel: this.model } = this.model.reduce((acc, cur) => { // [undefined, undefined, -1, 1, undefined, 2]
          if (cur !== undefined && cur !== -1) {
            const index = acc.newModel.indexOf(undefined, acc.from);
            if (index !== -1) {
              acc.newModel.splice(index, 1, cur);
              acc.from = index + 1;
            }
          }
          return acc;
        }, {
          from: 0,
          newModel,
        }));
      },
      async excludeWrongChoices() {
        if (this.excludeItemAmount || this.ownAccount.diamondAmount() >= this.excludeItem.price) {
          this.fetchingWrongChoices = true;
          try {
            this.wrongChoices = await getWrongChoices.callAsync({
              roomId: this.room._id,
              session: this.room.session,
              roundNumber: this.room.currentRoundNumber(),
              osType: query.osType,
            });
          } catch (e) {
            // TODO: 显示异常信息
          } finally {
            this.fetchingWrongChoices = false;
          }
        } else {
          bridge.gameFastRecharge({ showMessage: true });
        }
      },
      async showTip() {
        if (this.tipItemAmount || this.ownAccount.diamondAmount() >= this.tipItem.price) {
          this.fetchingTip = true;
          try {
            this.tip = await getTip.callAsync({
              roomId: this.room._id,
              session: this.room.session,
              roundNumber: this.room.currentRoundNumber(),
              osType: query.osType,
            });
            this.$emit('got-tip', this.tip);
          } catch (e) {
            // TODO: 显示异常信息
          } finally {
            this.fetchingTip = false;
          }
        } else {
          bridge.gameFastRecharge({ showMessage: true });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>

  .answer-sheet {
    padding-left: .6rem;
    padding-right: .6rem;

    .button-bar {
      padding: .3rem .2rem;
      justify-content: flex-end;

      .btn-rounded {
        background-color: rgba(255,255,255,.1);
        border: .1rem rgb(3,3,3) solid;
        border-radius: .4rem;
        padding: .15rem 1.4rem .15rem .7rem;
        font-size: .875rem;
        line-height: 1.3;
        color: #fff;
        position: relative;

        & + .btn-rounded {
          margin-left: 1.5rem;
        }

        .small {
          font-size: 70%;
        }

        .btn-append-icon {
          position: absolute;
          height: 110%;
          width: auto;
          top: -5%;
          right: -13%;
        }

        &[disabled] {
          opacity: .4;
        }
      }
    }

    .answer-area {
      margin-left: -.4rem;
      margin-bottom: -.3rem;
      padding: .4rem .1rem;
      justify-content: center;

      .grid {
        padding-left: .4rem;
        margin-bottom: .3rem;
        width: 12.5%;
        font-size: 1.1rem;

        .char {
          font-size: 1.1rem;
        }

        &.shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .blink {
          animation: blink .25s step-end 0s 3;
        }
      }

      .input-grid button {
        height: 2.6rem;

        .input {
          padding-left: .4rem;
          padding-right: .4rem;
          text-align: left;
        }
      }

      .clear-grid {
        justify-content: center;
        align-items: center;

        .btn {
          width: 75%;
        }
      }
    }

    .choice-area {
      margin-left: -.5rem;
      margin-bottom: -.4rem;
      padding: .4rem 0 .2rem;
      flex-wrap: wrap;

      .grid {
        padding-left: .5rem;
        margin-bottom: .4rem;
        width: 14.2857%;

        .choice {
          background-color: #fff;
          border-radius: .4rem;
          font-size: 1.1rem;
          color: #0b0b0b;

          &.pressed {
            background-color: rgb(86,84,147);
            color: rgba(255,255,255,.5);
          }

          &.excluded {
            background-color: rgb(216,216,216);
            color: rgb(175,175,175);
          }
        }
      }
    }
  }
</style>
