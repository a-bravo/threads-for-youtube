<template>
  <div>
    <div
      v-if="loading"
      class="details"
    >
      loading...
    </div>
    <a
      v-else
      class="more-button"
      :class="YT_LINK_CLASS"
      @click="$emit('more')"
    >
      <slot />
    </a>
  </div>
</template>

<script>
import { YT_LINK_CLASS } from '../constants';

export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      YT_LINK_CLASS,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.details {
  color: $rt-grey;
}
</style>
