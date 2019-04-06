import { ValidatedMethod } from 'meteor/mdg:validated-method';
import bluebird from 'bluebird';

bluebird.promisifyAll(ValidatedMethod.prototype);
