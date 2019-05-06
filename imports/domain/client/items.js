import Vue from 'vue';
import find from 'lodash/find';
import filter from 'lodash/filter';

import { getItems } from '../../api/item/client/service-methods.js';

const data = Vue.observable({ items: undefined });

getItems().then((items) => {
  data.items = items;
});


const isListable = item => !['40', '60', '50', '30', '20'].includes(item.id);

const isBroadcast = item => item.id === '40';
const isFastMatch = item => item.id === '60';
const isExclude = item => item.id === '50';
const isTip = item => item.id === '30';
const isCancelDefeat = item => item.id === '20';


export default () => data.items;

export const listableItems = () => filter(data.items, isListable);

export const broadcastItem = () => find(data.items, isBroadcast);
export const fastMatchItem = () => find(data.items, isFastMatch);
export const excludeItem = () => find(data.items, isExclude);
export const tipItem = () => find(data.items, isTip);
export const cancelDefeatItem = () => find(data.items, isCancelDefeat);
