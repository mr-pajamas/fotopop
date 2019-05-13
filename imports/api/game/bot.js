import MD5 from 'crypto-js/md5';
import seedrandom from 'seedrandom';
import times from 'lodash/times';

function getRandom(min = 0, max = 1) {
  return this.rng() * (max - min) + min;
}

function cal(expectedTime, random) {
  return Math.ceil(-(Math.log(1 - random) / (1 / expectedTime)));
}

const Bot = function (id, level, roomId) {
  this.id = id;
  this.level = level;
  this.expectedTime = Bot.levelMap[level];
  this.roomId = roomId;
};

Bot.levelMap = [undefined, 20, 15, 7];
/*
Bot.expectedDecisionTime = 3;
Bot.STAY = Symbol('stay');
Bot.LEAVE = Symbol('leave');
*/

Bot.prototype.init = function(session) {
  const seed = MD5(this.id + this.roomId + session).toString();
  this.rng = seedrandom(seed);
  this.roundTimes = times(10, () => getRandom.call(this, 0.2, 0.8))
    .map(random => cal(this.expectedTime, random));
};
/*
Bot.prototype.setRound = function(roundNumber, elapsedTime = 0) {
  this.counter = elapsedTime;
  this.solvedAt = this.roundTimes[roundNumber - 1];
};

Bot.prototype.solve = function () {
  this.counter += 1;
  return this.counter === this.solvedAt;
};
*/

Bot.prototype.solve = function (roundNumber, elapsedTime) {
  return elapsedTime === this.roundTimes[roundNumber - 1];
  // return elapsedTime === 15;
};

/*
Bot.prototype.decide = function (elapsedTime) {
  return Bot.STAY;
};
*/

export default Bot;
