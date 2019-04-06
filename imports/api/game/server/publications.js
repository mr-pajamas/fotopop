import { Meteor } from 'meteor/meteor';
// import SimpleSchema from 'simpl-schema';
import map from 'lodash/map';
import filter from 'lodash/filter';
import union from 'lodash/union';

import { Rooms } from '../collections.js';
import { UserAccounts } from '../../account/collections.js';

Meteor.publishComposite('game.currentRoom', function () {
  const { userId } = this;

  return {
    find() {
      if (!userId) return null;
      return Rooms.find({ 'users.id': userId });
    },
    children: [{
      find({ users, messages }) {
        const ids = union(
          map(users, user => user.id),
          map(filter(messages, m => !!m.sender), m => m.sender),
        );
        return UserAccounts.find({ _id: { $in: ids } });
      },
    }],
  };
});
