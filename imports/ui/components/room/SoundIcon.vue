<template>
  <svg v-if="i === 1" width="19" height="26" viewBox="0 0 19 26" xmlns="http://www.w3.org/2000/svg"><ellipse cx="2.276" cy="12.942" rx="2.15" ry="2.122" transform="translate(0 1)" fill="#30FFEA" fill-rule="evenodd"/></svg>

  <svg v-else-if="i === 2" width="19" height="26" viewBox="0 0 19 26" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><path d="M6.415 18.662c3.532-3.532 3.57-9.221.083-12.707" stroke="#30FFEA" stroke-width="3.227" stroke-linecap="round"/><ellipse fill="#30FFEA" cx="2.276" cy="12.942" rx="2.15" ry="2.122"/></g></svg>

  <svg v-else-if="i === 3" width="19" height="26" viewBox="0 0 19 26" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><path d="M6.415 18.662c3.532-3.532 3.57-9.221.083-12.707M12.716 23.024C18.838 16.902 18.9 7.04 12.859.998" stroke="#30FFEA" stroke-width="3.227" stroke-linecap="round"/><ellipse fill="#30FFEA" cx="2.276" cy="12.942" rx="2.15" ry="2.122"/></g></svg>
  <!--<img v-if="i" :src="`/images/sound${i}.svg`">-->
</template>

<script>
  import { Meteor } from 'meteor/meteor';
  const interval = 400;
  const tid = Symbol('tid');
  export default {
    name: 'sound-icon',
    data() {
      return {
        i: 0,
      };
    },
    created() {
      this.startInterval();
    },
    destroyed() {
      this.stopInterval();
    },
    methods: {
      stopInterval() {
        if (this[tid]) {
          Meteor.clearInterval(this[tid]);
          this[tid] = undefined;
        }
      },
      startInterval() {
        this.stopInterval();
        this[tid] = Meteor.setInterval(() => {
          if (this.i >= 3) {
            this.i = 0;
          } else {
            this.i += 1;
          }
        }, interval);
      },
    },
  };
</script>
