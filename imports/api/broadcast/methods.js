/* eslint-disable import/prefer-default-export */
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Broadcasts } from './collections.js';
import { UserAccounts } from '../account/collections';

export const broadcast = new ValidatedMethod({
  name: 'broadcast.broadcast',
  validate: new SimpleSchema({
    message: {
      type: String,
      max: 50,
    },
  }).validator({ clean: true }),
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: '403',
    reason: 'You need to be logged in to call this method',
  },
  applyOptions: {
    throwStubExceptions: true,
  },
  run({ message }) {
    const { userId } = this;

    const { name: userName } = UserAccounts.findOne(userId);

    Broadcasts.insert({
      message,
      userId,
      userName,
      createdAt: new Date(),
    });
  },
});
