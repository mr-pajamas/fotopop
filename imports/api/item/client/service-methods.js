import { Meteor } from 'meteor/meteor';
import map from 'lodash/map';

import sleep from '../../../modules/sleep.js';
import client from '../../../modules/client/service-client.js';

export const getItems = async function () {
  if (Meteor.isDevelopment) {
    await sleep(2000);
    return [{
      id: '30',
      name: '提示',
      price: 50,
    }, {
      id: '50',
      name: '除错',
      price: 20,
    }, {
      id: '40',
      name: '喇叭',
      price: 10,
    }, {
      id: '60',
      name: '快速匹配',
      price: 20,
    }, {
      id: '11',
      name: '双倍经验卡1局',
      price: 100,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '12',
      name: '双倍经验卡5局',
      price: 400,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '13',
      name: '双倍经验卡1天',
      price: 1000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '14',
      name: '双倍经验卡3天',
      price: 2000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '15',
      name: '双倍经验卡10天',
      price: 5000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '16',
      name: '双倍经验卡30天',
      price: 10000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '17',
      name: '双倍经验卡90天',
      price: 20000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '18',
      name: '双倍经验卡1年',
      price: 60000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '19',
      name: '双倍经验卡无限期',
      price: 100000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '21',
      name: 'XXX卡',
      price: 5000,
      icon: '/images/cancel-defeat.png',
    }, {
      id: '22',
      name: 'YYY卡',
      price: 5000,
      icon: '/images/cancel-defeat.png',
    }];
  }

  const { data: { data: { list = [] } = {} } = {} } = await client.get('/api/product/tools');

  return map(
    list,
    ({
      event,
      name,
      price,
      coverUrl: icon,
    }) => ({
      id: `${event}`,
      name,
      price,
      icon,
    }),
  );
};
