<template>
  <div class="at-component">
    <h3 v-if="loading">
      <spinner />
    </h3>
    <h3 v-else-if="apiError">
      Could not reach reddit. Try again later.
    </h3>
    <h3 v-else-if="!submissions.length">
      No posts.
    </h3>
    <ul
      v-else
      class="submission-list"
    >
      <submission
        v-for="submission in submissions.slice(0, maxIndex)"
        :key="submission.id"
        :show-flair="options.SHOW_POST_FLAIR"
        :submission="submission"
      />

      <li
        v-if="!isFinished"
        class="submission"
      >
        <button
          v-if="!buttonPressed"
          id="more-threads-button"
          @click="fetchMore"
        >
          view more
        </button>
        <div v-else>
          loading...
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Submission from './Submission.vue';
import Spinner from './Spinner.vue';

export default {
  components: {
    Submission,
    Spinner,
  },
  props: {
    submissions: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    apiError: {
      type: Boolean,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      maxIndex: this.options.NUM_POSTS,
      buttonPressed: false,
    };
  },
  computed: {
    isFinished() {
      return this.maxIndex >= this.submissions.length;
    },
  },
  watch: {
    submissions() {
      this.maxIndex = this.options.NUM_POSTS;
    },
  },
  methods: {
    fetchMore() {
      this.buttonPressed = true;
      this.maxIndex += this.options.NUM_POSTS;
      this.buttonPressed = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixins.scss";

.submission-list {
  @include reset-list;
  max-width: 750px;
}
</style>
