<template>
  <div class="empty-slot">
    <aspect-ratio-box class="w-100" :ratio="1">
      <div class="w-100 h-100 d-flex align-items-center justify-content-center">
        <span class="d-block">空</span>
      </div>
    </aspect-ratio-box>
  </div>
</template>

<script>
  import AspectRatioBox from '../general/AspectRatioBox2.vue';
  export default {
    name: 'empty-slot',
    components: { AspectRatioBox },
  }
</script>

<style lang="scss" scoped>
  .empty-slot {
    background-color: rgba(255,255,255,.1);
    border-radius: 50%;

    span {
      color: #8b8aaf;
      font-size: 1.2rem;
    }
  }
</style>
