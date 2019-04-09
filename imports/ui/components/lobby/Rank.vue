<template>
  <div class="rank d-flex align-items-center">
    <div class="rounded-circle rank-number inflexible d-flex justify-content-center align-items-center"><span>4</span></div>
    <avatar :user="user" :show-vip="true" class="inflexible" />
    <span class="user-name flexible">{{ user.name }}</span>
    <span class="score inflexible">48240</span>
  </div>
</template>

<script>
  import Avatar from '../user/Avatar';
  export default {
    name: "rank",
    components: { Avatar },
    props: ['user'],
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
