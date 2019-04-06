/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import times from 'lodash/times';
import random from 'lodash/random';
import find from 'lodash/find';

import MD5 from 'crypto-js/md5';

import { Rooms } from './collections.js';

function generateCode() {
  return times(6, () => random(9)).join('');
}

export const enterRoom = new ValidatedMethod({
  name: 'game.enterRoom',
  validate: new SimpleSchema({}).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: true,
    throwStubExceptions: true,
  },
  run() {
    const { userId } = this;
    // 1. 检查是否已经在房间里
    const currentRoom = Rooms.findOne({ 'users.id': userId });
    if (currentRoom) throw new Meteor.Error(409, `用户已经在房间（${currentRoom._id}）中`);

    // 2. 寻找有空房间
    // 3. 若无，则创建一个新房间，房主为本人
    const room = Rooms.findOne({
      // userCount: { $lt: 6 },
      users: { $not: { $size: 6 } },
      // questions: { $exists: true, $ne: null },
      rounds: null,
    });
    if (room) {
      Rooms.update({
        _id: room._id,
        // users里面没有userId
        users: { $not: { $elemMatch: { id: userId } } },
      }, {
        // $inc: { userCount: 1 },
        $push: { users: { id: userId } },
        // TODO: push join message
      });
    } else {
      Rooms.insert({
        type: 1,
        categoryId: '1',
        categoryName: '80后专属',
        searchId: generateCode(),
        // userCount: 1,
        users: [{ id: userId }, { id: 'bot0', botLevel: 1 }, { id: 'bot2', botLevel: 3 }],
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
        // TODO: push create message?
        messages: [],
      });
    }
  },
});

// TODO: 这里需要房间ID和session
export const startGame = new ValidatedMethod({
  name: 'game.startGame',
  validate: new SimpleSchema({}).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: true,
    noRetry: true,
    throwStubExceptions: true,
  },
  run() {
    const { userId } = this;

    // 1. 检查是否在房间里
    // 2. 检查是否是房主
    // 3. 检查游戏是否已经开始
    // 4. 检查游戏是否在快速匹配过程中
    // 5、检查是否所有人都准备好（下完第一首歌？） TODO: 暂时不等

    // 6. 重置ready? yes TODO: 暂时不重置
    // 6.1 score什么时候重置的？ 结束时候？开始时候
    // 7. 添加round 1

    // TODO: 发送请求通知服务端，还是这事情彻底服务端做（自己做）？

    const currentRoom = Rooms.findOne({ 'users.id': userId });
    if (!currentRoom) throw new Meteor.Error(409, '用户不在房间中');

    if (currentRoom.inGame()) throw new Meteor.Error(409, '当前房间游戏已经开始');

    if (currentRoom.host().id !== userId) throw new Meteor.Error(403, '用户不是房主，无权开始游戏');

    if (currentRoom.fastMatching) throw new Meteor.Error(409, '当前房间正在进行快速匹配');

    if (find(currentRoom.users, user => !user.ready)) throw new Meteor.Error(409, '当前房间有人未准备好，无法开始游戏');

    if (!this.isSimulation) {
      Rooms.update({
        _id: currentRoom._id,
        $or: [
          { rounds: null },
          { rounds: { $size: 0 } },
        ],
      }, {
        $push: { rounds: { winners: [] } },
        // $inc: { roundCount: 1 },
        $set: {
          'users.$[].roundElapsedTime': 0,
          // 'users.$[].score': 0,
          // roundCount: 1,
        },
        $unset: { 'users.$[].supporters': '' },
      }, { bypassCollection2: true });
    }
  },
});

export const tellElapsedTime = new ValidatedMethod({
  name: 'game.tellElapsedTime',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    session: {
      type: SimpleSchema.Integer,
      min: 1,
    },
    roundNumber: {
      type: SimpleSchema.Integer,
      min: 1,
      max: 10,
    },
    elapsedTime: {
      type: SimpleSchema.Integer,
      min: 0,
      max: 23,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    noRetry: true,
    throwStubExceptions: true,
  },
  run({
    roomId,
    session,
    roundNumber,
    elapsedTime,
  }) {
    // 1. 检查是否在房间里，在房间里，游戏如果没开始（未掉线，黑客请求）
    // 2. 检查游戏是否已经开始
    // 3. 检查是否当前round，否则无效请求
    // 4. 看看elapsedTime是否大于现有的
    // 5. 设置elapsedTime
    // 7. 终局检查

    // 6. 设置需要的人elapsedTime
    // 8. 如果回合结束条件达成，则添加新回合/游戏结束（发送报告）

    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (!currentRoom.inGame()) throw new Meteor.Error(409, '当前房间未进行游戏');

    if (currentRoom.session !== session
      || currentRoom.currentRoundNumber() !== roundNumber) {
      throw new Meteor.Error(400, '指定的回合非当前正在进行的回合');
    }

    const user = find(currentRoom.users, u => u.id === userId);

    if (elapsedTime < user.roundElapsedTime) throw new Meteor.Error(400, '计时早于之前的值');

    if (!this.isSimulation) {
      // 设置elapsedTime
      Rooms.rawUpdateOne({
        _id: roomId,
        // 'users.id': userId,
        session,
        // roundCount: roundNumber,
        rounds: { $size: roundNumber },
      }, {
        $set: {
          'users.$[u].roundElapsedTime': elapsedTime,
          'users.$[o].roundElapsedTime': elapsedTime,
        },
      }, {
        arrayFilters: [{
          'u.id': userId,
        }, {
          'o.offline': false,
          'o.roundElapsedTime': null,
        }],
      });
      // 至此方法应该返回

      if (elapsedTime === 23) {
        Meteor.defer(async () => {
          const { decideRoundEnd } = await import('./server/game-operation.js');
          decideRoundEnd(roomId);
        });
      }
    }
  },
});

// TODO: 重复提交检查
export const submitAnswer = new ValidatedMethod({
  name: 'game.submitAnswer',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    session: {
      type: SimpleSchema.Integer,
      min: 1,
    },
    roundNumber: {
      type: SimpleSchema.Integer,
      min: 1,
      max: 10,
    },
    answer: {
      type: String,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    noRetry: false,
    throwStubExceptions: true,
  },
  run({
    roomId,
    session,
    roundNumber,
    answer,
  }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (!currentRoom.inGame()) throw new Meteor.Error(409, '当前房间未进行游戏');

    if (currentRoom.session !== session
      || currentRoom.currentRoundNumber() !== roundNumber) {
      throw new Meteor.Error(400, '指定的回合非当前正在进行的回合');
    }

    // 终局检查
    if (currentRoom.currentRoundOver()) throw new Meteor.Error(409, '当前回合已经结束');

    if (MD5(answer).toString().toLowerCase()
      !== currentRoom.currentQuestion().answerHash.toLowerCase()) {
      throw new Meteor.Error(400, '猜题回答错误');
    }

    // 加winner
    // TODO: 这里有竞争可能：在提交答案后，终局流程走了一半，将会遗漏统计该人的分数，问题不大
    Rooms.update({
      _id: roomId,
      // 'users.id': userId,
      session,
      // roundCount: roundNumber,
      rounds: { $size: roundNumber },
    }, { $addToSet: { 'rounds.0.winners': userId } });

    // 至此方法应该返回

    if (!this.isSimulation) {
      Meteor.defer(async () => {
        const { decideRoundEnd } = await import('./server/game-operation.js');
        decideRoundEnd(roomId);
      });
    }
  },
});

export const tellWinningBots = new ValidatedMethod({
  name: 'game.tellWinningBots',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    session: {
      type: SimpleSchema.Integer,
      min: 1,
    },
    roundNumber: {
      type: SimpleSchema.Integer,
      min: 1,
      max: 10,
    },
    bots: {
      type: Array,
      minCount: 1,
    },
    'bots.$': {
      type: String,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    noRetry: false,
    throwStubExceptions: true,
  },
  run({
    roomId,
    session,
    roundNumber,
    bots,
  }) {
    const { userId } = this;

    console.log(`${userId} is telling winning bots: ${bots}`);

    const currentRoom = Rooms.findOne({
      _id: roomId,
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (!currentRoom.inGame()) throw new Meteor.Error(409, '当前房间未进行游戏');

    if (currentRoom.session !== session
      || currentRoom.currentRoundNumber() !== roundNumber) {
      throw new Meteor.Error(400, '指定的回合非当前正在进行的回合');
    }

    // 终局检查
    if (currentRoom.currentRoundOver()) throw new Meteor.Error(409, '当前回合已经结束');

    // TODO: 检查bots

    if (!this.isSimulation) {
      Rooms.rawUpdateOne({
        _id: roomId,
        // 'users.id': userId,
        session,
        // roundCount: roundNumber,
        rounds: { $size: roundNumber },
      }, {
        $addToSet: {
          'users.$[b].supporters': userId,
        },
      }, {
        arrayFilters: [{
          'b.botLevel': { $exists: true, $ne: null },
          'b.id': { $in: bots },
        }],
      });
      // 至此方法应该返回

      Meteor.defer(async () => {
        const { decideBotWins, decideRoundEnd } = await import('./server/game-operation.js');
        decideBotWins(roomId);
        decideRoundEnd(roomId);
      });
    }
  },
});
