/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UserAccounts = new Mongo.Collection('accounts');

UserAccounts.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: '姓名',
    index: true,
  },
  avatar: {
    type: Object,
    defaultValue: {},
  },
  'avatar.head': {
    type: String,
    optional: true,
  },
  'avatar.full': {
    type: String,
    defaultValue: 'someUrl',
  },
  diamond: {
    type: Object,
    defaultValue: {},
  },
  'diamond.level': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  'diamond.amount': {
    type: Object,
    defaultValue: {},
  },
  'diamond.amount.common': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  'diamond.amount.ios': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  'diamond.amount.android': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  exp: {
    type: Object,
    optional: true,
  },
  'exp.level': {
    type: SimpleSchema.Integer,
  },
  'exp.levelPoints': {
    type: SimpleSchema.Integer,
  },
  'exp.maxLevelPoints': {
    type: SimpleSchema.Integer,
  },
  dressedMedal: {
    type: String,
    optional: true,
  },
  charisma: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  /*
  uncheckedAchievementCount: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  */
  /*
  bot: {
    type: Boolean,
    defaultValue: false,
  },
  */
  streaks: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
}));

/*
const sample = {
  _id: '1234567',
  name: '渣渣辉',
  avatar: {
    head: 'url',
    full: 'url',
  },
  diamond: {
    level: 5,
    amount: {
      common: 500,
      ios: 40,
      android: 100,
    },
  },
  exp: {
    level: 2,
    levelPoints: 10,
    maxLevelPoints: 100,
  },
  dressedMedal: 'url',
  charisma: 1000,
  bot: false,
  streaks: 4,
};
*/

Meteor.users.attachSchema(new SimpleSchema({
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
}));

export { UserAccounts };
