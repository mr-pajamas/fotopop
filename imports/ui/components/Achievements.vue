<template>
  <div class="achievements filler d-flex flex-column">
    <template v-if="!loading">
      <categories-header class="inflexible">
        <header-bar name="成就" v-on="$listeners" />
        <div class="summary-section d-flex align-items-center">
          <div class="medal-icon-box">
            <aspect-ratio-box :ratio="1" class="w-100">
              <img src="/images/medal.png" class="d-block mx-auto">
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
          <achievement-group v-for="group in achievementGroups" :key="group.name" :group="group" @update="fetchData" />
        <!--</div>-->
      </div>
    </template>

    <div class="filler d-flex justify-content-center align-items-center" v-else>
      <spinner-box text="加载中" />
    </div>
  </div>
</template>

<script>
  import reduce from 'lodash/reduce';

  import { AchievementStatus } from '../../domain/enums.js';

  import { getAchievementGroups } from '../../api/account/client/service-methods.js';

  import CategoriesHeader from './CategoriesHeader.vue';
  import HeaderBar from './lobby/HeaderBar.vue';
  import AspectRatioBox from './general/AspectRatioBox2.vue';
  import AchievementGroup from './lobby/AchievementGroup.vue';
  import SpinnerBox from './general/SpinnerBox.vue';

  export default {
    name: "achievements",
    components: { SpinnerBox, AchievementGroup, AspectRatioBox, HeaderBar, CategoriesHeader },
    data() {
      return {
        loading: true,
        achievementGroups: [],
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
    async created() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          this.achievementGroups = await getAchievementGroups();
        } finally {
          this.loading = false;
        }
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
