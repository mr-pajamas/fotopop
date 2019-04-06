import { Meteor } from 'meteor/meteor';
// import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
import { UserAccounts } from '../collections.js';

Meteor.publish('account.ownAccount', function () {
  if (!this.userId) return this.ready();
  return UserAccounts.find({ _id: this.userId });
});
