import { Meteor } from 'meteor/meteor';
import map from 'lodash/map';

import sleep from '../../../modules/sleep.js';
import client from '../../../modules/client/service-client.js';

export const getItems = async function () {
  if (Meteor.isDevelopment) {
    await sleep(2000);
    return [{ id: 'HALL', name: '喇叭', price: 10 }];
  }

  const { data: { data: { list = [] } = {} } = {} } = await client.get('/api/product/tools');

  return map(
    list,
    ({
      eventEnum: id,
      name,
      price,
      coverUrl: icon,
    }) => ({
      id,
      name,
      price,
      icon,
    }),
  );
};
