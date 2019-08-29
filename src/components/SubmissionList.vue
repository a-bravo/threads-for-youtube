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
        v-for="submission in visibleSubmissions.slice(0, maxIndex)"
        :key="submission.id"
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
          More Threads
        </button>
        <div v-else>
          loading...
        </div>
      </li>

      <li
        v-else-if="hiddenSubmissions.length"
        class="submission"
      >
        <div class="meta">
          {{ hiddenSubmissions.length }} empty comment thread(s) hidden.
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
  },
  data() {
    return {
      maxIndex: 10,
      buttonPressed: false,
    };
  },
  computed: {
    hiddenSubmissions() {
      return this.submissions.filter(submission => submission.num_comments < 1);
    },
    visibleSubmissions() {
      return this.submissions.filter(submission => submission.num_comments >= 1);
    },
    isFinished() {
      return this.maxIndex >= this.visibleSubmissions.length;
    },
  },
  watch: {
    submissions() {
      this.maxIndex = 10;
    },
  },
  methods: {
    fetchMore() {
      this.buttonPressed = true;
      this.maxIndex += 10;
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
