<template>
  <div class="answer-sheet">
    <div class="button-bar d-flex">
      <button class="btn btn-rounded">
        <div>除&nbsp;&nbsp;&nbsp;错</div>
        <div class="small">200钻石</div>
        <img src="/images/exclude.svg" class="btn-append-icon">
      </button>
      <button class="btn btn-rounded">
        <div>提&nbsp;&nbsp;示</div>
        <div class="small">50钻石</div>
        <img src="/images/tip.svg" class="btn-append-icon">
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
          <img src="/images/clear.svg" class="w-100 d-block">
        </button>
      </div>
    </div>
    <div class="choice-area d-flex">
      <div class="grid inflexible" v-for="(choice, index) in choices">
        <button class="btn w-100 choice" :class="{ pressed: isPressed(index), excluded: isExcluded(index) }" @click="!isExcluded(index) && onChoiceClick(index)" :disabled="isExcluded(index) || answerCorrect">
          <aspect-ratio-box :ratio="7/6">
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
  import MD5 from 'crypto-js/md5';

  import { submitAnswer } from '../../../api/game/methods.js';

  import AspectRatioBox from '../general/AspectRatioBox.vue';
  import StyledRoundedButton from '../general/StyledRoundedButton.vue';

  const tid = Symbol('tid');

  export default {
    name: "answer-sheet",
    components: { StyledRoundedButton, AspectRatioBox },
    props: ['type', 'choices', 'answerFormat', 'answerHash'],
    data() {
      return {
        excluded: [],
        model: [], // -1 表示空格，undefined表示空位，数字表示序号
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
    },

    watch: {
      model() {
        this.stopTimeout();
      },
      answerCorrect(val) {
        if (val) {
          this.$emit('answerCorrect', this.answer.join('').trim());
        }
      },
      answerIncorrect(val) {
        if (val) {
          this[tid] = Meteor.setTimeout(() => this.reset(), 1000);
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
        return this.excluded.includes(i);
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
          padding-right: 1.5rem;
        }

        .small {
          font-size: 70%;
        }

        .btn-append-icon {
          position: absolute;
          height: 110%;
          top: -5%;
          right: -13%;
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
        padding-left: .4rem;
        padding-right: .4rem;

        .input {
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
