import { Meteor } from 'meteor/meteor';

import agent from '../../../modules/server/service-agent.js';

export const useItem = async function (userId, osType, id, buy = false) {
  if (Meteor.isDevelopment) return;

  const data = {
    event: +id,
    buy,
    uid: +userId,
    osType,
  };

  const { data: { status, error } } = await agent.post('ws/game/tool/use', data);
  if (status !== 0) throw new Error(error);
};
