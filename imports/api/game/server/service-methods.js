import map from 'lodash/map';
import reverse from 'lodash/reverse';
import times from 'lodash/times';

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
export const createRoom = async function (userId, type, categoryId, pvt = false) {
  await agent.post('/ws/game/room/create', {
    uid: +userId,
    catId: +categoryId,
    privated: +pvt,
    type,
  });
};

export const report = async function (room) {
  // TODO: uncomment this
  const {
    _id: roomId,
    type,
    categoryId,
    session,
    rounds,
  } = room;

  const humanUsers = map(room.humanUsers(), ({ id, offline }) => ({ id, offline }));

  const roundsWinners = reverse(map(rounds, round => round.winners));

  await agent.post('/ws/game/room/round/settlement', {
    roomId, type, categoryId, session, humanUsers, roundsWinners,
  });
};

export const fetchQuestions = async function (type, categoryId) {
  const { data: { data: { questions = [] } = {} } = {} } = await agent.get(
    '/ws/game/type/subjects',
    { params: { type, catId: +categoryId } },
  );
  if (!questions.length) throw new Error('获取题目失败');
  return questions;
  /*
  return times(10, i => ({
    id: `${i}`,
    type: i % 2,
    audio: `/audio/${i + 1}.mp3`,
    choices: ['你', '我', '中', '发', '白', '爱', '说',
      '笑', '哭', '瓷', '奇', '花', '草', '树',
      '叶', '青', '东', '南', '西', '北', '快'],
    hints: times(3, j => `提示${j}`),
    answerHash: '135a2dc49169a5513bf8f42658713dd6',
    answerFormat: '...',
  }));
  */
};
