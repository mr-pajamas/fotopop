import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
/*
import { Accounts } from 'meteor/accounts-base';
*/

import { UserAccounts } from '../../account/collections.js';
import { Rooms } from '../collections.js';
import {
  decideBotWins,
  decideRoundEnd,
  fillRoom,
  decideBigGiftEnd,
} from './game-operation.js';

/*
Accounts.validateLoginAttempt(({ type }) => {
  if (type === 'resume') throw new Meteor.Error(403, '"resume" type login is disabled');
  return true;
});
*/


Meteor.onLogin(({ user: { _id: userId }, connection: { onClose } }) => {
  const cid = Random.id();
  UserAccounts.update(userId, { $set: { connection: cid } });

  // 连线，如果用户在房间内，offline要设置回来
  const affected = Rooms.update({
    searchId: { $exists: true, $ne: null },
    users: { $elemMatch: { id: userId, offline: true } },
  }, {
    $set: { 'users.$.offline': false },
    $inc: { userCount: 1 },
    $unset: {
      'users.$.elapsedTime': '',
      'users.$.bgElapsedTime': '',
    },
  });

  if (!affected) { // 可能onClose未来得及调用
    Rooms.update({
      searchId: { $exists: true, $ne: null },
      users: { $elemMatch: { id: userId, offline: false } },
    }, {
      $unset: {
        'users.$.elapsedTime': '',
        'users.$.bgElapsedTime': '',
      },
    });
  }

  onClose(() => {
    const { value } = UserAccounts.rawFindOneAndUpdate({
      _id: userId,
      connection: cid,
    }, {
      $unset: { connection: '' },
    });

    if (!value) return;

    const current = Rooms.findOne({ 'users.id': userId });

    const currentQueue = current && !current.searchId && current;
    const currentRoom = current && current.searchId && current;

    // 如果用户在房间内
    // 1、如果房间在准备阶段，直接离开(发送服务器请求)
    // 2、如果房间已经开始游戏，设置为offline
    // const currentRoom = Rooms.findOne({ 'users.id': userId });
    /*
    const currentRoom = Rooms.findOne({
      searchId: { $exists: true, $ne: null },
      'users.id': userId,
    });
    */
    if (currentQueue) {
      Rooms.update({
        _id: currentQueue._id,
        'users.id': userId,
      }, {
        $pull: { users: { id: userId } },
      });
    } else if (currentRoom) {
      const user = UserAccounts.findOne(userId);
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

        let updated = Rooms.update({
          _id: currentRoom._id,
          'users.id': userId,
          rounds: null,
          $nor: [{ lastWinner: userId }, { lastWinner: null, 'users.0.id': userId }],
        }, {
          $pull: { users: { id: userId } },
          $inc: { userCount: -1 },
          $push: {
            messages: {
              type: 1,
              text: `${user.name || '足记用户'}离开了房间`,
            },
          },
        });

        if (!updated) {
          updated = Rooms.update({
            _id: currentRoom._id,
            'users.id': userId,
            rounds: null,
            $or: [{ lastWinner: userId }, { lastWinner: null, 'users.0.id': userId }],
          }, {
            $pull: { users: { id: userId } },
            $inc: { userCount: -1 },
            $set: { botLeavingCount: 0 },
            $push: {
              messages: {
                type: 1,
                text: `${user.name || '足记用户'}离开了房间`,
              },
            },
            $unset: { lastWinner: '' },
          });
        }

        /*
        Rooms.update({
          _id: currentRoom._id,
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
        */

        // 为了以防万一游戏在期间开始
        if (!updated) {
          Rooms.rawUpdateOne({
            _id: currentRoom._id,
            'users.id': userId,
            rounds: { $exists: true, $ne: null },
          }, {
            $set: { 'users.$[u].offline': true },
            $unset: {
              'users.$[u].elapsedTime': '',
              'users.$[u].bgElapsedTime': '',
            },
            $inc: { userCount: -1 },
          }, {
            arrayFilters: [{
              'u.id': userId,
            }],
          });
        }

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

        let { matchedCount: updated } = Rooms.rawUpdateOne({
          _id: currentRoom._id,
          'users.id': userId,
          rounds: { $exists: true, $ne: null },
        }, {
          $set: { 'users.$[u].offline': true },
          $unset: {
            'users.$[u].elapsedTime': '',
            'users.$[u].bgElapsedTime': '',
          },
          $inc: { userCount: -1 },
        }, {
          arrayFilters: [{
            'u.id': userId,
          }],
        });

        // 为了以防万一游戏在期间结束
        if (!updated) {
          updated = Rooms.update({
            _id: currentRoom._id,
            'users.id': userId,
            rounds: null,
            $nor: [{ lastWinner: userId }, { lastWinner: null, 'users.0.id': userId }],
          }, {
            $pull: { users: { id: userId } },
            $inc: { userCount: -1 },
            $push: {
              messages: {
                type: 1,
                text: `${user.name || '足记用户'}离开了房间`,
              },
            },
          });
        }

        if (!updated) {
          Rooms.update({
            _id: currentRoom._id,
            'users.id': userId,
            rounds: null,
            $or: [{ lastWinner: userId }, { lastWinner: null, 'users.0.id': userId }],
          }, {
            $pull: { users: { id: userId } },
            $inc: { userCount: -1 },
            $set: { botLeavingCount: 0 },
            $push: {
              messages: {
                type: 1,
                text: `${user.name || '足记用户'}离开了房间`,
              },
            },
            $unset: { lastWinner: '' },
          });
        }
        /*
        Rooms.update({
          _id: currentRoom._id,
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
        */
      }

      // fillRoom(currentRoom._id);

      // TODO: 发送请求通知
      // TODO: 如果期间有断线用户回来，直接假定该轮结束
      const removed = Rooms.remove({
        _id: currentRoom._id,
        // 没有一个活人
        users: { $not: { $elemMatch: { botLevel: null, offline: false } } },
      });


      if (!removed) {
        fillRoom(currentRoom._id);
        decideBigGiftEnd(currentRoom._id);

        decideBotWins(currentRoom._id);
        decideRoundEnd(currentRoom._id);
      }
    }
  });
});
