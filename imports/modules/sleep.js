import { Meteor } from 'meteor/meteor';

export default millis => new Promise(resolve => Meteor.setTimeout(resolve, millis));
