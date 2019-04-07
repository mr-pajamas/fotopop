<template>
  <div class="lobby filler">
    <!--<transition :name="transitionName">-->
      <portal v-if="!currentComponent" :own-account="ownAccount" @join="showSelectRoom" @create="showCreateRoom" />
      <component v-else :is="currentComponent" v-bind="$props" @back="currentComponent = ''"></component>
    <!--</transition>-->
  </div>
</template>

<script>
  import Portal from './Portal.vue';
  import SelectRoom from './SelectRoom.vue';
  import CreateRoom from './CreateRoom.vue';
  export default {
    name: 'lobby',
    components: { CreateRoom, SelectRoom, Portal },
    props: ['ownAccount'],
    data() {
      return {
        currentComponent: '',
      };
    },
    computed: {
      transitionName() {
        return this.currentComponent ? 'slide-forward' : 'slide-backward';
      },
    },
    methods: {
      showSelectRoom() {
        this.currentComponent = SelectRoom.name;
      },
      showCreateRoom() {
        this.currentComponent = CreateRoom.name;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
