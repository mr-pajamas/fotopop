import { Meteor } from 'meteor/meteor';
// import SimpleSchema from 'simpl-schema';
import map from 'lodash/map';
import filter from 'lodash/filter';
import union from 'lodash/union';
import find from 'lodash/find';

import { Rooms, Results } from '../collections.js';
import { UserAccounts } from '../../account/collections.js';

Meteor.publishComposite('game.currentRoom', function () {
  const { userId } = this;

  return {
    find() {
      if (!userId) return null;
      return Rooms.find({
        searchId: { $exists: true, $ne: null },
        'users.id': userId,
      });
    },
    children: [{
      find({ users, messages }) { // TODO: gifts
        const ids = union(
          map(users, user => user.id),
          map(filter(messages, m => !!m.sender), m => m.sender),
        );
        return UserAccounts.find({ _id: { $in: ids } });
      },
    }],
  };
});

/*
Meteor.publish('game.result', function ({ roomId, session }) {
  return Results.find({ roomId, session });
});
*/


Meteor.publishComposite('game.result', function ({ roomId, session }) {
  // console.log(roomId, session);

  const { userId } = this;

  return {
    find() {
      if (!userId) return null;
      return Results.find({ roomId, session });
    },
    children: [{
      find({ rankings = [] }) {
        const { userId: winnerId } = find(rankings, ({ place }) => place === 1) || {};
        if (winnerId && winnerId !== userId) {
          return UserAccounts.find(winnerId);
        }
        return null;
      },
    }],
  };
});
