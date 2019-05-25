import { Meteor } from 'meteor/meteor';

import { Broadcasts } from '../collections.js';

// TODO: 需要优化
Meteor.publish('broadcast.broadcasts', function () {
  return Broadcasts.find({
    createdAt: { $gte: new Date() },
  }, {
    sort: { createdAt: 1 },
  });
});

Meteor.publish('broadcast.latestBroadcast', function () {
  return Broadcasts.find({}, { sort: { createdAt: -1 }, limit: 1 });
});
