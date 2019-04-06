import { Meteor } from 'meteor/meteor';

import '/imports/startup/server';

// import { UserAccounts } from '../imports/api/account/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
  /*
  console.log('shit3');

  const updateUserAccount = Meteor.wrapAsync(UserAccounts.rawCollection().updateOne, UserAccounts.rawCollection());

  // depends
  updateUserAccount({ _id: 'uuid2' }, {
    $set: {
      'tests.$[e].ready': false,
      'tests.$[f].ready': true,
    },
    /!*
    $pull: {
      tests: { ready: { $exists: false } },
    },
    *!/
  }, {
    arrayFilters: [{ 'e.ready': true }, {
      'f.ready': false,
    }],
  });

  console.log(UserAccounts.findOne({
    _id: 'uuid2',
  }));
  */
});
