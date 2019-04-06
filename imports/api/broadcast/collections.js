/* eslint-disable import/prefer-default-export */
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Broadcasts = new Mongo.Collection('broadcasts');

Broadcasts.attachSchema(new SimpleSchema({
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
}));

/*
const sample = {
  _id: 'xxxxxxx',
  message: '渣渣辉是渣男么？',
  createdAt: new Date(),
  userId: 'xxxxxx',
  userName: '张家辉',
};
*/

export { Broadcasts };
