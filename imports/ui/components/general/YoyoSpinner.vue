<template>
  <progress-pie class="yoyo-spinner" :color="color" :bg-color="bgColor" :progress="progress" />
</template>

<script>
  import { TweenMax, Linear } from 'gsap/umd/TweenMax';
  import ProgressPie from './ProgressPie.vue';
  export default {
    name: "yoyo-spinner",
    components: { ProgressPie },
    props: {
      duration: {
        type: Number,
        default: 5,
      },
      color1: {
        type: String,
        default: '#3498db',
      },
      color2: {
        type: String,
        default: '#bdc3c7',
      },
    },
    data() {
      return {
        state: 0,
        progress: 0,
      };
    },
    computed: {
      color() {
        return [this.color1, this.color2][this.state];
      },
      bgColor() {
        return [this.color2, this.color1][this.state];
      },
    },
    watch: {
      state() {
        this.progress = 0;
      },
    },
    created() {
      TweenMax.to(
        this.$data,
        this.duration || 5,
        {
          progress: 100,
          repeat: -1,
          onRepeat() { this.state = +!this.state; },
          onRepeatScope: this,
          ease: Linear.easeNone,
          repeatDelay: 0.3,
        },
      );
    },
  };
</script>
