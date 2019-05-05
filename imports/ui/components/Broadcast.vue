<template>
  <div class="broadcast">
    <transition name="cooldown" appear mode="out-in" @after-enter="playAndShift">
      <div class="broadcast-body d-flex align-items-center" v-if="currentBroadcast" :key="currentBroadcast._id">
        <div class="max-broadcast-content">六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字六十六个字字</div>
        <div class="broadcast-content">{{ currentBroadcast.userName }}：{{ currentBroadcast.message }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { Meteor } from 'meteor/meteor';
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';
  import { Broadcasts } from '../../api/broadcast/collections.js';

  const tid = Symbol('tid');

  function vw(val) {
    return window.innerWidth * (val / 100);
  }

  function width(elem) {
    return Math.max(elem.offsetWidth, elem.scrollWidth);
  }

  export default {
    name: "broadcast",
    data() {
      return {
        cursor: 0,
      };
    },
    computed: {
      currentBroadcast() {
        return this.$meteor.broadcasts[this.cursor];
      },
    },
    destroyed() {
      this.stopTimeout();
    },
    activated() {
      if (this.currentBroadcast) this.shiftCursor();
    },
    deactivated() {
      this.stopTimeout();
    },
    meteor: {
      broadcasts() {
        return Broadcasts.find();
      },
    },
    created() {
      this.$subscribe('broadcasts', { name: 'broadcast.broadcasts' });
    },
    methods: {
      stopTimeout() {
        if (this[tid]) {
          Meteor.clearTimeout(this[tid]);
          this[tid] = undefined;
        }
      },
      shiftCursor() {
        this.stopTimeout();
        this[tid] = Meteor.setTimeout(() => this.cursor += 1, 12000);
      },
      playAndShift() {
        this.shiftCursor();

        const contentElem = this.$el.querySelector('.broadcast-content');
        const speed = (width(this.$el.querySelector('.max-broadcast-content')) + vw(100)) / 12;
        const time = (width(contentElem) + vw(100)) / speed;
        /*
        TweenMax.set(contentElem, {
          x: vw(100),
        });
        */

        TweenMax.to(contentElem, time, {
          x: '-100%',
          repeat: -1,
          ease: Linear.easeNone,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>

  .broadcast {
    height: 2rem;
    overflow: hidden;

    .broadcast-body {
      height: 100%;
      background-color: rgb(54,54,102);

      .broadcast-content {
        transform: translateX(100vw);
        color: #fff;
        font-size: .875rem;
        white-space: nowrap;
        position: relative;
      }

      .max-broadcast-content {
        color: rgb(54,54,102);
        font-size: .875rem;
        white-space: nowrap;
        position: absolute;
        opacity: 0;
      }
    }
  }

  .cooldown-leave-active {
    transition: opacity .5s step-start;
  }

  .cooldown-leave-to {
    opacity: 0;
  }
</style>
