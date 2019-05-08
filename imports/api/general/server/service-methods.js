/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';

import agent from '../../../modules/server/service-agent.js';

export const textCheck = async function (text) {
  if (Meteor.isDevelopment) return;

  const { data: { status } = {} } = await agent.post('/ws/game/text-check', { text });
  if (status !== 0) throw new Error('请不要发送非法内容哦！');
};
