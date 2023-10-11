<template>
  <button
    id="to-top-button"
    @click="scrollTo(destinationId)"
  >
    <div />
  </button>
</template>

<script>
import scrollToMixin from '../mixins/scrollToMixin';

export default {
  mixins: [scrollToMixin],
  props: {
    destinationId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

#to-top-button {
  z-index: $at-high-z;
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: $at-floating-btn-diameter;
  height: $at-floating-btn-diameter;
  background-color: $at-dark-grey;
  text-indent: -9999px;
  border-radius: 60px;
  border: none;
  &:hover {
    background-color: $at-light-grey;
  }
  div {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -8px;
    margin-top: -12px;
    height: 0;
    width: 0;
    border: 8px solid transparent;
    border-bottom-color: #ffffff;
  }
}
</style>
