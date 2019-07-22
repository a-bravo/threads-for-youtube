<template>
  <div id="options-app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'AlienTube Settings',
    };
  },
};
</script>

<style>
#options-app {
  color: red;
  font-style: italic;
}
</style>
