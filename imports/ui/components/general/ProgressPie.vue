<template>
  <div class="progress-pie" :style="style">
    <div class="pie" :style="pieStyle">
      <div class="left-side half-circle" :style="leftSideStyle"></div>
      <div class="right-side half-circle" :style="rightSideStyle"></div>
    </div>
  </div>
</template>

<script>
  import { ResizeSensor } from 'css-element-queries';

  const observer = Symbol('observer');

  export default {
    name: "progress-pie",
    props: ['color', 'bgColor', 'progress'],
    data() {
      return {
        height: 0,
        width: 0,
      };
    },
    computed: {
      d() {
        return Math.ceil(Math.sqrt(this.height * this.height + this.width * this.width));
      },
      style() {
        return this.bgColor ? { backgroundColor: this.bgColor } : {};
      },
      pieStyle() {
        return Object.assign(
          {
            width: `${this.d}px`,
            height: `${this.d}px`,
          },
          this.progress <= 50 && { clip: `rect(0, ${this.d}px, ${this.d}px, ${this.d / 2}px)` },
        );
      },
      halfCircleStyle() {
        return {
          clip: `rect(0, ${this.d / 2}px, ${this.d}px, 0)`,
          backgroundColor: this.color || '#3498db',
        };
      },
      leftSideStyle() {
        return Object.assign({}, this.halfCircleStyle, {
          transform: `rotate(${this.progress * 3.6}deg)`,
        });
      },
      rightSideStyle() {
        return Object.assign({}, this.halfCircleStyle, this.progress <= 50
          ? { display: 'none' }
          : { transform: 'rotate(180deg)' });
      },
    },
    mounted() {
      this.reset();
      this[observer] = new ResizeSensor(this.$el, this.reset.bind(this));
    },
    methods: {
      reset() {
        this.height = this.$el.offsetHeight;
        this.width = this.$el.offsetWidth;
      },
    },

    destroyed() {
      this[observer].detach(this.$el);
    },
  };
</script>

<style lang="scss" scoped>

  .progress-pie {
    position: relative;
    overflow: hidden;

    .pie {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%,-50%,0);

      .half-circle {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
</style>
