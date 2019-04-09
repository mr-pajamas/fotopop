import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import jwt from 'jsonwebtoken';
import { Tokens, UserAccounts } from '../collections.js';

const { private: { jwtSecret } = {} } = Meteor.settings;

if (!jwtSecret) {
  console.log('未找到JWT密钥配置信息，将不验证口令的有效性');
}

Accounts.registerLoginHandler(({ jwt: token } = {}) => {
  if (!token) return undefined;

  try {
    const { sub } = jwtSecret
      ? jwt.verify(token, jwtSecret) : jwt.decode(token);

    // remove this
    // console.log(jwtSecret ? jwt.verify(token, jwtSecret) : jwt.decode(token));

    if (!sub) return { error: new Meteor.Error(403, '口令内容错误') };

    // 有没有token？
    const { userId } = Tokens.findOne(sub) || {};
    if (!userId) return { error: new Meteor.Error(404, '未找到登录口令') };

    // 有没有用户账号？
    const userAccount = UserAccounts.findOne(userId);

    if (!userAccount) return { error: new Meteor.Error(404, '未找到指定用户') };

    // 有没有开过用户表？
    Meteor.users.findOne(userId) || Accounts.insertUserDoc({}, { _id: userId });

    // const userId = user ? user._id : Accounts.insertUserDoc({}, { _id });

    return { userId };
  } catch (e) {
    return { error: new Meteor.Error(403, `口令验证失败：${e.message}`) };
  }
});
