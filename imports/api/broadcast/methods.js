/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
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
    throwStubExceptions: true,
  },
  async run({ message, osType }) {
    const { userId } = this;

    const user = UserAccounts.findOne(userId);

    // 检查库存
    if (!this.isSimulation) {
      const { useItem } = await import('../item/server/service-methods.js');
      try {
        await useItem(userId, osType, '40', !user.itemAmount('40'));
      } catch (e) {
        throw new Meteor.Error(500, e.message);
      }

      Broadcasts.insert({
        message,
        userId,
        userName: user.name,
        createdAt: new Date(),
      });
    }
  },
});
