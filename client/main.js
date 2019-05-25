import { Meteor } from 'meteor/meteor';

import Vue from 'vue';

import 'normalize.css';

import VueMeteorTracker from '/imports/modules/client/vue-meteor-tracker.js';

import VueChatScroll from 'vue-chat-scroll';

import { VueHammer } from 'vue2-hammer';

import '/imports/startup/client';

import App from '/imports/ui/App.vue';

VueHammer.customEvents = {
  tripletap: {
    type: 'tap',
    event: 'tripletap',
    taps: 3,
    interval: 250,
    posThreshold: 20,
  },
};

Vue.use(VueMeteorTracker);
Vue.use(VueChatScroll);
Vue.use(VueHammer);

Meteor.startup(() => {
  new Vue(App).$mount('#app');
});
