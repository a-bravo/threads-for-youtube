<template>
  <div class="spinner-container">
    <div class="vue-simple-spinner" />
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.vue-simple-spinner {
  transition: all 0.3s linear;
  margin: 0 auto;
  border-radius: 100%;
  border: 3px solid $yt-light-grey;
  border-top: 3px solid transparent;
  width: 24px;
  height: 24px;
  animation: vue-simple-spinner-spin 0.8s linear infinite;
}
.spinner-container {
  overflow: hidden;
}
@keyframes vue-simple-spinner-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
