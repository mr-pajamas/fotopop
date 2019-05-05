<template>
  <div class="rank d-flex align-items-center">
    <img v-if="rank.place === 1" class="rank-number inflexible" alt="first" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAB0VBMVEUAAADytjbxszXysjXxsTTxsjPxtjbyszbwsTXxszPwszPxsjXztDT3tTr/xTr3zFH3x0DytTb0wDzxtTbxszX2xUX0xEn0wUXzvEDzujjxszXysTP63Grxszb50UX3zlj3ykf2yE/2wjzytTn0vTrxtDbxszTxtTTxtDj1yXDxtDbxszT9wlb////urC3940/xrzT/8oL/8oT78Nn/8Hz+5VX+5FH/76f/84b/8YD/7nT+5lfytDn+57z/8X7/73f+517+5ln9wVT+5FP+7G/+62r+6GH+51v8v1D6vUz3uUb+6mf+6WT8303vrjH+/Pf+55f+7Hv/8Hn/7XH9xVj9y1f9yVb90VT94VP+3oj+73v9z3n953T+62z+5mj9x2P71mD61Vr9xVX+76T+4o//7n7+6Hf91HT9ymT1vUT++/H+8+D+7s364K7+24H91nn9zHH83lz90ln71lT3xEv0vkT2t0H+9OL++uH+8dj+98z857/+9bf936n+7KL93J797p391In+7oT/74D+5WT732D95V/94Vz9wlj93FP62Enwtkf3zkP0tT3+9tv+98X/9LD92pj91nH73m39z23+4GT9xV393VH40Ev40Er2wUdMQn3VAAAALHRSTlMAE/dg+vj0qnlaRjUsHwj5+fbyuZL28vLw8O1f/n/++fn29vby7e25kvmSf77BWJ0AAANySURBVDjLfdVnWxpBEABgPKQoRIpd05smWRY0HCKc0pFeBEQUEey9966xRtN7fm3mzsuJFOfD8YH3md3Znd3l5UaFtLxRLG4sl1bw7owSfqVAWFcjk9XUCQWV/JKi8J6otDYdbmlv7+zU9mmTmdpS0b3CGZuJR6P6Flpqtdq+7m6TyS4jqgpklrx4Em5tbQHa2QkSoMlgMKSqGyS5soy4r9eDHE1PUhqMNdRkBmQkcnSfKLstHzxL6iHn2CrOitVUxP55+ETx4FbOZ2GQ71ZoQHncLqvV5fZQGP8d2NpxHCuy8kqIJIw+Bv8FPFbEhdUToDY+ORyLhISr/QXMU/8tgPEaA7Nx8KPD611uKGFp8xM6ZwAH3CgnBjtUqoMBn6+6il15IgzzpLDGxZHzc4QOZ9anVExMbWy9ut4L0SOofQUHONkfVKmm4Wd/e52WMzsH4cciZqalo7BKGLu5USEZUCa+qIIL7jOn01JKz5Zf29rSvorXOLlJp3qrQUwEZxBacZrNSj7QyjTsEQ5YWbgbVGXTzVn4nJrNvyuhPwXQS2nsQUwsgLpFO/bhs2zu6hVU8KRC6KVJbGUrAhWczqKH/fBZ6uqyCKW88jpoJYpCHN2+nGUpF7Eui7G+nMevgf7UeBA7gd1LjPNoj8VohLrEMujPm5VyQ7905FJkNJJyMVDoecws/8QgQq41F8qjQ0aSpo010PIapqr5cbbqvAmQJKlshLK03SaKoYm5IjRGkjYoSyqEczTJTCCUKELjNptOKIUtSJpMGbqs6HCoCL3Q6fyCCtjYDBxNWKyfiba28WghOmTT6a6amHYxGI5GQnttTOyFRr7n0rhOrX7OZ5rQbogk5xMhWo7MjU8g9AFjnEV71Wo/NCGESBaJ2GMIjbcNA4PIoXG1Wi0XsQcmZbcPgB0eQQWiB6SfYC+v19VAU1EUmisgh3qBPq36f7gbMgMOx49oYr6A/AXy4cuSmyvjxOHwpr5O5I9O53xPSLIuIsWx1+v1paOc4SqCiSrKbl1vikWvz+c7XcrCQ3FICTkVb3IvzWWf0wlHc3Ep1gMDx+IXNh0tHxJleVdxQ/UZTeEYWaA9SdhMoP6nLyUFLvgq4rHlWhpJG8lAOVzwxZ4N5Z9eRkJO/9VzeDbufozqlXK5sl4oaCr+GHFPHF8s5hd44v4BcAokogguJMwAAAAASUVORK5CYII=">
    <!--<img src="/images/first.png" v-if="rank.place === 1" class="rank-number inflexible">-->
    <img v-else-if="rank.place === 2" class="rank-number inflexible" alt="second" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAABGlBMVEUAAAC9vb27vLy9vb3Dw8PExMTAwMC9vb28vLy7u7u9vb28vLy/v7+9vb3FxcW+v7+8vb29vr67vb28vb3Gx8fAwcLLzMzIycnIyMi8vLy7u7u9v7/P0NC8vLzPz8/BwsO+wMC6u7v///+np6fGx8ikm4rIyMro6OjKy8zJycvp6enm5+ba29vi4uLW1tfPz9Dd3d3U1dbf3+DY2drMzc6/wMDk5OS5urrc3Nz7/Py2trbNzs/X19jR0tPExsa8vb3Q0NHBwcKsra3y8vK4ubmys7P49/fi4eD19fXl5ebX08zDw8S0sq2pqamvqqDu7u7r6+q0tLSqpZjr6+vS09PR0dPQy8LAuq+vrqy0r6SwsbGuppfc2dKro5M5vRIvAAAAIXRSTlMA9vhgE/LyqnlaRjUsHwj28rmS+vn5+Pjy7e1/+ZH597lpQCR/AAADQElEQVQ4y5WVCXOiMBTHBc9WW7X33SKHoNwCgohnrVq11e3d7n7/r7EvsVBkbWf2P0yYJD9e3hGSWFTbuc14JhPfzG3HflQifkUSyaOLi6NknryKJ74Ft9K7R7I1r2DNLfloN7213uI5cWaVy5VyJdD4jDhfYzl7fCCVI6qWpYPjbJTcIJpVJMlovM5oevbaMCzUr9jExip5mlfHMGE36JAa9rjav1fzpys287o1tqQ6AnqDxnW9ft0Y9Gi6Lo36lp4P2c0SomVZYg/AQZ0KVB/QvZsRTBDZIPZjzbIkD8B3DIbghTOSJEk79vOwcwjdGnKOisiUSqUqTB7ufGaesKWh2qNn1yuY8tB3SljOzehsWYv0ga7r1zS9JPnyjVNy+kOT4prjPiLv+w/WQRp7umvruuyvLoMlrBsGdbWS02rIum7vIm/jSTC6oN8x2SkFcvCAUwGPAUjGAS0qqipCCvHMPbL38ucZsQwe0KERVVUpwv4ka7bN0AMKCy3/zLIscvIWfS3J0Li2XSO3YzlCFMUFGMUy395ePthpG38yRRQHDQMIkYttpuDd6/kpYkF3VLUEurvzByeApDYhqlqtNhsE9WlMp9QckbfsW1AJQCCuzCG8V+rUGiFyyLLBYBuQw0wss9dsNpfpN03Uug62ifwIUED2MuBAsynPcFQCg5OO88Wyv0JbQZblZBzCgncPox0eKo/I+QfYDG2yLiAQVo7QNG2AHdAUaoJX/317aw+H2pf3gBA5KIGnaV0cga2hLAV6CFDjUfPIbSgs9+h5C/DdVVW+FFL11Ue9R48rou2S8p5qHVlUQdUwOvQDmzx5T6k4oAnS7XQ6nCIDaitsSD4K8wqZwFt7T1EUEyqt2uZ0DdpSOspeevnDkIaiuMCKHrVGJhgyyK3P3/DSNQy+TWnGGrLNu657ee7/3CeMYRhc2+XWkAJMMSeJryOD43leYLr/ri4YvMER2fDhJvCgSZScoFFh9YA7JRgBxJlhsLtciziNHpotAavVNdvgotmFPidwXAtsRpQ9yTMMhx4uJCZ/kl1zwO+Q+0xE++RO4ptrgyx0Wz7W6hbI9NYPl1GRLBRS+/upQoEsRi6j/7ji/gIJetM5J43JdwAAAABJRU5ErkJggg==">
    <!--<img src="/images/second.png" v-else-if="rank.place === 2" class="rank-number inflexible">-->
    <img v-else-if="rank.place === 3" class="rank-number inflexible" alt="third" src="data:image/png;base64,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">
    <!--<img src="/images/third.png" v-else-if="rank.place === 3" class="rank-number inflexible">-->
    <div v-else class="rank-number inflexible d-flex justify-content-center align-items-center"><span>{{ rank.place || '-' }}</span></div>
    <avatar :user="user" :show-vip="true" class="inflexible" />
    <span class="user-name flexible text-truncate">{{ user.name }}</span>
    <span class="score inflexible">{{ rank.score }}{{ unit || '' }}</span>
  </div>
</template>

<script>
  import Avatar from '../user/Avatar.vue';
  export default {
    name: "rank",
    components: { Avatar },
    props: ['user', 'rank', 'unit'],
  };
</script>

<style lang="scss" scoped>
  .rank {
    font-weight: 500;
    font-size: .875rem;
    color: #0b0b0b;

    .rank-number {
      height: 1.5rem;
      width: 1.5rem;
      font-size: .875rem;
      line-height: 1;
      background-color: rgb(216,216,216);
      font-weight: bolder;
      margin-right: .65rem;
      border-radius: 50%;
    }
    .avatar {
      width: 2.4rem;
    }

    .user-name {
      padding: 0 .5rem;
    }

    .score {
      font-weight: 600;
      font-size: 1rem;
    }
  }
</style>
