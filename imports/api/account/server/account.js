import { Meteor } from 'meteor/meteor';

const loginCallbacks = [];

function successfulLogin(user, connection) {
  loginCallbacks.forEach(cb => cb({ user: { ...user }, connection }));
}

function wrapCallback(callback) {
  return function (...args) {
    try {
      return callback(...args);
    } catch (e) {
      console.log(`Exception in onLogin callback: ${e && (e.stack || e)}`);
    }
    return undefined;
  };
}

Meteor.onLogin = function (callback) {
  loginCallbacks.push(wrapCallback(callback));
};

export default successfulLogin;
