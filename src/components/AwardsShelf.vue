<template>
  <span class="awards">
    <AwardsShelfItem
      :count="gildings.gid_3"
      image-path="images/platinum_48.png"
    />

    <AwardsShelfItem
      :count="gildings.gid_2"
      image-path="images/gold_48.png"
    />

    <AwardsShelfItem
      :count="gildings.gid_1"
      image-path="images/silver_48.png"
    />
  </span>
</template>

<script>
import AwardsShelfItem from './AwardsShelfItem.vue';

export default {
  components: {
    AwardsShelfItem,
  },
  props: {
    gildings: {
      type: Object,
      required: true,
    },
  },
};
</script>
