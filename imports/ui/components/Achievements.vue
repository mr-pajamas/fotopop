<template>
  <div class="achievements filler d-flex flex-column">
    <categories-header class="inflexible">
      <header-bar name="成就" v-on="$listeners" />
      <div class="summary-section d-flex align-items-center">
        <div class="medal-icon-box">
          <aspect-ratio-box :ratio="1" class="w-100">
            <img src="/images/medal.png" class="d-block mx-auto">
            <!--
            <svg class="inflexible mx-auto" width="74" height="108" viewBox="0 0 74 108" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M0 0h46.667v48.333l-23.334-8.655L0 48.333z"/><linearGradient x1="90.834%" y1="59.484%" x2="-11.984%" y2="19.88%" id="c"><stop stop-color="#FFE200" offset="0%"/><stop stop-color="#FFAB00" offset="100%"/></linearGradient><path id="d" d="M35 49.275l-15.45 8.09L22.5 40.23 10 28.092l17.275-2.5L35 10l7.725 15.592L60 28.092 47.5 40.23l2.95 17.137z"/><filter x="-3%" y="-3.2%" width="106%" height="106.3%" filterUnits="objectBoundingBox" id="e"><feOffset dx="-3" dy="-3" in="SourceAlpha" result="shadowOffsetInner1"/><feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 0.870588235 0 0 0 0 0.533333333 0 0 0 1 0" in="shadowInnerInner1"/></filter></defs><g transform="translate(2 2)" fill="none" fill-rule="evenodd"><g transform="translate(11.667 51.667)"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><path stroke="#FFCF1E" stroke-width="4" d="M23.333 41.81L-2 51.209V-2h50.667v53.208l-25.334-9.397z"/><path stroke="#FEA948" stroke-width="6.66" mask="url(#b)" d="M16.663 4.997h13.34V46.67h-13.34z"/></g><circle stroke="#FF9B00" stroke-width="4" fill="url(#c)" cx="35" cy="35" r="35"/><circle fill="#FFCF1E" cx="35" cy="35" r="28.333"/><use fill="#FFF" xlink:href="#d"/><use fill="#000" filter="url(#e)" xlink:href="#d"/></g></svg>
            -->
          </aspect-ratio-box>
        </div>

        <div class="summary flexible">
          <h3>我的成就</h3>
          <p>已获得{{ summary.acquired }}/{{ summary.total }}个成就</p>
        </div>
      </div>
    </categories-header>

    <div class="achievement-groups">
      <!--<div class="unreverse">-->
        <achievement-group v-for="group in achievementGroups" :key="group.name" :group="group" />
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import reduce from 'lodash/reduce';

  import { AchievementStatus } from '../../domain/enums.js';

  import CategoriesHeader from './CategoriesHeader.vue';
  import HeaderBar from './lobby/HeaderBar.vue';
  import AspectRatioBox from './general/AspectRatioBox.vue';
  import AchievementGroup from './lobby/AchievementGroup.vue';

  export default {
    name: "achievements",
    components: { AchievementGroup, AspectRatioBox, HeaderBar, CategoriesHeader },
    data() {
      return {
        achievementGroups: [{
          name: '胜场成就',
          achievements: [{
            medal: '/images/title.png',
            name: '常胜将军',
            description: '用户取得游戏第一名累计10次',
            status: AchievementStatus.DECORATED,
          }, {
            medal: '/images/title.png',
            name: '超神之旅',
            description: '用户取得游戏第一名累计10次',
            status: AchievementStatus.NEWLY_ACQUIRED,
          }, {
            medal: '/images/title.png',
            name: '高处不胜寒',
            description: '用户取得游戏第一名累计10次',
            status: AchievementStatus.ACQUIRED,
          }, {
            medal: '/images/title.png',
            name: '常胜将军2',
            description: '免费使用，点击标签即可体验同款主题模版，让你的作品带上宫廷范，赶快；来试一下吧免费使用，点击标签即可体验同款主题模版。',
            status: AchievementStatus.NOT_ACQUIRED,
          }],
        }, {
          name: '对局成就',
          achievements: [{
            medal: '/images/title.png',
            name: '常胜将军',
            description: '用户取得游戏第一名累计10次',
            status: AchievementStatus.ACQUIRED,
          }, {
            medal: '/images/title.png',
            name: '超神之旅',
            description: '用户取得游戏第一名累计10次',
            status: AchievementStatus.ACQUIRED,
          }, {
            medal: '/images/title.png',
            name: '高处不胜寒',
            description: '用户取得游戏第一名累计10次',
            status: AchievementStatus.ACQUIRED,
          }, {
            medal: '/images/title.png',
            name: '常胜将军2',
            description: '免费使用，点击标签即可体验同款主题模版，让你的作品带上宫廷范，赶快；来试一下吧免费使用，点击标签即可体验同款主题模版。',
            status: AchievementStatus.NOT_ACQUIRED,
          }],
        }],
      };
    },
    computed: {
      summary() {
        return reduce(this.achievementGroups, (summary, group) => {
          summary.total += group.achievements.length;
          summary.acquired += reduce(group.achievements, (sum, { status }) => {
            if (AchievementStatus.acquired(status)) return sum + 1;
            return sum;
          }, 0);
          return summary;
        }, { total: 0, acquired: 0 });
      },
    },
  };
</script>

<style lang="scss" scoped>

  .achievements {
    background-color: rgb(245,245,245);

    .categories-header {

      .summary-section {
        padding: .8rem;
        .medal-icon-box {
          width: 2.8rem;

          img, svg {
            height: 100%;
            width: auto;
          }
        }

        .summary {
          margin: 0 0 0 .5rem;
          h3 {
            font-size: 1.125rem;
            margin: 0 0 .4rem;
            font-weight: normal;
          }
          p {
            font-size: .875rem;
            margin: 0;
          }
        }
      }
    }

    .achievement-groups {
      overflow: auto;
      /*
      display: flex;
      flex-direction: column-reverse;
      */
      padding: .8rem;

      .unreverse {
      }

      .achievement-group {
        & + .achievement-group {
          margin-top: .6rem;
        }
      }
    }
  }
</style>
