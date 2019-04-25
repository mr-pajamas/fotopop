import { Meteor } from 'meteor/meteor';

import Vue from 'vue';

import 'normalize.css';

import VueMeteorTracker from '/imports/modules/client/vue-meteor-tracker.js';

import VueChatScroll from 'vue-chat-scroll';

import '/imports/startup/client';

import App from '/imports/ui/App.vue';

Vue.use(VueMeteorTracker);
Vue.use(VueChatScroll);

Meteor.startup(() => {
  new Vue(App).$mount('#app');
});
