<template>
  <div class="achievement-group">
    <div class="group-head d-flex align-items-center">
      <h5 class="flexible">{{ group.name }}</h5>
      <!--
      <button class="btn collapse-btn inflexible" @click="show = !show">
        &lt;!&ndash; collapse &ndash;&gt;
        <svg v-if="show" width="25" height="19" viewBox="0 0 25 19" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="#545454" width="24" height="2" rx="1"/><path stroke="#545454" stroke-width="2" d="M1 18.314L12.314 7l11.313 11.314"/></g></svg>
        &lt;!&ndash; expand &ndash;&gt;
        <svg v-else width="25" height="19" viewBox="0 0 25 19" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -5)" fill="none" fill-rule="evenodd"><rect fill="#545454" y="5" width="24" height="2" rx="1"/><path stroke="#545454" stroke-width="2" d="M1 11.314l11.314 11.313 11.313-11.313"/></g></svg>
      </button>
      -->
    </div>
    <transition name="collapse" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
      <div class="group-body" v-show="true">
        <div class="group-body-content">
          <div class="achievement" v-for="achievement in group.achievements" :key="achievement.name" :class="{ acquired: acquired(achievement) }">
            <div class="medal-bar d-flex align-items-center">
              <img v-if="acquired(achievement)" :src="achievement.medal" class="medal">
              <div v-else class="medal d-flex align-items-center"><span>{{ achievement.name }}</span></div>

              <span v-if="!acquired(achievement)" class="status">未获得</span>
              <img v-else-if="newlyAcquired(achievement)" class="status" style="color: rgb(250,75,127)" src="/images/new.png">
              <!-- decorated -->

            </div>
            <p>{{ achievement.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { TweenMax, Sine } from 'gsap/umd/TweenMax';

  import find from 'lodash/find';

  import { AchievementStatus } from '../../../domain/enums.js';

  export default {
    name: "achievement-group",
    props: ['group'],
    data() {
      return {
        show: this.defaultShow(),
      };
    },
    /*
    created() {
      this.show = this.defaultShow;
    },
    */
    methods: {
      defaultShow() {
        return !!find(this.group.achievements, (a) => {
          return a.status === AchievementStatus.DECORATED
            || a.status === AchievementStatus.NEWLY_ACQUIRED;
        });
      },
      acquired({ status }) {
        return AchievementStatus.acquired(status);
      },
      newlyAcquired({ status }) {
        return status === AchievementStatus.NEWLY_ACQUIRED;
      },
      beforeEnter(el) {
        // el.style.height = '0';
        // TweenMax.set(el, { height: 0 });
        if (!el.style.height) TweenMax.set(el, { height: 0 });
      },
      enter(el, done) {
        // el.style.height = `${el.querySelector('.group-body-content').offsetHeight}px`;
        TweenMax.to(el, .3, { height: el.firstChild.offsetHeight, repeat: 0, ease: Sine.ease, onComplete: done });
      },
      beforeLeave(el) {
        /*
        console.log(el.querySelector('.group-body-content').offsetHeight);
        el.style.height = `${el.querySelector('.group-body-content').offsetHeight}px`;
        console.log(el.style.height);
        */
        // TweenMax.set(el, { height: el.querySelector('.group-body-content').offsetHeight, overflow: 'hidden' });
      },
      leave(el, done) {
        // el.style.height = '0';
        TweenMax.to(el, .2, { height: 0, repeat: 0, ease: Sine.ease, onComplete: done });
      },
    },
  };
</script>

<style lang="scss" scoped>

  .achievement-group {
    background-color: #fff;
    color: #0b0b0b;
    border-radius: .8rem;

    .group-head {
      height: 3rem;
      padding: 0 .8rem;

      h5 {
        margin: 0;
        line-height: 1;
        font-size: 1rem;
      }

      .collapse-btn {
        padding: .3rem;
        margin-left: .5rem;

        img, svg {
          width: 1rem;
        }
      }
    }

    .group-body {
      .achievement {
        padding: .8rem;
        & + .achievement {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        &:not(.acquired) {
          color: rgb(160,160,160);
        }

        .medal-bar {
          margin-bottom: .75rem;
          height: 2rem;

          .medal {
            height: 2rem;
          }

          div.medal {
            height: 1.8rem;
            padding: 0 1rem;
            border-radius: 50rem;
            background-color: rgb(216,216,216);
            line-height: 1;
          }

          .status {
            margin-left: auto;
            line-height: 1;
          }

          img.status {
            height: 1rem;
          }
        }

        p {
          font-size: .75rem;
          line-height: 1.33;
          margin: 0;
        }
      }
    }
  }
</style>
