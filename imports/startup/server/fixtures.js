import { Meteor } from 'meteor/meteor';
// import { Random } from 'meteor/random';
import times from 'lodash/times';
import forEach from 'lodash/forEach';

import { UserAccounts, Tokens } from '../../api/account/collections.js';

Meteor.startup(() => {
  if (UserAccounts.find().count() === 0) {
    times(9, (i) => {
      UserAccounts.insert({
        _id: `10001${i}`,
        name: `机器人${i}`,
        diamond: { level: 8, amount: { common: 250, ios: 150, android: 80 } },
        bot: true,
      });
    });

    UserAccounts.insert({
      _id: '13404389',
      name: '丿灬阿狸',
      avatar: {
        head: 'http://dn.fotoplace.cc/b4bef69ad40a4a579336cfd8525c03bc.jpg',
        full: 'http://cache.fotoplace.cc/190408/13404389/676e06bddf733e47a07713098930b32a.jpg',
      },
      diamond: { level: 5, amount: { common: 100, ios: 50, android: 80 } },
    });
    UserAccounts.insert({
      _id: '28763072',
      name: '黄艾玛微博号',
      avatar: {
        head: 'http://dn.fotoplace.cc/e3bc3e55232f452fba93563c780cd5a4.jpg',
        full: 'http://cache.fotoplace.cc/190403/28763072/2f2e2f88094672aa827f9c726b37c5c6.png',
      },
    });
    UserAccounts.insert({
      _id: '28883830',
      name: '茶盘QQ',
      avatar: {
        head: 'http://dn.fotoplace.cc/dde77fd9b926493c9b75a6dc56b2f159.jpg',
      },
      diamond: { level: 6, amount: { common: 200, ios: 150, android: 180 } },
    });
    UserAccounts.insert({
      _id: '25610358',
      name: '小纯洁',
      avatar: {
        head: 'http://dn.fotoplace.cc/dde77fd9b926493c9b75a6dc56b2f159.jpg',
      },
      diamond: { level: 6, amount: { common: 200, ios: 150, android: 180 } },
    });

    Tokens.insert({
      _id: '6c6ec250a25c45a892fccbc7fc1f46f1',
      userId: '13404389',
      createdAt: new Date(),
    });

    // 871efbc16e4c4c60a35f621c77f7185a
    Tokens.insert({
      _id: 'd27869230e804e898776b76b187604e7',
      userId: '28763072',
      createdAt: new Date(),
    });

    // 611ed48e1ce846e881e5f02874604da5
    Tokens.insert({
      _id: 'a8ad19aed85c4c19bf77a30d0b3158f7',
      userId: '28883830',
      createdAt: new Date(),
    });

    Tokens.insert({
      _id: 'c2129f08790441a495042811e5f63401',
      userId: '25610358',
      createdAt: new Date(),
    });
  }

  /*
  const botIds = times(3, i => `10001${i}`);

  if (UserAccounts.find({ _id: { $in: botIds } }).fetch().length === 0) {
    forEach(botIds, (_id, i) => {
      UserAccounts.insert({
        _id,
        name: `机器人${i}`,
        diamond: { level: 8, amount: { common: 250, ios: 150, android: 80 } },
      });
    });
  }
  */
  /*
  if (!UserAccounts.findOne('uuid2')) {
    UserAccounts.insert({ _id: 'uuid2', name: '渣渣辉' });
  }
  */
});
