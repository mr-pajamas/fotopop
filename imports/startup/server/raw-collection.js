import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Mongo.Collection.prototype.rawUpdateOne = function (filter, update, options) {
  const rawCollection = this.rawCollection();
  return Meteor.wrapAsync(rawCollection.updateOne, rawCollection)(filter, update, options);
};
