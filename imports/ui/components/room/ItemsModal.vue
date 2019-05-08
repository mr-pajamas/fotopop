<template>
  <div class="filler d-flex justify-content-center align-items-center dialog-filler" @click.self="$emit('close')">
    <div class="dialog items-dialog">
      <div class="dialog-header d-flex align-items-center">
        <p class="flexible text-truncate">{{ selectedItem.name }}</p>
        <button class="btn rounded-circle inflexible" @click="$emit('close')"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></button>
      </div>
      <div class="dialog-body">
        <flickity ref="flickity" :options="flickityOptions">
          <div class="cell" v-for="(item, index) in items" :key="item.id">
            <a href="javascript:void(0)" class="item-box" :class="{ selected: index === selectedIndex }">
              <div class="item-icon">
                <aspect-ratio-img-box :ratio="1" :src="item.icon" class="w-100" />
                <div class="amount-label" v-if="ownAccount.itemAmount(item.id)">{{ ownAccount.itemAmount(item.id) }}</div>
              </div>
              <p class="item-price d-flex align-items-center justify-content-center"><img src="/images/diamond.png" class="d-block"><span>{{ item.price }}</span></p>
            </a>
          </div>
        </flickity>
        <!--
        <tiny-slider v-bind="tinySliderOptions">
          <div class="item-box">
            <div class="item-icon w-100">
              <aspect-ratio-img-box :ratio="1" src="/images/cancel-defeat.png" class="w-100" />
            </div>
            <p>1000</p>
          </div>
          <div class="item-box">
            <div class="item-icon w-100">
              <aspect-ratio-img-box :ratio="1" src="/images/cancel-defeat.png" class="w-100" />
            </div>
            <p>1000</p>
          </div>
          <div class="item-box">
            <div class="item-icon w-100">
              <aspect-ratio-img-box :ratio="1" src="/images/cancel-defeat.png" class="w-100" />
            </div>
            <p>1000</p>
          </div>
          <div class="item-box">
            <div class="item-icon w-100">
              <aspect-ratio-img-box :ratio="1" src="/images/cancel-defeat.png" class="w-100" />
            </div>
            <p>1000</p>
          </div>
          <div class="item-box">
            <div class="item-icon w-100">
              <aspect-ratio-img-box :ratio="1" src="/images/cancel-defeat.png" class="w-100" />
            </div>
            <p>1000</p>
          </div>
          <div class="item-box">
            <div class="item-icon w-100">
              <aspect-ratio-img-box :ratio="1" src="/images/cancel-defeat.png" class="w-100" />
            </div>
            <p>1000</p>
          </div>
        </tiny-slider>
        <div class="slider-nav-container">
          <button class="btn">1</button>
          <button class="btn">2</button>
          <button class="btn">3</button>
          <button class="btn">4</button>
          <button class="btn">5</button>
          <button class="btn">6</button>
        </div>
        -->
      </div>
      <div class="dialog-footer d-flex align-items-center">
        <div class="own-diamonds d-flex align-items-center flexible" style="overflow: hidden">
          <img src="/images/diamond.png" class="d-block inflexible">
          <span class="text-truncate" style="flex: 0 1 auto">{{ ownAccount.diamondAmount() }}</span>
          <button class="btn inflexible" @click="purchaseDiamonds">充值</button>
        </div>
        <button class="btn inflexible" @click="useItem" :disabled="submitting">{{ submitting ? '使用中...' : '使用' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  /*
  import 'vue-agile/dist/VueAgile.css';
  import VueAgile from 'vue-agile/dist/VueAgile.common';
  */
  // import VueTinySlider from 'vue-tiny-slider';
  import { Meteor } from 'meteor/meteor';

  import Flickity from '../general/Flickity.vue';
  import query from '../../../modules/client/parsed-query.js';
  import { listableItems } from '../../../domain/client/items.js';
  import bridge from '../../../modules/client/js-bridge.js';
  import AspectRatioImgBox from '../general/AspectRatioImgBox.vue';
  import { useItem } from '../../../api/item/methods.js';

  const tid = Symbol('tid');

  export default {
    name: "items-modal",
    components: {
      AspectRatioImgBox,
      // 'tiny-slider': VueTinySlider,
      Flickity,
    },
    props: ['ownAccount'],
    data() {
      return {
        selectedIndex: 0,
        submitting: false,
      };
    },
    computed: {
      items() {
        return listableItems();
      },
      selectedItem() {
        return this.items[this.selectedIndex];
      },
      /*
      tinySliderOptions() {
        return {
          mouseDrag: true,
          loop: false,
          items: 4,
          nav: true,
          navContainer: '.slider-nav-container',
          controls: false,
        };
      },
      */
      flickityOptions() {
        return {
          prevNextButtons: false,
          pageDots: true,
          wrapAround: false,
          contain: true,
          groupCells: 4,
          draggable: true,
          selectedAttraction: 0.2,
          friction: 0.9,
          on: {
            staticClick: this.onFlickityClick,
            select: this.stopTimeout,
            dragStart: this.stopTimeout,
            settle: this.onFlickitySettle,
          },
          accessibility: false,
          dragThreshold: 5,
        };
      },
    },
    methods: {
      onFlickityClick(event, pointer, cellElement, cellIndex) {
        if (!cellElement) return;
        this.selectedIndex = cellIndex;
        this.stopTimeout();
      },
      onFlickitySettle(index) {
        const slides = Math.ceil(this.items.length / 4);
        let first, last;
        if (index === slides - 1) {
          first = this.items.length - 4;
          last = this.items.length - 1;
        } else {
          first = index * 4;
          last = index * 4 + 3;
        }
        if (this.selectedIndex < first || this.selectedIndex > last) {
          this[tid] = Meteor.setTimeout(() => {
            this.$refs.flickity.selectCell(this.selectedIndex);
          }, 1000);
        }
      },
      stopTimeout() {
        if (this[tid]) {
          Meteor.clearTimeout(this[tid]);
          this[tid] = undefined;
        }
      },
      purchaseDiamonds() {
        this.$emit('close');
        bridge.gameFastRecharge();
      },
      async useItem() {
        const { id, price } = this.selectedItem;
        if (this.ownAccount.itemAmount(id) || this.ownAccount.diamondAmount() >= price) {
          this.submitting = true;
          try {
            await useItem.callAsync({ id, osType: query.osType });
            // this.$emit('close');
          } catch (e) {
            // TODO: 显示异常信息
          } finally {
            this.submitting = false;
          }
        } else {
          this.$emit('close');
          bridge.gameFastRecharge({ showMessage: true });
        }
      },
    },

    destroyed() {
      this.stopTimeout();
    },
  };
</script>

<style lang="scss" scoped>
  /*@import "~node_modules/tiny-slider/src/tiny-slider";*/

  .dialog-filler {
    background-color: transparent;
  }

  .items-dialog {
    width: 100%;
    bottom: 0;
    background-color: rgb(39,38,81);
    border-radius: .8rem .8rem 0 0;
    padding: 0;

    .dialog-header {
      height: 2.5rem;
      border-bottom: 1px rgba(110,106,144,.3) solid;
      color: #fff;
      padding: 0 .75rem;

      p {
        margin: 0;
        font-size: .875rem;
      }

      .btn {
        margin-left: .5rem;
        padding: .2rem;
        line-height: 1;
        color: #fff;
        svg {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    .dialog-body {
      position: relative;
      /*padding-top: 1rem;*/
      .cell {
        padding: .5rem .5rem 0;
        width: 25%;

        .item-box {
          display: block;
          padding-top: .5rem;

          .item-icon {
            width: 85%;
            margin-left: auto;
            margin-right: auto;
            border-radius: .75rem;
            padding: .25rem;
            position: relative;
            border: .15rem transparent solid;

            .amount-label {
              position: absolute;
              top: .2rem;
              right: .25rem;
              border-radius: 50rem;
              font-size: .6rem;
              line-height: 1;
              padding: .2rem .4rem .1rem;
              color: rgb(11,11,11);
              background-color: rgb(255,218,36);
              display: inline-block;
            }
          }

          .item-price {
            margin: 0;
            height: 2rem;
            font-size: .75rem;

            img {
              height: .75rem;
              margin-right: .3rem;
              margin-left: -.2rem;
            }
          }

          &.selected {
            .item-icon {
              border-color: rgb(250,75,127);
            }
          }
        }
      }
    }

    .dialog-footer {
      background-color: rgb(31,30,72);
      height: 4.2rem;
      padding: 0 .75rem;
      color: #fff;

      .own-diamonds {
        img {
          height: 1.4rem;
          margin-right: .3rem;
        }

        span {
          font-size: 1.25rem;
          line-height: 1;
        }

        button {
          background-color: transparent;
          border: .05rem rgb(245,245,245) solid;
          border-radius: .5rem;
          padding: .2rem .4rem;
          color: #fff;
          font-size: .875rem;
          line-height: 1;
          margin-left: .4rem;
        }
      }

      > button {
        border-radius: .8rem;
        background-color: rgb(250,75,127);
        color: #fff;
        padding: .75rem 1.6rem;
        font-size: 1.125rem;
        line-height: 1;
        margin-left: .75rem;

        &[disabled] {
          background-color: #a0a0a0;
        }
      }
    }

    /deep/ .flickity-page-dots {
      position: relative;
      top: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.125rem;

      .dot {
        width: .375rem;
        height: .375rem;
        opacity: 1;
        background-color: rgba(255,255,255,.4);
        border-radius: 50rem;
        margin: 0 .2rem;
        transition: width .2s linear;

        &.is-selected {
          background-color: #fff;
          width: 1.6875rem;
        }
      }
    }
  }
</style>
