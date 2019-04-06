<template>
  <img v-if="i" :src="`/images/sound${i}.svg`">
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
