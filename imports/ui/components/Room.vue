<template>
  <div class="room filler" :class="{ 'will-transform': mayLeaveRoom }">
    <template v-if="room.questions">
      <audio v-for="(question, index) in room.questions" :src="question.audio" preload="auto" :class="{ playing: index === room.currentRoundNumber() - 1 }"></audio>
    </template>

    <div class="room-top">
      <div class="room-head-bar">
        <template v-if="!room.inGame()">
          <button class="btn rounded-circle inflexible leave-btn" @click="leaveRoom">
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#1F1E48" cx="25" cy="25" r="25"/><path d="M15.257 17.933l-4.632 5.137a1 1 0 0 0 .024 1.365l4.632 4.788A1 1 0 0 0 17 28.528v-9.926a1 1 0 0 0-1.743-.67z" fill="#FFF"/><path d="M14 22h12a2 2 0 1 1 0 4H14v-4z" fill="#FFF"/><path d="M19 12h13a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H19" stroke="#FFF" stroke-width="4" stroke-linecap="round"/></g></svg>
          </button>
          <div class="room-title flexible">
            <p class="room-name">{{ room.typeName() }} - {{ room.categoryName }}</p>
            <p class="small">房间ID：{{ room.searchId }}</p>
          </div>
        </template>

        <message-box v-else class="question-counter">
          <span v-if="countdown">即将播放第{{ room.currentRoundNumber() }}题</span>
          <template v-else>
            <span>{{ room.currentRoundNumber() }}/10题<span v-if="elapsedTime !== undefined" style="margin-left: .5rem">{{ 23 - elapsedTime }}s</span></span>
            <sound-icon class="ml-auto sound-icon" />
          </template>
        </message-box>

        <diamond-inline :diamond-amount="ownAccount.diamondAmount()" class="ml-auto" bg-color="#1f1e48" />
      </div>
      <div class="room-users">
        <div v-for="(user, index) in $meteor.roomUsers" :key="user.id">
          <div class="avatar-box">
            <avatar :user="user" :show-vip="true" :offline="user.offline" />
            <div v-if="index === 0" class="host-label">房主</div>
            <div v-if="!room.inGame() && user.ready" class="avatar-label ready-label"><span>准备</span></div>
            <transition name="inc">
              <div v-if="room.inGame() && incs[user.id]" :key="incs[user.id].c" class="avatar-label inc-label"><span>+{{ incs[user.id].d }}</span></div>
            </transition>
            <div v-if="room.inGame()" class="avatar-label score-label"><span>{{ room.scores()[user.id] || 0 }}分</span></div>
          </div>
          <p class="text-truncate small text-center mt-0 mb-0 w-100">{{ user.name }}</p>
        </div>
        <div v-for="emptySlot in emptySlots">
          <empty-slot />
        </div>
      </div>
    </div>
    <div class="room-bottom d-flex flex-column">
      <div class="messages" v-chat-scroll="{ always: false, smooth: true, scrollonremoved: true }" style="flex: 1 1 0">
        <template v-for="message in userMessages">
          <message v-if="message.type !== 1" :color="messageColor(message)">
            <template slot="icon">
              <avatar class="w-100" v-if="message.type === 2" :user="message.user" :show-vip="false" />
              <img class="w-100" src="/images/m4.png" v-else-if="message.type === 4">
              <img class="w-100" src="/images/m3.png" v-else>
            </template>
            <template slot="default">{{ message.text }}</template>
          </message>
          <p v-else class="message-line">{{ message.text }}</p>
        </template>

        <div style="display: none" v-if="!inQuestion"></div>
      </div>

      <broadcast />

      <transition name="slide-up">
        <answer-sheet v-if="inQuestion" class="inflexible" v-bind="room.currentQuestion()" @answer-correct="submitAnswer($event)" />
      </transition>

      <div v-if="!room.inGame()" class="button-group inflexible d-flex">
        <styled-pill-button class="fast-match-btn disabled" bg-color="rgb(64,197,255)" color="#fff" :text-shadow="true">
          <span>快速匹配</span>
          <span class="fast-match-price">
            <img src="/images/diamond.png" class="d-block">
            <!--
            <svg width="28" height="23" viewBox="0 0 28 23" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M14.098 21.224L26.194 8.277a.415.415 0 0 0 .001-.557l-5.927-6.406a.358.358 0 0 0-.262-.117H7.594c-.099 0-.194.043-.263.12L1.474 7.72a.415.415 0 0 0 .003.555l12.1 12.949a.352.352 0 0 0 .52 0" fill="#00AEEF"/><path d="M14.098 21.224L26.194 8.277a.415.415 0 0 0 .001-.557l-5.927-6.406a.358.358 0 0 0-.262-.117H7.594c-.099 0-.194.043-.263.12L1.474 7.72a.415.415 0 0 0 .003.555l12.1 12.949a.352.352 0 0 0 .52 0z" stroke="#00AEEF" stroke-width="1.844"/><path d="M26.67 13.838h-.032" fill="#FFF200"/><path fill="#0194FF" d="M13.837 21.42l-6.293-6.735-.032-.032L1.22 7.917l6.325-6.77.11.12 1.481 6.616.011.034 1.263 3.635.017.048z"/><path fill="#FFF200" d="M11.145 5.004l-2.01 2.88-1.48-6.616"/><path fill="#07DBFC" d="M13.837 1.147l-2.692 3.857-2.01 2.88L7.47 1.267l-.026-.12zM13.837 1.147h6.294l.03-.031.029.031-1.844 6.736"/><path fill="#0194FF" d="M26.454 7.917l-6.294 6.736-6.323 6.768 3.323-9.979 1.175-3.525z"/><path fill="#32F4FE" d="M26.485 7.883l-.031.034h-8.12l.012-.034 1.814-6.767.03.031h.001zM1.115 7.883l.031.034h8.119l-.011-.034-1.815-6.767-.03.031z"/><path d="M9.146 7.917H1.234" fill="#FFF200"/><path fill="#00CCFE" d="M13.837 1.147l-2.692 3.857-2.01 2.88.011.033 1.263 3.636.017.047 3.411 9.82 3.323-9.978 1.175-3.525z"/><path fill="#32F4FE" d="M15.404 7.917h2.93l-4.497-6.77-2.692 3.857-2.01 2.88.01.033z"/><path fill="#0194FF" d="M13.837 21.42l-6.293-6.735-.032-.032L1.22 7.917l6.325-6.77.11.12 1.481 6.616.011.034 1.263 3.635.017.048z"/><path fill="#FFF200" d="M11.145 5.004l-2.01 2.88-1.48-6.616"/><path fill="#07DBFC" d="M13.837 1.147l-2.692 3.857-2.01 2.88L7.47 1.267l-.026-.12zM13.837 1.147h6.294l.03-.031.029.031-1.844 6.736"/><path fill="#0194FF" d="M26.454 7.917l-6.294 6.736-6.323 6.768 3.323-9.979 1.175-3.525z"/><path fill="#32F4FE" d="M26.485 7.883l-.031.034h-8.12l.012-.034 1.814-6.767.03.031h.001zM1.115 7.883l.031.034h8.119l-.011-.034-1.815-6.767-.03.031z"/><path d="M9.146 7.917H1.234" fill="#FFF200"/><path fill="#00CCFE" d="M13.837 1.147l-2.692 3.857-2.01 2.88.011.033 1.263 3.636.017.047 3.411 9.82 3.323-9.978 1.175-3.525z"/><path fill="#32F4FE" d="M15.404 7.917h2.93l-4.497-6.77-2.692 3.857-2.01 2.88.01.033z"/></g></svg>
            -->
            <span>10</span>
          </span>
        </styled-pill-button>
        <template v-if="room.host().id === ownAccount._id">
          <styled-pill-button v-if="room.canStartGame()" bg-color="rgb(250,75,127)" color="#fff" :text-shadow="true" @click.native="startGame">开始游戏</styled-pill-button>
          <styled-pill-button v-else bg-color="rgb(216,216,216)" color="rgb(175,175,175)" :text-shadow="true" disabled>开始游戏</styled-pill-button>
        </template>
        <!--
        <styled-pill-button v-if="room.host().id === ownAccount._id" bg-color="rgb(250,75,127)" color="#fff" :text-shadow="true" @click.native="startGame" :disabled="!room.canStartGame()">开始游戏</styled-pill-button>
        -->
      </div>

      <bottom-bar class="inflexible" @show-snippets="showSnippets = true" />
    </div>

    <transition name="countdown">
      <!--<img v-if="countdown > 1" :key="countdown" :src="`/images/${countdown}.svg`" class="countdown">-->
      <svg v-if="countdown === 3" class="countdown" width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M95.249 59.575c3.816 1.394 6.352 3.676 7.61 6.845 1.256 3.17.45 10.594-2.417 22.28-2.127 8.676-4.774 15.406-7.938 20.192-3.164 4.786-7.491 8.427-12.985 10.92-5.492 2.496-12.06 3.742-19.7 3.742-8.678 0-15.135-1.449-19.375-4.344-4.237-2.898-6.621-6.447-7.151-10.647-.53-4.2.481-11.488 3.027-21.866l1.553-6.325h27.39l-3.784 15.421c-1.157 4.718-1.611 7.717-1.359 8.996.25 1.28 1.347 1.92 3.291 1.92 2.125 0 3.724-.807 4.8-2.426 1.074-1.617 2.448-5.84 4.124-12.666l1.851-7.549c1.026-4.177 1.301-7.231.827-9.163-.477-1.932-1.565-3.202-3.27-3.807-1.706-.607-5.212-.954-10.526-1.044l3.888-15.835c6.508 0 10.59-.249 12.25-.74 1.657-.495 3.03-1.574 4.114-3.237 1.088-1.66 2.065-4.267 2.935-7.815l1.49-6.066c.935-3.818 1.158-6.334.665-7.546-.493-1.212-1.576-1.82-3.25-1.82-1.897 0-3.353.64-4.369 1.921-1.014 1.281-2.034 4.01-3.06 8.186l-1.636 6.663H46.852l1.72-6.999c2.557-10.421 6.679-17.464 12.37-21.125 5.688-3.66 13.754-5.49 24.196-5.49 13.061 0 21.3 2.534 24.712 7.608 3.41 5.072 4.008 12.121 1.793 21.144-1.497 6.104-3.416 10.516-5.753 13.232-2.34 2.716-5.885 5.196-10.641 7.44z" fill="#5542ED"/><path d="M85.249 59.575c3.816 1.394 6.352 3.676 7.61 6.845 1.256 3.17.45 10.594-2.417 22.28-2.127 8.676-4.774 15.406-7.938 20.192-3.164 4.786-7.491 8.427-12.985 10.92-5.492 2.496-12.06 3.742-19.7 3.742-8.678 0-15.135-1.449-19.375-4.344-4.237-2.898-6.621-6.447-7.151-10.647-.53-4.2.481-11.488 3.027-21.866l1.553-6.325h27.39l-3.784 15.421c-1.157 4.718-1.611 7.717-1.359 8.996.25 1.28 1.347 1.92 3.291 1.92 2.125 0 3.724-.807 4.8-2.426 1.074-1.617 2.448-5.84 4.124-12.666l1.851-7.549c1.026-4.177 1.301-7.231.827-9.163-.477-1.932-1.565-3.202-3.27-3.807-1.706-.607-5.212-.954-10.526-1.044l3.888-15.835c6.508 0 10.59-.249 12.25-.74 1.657-.495 3.03-1.574 4.114-3.237 1.088-1.66 2.065-4.267 2.935-7.815l1.49-6.066c.935-3.818 1.158-6.334.665-7.546-.493-1.212-1.576-1.82-3.25-1.82-1.897 0-3.353.64-4.369 1.921-1.014 1.281-2.034 4.01-3.06 8.186l-1.636 6.663H36.852l1.72-6.999c2.557-10.421 6.679-17.464 12.37-21.125 5.688-3.66 13.754-5.49 24.196-5.49 13.061 0 21.3 2.534 24.712 7.608 3.41 5.072 4.008 12.121 1.793 21.144-1.497 6.104-3.416 10.516-5.753 13.232-2.34 2.716-5.885 5.196-10.641 7.44" fill="#FFF"/><path d="M85.249 59.575c3.816 1.394 6.352 3.676 7.61 6.845 1.256 3.17.45 10.594-2.417 22.28-2.127 8.676-4.774 15.406-7.938 20.192-3.164 4.786-7.491 8.427-12.985 10.92-5.492 2.496-12.06 3.742-19.7 3.742-8.678 0-15.135-1.449-19.375-4.344-4.237-2.898-6.621-6.447-7.151-10.647-.53-4.2.481-11.488 3.027-21.866l1.553-6.325h27.39l-3.784 15.421c-1.157 4.718-1.611 7.717-1.359 8.996.25 1.28 1.347 1.92 3.291 1.92 2.125 0 3.724-.807 4.8-2.426 1.074-1.617 2.448-5.84 4.124-12.666l1.851-7.549c1.026-4.177 1.301-7.231.827-9.163-.477-1.932-1.565-3.202-3.27-3.807-1.706-.607-5.212-.954-10.526-1.044l3.888-15.835c6.508 0 10.59-.249 12.25-.74 1.657-.495 3.03-1.574 4.114-3.237 1.088-1.66 2.065-4.267 2.935-7.815l1.49-6.066c.935-3.818 1.158-6.334.665-7.546-.493-1.212-1.576-1.82-3.25-1.82-1.897 0-3.353.64-4.369 1.921-1.014 1.281-2.034 4.01-3.06 8.186l-1.636 6.663H36.852l1.72-6.999c2.557-10.421 6.679-17.464 12.37-21.125 5.688-3.66 13.754-5.49 24.196-5.49 13.061 0 21.3 2.534 24.712 7.608 3.41 5.072 4.008 12.121 1.793 21.144-1.497 6.104-3.416 10.516-5.753 13.232-2.34 2.716-5.885 5.196-10.641 7.44z" stroke="#333" stroke-width="6.9"/></g></svg>
    </transition>
    <transition name="countdown">
      <svg v-if="countdown === 2" class="countdown" width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M95.23 102.983l-4.514 18.648h-59.63l3.799-15.608c24.703-29.096 39.56-47.1 44.564-54.014 5.005-6.916 7.98-12.308 8.918-16.182.719-2.973.75-5.191.098-6.656-.652-1.464-2.01-2.195-4.068-2.195-2.06 0-3.791.812-5.19 2.433-1.401 1.621-2.683 4.84-3.851 9.66l-2.519 10.406H48.555l.966-3.988c1.484-6.125 2.965-10.956 4.449-14.491 1.481-3.536 3.867-7.016 7.155-10.438 3.287-3.425 7.11-6.014 11.472-7.77 4.362-1.757 9.29-2.635 14.79-2.635 10.777 0 18.275 2.691 22.494 8.074 4.22 5.382 5.332 12.194 3.336 20.436-1.516 6.262-4.673 12.882-9.47 19.865-4.8 6.981-17.544 21.8-38.231 44.455H95.23z" fill="#5542ED"/><path d="M85.23 102.983l-4.514 18.648h-59.63l3.799-15.608c24.703-29.096 39.56-47.1 44.564-54.014 5.005-6.916 7.98-12.308 8.918-16.182.719-2.973.75-5.191.098-6.656-.652-1.464-2.01-2.195-4.068-2.195-2.06 0-3.791.812-5.19 2.433-1.401 1.621-2.683 4.84-3.851 9.66l-2.519 10.406H38.555l.966-3.988c1.484-6.125 2.965-10.956 4.449-14.491 1.481-3.536 3.867-7.016 7.155-10.438 3.287-3.425 7.11-6.014 11.472-7.77 4.362-1.757 9.29-2.635 14.79-2.635 10.777 0 18.275 2.691 22.494 8.074 4.22 5.382 5.332 12.194 3.336 20.436-1.516 6.262-4.673 12.882-9.47 19.865-4.8 6.981-17.544 21.8-38.231 44.455H85.23z" fill="#FFF"/><path d="M85.23 102.983l-4.514 18.648h-59.63l3.799-15.608c24.703-29.096 39.56-47.1 44.564-54.014 5.005-6.916 7.98-12.308 8.918-16.182.719-2.973.75-5.191.098-6.656-.652-1.464-2.01-2.195-4.068-2.195-2.06 0-3.791.812-5.19 2.433-1.401 1.621-2.683 4.84-3.851 9.66l-2.519 10.406H38.555l.966-3.988c1.484-6.125 2.965-10.956 4.449-14.491 1.481-3.536 3.867-7.016 7.155-10.438 3.287-3.425 7.11-6.014 11.472-7.77 4.362-1.757 9.29-2.635 14.79-2.635 10.777 0 18.275 2.691 22.494 8.074 4.22 5.382 5.332 12.194 3.336 20.436-1.516 6.262-4.673 12.882-9.47 19.865-4.8 6.981-17.544 21.8-38.231 44.455H85.23z" stroke="#333" stroke-width="6.9"/></g></svg>
    </transition>
    <transition name="countdown-last">
      <!--<img v-if="countdown === 1" src="/images/1.svg" class="countdown">-->
      <svg v-if="countdown === 1" class="countdown" width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M97.431 12.146l-26.37 108.698H44.075l14.138-58.277c2.04-8.415 3.069-13.473 3.08-15.173.012-1.7-.777-2.988-2.37-3.861-1.592-.874-5.505-1.309-11.74-1.309h-2.67l5.298-21.837c16.088 1.72 22.823.54 31.722-8.241H97.43z" fill="#5542ED"/><path d="M87.431 12.146l-26.37 108.698H34.075l14.138-58.277c2.04-8.415 3.069-13.473 3.08-15.173.012-1.7-.777-2.988-2.37-3.861-1.592-.874-5.505-1.309-11.74-1.309h-2.67l5.298-21.837c16.088 1.72 22.823.54 31.722-8.241H87.43z" fill="#FFF"/><path d="M87.431 12.146l-26.37 108.698H34.075l14.138-58.277c2.04-8.415 3.069-13.473 3.08-15.173.012-1.7-.777-2.988-2.37-3.861-1.592-.874-5.505-1.309-11.74-1.309h-2.67l5.298-21.837c16.088 1.72 22.823.54 31.722-8.241H87.43z" stroke="#333" stroke-width="6.9"/></g></svg>
    </transition>

    <div class="filler d-flex justify-content-center align-items-center dialog-filler" v-if="showSnippets" @click.self="showSnippets = false">
      <div class="dialog snippets-dialog">
        <div class="snippet-list d-flex flex-column align-items-stretch">
          <button class="btn snippet d-block inflexible" v-for="s in snippets" @click="sendMessage(s)">{{ s }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fill from 'lodash/fill';
  import find from 'lodash/find';
  import filter from 'lodash/filter';
  import reject from 'lodash/reject';
  import reduce from 'lodash/reduce';
  import forEach from 'lodash/forEach';
  import map from 'lodash/map';
  import slice from 'lodash/slice';
  import { Meteor } from 'meteor/meteor';

  import { UserAccounts } from '../../api/account/collections.js';
  import * as GameMethods from '../../api/game/methods.js';

  import Bot from '../../api/game/bot.js';

  import MessageBox from './room/MessageBox.vue';
  import DiamondInline from './user/DiamondInline.vue';
  import Avatar from './user/Avatar.vue';
  import EmptySlot from './user/EmptySlot.vue';
  import StyledPillButton from './general/StyledPillButton2.vue';
  import BottomBar from './room/BottomBar.vue';
  import SoundIcon from './room/SoundIcon.vue';
  import AnswerSheet from './room/AnswerSheet';
  import Message from './room/Message.vue';
  import Broadcast from './Broadcast.vue';

  const tid = Symbol('tid');
  // const atid = Symbol('atid');
  const snippets = [
    '稍等下，马上开',
    '快点答题啊，是不是在挂机啊！',
    '这是什么鬼！ᓫ(°⌑°)ǃ',
    '请收下我的膝盖m(_ _)m',
    '233333333',
    '加个足记好友吧',
    '你的衣服好好看阿',
    '你就是弟弟',
    '还有谁？',
    '我不服，再来一局',
    '6666666',
    '我要举报，这里有人开挂！',
  ];

  export default {
    name: 'room',
    components: { Broadcast, Message, AnswerSheet, SoundIcon, BottomBar, StyledPillButton, EmptySlot, Avatar, DiamondInline, MessageBox },
    props: ['ownAccount', 'room'],
    data() {
      return {
        elapsedTime: undefined,
        bots: {},
        incs: {}, // { uid2: { c: 1, value: 5, ttl: 2 } }
        showSnippets: false,
        userMessages: [],
        hintsShown: 0,
      };
    },
    computed: {
      emptySlots() {
        return fill(Array(6 - this.room.users.length), undefined);
      },
      /*
      ownRoom() {
        return this.room.host().id === this.ownAccount._id;
      },
      */
      countdown() {
        const cd = 3 - this.elapsedTime;
        return cd > 0 ? cd : 0;
      },
      inQuestion() {
        return this.room.inGame() && !this.countdown;
      },
      mayLeaveRoom() {
        return !this.room.inGame();
      },
      snippets() {
        return snippets;
      },
    },
    meteor: {
      roomUsers() {
        // 房主提前
        const { users } = this.room;
        const host = this.room.host();
        return [host, ...reject(users, u => u.id === host.id)]
          .map(user => Object.assign({}, UserAccounts.findOne(user.id), user));
        // return users.map(user => Object.assign({}, UserAccounts.findOne(user.id), user));
      },
      disconnected() {
        return !Meteor.status().connected;
      },
      /*
      userMessages() {
        return map(this.room.messages, m => Object.assign({ user: UserAccounts.findOne(m.sender) }, m));
        /!*
        return [{
          type: 2,
          text: '草泥马',
          sender: this.ownAccount._id,
          user: this.ownAccount,
        }, {
          type: 3,
          text: '草泥马',
          sender: this.ownAccount._id,
          user: this.ownAccount,
        }];
        *!/
      },
      */
    },

    created() {
      // TODO: 注意ownership的转换
      /*
      this.$watch('room.rounds.length', function (val) {
        this.stopCountdown();
        if (val) {
          const { elapsedTime } = _.last(this.room.rounds);

          if (elapsedTime < 23) {
            this.timeRemaining = 23 - elapsedTime;
            this[tid] = Meteor.setInterval(() => {
              if (this.timeRemaining > 0) this.timeRemaining -= 1;
              if (this.timeRemaining === 0) {
                this.stopCountdown();
              }
            }, 1000);
          } else {
            this.timeRemaining = 0;
          }
        } else {
          this.timeRemaining = 0;
        }
      }, { immediate: true });
      */
      // 还要watch session
      this.$watch(function () {
        return filter(this.room.users, u => !!u.botLevel);
      }, function (bots) {
        this.bots = reduce(
          bots,
          (map, b) => {
            const bot = new Bot(b.id, b.botLevel, this.room._id);
            bot.init(this.room.session);
            map[b.id] = bot;
            return map;
          },
          {},
        );
      }, { immediate: true });

      /*
      this.$watch(function () {
        return this.room.inGame();
      }, function (val) {
        if (val) {

        } else {

        }
      }, { immediate: true });
      */

      // 进来的时候，看看要不要倒计时（意味着断线重连）
      this.$watch(function () {
        return this.room.inGame() && this.room.users;
      }, async function (users) {
        if (users) { // 如果是inGame
          // 看看是别人还是自己
          if (this.elapsedTime === undefined) { // 自己恢复计时
            const { elapsedTime } = find(users, user => user.id === this.ownAccount._id);
            if (elapsedTime !== undefined) {
              this.elapsedTime = elapsedTime;
              if (this.elapsedTime < 23) this.startCountdown();
            } else {
              // 如果没人知道时间，就假定该回合结束
              const user = find(users, (user) => {
                return user.id !== this.ownAccount._id && !user.botLevel && user.elapsedTime !== undefined;
              });
              if (!user) {
                await GameMethods.tellElapsedTime.callAsync({
                  roomId: this.room._id,
                  session: this.room.session,
                  roundNumber: this.room.currentRoundNumber(),
                  elapsedTime: 23,
                });
              }
              return;
            }
          }

          // 看别人
          // assert this.timeRemaining !== undefined
          const user = find(users, (user) => {
            return user.id !== this.ownAccount._id && !user.offline && user.elapsedTime === undefined;
          });
          if (user) {
            await GameMethods.tellElapsedTime.callAsync({
              roomId: this.room._id,
              session: this.room.session,
              roundNumber: this.room.currentRoundNumber(),
              elapsedTime: this.elapsedTime,
            });
          }
        }
      }, { immediate: true });

      this.$watch(function () {
        return this.room.scores();
      }, function (scores, oldScores) {
        const incs = reduce(Object.entries(scores), (result, [uid, score]) => {
          const d = oldScores[uid] ? score - oldScores[uid] : score;

          if (d > 0) {
            const c = (this.incs[uid] ? this.incs[uid].c + 1 : 0);
            result[uid] = { c, d };
          }
          return result;
        }, {});

        this.incs = Object.assign({}, this.incs, incs);
      });

      this.$watch('room.messages', function (val, oldVal = []) {
        const newMessages = slice(val, oldVal.length);
        this.userMessages.push(
          ...map(newMessages, m => Object.assign({ user: UserAccounts.findOne(m.sender) }, m)),
        );
      }, { immediate: true });
    },

    mounted() {
      this.$watch('inQuestion', async function (val) {
        if (val) {
          this.$el.querySelectorAll('audio:not(.playing)').forEach(e => e.pause());
          await this.$el.querySelector('audio.playing').play();
        } else {
          this.$el.querySelectorAll('audio').forEach(e => e.pause());
        }
      }, { immediate: true });
    },

    watch: {
      'room.session'(session, oldSession) {
        this.incs = {};
        forEach(this.bots, bot => bot.init(session));
        if (oldSession) this.$emit('session-over', { roomId: this.room._id, session: oldSession }); // TODO: 这里有个疑点，oldSession会是undefined
      },
      'room.rounds.length'(val) {
        this.stopCountdown();
        /*
        if (val) {
          this.elapsedTime = 0;
          this.startCountdown();
        } else {
          this.elapsedTime = undefined;
        }
        */
        this.elapsedTime = undefined;
        this.hintsShown = 0;
      },
      async elapsedTime(val) { // TODO: 此处还要回收加分动效
        if (val >= 3) {
          const bots = filter(Object.entries(this.bots), ([id, bot]) => {
            return bot.solve(this.room.currentRoundNumber(), val - 3); // 从第三秒开始算起
          }).map(([id]) => id);
          if (bots.length) {
            await GameMethods.tellWinningBots.callAsync({
              roomId: this.room._id,
              session: this.room.session,
              roundNumber: this.room.currentRoundNumber(), // TODO: 这里可能有问题，已经到下一轮
              bots,
            });
          }
        }
        forEach([1, 2, 3], (i) => {
          if (val >= (5 * i + 3)) {
            if (this.hintsShown < i) {
              this.userMessages.push({
                type: 4,
                text: `第${this.room.currentRoundNumber()}题提示${i}：${this.room.currentQuestion().hints[i - 1]}`,
              });
              this.hintsShown += 1;
            }
          } else {
            return false;
          }
        });
        if (val === 23) {
          await GameMethods.tellElapsedTime.callAsync({
            roomId: this.room._id,
            session: this.room.session,
            roundNumber: this.room.currentRoundNumber(), // TODO: 这里可能有问题，已经到下一轮
            elapsedTime: 23,
          });
        }
      },
      '$meteor.disconnected'(val) {
        if (val) {
          this.stopCountdown();
          this.elapsedTime = undefined;
        }
      },
    },

    destroyed() {
      this.stopCountdown();
    },

    methods: {
      stopCountdown() {
        if (this[tid]) {
          Meteor.clearInterval(this[tid]);
          this[tid] = undefined;
        }
      },
      startCountdown() {
        this[tid] = Meteor.setInterval(() => {
          if (this.elapsedTime < 23) this.elapsedTime += 1;
          if (this.elapsedTime === 23) {
            this.stopCountdown();
          }
        }, 1000);
      },
      /*
      stopTicker() {
        if (this[atid]) {
          Meteor.clearInterval(this[atid]);
          this[atid] = undefined;
        }
      },
      startTicker() {
        this[atid] = Meteor.setInterval(() => {

        }, 500);
      },
      */
      /*
      isCountingDown() {
        return !!this[tid];
      },
      */
      async startGame() {
        await GameMethods.startGame.callAsync({});
      },
      async submitAnswer(answer) {
        this.hintsShown = 3;
        await GameMethods.submitAnswer.callAsync({
          roomId: this.room._id,
          session: this.room.session,
          roundNumber: this.room.currentRoundNumber(),
          answer,
        });
      },
      async leaveRoom() {
        await GameMethods.leaveRoom.callAsync({ roomId: this.room._id });
      },
      messageColor({ type }) {
        return [undefined, 'rgb(48,255,234)', undefined, 'rgb(255,57,98)', 'rgb(255,232,42)'][type];
      },
      async sendMessage(text) {
        await GameMethods.sendMessage.callAsync({ roomId: this.room._id, messageText: text });
        this.showSnippets = false;
      },
    },
  };
</script>

<style lang="scss" scoped>

  .room {
    /*
    height: 100%;
    width: 100%;
    position: relative;
    */
    display: flex;
    flex-direction: column;
    background-color: #2d2c66;
    justify-content: center;

    audio {
      display: none;
    }

    .room-top {
      background-color: #272651;
      flex: 0 0 auto;
    }

    .room-head-bar {
      height: 3.2rem;
      display: flex;
      align-items: center;
      padding: 0 .6rem;
      margin: 0;
      border: 0;


      .leave-btn {
        height: 2rem;
        width: 2rem;
      }

      .room-title {
        color: #fff;
        padding: 0 .5rem;

        p {
          margin: 0;
        }

        .room-name {
          margin-bottom: .2rem;
        }

        .small {
          font-size: 70%;
          color: rgba(255,255,255,.8);
        }
      }

      .question-counter {
        color: rgb(48,255,234);
        min-width: 50%;
        display: flex;
        align-items: center;

        .sound-icon {
          height: 1.2rem;
          width: auto;
        }
      }
    }

    .room-users {
      display: flex;
      align-items: stretch;
      justify-content: center;
      flex-wrap: nowrap;
      padding: 1rem .6rem;
      margin: 0;
      border: 0;
      margin-left: -.5rem;

      > div {
        flex: 0 0 auto;
        padding-left: .5rem;
        width: 16.666%;

        .avatar-box, .empty-slot {
          width: 75%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: .5rem;
          position: relative;

          .avatar-label {
            position: absolute;
            bottom: -5%;
            width: 100%;
            display: flex;
            align-items: stretch;
            justify-content: center;

            span {
              border-radius: .45rem;
              font-size: .6rem;
              line-height: .6rem;
              height: .9rem;
              padding: .2rem .3rem .1rem;
              margin-left: auto;
              margin-right: auto;
              border: 0;
            }
          }

          .ready-label span {
            background-color: #8b8aaf;
            color: #272651;
          }

          .score-label span,
          .inc-label span {
            background-color: rgb(250,75,127);
            color: #fff;
          }

          .inc-label {
            opacity: 0;
          }

          .host-label {
            position: absolute;
            top: -5%;
            right: -15%;
            border-radius: .45rem;
            font-size: .6rem;
            height: .9rem;
            line-height: .6rem;
            padding: .2rem .3rem .1rem;
            border: 0;
            background-color: #5542ed;
            color: #fff;
            display: inline-block;
          }
        }

        > p {
          font-size: .625rem;
        }
      }
    }

    /*
    .broadcast-bar {
      height: 2rem;

      div {
        height: 100%;
        padding: .4rem .7rem;
        font-size: .875rem;
        line-height: 1.37142857;
        background-color: rgb(54,54,102);
      }
    }
    */

    .broadcast {
      position: absolute;
      width: 100%;
    }

    .messages {
      overflow: auto;
      padding: .5rem 0;
      /*
      display: flex;
      flex-direction: column-reverse;
      */

      /*
      .unreverse {
        min-height: 100%;
      }
      */

      .message-line {
        line-height: 1.4;
        padding: .3rem .8rem;
        margin: 0;
        font-size: .75rem;
        color: rgb(48,255,234);
      }
    }

    .button-group {
      padding: .6rem;
      > * {
        flex: 1 1 0;
        & + * {
          margin-left: .5rem;
        }
      }

      > button {
        height: 3rem;
        font-size: 1.2rem;
        line-height: 1.4;
      }

      .fast-match-btn {
        .fast-match-price {
          margin-left: .8rem;
          font-size: .8rem;
          line-height: 1;
          display: flex;
          align-items: center;
          text-shadow: none;

          img, svg {
            margin-right: .2rem;
            height: .8rem;
            width: auto;
          }
        }
      }
    }

    .room-bottom {
      background-color: #2d2c66;
      flex: 1 1 auto;
      position: relative;
    }

    .countdown {
      width: 5rem;
      position: absolute;
      align-self: center;
      margin-top: auto;
      margin-bottom: auto;
    }

    .snippets-dialog {
      width: 100%;
      bottom: 0;
      height: 45%;
      background-color: rgb(66,65,117);
      border-radius: .8rem .8rem 0 0;

      .snippet-list {
        overflow: auto;
        height: 100%;

        > button {
          border-radius: .3rem;
          background-color: rgba(31,30,72,.48);
          padding: .4rem .5rem;
          margin: 0;
          font-size: .875rem;
          color: #fff;
          text-align: left;

          & + button {
            margin-top: .5rem;
          }
        }
      }
    }
  }
</style>
