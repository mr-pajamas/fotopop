<template>
  <div class="header-bar d-flex align-items-center justify-content-center">
    <h3>{{ name }}</h3>
    <div class="filler d-flex align-items-center justify-content-start">
      <button class="btn back-btn" @click="$emit('back')">
        <svg width="30" height="29" viewBox="0 0 30 29" xmlns="http://www.w3.org/2000/svg"><path d="M21 2L10 14.94 21 27" stroke="#FFF" stroke-width="4" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "header-bar",
    props: ['name'],
  }
</script>

<style lang="scss" scoped>
  .header-bar {
    height: 3rem;
    position: relative;
    h3 {
      margin: 0;
      font-weight: 600;
      line-height: 1;
      font-size: 1rem;
    }

    .back-btn {
      padding: .2rem;
      margin-left: .2rem;
      img, svg {
        height: 1.2rem;
        width: auto;
      }
    }
  }
</style>
