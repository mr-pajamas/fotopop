import { Meteor } from 'meteor/meteor';
import map from 'lodash/map';

import sleep from '../../../modules/sleep.js';
import client from '../../../modules/client/service-client.js';

export const getItems = async function () {
  if (Meteor.isDevelopment) {
    await sleep(2000);
    return [{ id: '40', name: '喇叭', price: 10 }];
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
