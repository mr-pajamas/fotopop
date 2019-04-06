import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';

const loginOptionsSchema = new SimpleSchema({
  jwt: {
    type: String,
  },
}, { check });

Meteor.loginWithJwt = (options, callback) => {
  const normalized = { ...options };
  loginOptionsSchema.clean(normalized);
  loginOptionsSchema.validate(normalized);

  Accounts.callLoginMethod({
    methodArguments: [normalized],
    userCallback: callback,
  });
};
