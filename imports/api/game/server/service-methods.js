import map from 'lodash/map';
import reverse from 'lodash/reverse';

import agent from '../../../modules/server/service-agent.js';
/*
const report = {
  roomId: 'xxxx',
  session: 1, // starts from 1
  humanUsers: [
    {
      id: 'uid1',
      offline: true,
    },
    {
      id: 'uid2',
      offline: false,
    },
  ],
  // offlineUsers: ['uid1', 'uid2'],
  roundsWinners: [
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
  ],
};
*/
export const createRoom = async function (userId, type, categoryId, p = false) {
  await agent.post('/ws/game/room/create', {
    uid: +userId,
    catId: +categoryId,
    privated: +p,
    type,
  });
};

export const report = async function (room) {
  const {
    _id: roomId,
    session,
    rounds,
  } = room;

  const humanUsers = map(room.humanUsers(), ({ id, offline }) => ({ id, offline }));

  const roundsWinners = reverse(map(rounds, round => round.winners));

  await agent.post('/ws/game/room/round/settlement', {
    roomId, session, humanUsers, roundsWinners,
  });
};
