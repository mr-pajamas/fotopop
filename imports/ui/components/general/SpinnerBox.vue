<template>
  <div class="spinner-box d-flex flex-column align-self-center justify-content-center">
    <div class="spinner mx-auto d-flex justify-content-between align-items-center">
      <div class="dot" v-for="n in 3">
        <aspect-ratio-box :ratio="1" />
      </div>
    </div>
    <p class="lead text-center">{{ text }}</p>
  </div>
</template>

<script>
  import AspectRatioBox from './AspectRatioBox';
  export default {
    name: "spinner-box",
    components: { AspectRatioBox },
    props: {
      text: {
        type: String,
        default: '请稍候',
      },
    },
  };
</script>

<style lang="scss" scoped>

  $dot-size: 23%;

  .spinner-box {

    background-color: rgba(0,0,0,.6);
    border-radius: .5rem;
    height: 4.8rem;
    width: 9.6rem;
    overflow: hidden;


    .spinner {
      width: 40%;
      height: 2rem;

      .dot {
        width: $dot-size;
        animation: spinner-bounce .3s infinite step-end both;
        position: relative;

        &:before {
          background-color: #fff;
          border: .2rem rgb(51,51,51) solid;
          content: " ";
          position: absolute;
          z-index: 1;
          left: -.06rem;
          top: -.06rem;
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }

        &:after {
          content: " ";
          position: absolute;
          z-index: 0;
          right: -.06rem;
          bottom: -.06rem;
          height: 101%;
          width: 101%;
          background-color: rgb(255,230,25);
          border-radius: 50%;
        }

        &:nth-child(1) {
          animation-delay: -.1s;
        }

        &:nth-child(2) {
          animation-delay: -.05s;
        }
      }
    }

    p.lead {
      margin: 0;
      font-size: 1rem;
      color: #fff;

    }
  }


  @keyframes spinner-bounce {
    0%, 80%, 100% { transform: translateY(0) }
    40% { transform: translateY(-60%) }
  }
</style>
