import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import jwt from 'jsonwebtoken';
import { Tokens, UserAccounts } from './collections.js';

let jwtSecret;

if (Meteor.isServer) {
  ({ private: { jwtSecret } = {} } = Meteor.settings);

  if (!jwtSecret) {
    console.log('未找到JWT密钥配置信息，将不验证口令的有效性');
  }
}

export const login = new ValidatedMethod({
  name: 'account.login',
  validate: new SimpleSchema({
    jwt: String,
  }).validator({ clean: true }),
  applyOptions: {
    wait: true,
    noRetry: false,
    throwStubExceptions: true,
  },
  async run({ jwt: token }) {
    let sub;

    try {
      ({ sub } = jwtSecret ? jwt.verify(token, jwtSecret) : jwt.decode(token));
    } catch (e) {
      throw new Meteor.Error(403, `口令验证失败：${e.message}`);
    }
    // remove this
    // console.log(jwtSecret ? jwt.verify(token, jwtSecret) : jwt.decode(token));

    if (!sub) throw new Meteor.Error(403, '口令内容错误');

    if (!this.isSimulation) {
      // 有没有token？
      const { userId } = Tokens.findOne(sub) || {};
      if (!userId) throw new Meteor.Error(404, '未找到登录口令');

      // 有没有用户账号？
      const userAccount = UserAccounts.findOne(userId);

      if (!userAccount) throw new Meteor.Error(404, '未找到指定用户');

      // 有没有开过用户表？
      // Meteor.users.findOne(userId) || Accounts.insertUserDoc({}, { _id: userId });

      // const userId = user ? user._id : Accounts.insertUserDoc({}, { _id });
      this.setUserId(userId);

      const { default: successfulLogin } = await import('./server/account.js');
      successfulLogin({ _id: userId }, this.connection);

      return userId;
    }

    return undefined;
  },
});
