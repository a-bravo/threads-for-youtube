<template>
  <div class="at-component">
    <h3 v-if="$root.$data.state.submissions.loading">
      <spinner />
    </h3>
    <h3 v-else-if="$root.$data.state.submissions.error">
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
        v-for="submission in submissions"
        :key="submission.id"
        :show-flair="options.SHOW_POST_FLAIR"
        :submission="submission.data"
      />

      <more-button
        v-if="this.$root.$data.state.nextSubmission"
        :loading="$root.$data.state.submissions.moreLoading"
        @more="$emit('moreSubmissions')"
      >
        load more posts
        <span v-if="$root.$data.state.submissions.moreError">
          (Could not reach reddit. Try again later.)
        </span>
      </more-button>
    </ul>
  </div>
</template>

<script>
import Submission from './Submission.vue';
import Spinner from './Spinner.vue';
import MoreButton from './MoreButton.vue';

export default {
  components: {
    Submission,
    Spinner,
    MoreButton,
  },
  props: {
    submissions: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixins.scss";
@import "../styles/variables.scss";

.submission-list {
  @include reset-list;
  max-width: 750px;
}
</style>
