// import SimpleSchema from 'simpl-schema';
import map from 'lodash/map';
import client from '../../../modules/client/service-client.js';

const typeNames = ['music', 'movie'];

export const getCategories = async function (gameType) {
  // TODO: uncomment this
  const { data: { data: { list = [] } = {} } = {} } = await client.get(`/api/game/list/${typeNames[gameType]}/cats`);
  return map(list, ({ id, name, coverUrl }) => ({ id: `${id}`, name, coverUrl }));
  // TODO: comment this
  /*
  return [{
    id: '1',
    name: '华语专场',
    coverUrl: '/images/cat1.png',
  }, {
    id: '2',
    name: '李健专场',
    coverUrl: '/images/cat2.png',
  }, {
    id: '3',
    name: '周杰伦专场',
    coverUrl: '/images/cat3.png',
  }];
  */
};

export const createRoom = async function (type, categoryId, pvt = false) {
  const { data } = await client.post('/api/game/room/create', {
    catId: +categoryId,
    privated: +pvt,
    type,
  });
  return data;
};

const rankingNames = ['diamond', 'charm', 'expr'];

export const getRankings = async function (type, scope) {
  const { data: { data: { myList, topLists = [] } = {} } = {} } = await client.get(
    `/api/game/list/${rankingNames[type]}`,
    {
      params: { type: scope },
    },
  );

  const rankList = map(
    topLists,
    ({ score, rank, uid }) => ({ score, place: rank, userId: `${uid}` }),
  );
  const { score, rank: place } = myList;
  return {
    myRank: { score, place },
    rankList,
  };
};
