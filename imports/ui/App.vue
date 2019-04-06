<template>
  <div id="app">
    <!--
    <div v-if="$subReady.currentRoom">
      {{ $meteor.ownAccount.name }}
    </div>
    -->
    <iframe src="/audio/silence.mp3" allow="autoplay" style="display: none"></iframe>
    <!--
    <template v-if="$subReady.ownAccount">
      <room v-if="$subReady.currentRoom && $meteor.currentRoom" :room="$meteor.currentRoom" :own-account="$meteor.ownAccount" />
      <transition name="slide-left">
        <result v-if="showResult" :own-account="$meteor.ownAccount" @close="showResult = false" />
      </transition>
    </template>
    -->
    <template v-if="$subReady.ownAccount">
      <lobby :own-account="$meteor.ownAccount" />
    </template>
  </div>
</template>

<script>
  import { Meteor } from 'meteor/meteor';
  // import UAParser from 'ua-parser-js';
  import queryString from 'query-string';
  import bluebird from 'bluebird';

  import { UserAccounts } from '../api/account/collections.js';
  import { Rooms } from '../api/game/collections.js';
  import '../api/account/client/methods.js';
  import { enterRoom } from '../api/game/methods.js';

  import Lobby from './components/Lobby.vue';
  import Room from './components/Room';
  import Result from './components/Result';

  // import bridge from '../modules/client/js-bridge.js';

  /*
  function getOS() {
    return navigator.userAgent && new UAParser(navigator.userAgent).getOS();
  }
  */
  const loginAsync = bluebird.promisify(Meteor.loginWithJwt);

  export default {
    name: "app",
    components: { Result, Room, Lobby },
    data() {
      return {
        showResult: false,
      };
    },

    async created() {
      const { jwt } = queryString.parse(location.search);

      await loginAsync({ jwt });

      this.$subscribe('ownAccount', { name: 'account.ownAccount' });
      this.$subscribe('currentRoom', { name: 'game.currentRoom' });

      // bridge.shit({ a: 1 });
      await enterRoom.callAsync({});
    },

    meteor: {
      ownAccount() {
        return UserAccounts.findOne(Meteor.userId());
      },
      currentRoom() {
        return Rooms.findOne();
      },
    },
  }
</script>

<style lang="scss">
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* make the video stretch to fill the screen in WebKit */
  :-webkit-full-screen {
    width: 100%;
    height: 100%;
  }

  html {
    /* extra small & small */
    font-size: 16px;

    /* medium */
    @media (min-width: 768px) and (min-height: 375px), (min-height: 768px) and (min-width: 375px) {
      font-size: 18px;
    }
    /* large */
    @media (min-width: 992px) and (min-height: 425px), (min-height: 992px) and (min-width: 425px) {
      font-size: 20px;
    }
    /* extra large */
    @media (min-width: 1200px), (min-height: 1200px) {
      font-size: 24px;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
    color: #fff;
  }

  #app {
    position: relative;
    overflow: hidden;
  }

  .filler {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  a {
    color: inherit;
  }

  button:focus {
    outline: 0 !important;
  }

  .d-flex {
    display: flex !important;
  }

  .d-block {
    display: block !important;
  }

  .flex-column {
    flex-direction: column !important;
  }

  .flexible {
    flex: 1 1 auto !important;
  }

  .inflexible {
    flex: 0 0 auto !important;
  }

  .align-items-start {
    align-items: flex-start !important;
  }

  .align-items-end {
    align-items: flex-end !important;
  }

  .align-items-center {
    align-items: center !important;
  }

  .align-items-baseline {
    align-items: baseline !important;
  }

  .align-items-stretch {
    align-items: stretch !important;
  }

  .justify-content-start {
    justify-content: flex-start !important;
  }

  .justify-content-end {
    justify-content: flex-end !important;
  }

  .justify-content-center {
    justify-content: center !important;
  }

  .justify-content-between {
    justify-content: space-between !important;
  }

  .justify-content-around {
    justify-content: space-around !important;
  }

  .btn {
    background: none;
    background-size: cover;
    border: none;
    padding: 0;
  }

  .m-0 {
    margin: 0 !important;
  }

  .mb-0 {
    margin-bottom: 0 !important;
  }

  .mt-0 {
    margin-top: 0 !important;
  }

  .m-auto {
    margin: auto !important;
  }

  .mt-auto,
  .my-auto {
    margin-top: auto !important;
  }

  .mr-auto,
  .mx-auto {
    margin-right: auto !important;
  }

  .mb-auto,
  .my-auto {
    margin-bottom: auto !important;
  }

  .ml-auto,
  .mx-auto {
    margin-left: auto !important;
  }

  .p-0 {
    padding: 0 !important;
  }

  .pb-0 {
    padding-bottom: 0 !important;
  }

  .pt-0 {
    padding-top: 0 !important;
  }

  .w-100 {
    width: 100% !important;
  }

  .w-auto {
    width: auto !important;
  }

  .h-100 {
    height: 100% !important;
  }

  .h-auto {
    height: auto !important;
  }

  .lead {
    font-size: 125%;
    font-weight: 300;
  }

  small,
  .small {
    font-size: 75%;
    font-weight: 400;
  }

  .rounded-circle {
    border-radius: 50% !important;
  }

  .text-center {
    text-align: center !important;
  }

  .no-break {
    white-space: nowrap;
  }

  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-light {
    color: #f8f9fa !important;
  }

  a.text-light:hover, a.text-light:focus {
    color: #dae0e5 !important;
  }

  .text-dark {
    color: #343a40 !important;
  }

  a.text-dark:hover, a.text-dark:focus {
    color: #1d2124 !important;
  }

  .btn-lg {
    padding: .6rem 1rem;
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .btn-md {
    padding: .6rem .8rem;
    font-size: 1.125rem;
    line-height: 1.2;
  }

  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .countdown-enter-active, .countdown-last-enter-active {
    transition: all .1s ease-in;
  }
  .countdown-leave-active {
    transition: opacity .1s ease-out;
  }
  .countdown-last-leave-active {
    transition: all .2s ease-out;
  }

  .countdown-enter, .countdown-last-enter {
    transform: scale(1.8) translateY(-10%);
    opacity: .2;
  }
  .countdown-leave-to {
    opacity: 0;
  }

  .countdown-last-leave-to {
    opacity: 0;
    transform: scale(3.6) translateY(-10%);
  }

  .slide-up-enter-active,
  .slide-left-enter-active {
    transition: all .3s ease-out;
  }
  .slide-up-leave-active,
  .slide-left-leave-active {
    transition: all .2s ease-in;
  }

  .slide-up-enter, .slide-up-leave-to {
    transform: translateY(100%);
    opacity: .3;
  }

  .slide-left-enter, .slide-left-leave-to {
    transform: translateX(100%);
  }

  .inc-enter-active {
    animation: inc 1.2s ease-in;
    backface-visibility: hidden;
  }

  @keyframes inc {
    0%, 5%, 70% {
      transform: scale(1.5) translateY(-160%) perspective(1px);
    }
    0% {
      opacity: .6;
    }
    5%, 70% {
      opacity: 1;
    }

    100% {
      opacity: .3;
    }
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  @keyframes blink {
    50% {
      opacity: 0.0;
    }
  }

  @keyframes swing {
    0%, 20% {
      transform: rotate(-10deg);
    }
    100%, 80% {
      transform: rotate(10deg);
    }
  }
</style>
