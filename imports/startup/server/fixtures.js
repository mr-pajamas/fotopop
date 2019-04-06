import { Meteor } from 'meteor/meteor';
// import { Random } from 'meteor/random';
import times from 'lodash/times';

import { UserAccounts } from '../../api/account/collections.js';


Meteor.startup(() => {
  if (UserAccounts.find().count() === 0) {
    times(10, (i) => {
      UserAccounts.insert({
        _id: `bot${i}`,
        name: `机器人${i}`,
        diamond: { level: 8, amount: { common: 250, ios: 150, android: 80 } },
      });
    });

    UserAccounts.insert({ _id: 'uuid2', name: '渣渣辉' });
    UserAccounts.insert({
      _id: '1a18af17dd144b88aabe55f05b334b8b',
      name: '古田螺',
      diamond: { level: 5, amount: { common: 100, ios: 50, android: 80 } },
    });
  }
  /*
  if (!UserAccounts.findOne('uuid2')) {
    UserAccounts.insert({ _id: 'uuid2', name: '渣渣辉' });
  }
  */
});
