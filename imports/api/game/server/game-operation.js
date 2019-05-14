// 终局检查观察什么？
// 用户离线
// 用户告知时间
import { Meteor } from 'meteor/meteor';
import times from 'lodash/times';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';

import { Rooms } from '../collections.js';
import { report, fetchQuestions } from './service-methods.js';
import { UserAccounts } from '../../account/collections.js';

function findAndJoin(userId, botLevel, type, categoryId, prepend = false) {
  const user = UserAccounts.findOne(userId);
  const { value: affected } = Rooms.rawFindOneAndUpdate({
    type,
    categoryId,
    searchId: { $exists: true, $ne: null },
    pvt: false,
    userCount: { $lt: 6 },
    users: { $not: { $elemMatch: { id: userId } } }, // 自己与自己竞争概率不高
    rounds: null,
  }, {
    $inc: { userCount: 1 },
    $push: {
      users: Object.assign({ id: userId, ready: true, offline: false }, botLevel && { botLevel }),
      /*
      users: {
        id: userId,
        ready: true,
        offline: false,
      },
      */
      messages: {
        type: 1,
        text: `${user.name || '足记用户'}进入了房间`,
      },
    },
  }, {
    sort: { fastMatching: -1, userCount: -1 },
  });

  // 若无，则加入等待队列
  if (!affected) {
    Rooms.upsert({
      type,
      categoryId,
      searchId: { $exists: false },
      users: { $not: { $elemMatch: { id: userId } } },
    }, {
      $push: {
        users: prepend
          ? { $each: [Object.assign({ id: userId }, botLevel && { botLevel })], $position: 0 }
          : Object.assign({ id: userId }, botLevel && { botLevel }),
      },
    }, {
      bypassCollection2: true,
    });
  }
}

function fillRoom(roomId) {
  // 当房间存在，而且没开始，没满，而且队列里还有人时，循环
  while (true) {
    const room = Rooms.findOne({
      _id: roomId,
      rounds: null,
      users: { $not: { $size: 6 } },
    });
    if (!room) break;

    const { type, categoryId } = room;

    // 先拉人
    const { value: queue } = Rooms.rawFindOneAndUpdate({
      type,
      categoryId,
      searchId: null,
      users: { $not: { $size: 0 } },
    }, {
      $pop: { users: -1 },
    });

    if (!queue) break;

    const { id: userId, botLevel } = queue.users[0];

    const user = UserAccounts.findOne(userId);
    try {
      const affected = Rooms.update({
        _id: roomId,
        // $nor: [{ users: { $size: 6 } }, { users: { $elemMatch: { id: user.id } } }],
        users: { $not: { $size: 6 } },
        rounds: null,
      }, {
        $push: {
          users: Object.assign(
            { id: userId, ready: true, offline: false },
            botLevel && { botLevel },
          ),
          messages: {
            type: 1,
            text: `${user.name || '足记用户'}进入了房间`,
          },
        },
        $inc: { userCount: 1 },
      });

      // 没有affected有可能是因为用户已经在里面，也有可能该房间已经不满足条件（满员或者已经开始）
      // 如果是因为用户已经在里面，则不能归还（当时的情况已经不知道了），不太可能的情况
      // 如果是因为房间满员，则需要归还（当时的情况已经不知道了）
      // 如果是因为房间已经开始，则需要归还（当时开没开始不清楚，现在没开始那么当时肯定没开始，现在开始了当时未必开始）

      if (!affected) {
        // 重新等待加入房间
        findAndJoin(userId, botLevel, type, categoryId, true);
      }
    } catch (e) {
      // 失败原因可能是这个人在此期间加到其他地方去了
      // 重新进队列
      // 或者开房间
      console.log(e);
    }
  }
}

function decideBotWins(roomId) {
  const room = Rooms.findOne(roomId);
  if (room && room.inGame()) {
    const botWinners = room.botWinners();
    if (botWinners.length > 0) {
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

      lastWinner = lastWinner || room.lastWinner;

      if (lastWinner) {
        lastWinner = !room.user(lastWinner).offline && lastWinner;
      }

      let affected = false;

      if (lastWinner) {
        ({ value: affected } = Rooms.rawFindOneAndUpdate({
          _id: roomId,
          session: room.session,
          rounds: { $size: 10 },
          users: { $elemMatch: { id: lastWinner, offline: false } },
        }, {
          $inc: { session: 1 },
          $unset: { questions: '', rounds: '' },
          $set: { fastMatching: false, lastWinner },
          $pull: { users: { offline: true } },
        }));

        if (affected) {
          const offlineUserIds = map(filter(affected.users, u => u.offline), 'id');
          const messages = UserAccounts.find({ _id: { $in: offlineUserIds } })
            .map(({ name }) => ({ type: 1, text: `${name || '足记用户'}离开了房间` }));
          Rooms.update(roomId, { $push: { messages: { $each: messages } } });
        }
      }

      if (!affected) {
        ({ value: affected } = Rooms.rawFindOneAndUpdate({
          _id: roomId,
          session: room.session,
          rounds: { $size: 10 },
        }, {
          $inc: { session: 1 },
          $unset: { questions: '', rounds: '', lastWinner: '' },
          $set: { fastMatching: false },
          $pull: { users: { offline: true } },
        }));

        if (affected) {
          const offlineUserIds = map(filter(affected.users, u => u.offline), 'id');
          const messages = UserAccounts.find({ _id: { $in: offlineUserIds } })
            .map(({ name }) => ({ type: 1, text: `${name || '足记用户'}离开了房间` }));
          Rooms.update(roomId, { $push: { messages: { $each: messages } } });
        }
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
        report(room);
        // TODO: 拉题目
        fetchQuestions(room.type, room.categoryId).then((questions) => {
          Rooms.update(roomId, {
            $set: { questions },
          });
        });

        fillRoom(roomId);


        /*
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
        */
      }
    } else { // 进入下一回合
      Rooms.rawUpdateOne({
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
        $set: { 'users.$[u].elapsedTime': 0 }, // TODO: 离线用户也设置？
        $unset: { 'users.$[].supporters': '' },
      }, {
        arrayFilters: [{
          'u.offline': false,
        }],
      });
    }
  }
}

function decideBigGiftEnd(roomId) {
  const room = Rooms.findOne(roomId);
  // const currentBigGift = room.currentBigGift();
  if (room && room.currentBigGift() && room.currentBigGiftOver()) {
    Rooms.rawUpdateOne({
      _id: roomId,
      'bigGifts.0.id': room.currentBigGift().id,
    }, {
      $pop: { bigGifts: -1 },
      $set: { 'users.$[u].bgElapsedTime': 0 },
    }, {
      arrayFilters: [{
        'u.offline': false,
      }],
    });
  }
}

// 用户掉线时
// 影响游戏终局检查[done]
// 影响机器人答题[done]
// 影响礼物检查[done]

// 用户告知礼物时间时
// 影响礼物检查，仅当用户宣称礼物结束

// 用户离开时
// 影响礼物检查

// 用户告知时间时
// 影响游戏终局检查，但仅当用户宣称终局时[done]
// 不影响机器人答题

// 用户答题时/用户宣称机器人答题时
// 影响终局检查
// 影响机器人答题（当宣称机器人答题时）
export {
  decideBotWins,
  decideRoundEnd,
  decideBigGiftEnd,
  fillRoom,
  findAndJoin,
};
