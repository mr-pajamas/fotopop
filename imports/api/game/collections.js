/* eslint-disable import/prefer-default-export */
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import filter from 'lodash/filter';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import reverse from 'lodash/reverse';
// import property from 'lodash/property';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

const Rooms = new Mongo.Collection('rooms');

Rooms.attachSchema(new SimpleSchema({
  type: {
    type: SimpleSchema.Integer,
  },
  categoryId: {
    type: String,
  },
  categoryName: {
    type: String,
  },
  searchId: {
    type: String,
    index: true,
    unique: true,
  },
  pvt: {
    type: Boolean,
    defaultValue: false,
  },
  userCount: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
    // TODO: auto value here
    max: 6,
    min: 0,
  },
  users: {
    type: Array,
    minCount: 1,
    maxCount: 6,
  },
  'users.$': {
    type: Object,
  },
  'users.$.id': {
    type: String,
  },
  /*
  'users.$.name': {
    type: String,
    optional: true,
  },
  */
  'users.$.ready': {
    type: Boolean,
    defaultValue: true,
  },
  /*
  'users.$.score': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  */
  'users.$.offline': {
    type: Boolean,
    defaultValue: false,
  },
  'users.$.elapsedTime': {
    type: SimpleSchema.Integer,
    optional: true,
    max: 23,
    min: 0,
  },
  'users.$.botLevel': {
    type: SimpleSchema.Integer,
    optional: true,
  },
  'users.$.supporters': {
    type: Array,
    optional: true,
  },
  'users.$.supporters.$': {
    type: String,
  },
  lastWinner: {
    type: String,
    optional: true,
  },
  /*
  owner: {
    type: String,
  },
  */
  session: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
  },
  questions: {
    type: Array,
    optional: true,
  },
  'questions.$': {
    type: Object,
  },
  'questions.$.id': {
    type: String,
  },
  'questions.$.type': { // 中文/英文
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  'questions.$.audio': {
    type: String, // url
  },
  'questions.$.choices': {
    type: Array,
    minCount: 21,
    maxCount: 21,
  },
  'questions.$.choices.$': {
    type: String,
  },
  'questions.$.hints': {
    type: Array,
    minCount: 3,
    maxCount: 3,
  },
  'questions.$.hints.$': {
    type: String,
  },
  /*
  'questions.$.tip': {
    type: String,
  },
  */
  'questions.$.answerHash': {
    type: String, // hashed
  },
  /*
  'questions.$.answerLength': {
    type: SimpleSchema.Integer,
    optional: true,
    max: 15,
    min: 1,
  },
  */
  'questions.$.answerFormat': {
    type: String,
  },
  messages: {
    type: Array,
    defaultValue: [],
  },
  'messages.$': {
    type: Object,
  },
  /*
   * - 进出房间1
   * - IM2，
   * - 送礼3，
   * - TIP4
   */
  'messages.$.type': { // 我只需要做提示4
    type: SimpleSchema.Integer,
  },
  'messages.$.text': {
    type: String,
  },
  'messages.$.sender': {
    type: String,
    optional: true,
  },
  /*
  'messages.$.sender.id': {
    type: String,
  },
  'messages.$.sender.name': {
    type: String,
  },
  'messages.$.sender.avatar': {
    type: String,
    optional: true,
  },
  */
  fastMatching: {
    type: Boolean,
    defaultValue: false,
  },
  /*
  isStarted: {
    type: Boolean,
    defaultValue: false,
  },
  */
  /*
  roundCount: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
    max: 10,
  },
  */
  /*
  roundCount: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 10,
    defaultValue: 0,
  },
  */

  // reversed order!!!!
  rounds: {
    type: Array,
    maxCount: 10,
    minCount: 1,
    optional: true,
  },
  'rounds.$': {
    type: Object,
  },
  /*
  'rounds.$.id': {
    type: String,
  },
  */
  /*
  'rounds.$.elapsedTime': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  */
  'rounds.$.winners': {
    type: Array,
    defaultValue: [],
  },
  'rounds.$.winners.$': {
    type: String,
  },
  /*
  currentRound: {
    type: Object,
  },
  'currentRound.number': {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  'currentRound.elapsedTime': { // 最多23秒
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  'currentRound.winners': {
    type: Array,
  },
  'currentRound.winners.$': {
    type: String,
  },
  */
}));

const isActiveUser = user => !user.offline;

const isHuman = user => !user.botLevel;

const isBot = user => !isHuman(user);

const isVoter = user => isActiveUser(user) && isHuman(user) && user.elapsedTime !== undefined;

const majorities = [0, 1, 2, 2, 3, 3, 4];
const scoreMap = [6, 5, 4, 3, 2, 1];

Rooms.helpers({
  typeName() {
    return this.type === 0 ? '猜歌名' : '猜电影';
  },
  inGame() {
    return !!this.rounds;
  },
  currentRound() {
    return this.rounds && this.rounds[0];
  },
  currentRoundNumber() {
    return this.rounds && this.rounds.length;
  },
  lastRound() {
    return this.currentRoundNumber() === 10;
  },
  sessionReady() {
    return !!this.questions;
  },
  /*
  currentRoundOver(newSupporterId) {
    const voters = filter(this.users, isAssertiveUser);
    const supporters = filter(voters, ({ id, roundElapsedTime }) => {
      return id === newSupporterId || roundElapsedTime === 23
    });
    return supporters.length >= majorities[voters.length];
  },
  */

  currentRoundOver() {
    // 不单单是大多数活人宣称时间到，而且当所有在线的人和机器人都在时限内答出来
    const currentRound = this.currentRound();
    if (!currentRound) return false;

    const activeUsers = filter(this.users, isActiveUser);
    if (!difference(map(activeUsers, 'id'), currentRound.winners).length) return true;

    const voters = this.voters();
    const supporters = filter(voters, ({ elapsedTime }) => elapsedTime === 23);
    return supporters.length >= majorities[voters.length];
  },

  currentQuestion() {
    return (this.questions
      && this.currentRoundNumber()
      && this.questions[this.currentRoundNumber() - 1])
      || undefined;
  },

  host() {
    if (this.lastWinner) {
      return find(this.users, u => u.id === this.lastWinner);
    }
    return this.users[0];
  },

  humanUsers() {
    return filter(this.users, isHuman);
  },

  voters() {
    return filter(this.users, isVoter);
  },

  bots() {
    return filter(this.users, isBot);
  },

  botWinners() {
    const bots = filter(this.users, u => !!u.botLevel);
    const voters = this.voters();
    return filter(bots, b => b.supporters
      && intersection(b.supporters, map(voters, 'id')).length >= majorities[voters.length]);
  },
  scores() {
    /*
    return {
      uid1: 23,
      uid2: 5,
    };
    */
    if (!this.inGame()) return {};
    const rounds = reverse([...this.rounds]);
    return reduce(rounds, (result, { winners = [] }) => {
      forEach(winners, (winner, index) => {
        result[winner] = result[winner] || 0;
        result[winner] += scoreMap[index];
      });
      return result;
    }, {});
  },
  user(userId) {
    return find(this.users, ({ id }) => id === userId);
  },
});

const Results = new Mongo.Collection('results');

const awardSchema = new SimpleSchema({
  name: {
    type: String,
  },
  amount: {
    type: SimpleSchema.Integer,
    min: 1,
  },
  icon: {
    type: String,
  },
});

Results.attachSchema(new SimpleSchema({
  roomId: {
    type: String,
  },
  session: {
    type: SimpleSchema.Integer,
    min: 1,
  },
  rankings: {
    type: Array,
  },
  'rankings.$': {
    type: Object,
  },
  'rankings.$.place': {
    type: SimpleSchema.Integer,
    min: 1,
    max: 6,
  },
  'rankings.$.userId': {
    type: String,
  },
  'rankings.$.score': {
    type: SimpleSchema.Integer,
    min: 1,
  },
  'rankings.$.expGain': {
    type: SimpleSchema.Integer,
  },
  'rankings.$.doubleExp': {
    type: Boolean,
  },
  'rankings.$.remainingWins': {
    type: SimpleSchema.Integer,
    min: 1,
  },
  'rankings.$.awards': {
    type: Array,
    minCount: 1,
    optional: true,
  },
  'rankings.$.awards.$': {
    type: awardSchema,
  },
  'rankings.$.nextAwards': {
    type: Array,
    minCount: 1,
  },
  'rankings.$.nextAwards.$': {
    type: awardSchema,
  },
}));

const JoinQueues = new Mongo.Collection('join-queues');

JoinQueues.attachSchema(new SimpleSchema({
  type: {
    type: SimpleSchema.Integer,
  },
  categoryId: {
    type: String,
  },
  /*
  userCount: {
    type: SimpleSchema.Integer,
    // TODO: auto value here
    min: 0,
    defaultValue: 0,
  },
  */
  waitingUsers: {
    type: Array,
    defaultValue: [],
  },
  'waitingUsers.$': {
    type: String,
  },
  version: {
    type: SimpleSchema.Integer,
    autoValue() {
      return { $inc: 1 };
    },
  },
}));

export { Rooms, Results, JoinQueues };
