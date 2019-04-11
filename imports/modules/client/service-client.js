import { Meteor } from 'meteor/meteor';
import axios from 'axios';

import query from './parsed-query.js';

const { public: { serviceEndpoint } } = Meteor.settings;

if (!serviceEndpoint) throw new Error('未找到内调接口服务配置信息');

const { jwt, ua } = query;

const client = axios.create({
  baseURL: serviceEndpoint,
  headers: {
    Authorization: `Bearer ${jwt}`,
    'Client-Agent': ua,
  },
});

export default client;
