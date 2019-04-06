import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Rooms } from '../collections.js';
import { decideBotWins, decideRoundEnd } from './game-operation.js';

Accounts.validateLoginAttempt(({ type }) => {
  if (type === 'resume') throw new Meteor.Error(403, '"resume" type login is disabled');
  return true;
});

Accounts.onLogin(({ user: { _id: userId }, connection: { onClose } }) => {
  // 连线，如果用户在房间内，offline要设置回来
  Rooms.update({ 'users.id': userId }, { $set: { 'users.$.offline': false } });

  onClose(() => {
    // 如果用户在房间内
    // 1、如果房间在准备阶段，直接离开(发送服务器请求)
    // 2、如果房间已经开始游戏，设置为offline
    const currentRoom = Rooms.findOne({ 'users.id': userId });
    if (currentRoom) {
      if (!currentRoom.inGame()) {
        // TODO: 发送请求（只是通知？还是后端来？）
        // 如果房间里没活人了，要删除房间
        // 看看下任是不是机器人
        /*
        if (users[0].id === userId) { // 掉线的是房主
          const index = Math.max(0, findIndex(users, isActiveUser, 1));
          const uids = take(users, index || users.length).map(u => u.id);
          Rooms.update(currentRoom._id, {
            $pull: { users: { id: { $in: uids } } },
            $inc: { userCount: -uids.length },
          });

          // 如果房间里没活人了，要删除房间 TODO: 也要通知
          Rooms.remove({
            _id: currentRoom._id,
            // 没有一个活人
            users: { $not: { $elemMatch: { botLevel: null } } },
          });
        } else {
          Rooms.update({
            _id: currentRoom._id,
            'users.id': userId,
          }, {
            $pull: { users: { id: userId } },
            $inc: { userCount: -1 },
          });
        }
        */

        Rooms.update({
          _id: currentRoom._id,
          'users.id': userId,
          rounds: null,
        }, {
          $pull: { users: { id: userId } },
          // $inc: { userCount: -1 },
        });

        // 为了以防万一游戏在期间开始
        Rooms.rawUpdateOne({
          _id: currentRoom._id,
          'users.id': userId,
          rounds: { $exists: true, $ne: null },
        }, {
          $set: { 'users.$[u].offline': true },
          $unset: { 'users.$[u].roundElapsedTime': '' },
        }, {
          arrayFilters: [{
            'u.id': userId,
          }],
        });

        /*
        Rooms.remove({
          _id: currentRoom._id,
          // 没有一个活人
          users: { $not: { $elemMatch: { botLevel: null } } },
        });
        */
      } else {
        // 如果房间里面没活人了，要删除房间（啊哦！这里有点假）
        /*
        if (hasActiveUser(reject(users, u => u.id === userId))) {
          // TODO: 这里要重新计算终局检查，以及机器人答题情况
          Rooms.update({
            _id: currentRoom._id,
            'users.id': userId,
          }, {
            $set: { 'users.$.offline': true },
            $unset: { 'users.$.roundElapsedTime': '' },
          });
        } else {
          // 删除房间
          // TODO: 发送请求通知
          // TODO: 如果很不巧，有个断线用户回来了
          // 他会被踢，不应该
          // 但他不知道时间，只能假设
          Rooms.remove(currentRoom._id);
        }
        */

        // 这里要重新计算终局检查，以及机器人答题情况

        Rooms.rawUpdateOne({
          _id: currentRoom._id,
          'users.id': userId,
          rounds: { $exists: true, $ne: null },
        }, {
          $set: { 'users.$[u].offline': true },
          $unset: { 'users.$[u].roundElapsedTime': '' },
        }, {
          arrayFilters: [{
            'u.id': userId,
          }],
        });

        // 为了以防万一游戏在期间结束
        Rooms.update({
          _id: currentRoom._id,
          'users.id': userId,
          rounds: null,
        }, {
          $pull: { users: { id: userId } },
          // $inc: { userCount: -1 },
        });
      }

      // TODO: 发送请求通知
      // TODO: 如果期间有断线用户回来，直接假定该轮结束
      const affected = Rooms.remove({
        _id: currentRoom._id,
        // 没有一个活人
        users: { $not: { $elemMatch: { botLevel: null, offline: false } } },
      });


      if (!affected) {
        decideBotWins(currentRoom._id);
        decideRoundEnd(currentRoom._id);
      }
    }
  });
});
