// 终局检查观察什么？
// 用户离线
// 用户告知时间
import { Meteor } from 'meteor/meteor';
import times from 'lodash/times';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import { Rooms } from '../collections.js';

function decideBotWins(roomId) {
  const room = Rooms.findOne(roomId);
  const botWinners = room.botWinners();
  if (room && room.inGame() && botWinners.length > 0) {
    Rooms.update({
      _id: roomId,
      session: room.session,
      rounds: { $size: room.currentRoundNumber() },
    }, {
      $addToSet: {
        'rounds.0.winners': {
          $each: map(botWinners, 'id'),
        },
      },
    });
  }
}

function decideRoundEnd(roomId) {
  const room = Rooms.findOne(roomId);
  if (room && room.inGame() && room.currentRoundOver()) {
    // 终局检查
    if (room.lastRound()) {
      // 如果第一名是个掉线的？

      let { userId: lastWinner } = reduce(room.scores(), (result, score, uid) => {
        if (score > result.score) {
          return { userId: uid, score };
        }
        return result;
      }, { score: -1 });

      if (lastWinner) {
        lastWinner = !room.user(lastWinner).offline && lastWinner;
      }

      let affected = false;

      if (lastWinner) {
        affected = Rooms.update({
          _id: roomId,
          session: room.session,
          rounds: { $size: 10 },
          users: { $elemMatch: { id: lastWinner, offline: false } },
        }, {
          $inc: { session: 1 },
          $unset: { questions: '', rounds: '' },
          $set: { fastMatching: false, lastWinner },
          $pull: { users: { offline: true } },
        });
      }

      if (!affected) {
        affected = Rooms.update({
          _id: roomId,
          session: room.session,
          rounds: { $size: 10 },
        }, {
          $inc: { session: 1 },
          $unset: { questions: '', rounds: '' },
          $set: { fastMatching: false },
          $pull: { users: { offline: true } },
        });
      }

      /*
      affected = Rooms.update({
        _id: roomId,
        session: room.session,
        rounds: { $size: 10 },
      }, {
        $inc: { session: 1 },
        $unset: { questions: '', rounds: '' },
        $set: Object.assign({ fastMatching: false }, lastWinner && { lastWinner }),
        $pull: { users: { offline: true } },
      });
      */

      // TODO: 发送请求
      // 发送报告
      // 返回题目
      if (affected) { // TODO: 应该可以重复请求，就不需要affected了
        Meteor.defer(() => {
          Rooms.rawUpdateOne({
            _id: roomId
          }, {
            $set: {
              questions: times(10, i => ({
                id: `${i}`,
                type: i % 2,
                audio: `/audio/${i + 1}.mp3`,
                choices: ['你', '我', '中', '发', '白', '爱', '说',
                  '笑', '哭', '瓷', '奇', '花', '草', '树',
                  '叶', '青', '东', '南', '西', '北', '快'],
                hints: times(3, j => `提示${j}`),
                answerHash: '135a2dc49169a5513bf8f42658713dd6',
                answerFormat: '...',
              })),
              'users.$[u].ready': false,
            },
          }, {
            arrayFilters: [{ 'u.botLevel': null }],
          });
        });
      }
    } else { // 进入下一回合
      Rooms.update({
        _id: roomId,
        session: room.session,
        rounds: { $size: room.currentRoundNumber() },
      }, {
        $push: {
          rounds: {
            $each: [{ winners: [] }],
            $position: 0,
          },
        },
        $set: { 'users.$[].elapsedTime': 0 },
        $unset: { 'users.$[].supporters': '' },
      }, { bypassCollection2: true });
    }
  }
}

// 用户掉线时
// 影响游戏终局检查[done]
// 影响机器人答题[done]

// 用户告知时间时
// 影响游戏终局检查，但仅当用户宣称终局时[done]
// 不影响机器人答题

// 用户答题时/用户宣称机器人答题时
// 影响终局检查
// 影响机器人答题（当宣称机器人答题时）
export { decideBotWins, decideRoundEnd };
