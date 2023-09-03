<template>
  <div>
    <div
      v-if="loading"
      class="subtext"
    >
      loading...
    </div>
    <a
      v-else
      class="more-button"
      :class="AT_LINK_CLASS"
      @click="$emit('more')"
    >
      <slot />
    </a>
  </div>
</template>

<script>
import { AT_LINK_CLASS } from '../constants';

export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      AT_LINK_CLASS,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
