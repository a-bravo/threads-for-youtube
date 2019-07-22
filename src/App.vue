<template>
  <div id="at-app">
    {{ message }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Vue loaded',
    };
  },
};
</script>

<style>
#at-app {
  font-size: 15px;
  font-family: verdana, arial, helvetica, sans-serif;
  color: black;
}
</style>
