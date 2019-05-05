import { UserAccounts } from '../collections.js';
import query from '../../../modules/client/parsed-query.js';

UserAccounts.helpers({
  diamondAmount() {
    const { amount } = this.diamond;
    if (query.isAndroid) return amount.common + amount.android;
    if (query.isIOS) return amount.common + amount.ios;
    return amount.common;
  },
});
