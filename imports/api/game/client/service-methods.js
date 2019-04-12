// import SimpleSchema from 'simpl-schema';
import map from 'lodash/map';
import client from '../../../modules/client/service-client.js';

const typeNames = ['music', 'movie'];

export const getCategories = async function (gameType) {
  const { data: { data: { list = [] } = {} } = {} } = await client.get(`/api/game/list/${typeNames[gameType]}/cats`);
  return map(list, ({ id, name, coverUrl }) => ({ id: `${id}`, name, coverUrl }));
};

export const createRoom = async function (type, categoryId, pvt = false) {
  const { data } = await client.post('/api/game/room/create', {
    catId: +categoryId,
    privated: +pvt,
    type,
  });
  return data;
};
