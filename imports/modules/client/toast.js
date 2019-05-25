import { Meteor } from 'meteor/meteor';
import Vue from 'vue';
import uniqueId from 'lodash/uniqueId';

const data = Vue.observable({ message: null });
let tid;

function clearTimeout() {
  if (tid) {
    Meteor.clearTimeout(tid);
    tid = undefined;
  }
}

export const toast = (message) => {
  clearTimeout();
  data.message = {
    id: uniqueId(),
    text: message,
  };
  tid = Meteor.setTimeout(() => { data.message = null; }, 3000);
};

export const toastMessage = () => data.message;
