/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { UserAccounts } from '../account/collections';

export const useItem = new ValidatedMethod({
  name: 'item.useItem',
  validate: new SimpleSchema({
    id: String,
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
  async run({ id, osType }) {
    const { userId } = this;

    const user = UserAccounts.findOne(userId);

    if (!this.isSimulation) {
      const { useItem: use } = await import('./server/service-methods.js');
      try {
        await use(userId, osType, id, !user.itemAmount(id));
      } catch (e) {
        throw new Meteor.Error(500, e.message);
      }
    }
  },
});
