/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import times from 'lodash/times';
import random from 'lodash/random';
import find from 'lodash/find';
import map from 'lodash/map';
import take from 'lodash/take';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';
import attempt from 'lodash/attempt';

import MD5 from 'crypto-js/md5';

import { Rooms } from './collections.js';
import { UserAccounts } from '../account/collections.js';

function generateCode() {
  return times(6, () => random(9)).join('');
}

export const createRoom = new ValidatedMethod({
  name: 'game.createRoom',
  validate: new SimpleSchema({
    type: SimpleSchema.Integer,
    categoryId: String,
    categoryName: String,
    pvt: {
      type: Boolean,
      defaultValue: false,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: true,
    throwStubExceptions: true,
  },
  async run({
    type,
    categoryId,
    categoryName,
    pvt,
  }) {
    const { userId } = this;
    // 1. 检查是否已经在房间里
    const currentRoom = Rooms.findOne({
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });
    if (currentRoom) throw new Meteor.Error(409, `用户已经在房间（${currentRoom.searchId}）中`);

    // 此处不保证用户又进入一个房间

    if (!this.isSimulation) {
      const { fetchQuestions } = await import('./server/service-methods.js');

      // 先异步拉题目
      const fetchPromise = fetchQuestions(type, categoryId);

      // 如果用户有在任何分类中等待加入房间，则从队列中移除
      // 用户同步加入房间，会被误删（没事）
      Rooms.update({
        searchId: null,
        'users.id': userId,
      }, {
        $pull: { users: { id: userId } },
      });

      // 此处无法保证用户是否在等待还是在房间中

      // 一步步来，先独自建好房间，方法返回，再从等待队列中一个个拿用户一个个加

      const { name: userName } = UserAccounts.findOne(userId);
      const questions = await fetchPromise;

      let needRetry = true;
      let roomId;
      while (needRetry) {
        const searchId = generateCode();
        try {
          roomId = Rooms.insert({
            type,
            categoryId,
            categoryName,
            searchId,
            pvt,
            userCount: 1,
            /*
            users: [
              {
                id: userId,
                ready: true,
                offline: false,
              },
              ...(!pvt
                ? times(2, i => ({
                  id: `10001${i}`,
                  ready: true,
                  offline: false,
                  botLevel: 3 - i,
                }))
                : []),
            ],
            */
            users: [{ id: userId, ready: true, offline: false }],
            session: 1,
            questions,
            messages: [{
              type: 1,
              text: `${userName}创建了房间`,
            }],
            fastMatching: false,
          });

          needRetry = false;
        } catch (e) {
          if (e.code !== 11000 || !Rooms.findOne({ searchId })) {
            throw e;
          }
        }
      }

      // 加等待的人，一个一个来
      if (!pvt) {
        Meteor.defer(async () => {
          // 此处不保证房间还在
          // 于是此处不保证房主不出现在等待队列中，只要房间还在，房主必然不会出现在队列中
          // 先拉人，再加房间，如果加房间失败，退回去

          const { fillRoom } = await import('./server/game-operation.js');
          Meteor.setTimeout(fillRoom.bind(null, roomId), 2000);
          // fillRoom(roomId);
        });
      }


      /*
      // 看看有没有等待的人
      // 移除同分类下至多5个人，并获取这5个人的ID信息
      let waitingUsers = !pvt && [];
      while (!waitingUsers) {
        const { _id, users = [], version } = Rooms.findOne({
          type,
          categoryId,
          searchId: null,
        }) || {};

        if (users.length === 0) {
          waitingUsers = [];
        } else {
          if (find(users, ({ id }) => id === userId)) throw new Meteor.Error(409, '状态错误：用户仍在等待队列');
          const takenUsers = take(users, 5);
          const affected = Rooms.update({
            _id,
            version,
          }, {
            $push: {
              users: {
                $each: [],
                $slice: takenUsers.length - users.length,
              },
            },
          });
          if (affected) waitingUsers = takenUsers;
        }
      }


      // 在此处无法保证这些用户不再出现在等待队列中，或者出现在房间里

      try {
        const users = pvt ? [{ id: userId }] : take(
          [
            { id: userId },
            ...waitingUsers,
            { id: '100011', botLevel: 3 },
            { id: '100012', botLevel: 2 },
            { id: '100013', botLevel: 1 },
          ],
          6,
        );

        const userIds = map(users, 'id');

        const userNames = reduce(
          UserAccounts.find({ _id: { $in: userIds } }).fetch(),
          (nameMap, { _id, name }) => {
            nameMap[_id] = name;
            return nameMap;
          },
          {},
        );

        const messages = map(userIds, (uid, index) => ({
          type: 1,
          text: `${userNames[uid] || '足记用户'}${index === 0 ? '创建' : '进入'}了房间`,
        }));

        const questions = await fetchPromise;

        let needRetry = true;
        while (needRetry) {
          try {
            Rooms.insert({
              type,
              categoryId,
              categoryName,
              searchId: generateCode(),
              pvt,
              userCount: users.length,
              users,
              questions,
              messages,
            });

            needRetry = false;
          } catch (e) {
            if (e.code !== 11000) throw e;
          }
        }
      } catch (e) {
        // 把拉出来的人塞回等待队列 TODO: 注意重复
        // TODO: 一个个塞？
        if (waitingUsers && waitingUsers.length > 0) {
          Rooms.update({
            type,
            categoryId,
            searchId: null,
          }, {
            $push: {
              users: {
                $each: waitingUsers,
                $position: 0,
              },
            },
          });
        }

        throw e;
      }
      */
    }
  },
});

export const searchAndJoinRoom = new ValidatedMethod({
  name: 'game.searchAndJoinRoom',
  validate: new SimpleSchema({
    searchId: {
      type: String,
      min: 6,
      max: 6,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: true,
    throwStubExceptions: true,
  },
  run({ searchId }) {
    const { userId } = this;
    // 1. 检查是否已经在房间里
    // const currentRoom = Rooms.findOne({ 'users.id': userId });
    const currentRoom = Rooms.findOne({
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });
    if (currentRoom) throw new Meteor.Error(409, `用户已经在房间（${currentRoom.searchId}）中`);

    // 如果用户有在任何分类中等待加入房间，则从队列中移除
    // 用户同步加入房间，会被误删（没事）
    Rooms.update({
      searchId: null,
      'users.id': userId,
    }, {
      $pull: { users: { id: userId } },
    });

    if (!this.isSimulation) {
      const room = Rooms.findOne({ searchId });
      if (!room) throw new Meteor.Error(404, '未找到指定的房间');
      if (room.users.length === 6) throw new Meteor.Error(409, '该房间已经满员');
      if (room.inGame()) throw new Meteor.Error(409, '该房间已经开始游戏');

      const user = UserAccounts.findOne(userId);
      const affected = Rooms.update({
        _id: room._id,
        userCount: { $lt: 6 },
        users: { $not: { $elemMatch: { id: userId } } }, // 自己与自己竞争概率不高
        rounds: null,
      }, {
        $inc: { userCount: 1 },
        $push: {
          users: {
            id: userId,
            ready: true,
            offline: false,
          },
          messages: {
            type: 1,
            text: `${user.name || '足记用户'}进入了房间`,
          },
        },
      });
      if (!affected) throw new Meteor.Error(500, '加入房间失败，请重新尝试');
    }
  },
});

export const findAndJoinRoom = new ValidatedMethod({
  name: 'game.findAndJoinRoom',
  validate: new SimpleSchema({
    type: SimpleSchema.Integer,
    categoryId: String,
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: true,
    throwStubExceptions: true,
  },
  async run({ type, categoryId }) {
    const { userId } = this;
    // 1. 检查是否已经在房间里
    // const currentRoom = Rooms.findOne({ 'users.id': userId });
    const currentRoom = Rooms.findOne({
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });
    if (currentRoom) throw new Meteor.Error(409, `用户已经在房间（${currentRoom.searchId}）中`);

    // 如果用户有在任何分类中等待加入房间，则从队列中移除
    // 用户同步加入房间，会被误删（没事）
    Rooms.update({
      searchId: null,
      'users.id': userId,
    }, {
      $pull: { users: { id: userId } },
    });

    if (!this.isSimulation) {
      const { findAndJoin } = await import('./server/game-operation.js');
      findAndJoin(userId, undefined, type, categoryId);

      /*
      const user = UserAccounts.findOne(userId);
      const { value: affected } = Rooms.rawFindOneAndUpdate({
        type,
        categoryId,
        pvt: false,
        userCount: { $lt: 6 },
        users: { $not: { $elemMatch: { id: userId } } }, // 自己与自己竞争概率不高
        rounds: null,
      }, {
        $inc: { userCount: 1 },
        $push: {
          users: { id: userId },
          messages: {
            type: 1,
            text: `${user.name || '足记用户'}进入了房间`,
          },
        },
      }, {
        sort: { fastMatching: -1, userCount: -1 },
      });

      // 3 若无，则加入等待队列
      if (!affected) {
        JoinQueues.upsert({
          type,
          categoryId,
        }, {
          $addToSet: { waitingUsers: userId },
        });
      }
      */
    }

    /*
    const room = Rooms.findOne({
      // users: { $not: { $size: 6 } },
      userCount: { $lt: 6 },
      // questions: { $exists: true, $ne: null },
      rounds: null,
      type,
      categoryId,
    }, {
      sort: { fastMatching: -1, userCount: -1 },
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
    } else if (!this.isSimulation) {
      const { createRoom: create } = await import('./server/service-methods.js');
      await create(userId, type, categoryId);
      /!*
      Rooms.insert({
        type,
        categoryId,
        // categoryName,
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
      *!/
    }
    */
  },
});

export const kick = new ValidatedMethod({
  name: 'game.kick',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    kickee: {
      type: String,
    },
  }).validator({ clean: true }),
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
  run({ roomId, kickee }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (currentRoom.host().id !== userId) throw new Meteor.Error(403, '用户不是房主，无权踢人');

    if (!currentRoom.user(kickee)) throw new Meteor.Error(400, '指定用户不在房间中');

    if (currentRoom.inGame()) throw new Meteor.Error(409, '当前房间正在游戏中，无法踢人');

    const users = UserAccounts.find({ _id: { $in: [userId, kickee] } }).fetch();

    const user = find(users, u => u._id === userId);
    const kickeeUser = find(users, u => u._id === kickee);

    const [
      { diamond: { level: userDiamondLevel = 0 } = {} },
      { diamond: { level: kickeeDiamondLevel = 0 } = {} },
    ] = [user, kickeeUser];

    if (kickeeDiamondLevel > userDiamondLevel) throw new Meteor.Error(403, '对方VIP等级高于用户，无法踢人');

    Rooms.update({
      _id: roomId,
      $and: [
        { 'users.id': userId },
        { 'users.id': kickee },
      ],
      rounds: null,
    }, {
      $pull: { users: { id: kickee } },
      $inc: { userCount: -1 },
      $push: {
        messages: {
          type: 1,
          text: `${kickeeUser.name || '足记用户'}被请离了房间`,
        },
      },
    });

    if (!this.isSimulation) {
      Meteor.defer(async () => {
        const { fillRoom, decideBigGiftEnd } = await import('./server/game-operation.js');
        fillRoom(roomId);
        decideBigGiftEnd(roomId);
      });
    }
  },
});

export const leaveRoom = new ValidatedMethod({
  name: 'game.leaveRoom',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
  }).validator({ clean: true }),
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
  run({ roomId }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (currentRoom.inGame()) throw new Meteor.Error(409, '当前房间正在游戏中，无法退出');

    // if (currentRoom.fastMatching) throw new Meteor.Error(409, '当前房间正在进行快速匹配');


    const user = UserAccounts.findOne(userId);
    // 如果退出的是lastWinner那么要清空
    Rooms.update({
      _id: roomId,
      'users.id': userId,
      rounds: null,
    }, Object.assign(
      {
        $pull: { users: { id: userId } },
        $inc: { userCount: -1 },
        $push: {
          messages: {
            type: 1,
            text: `${user.name || '足记用户'}离开了房间`,
          },
        },
      },
      (currentRoom.lastWinner === userId) && { $unset: { lastWinner: '' } },
    ));

    if (!this.isSimulation) {
      Meteor.defer(async () => {
        const affected = Rooms.remove({
          _id: roomId,
          // 没有一个活人
          users: { $not: { $elemMatch: { botLevel: null, offline: false } } },
        });

        if (!affected) {
          const { fillRoom, decideBigGiftEnd } = await import('./server/game-operation.js');
          fillRoom(roomId);
          decideBigGiftEnd(roomId);
        }
      });
    }
  },
});

export const fastMatch = new ValidatedMethod({
  name: 'game.fastMatch',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    session: {
      type: SimpleSchema.Integer,
      min: 1,
    },
    osType: {
      type: SimpleSchema.Integer,
      allowedValues: [1, 2],
    },
  }).validator({ clean: true }),
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
  async run({ roomId, session, osType }) {
    const { userId } = this;

    const user = UserAccounts.findOne(userId);

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (currentRoom.inGame()) throw new Meteor.Error(409, '当前房间正在游戏中');

    if (currentRoom.session !== session) {
      throw new Meteor.Error(400, '指定的场次非当前场次');
    }

    if (currentRoom.fastMatching) throw new Meteor.Error(409, '当前房间已经在快速匹配中');

    if (!this.isSimulation) {
      const { useItem } = await import('../item/server/service-methods.js');
      try {
        await useItem(userId, osType, '60', !user.itemAmount('60'));
      } catch (e) {
        throw new Meteor.Error(500, e.message);
      }

      Rooms.update({
        _id: roomId,
        'users.id': userId,
        session,
        rounds: null,
        /*
        $or: [
          { fastMatching: null },
          { fastMatching: false },
        ],
        */
      }, {
        $set: { fastMatching: true, pvt: false },
        $push: {
          messages: {
            type: 1,
            text: `${user.name || '足记用户'}使用了快速匹配`,
          },
        },
      });

      // TODO: 使用失败退item
    }
  },
});

export const ready = new ValidatedMethod({
  name: 'game.ready',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    session: {
      type: SimpleSchema.Integer,
      min: 1,
    },
  }).validator({ clean: true }),
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
  run({ roomId, session }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (currentRoom.inGame()) throw new Meteor.Error(409, '当前房间正在游戏中');

    if (currentRoom.session !== session) {
      throw new Meteor.Error(400, '指定的场次非当前场次');
    }

    if (currentRoom.user(userId).ready) throw new Meteor.Error(409, '用户已经准备');

    Rooms.update({
      _id: roomId,
      'users.id': userId,
      session,
      rounds: null,
    }, {
      $set: { 'users.$.ready': true },
    });
  },
});

// TODO: 这里需要房间ID和session
export const startGame = new ValidatedMethod({
  name: 'game.startGame',
  validate: null,
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
    const currentRoom = Rooms.findOne({
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });
    // const currentRoom = Rooms.findOne({ 'users.id': userId });
    if (!currentRoom) throw new Meteor.Error(409, '用户不在房间中');

    if (currentRoom.inGame()) throw new Meteor.Error(409, '当前房间游戏已经开始');

    if (currentRoom.host().id !== userId) throw new Meteor.Error(403, '用户不是房主，无权开始游戏');

    // TODO: 可能需要删除
    // if (currentRoom.fastMatching) throw new Meteor.Error(409, '当前房间正在进行快速匹配');

    if (!currentRoom.questions || currentRoom.questions.length === 0) throw new Meteor.Error(409, '当前房间题目尚未准备好');

    if (currentRoom.users.length <= 1) throw new Meteor.Error(409, '当前房间人数不够，无法开始游戏');

    if (find(currentRoom.users, user => !user.ready)) throw new Meteor.Error(409, '当前房间有人未准备好，无法开始游戏');

    if (!this.isSimulation) {
      Rooms.rawUpdateOne({
        _id: currentRoom._id,
        $or: [
          { rounds: null },
          { rounds: { $size: 0 } },
        ],
      }, {
        $push: { rounds: { winners: [] } },
        // $inc: { roundCount: 1 },
        $set: {
          'users.$[].elapsedTime': 0,
          // 'users.$[].score': 0,
          // roundCount: 1,
          'users.$[u].ready': false, // TODO: 临时方案
          fastMatching: false,
        },
        $unset: { 'users.$[].supporters': '' },
      }, {
        arrayFilters: [{ 'u.botLevel': null }],
      });
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
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (!currentRoom.inGame()) throw new Meteor.Error(409, '当前房间未进行游戏');

    if (currentRoom.session !== session
      || currentRoom.currentRoundNumber() !== roundNumber) {
      throw new Meteor.Error(400, '指定的回合非当前正在进行的回合');
    }

    const user = find(currentRoom.users, u => u.id === userId);

    if (elapsedTime < user.elapsedTime) throw new Meteor.Error(400, '计时早于之前的值');

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
          'users.$[u].elapsedTime': elapsedTime,
          'users.$[o].elapsedTime': elapsedTime,
        },
      }, {
        arrayFilters: [{
          'u.id': userId,
        }, {
          'o.id': { $ne: userId },
          'o.offline': false,
          'o.elapsedTime': null,
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
      searchId: { $exists: true, $ne: null },
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

    if (!this.isSimulation) {
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

    // console.log(`${userId} is telling winning bots: ${bots}`);

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
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

export const sendBigGift = new ValidatedMethod({
  name: 'game.sendBigGift',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    giftId: {
      type: String,
    },
    receiver: {
      type: String,
    },
    packId: {
      type: String,
      optional: true,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: false,
    noRetry: true,
    throwStubExceptions: true,
  },
  run({
    roomId,
    giftId,
    receiver,
    packId,
  }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (!currentRoom.user(receiver)) throw new Meteor.Error(400, '指定用户不在房间中');

    // TODO: 发送验证请求

    // 先看是不是后面的再看是不是第一个

    // 模拟请求返回
    let affected = false;
    if (packId) {
      affected = Rooms.update({
        _id: roomId,
        'bigGifts.0.id': { $ne: packId },
        'bigGifts.id': packId,
      }, {
        $inc: { 'bigGifts.$.combo': 1 },
      });

      if (!affected) {
        affected = Rooms.update({
          _id: roomId,
          'bigGifts.0.id': packId,
        }, {
          $inc: { 'bigGifts.0.combo': 1 },
          // $set: { 'users.$[u].bgElapsedTime': 0 },
        });
      }
    }

    if (!affected) {
      const id = Random.id();

      affected = Rooms.update({
        _id: roomId,
        bigGifts: { $exists: true, $not: { $size: 0 } },
      }, {
        $push: {
          bigGifts: {
            id,
            giftId,
            sender: userId,
            receiver,
            combo: 1,
          },
        },
      });

      if (!affected) {
        Rooms.rawUpdateOne({
          _id: roomId,
          $or: [
            { bigGifts: null },
            { bigGifts: { $size: 0 } },
          ],
        }, {
          $push: {
            bigGifts: {
              id,
              giftId,
              sender: userId,
              receiver,
              combo: 1,
            },
          },
          $set: { 'users.$[u].bgElapsedTime': 0 },
        }, {
          arrayFilters: [{ 'u.offline': false }],
        });
      }

      return id;
      /*
      Rooms.rawUpdateOne({
        _id: roomId,
      }, {
        $push: {
          bigGifts: {
            id: Random.id(),
            giftId,
            sender: userId,
            receiver,
            combo: 1,
          },
        },
        $set: { 'users.$[u].bgElapsedTime': 0 },
      }, {
        arrayFilters: [{ 'u.offline': false }],
      });
      */
    }

    return packId;
  },
});

export const tellBigGiftElapsedTime = new ValidatedMethod({
  name: 'game.tellBigGiftElapsedTime',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    packId: {
      type: String,
    },
    elapsedTime: {
      type: Number,
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
    packId,
    elapsedTime,
  }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    if (packId !== currentRoom.currentBigGift().id) throw new Meteor.Error(400, '指定礼物ID非当前礼物');

    const user = currentRoom.user(userId);

    if (elapsedTime >= 0 && elapsedTime < user.bgElapsedTime) throw new Meteor.Error(400, '计时早于之前的值');

    if (!this.isSimulation) {
      Rooms.rawUpdateOne({
        _id: roomId,
        'bigGifts.0.id': packId,
      }, {
        $set: {
          'users.$[u].bgElapsedTime': elapsedTime,
          'users.$[o].bgElapsedTime': elapsedTime,
        },
      }, {
        arrayFilters: [{
          'u.id': userId,
        }, {
          'o.offline': false,
          'o.bgElapsedTime': null,
        }],
      });

      if (elapsedTime === -1) {
        Meteor.defer(async () => {
          const { decideBigGiftEnd } = await import('./server/game-operation.js');
          decideBigGiftEnd(roomId);
        });
      }
    }
  },
});

export const sendMessage = new ValidatedMethod({
  name: 'game.sendMessage',
  validate: new SimpleSchema({
    roomId: {
      type: String,
    },
    messageText: {
      type: String,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    wait: false,
    noRetry: false,
    throwStubExceptions: true,
  },
  run({
    roomId,
    messageText,
  }) {
    const { userId } = this;

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });

    if (!currentRoom) throw new Meteor.Error(400, '用户不在指定房间中');

    Rooms.update({
      _id: roomId,
      'users.id': userId,
    }, {
      $push: {
        messages: {
          type: 2,
          text: messageText,
          sender: userId,
        },
      },
    });
  },
});

export const getWrongChoices = new ValidatedMethod({
  name: 'game.getWrongChoices',
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
    osType: {
      type: SimpleSchema.Integer,
      allowedValues: [1, 2],
    },
  }).validator({ clean: true }),
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
  async run({
    roomId,
    session,
    roundNumber,
    osType,
  }) {
    const { userId } = this;

    const user = UserAccounts.findOne(userId);

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
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

    if (!this.isSimulation) {
      const { useItem } = await import('../item/server/service-methods.js');
      try {
        await useItem(userId, osType, '50', !user.itemAmount('50'));
      } catch (e) {
        throw new Meteor.Error(500, e.message);
      }
    }

    return currentRoom.currentQuestion().wrongChoices;
  },
});

export const getTip = new ValidatedMethod({
  name: 'game.getTip',
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
    osType: {
      type: SimpleSchema.Integer,
      allowedValues: [1, 2],
    },
  }).validator({ clean: true }),
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
  async run({
    roomId,
    session,
    roundNumber,
    osType,
  }) {
    const { userId } = this;

    const user = UserAccounts.findOne(userId);

    const currentRoom = Rooms.findOne({
      _id: roomId,
      searchId: { $exists: true, $ne: null },
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

    if (!this.isSimulation) {
      const { useItem } = await import('../item/server/service-methods.js');
      try {
        await useItem(userId, osType, '30', !user.itemAmount('30'));
      } catch (e) {
        throw new Meteor.Error(500, e.message);
      }
    }

    return currentRoom.currentQuestion().tip;
  },
});
