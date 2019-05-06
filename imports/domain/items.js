import Vue from 'vue';
import find from 'lodash/find';
import filter from 'lodash/filter';

import { getItems } from '../api/item/client/service-methods.js';

const data = Vue.observable({ items: undefined });

getItems().then((items) => {
  data.items = items;
});


const isListable = item => !['HALL', 'QUICK_SEARCH', 'WRONG_CLEAN', 'TIPS', 'FALL_CLEAN'].includes(item.id);

const isBroadcast = item => item.id === 'HALL';
const isFastMatch = item => item.id === 'QUICK_SEARCH';
const isExclude = item => item.id === 'WRONG_CLEAN';
const isTip = item => item.id === 'TIPS';
const isCancelDefeat = item => item.id === 'FALL_CLEAN';


export default () => data.items;

export const listableItems = () => filter(data.items, isListable);

export const broadcastItem = () => find(data.items, isBroadcast);
export const fastMatchItem = () => find(data.items, isFastMatch);
export const excludeItem = () => find(data.items, isExclude);
export const tipItem = () => find(data.items, isTip);
export const cancelDefeatItem = () => find(data.items, isCancelDefeat);
