<template>
  <div class="lobby filler">
    <!--<transition :name="transitionName">-->
    <!--<keep-alive>-->
      <!--<portal v-if="!currentPage" :own-account="ownAccount" @show="jump($event)" />-->
      <component :is="currentPage" :own-account="ownAccount" v-bind="params" @show="jump($event)" @back="jump"></component>
    <!--</keep-alive>-->
    <!--</transition>-->
  </div>
</template>

<script>
  import Portal from './Portal.vue';
  import SelectRoom from './SelectRoom.vue';
  import CreateRoom from './CreateRoom.vue';
  import Leaderboard from './Leaderboard.vue';
  export default {
    name: 'lobby',
    components: { Leaderboard, CreateRoom, SelectRoom, Portal },
    props: ['ownAccount'],
    data() {
      return {
        currentPage: 'portal',
        params: {},
      };
    },
    computed: {
      transitionName() {
        return this.currentPage === 'portal' ? 'slide-backward' : 'slide-forward';
      },
    },
    methods: {
      jump({ page = 'portal', params = {} } = {}) {
        this.currentPage = page;
        this.params = params;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
