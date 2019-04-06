import times from 'lodash/times';

const report = {
  roomId: 'xxxx',
  session: 1, // starts from 1
  offlineUsers: ['uid1', 'uid2'],
  roundsWinners: [
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
    ['uid2', 'uid3', 'uid4', 'bot1'],
  ],
};

const response = {
  questions: [{
    id: 'xxxxxx',
    type: 1,
    audio: 'http://xxx.com/xxx.mp3',
    choices: ['你', '我', '中', '发', '白', '爱', '说',
      '笑', '哭', '瓷', '奇', '花', '草', '树',
      '叶', '青', '东', '南', '西', '北', '快'],
    hints: ['提示1', '提示2', '提示3'],
    answerHash: '135a2dc49169a5513bf8f42658713dd6', // md5
    answerFormat: '. .... ...', // I love you
  }, {
    id: 'xxxxxx',
    audio: 'http://xxx.com/xxx.mp3',
    choices: ['你', '我', '中', '发', '白', '爱', '说',
      '笑', '哭', '瓷', '奇', '花', '草', '树',
      '叶', '青', '东', '南', '西', '北', '快'],
    hints: ['提示1', '提示2', '提示3'],
    answerHash: '135a2dc49169a5513bf8f42658713dd6', // md5
    answerFormat: '. .... ...', // I love you
  }, {
    id: 'xxxxxx',
    audio: 'http://xxx.com/xxx.mp3',
    choices: ['你', '我', '中', '发', '白', '爱', '说',
      '笑', '哭', '瓷', '奇', '花', '草', '树',
      '叶', '青', '东', '南', '西', '北', '快'],
    hints: ['提示1', '提示2', '提示3'],
    answerHash: '135a2dc49169a5513bf8f42658713dd6', // md5
    answerFormat: '. .... ...', // I love you
  }], // 10条
};
