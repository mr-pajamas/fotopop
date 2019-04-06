import queryString from 'query-string';

const { ua } = queryString.parse(window.location.search);

const osType = ua && ua.split('/')[3];

export default {
  isAndroid: osType === '1',
  isIOS: osType === '2',
};
