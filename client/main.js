import { Meteor } from 'meteor/meteor';

import Vue from 'vue';

import 'normalize.css';

import VueMeteorTracker from '/imports/modules/client/vue-meteor-tracker.js';

import '/imports/startup/client';

import App from '/imports/ui/App.vue';

Vue.use(VueMeteorTracker);

Meteor.startup(() => {
  new Vue(App).$mount('#app');
});
