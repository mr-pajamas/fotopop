/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import client from '../../../modules/client/service-client.js';

export const getStarPlayerId = async function () {
  if (Meteor.isDevelopment) {
    return Meteor.connection.userId();
  }

  const { data: { data: { uid } = {} } = {} } = await client.get('/api/game/list/top');
  return uid ? `${uid}` : undefined;
};
