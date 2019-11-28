<template>
  <span v-if="count">
    <img
      class="award-img"
      :src="$browser.runtime.getURL(imagePath)"
    >
    <span v-if="count > 1">
      {{ count }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    imagePath: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.award-img {
  max-width: 12px;
  max-height: 12px;
  vertical-align: -2px;
}
</style>
