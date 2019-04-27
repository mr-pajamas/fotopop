// import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import map from 'lodash/map';
import client from '../../../modules/client/service-client.js';

const typeNames = ['music', 'movie'];

export const getCategories = async function (gameType) {
  if (Meteor.isDevelopment) {
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
  }

  const { data: { data: { list = [] } = {} } = {} } = await client.get(`/api/game/list/${typeNames[gameType]}/cats`);
  return map(list, ({ id, name, coverUrl }) => ({ id: `${id}`, name, coverUrl }));
};

/*
export const createRoom = async function (type, categoryId, pvt = false) {
  const { data } = await client.post('/api/game/room/create', {
    catId: +categoryId,
    privated: +pvt,
    type,
  });
  return data;
};
*/

const rankingNames = ['diamond', 'charm', 'expr'];

export const getRankings = async function (type, scope) {
  if (Meteor.isDevelopment) {
    return {
      myRank: { score: 400, place: 1 },
      rankList: [{
        score: 400,
        place: 1,
        userId: Meteor.connection.userId(),
      }],
    };
  }

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
