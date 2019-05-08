/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';

import map from 'lodash/map';
import client from '../../../modules/client/service-client.js';

import { AchievementStatus } from '../../../domain/enums.js';

import sleep from '../../../modules/sleep.js';

export const getAchievementGroups = async function () {
  if (Meteor.isDevelopment) {
    await sleep(1500);
    return [{
      name: '胜场成就',
      achievements: [{
        id: '1',
        medal: '/images/title.png',
        name: '常胜将军',
        description: '用户取得游戏第一名累计10次',
        status: AchievementStatus.DECORATED,
      }, {
        id: '2',
        medal: '/images/title.png',
        name: '超神之旅',
        description: '用户取得游戏第一名累计10次',
        status: AchievementStatus.NEWLY_ACQUIRED,
      }, {
        id: '3',
        medal: '/images/title.png',
        name: '高处不胜寒',
        description: '用户取得游戏第一名累计10次',
        status: AchievementStatus.ACQUIRED,
      }, {
        id: '4',
        medal: '/images/title.png',
        name: '常胜将军2',
        description: '免费使用，点击标签即可体验同款主题模版，让你的作品带上宫廷范，赶快；来试一下吧免费使用，点击标签即可体验同款主题模版。',
        status: AchievementStatus.NOT_ACQUIRED,
      }],
    }, {
      name: '对局成就',
      achievements: [{
        id: '5',
        medal: '/images/title.png',
        name: '常胜将军',
        description: '用户取得游戏第一名累计10次',
        status: AchievementStatus.ACQUIRED,
      }, {
        id: '6',
        medal: '/images/title.png',
        name: '超神之旅',
        description: '用户取得游戏第一名累计10次',
        status: AchievementStatus.ACQUIRED,
      }, {
        id: '7',
        medal: '/images/title.png',
        name: '高处不胜寒',
        description: '用户取得游戏第一名累计10次',
        status: AchievementStatus.ACQUIRED,
      }, {
        id: '8',
        medal: '/images/title.png',
        name: '常胜将军2',
        description: '免费使用，点击标签即可体验同款主题模版，让你的作品带上宫廷范，赶快；来试一下吧免费使用，点击标签即可体验同款主题模版。',
        status: AchievementStatus.NOT_ACQUIRED,
      }],
    }];
  }

  const { data: { data: { list = [] } = {} } = {} } = await client.get('/api/user/archive/all');
  return map(
    list,
    ({
      archives = [],
      group: { name },
    }) => ({
      name,
      achievements: map(
        archives,
        ({
          archive: {
            medalId,
            coverUrl: medal,
            name: achievementName,
            description,
          },
          status,
        }) => ({
          id: `${medalId}`,
          medal,
          name: achievementName,
          description,
          status,
        }),
      ),
    }),
  );
};

export const decorate = async function (id) {
  if (Meteor.isDevelopment) return;

  await client.post('/api/game/on/medal', { id: +id });
};
