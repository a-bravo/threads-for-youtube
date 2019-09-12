<template>
  <div class="comment-list">
    <div class="details">
      <span v-if="submission.archived">
        Archived.
      </span>
      <span v-if="submission.locked">
        Locked.
      </span>
    </div>
    <submission
      :key="submission.id"
      class="at-title"
      :submission="submission"
      :show-flair="options.SHOW_POST_FLAIR"
    />
    <spinner v-if="loading" />
    <div v-else-if="apiError">
      Could not reach reddit. Try again later.
    </div>
    <div v-else-if="!comments.length">
      there doesn't seem to be anything here
    </div>
    <ul
      v-else
      class="replies"
    >
      <comment
        v-for="comment in comments"
        :key="comment.id"
        :item="comment"
        :options="options"
      />
    </ul>
  </div>
</template>

<script>
import Submission from './Submission.vue';
import Comment from './Comment.vue';
import Spinner from './Spinner.vue';

export default {
  components: {
    Submission,
    Comment,
    Spinner,
  },
  props: {
    submission: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: null,
      loading: true,
      apiError: false,
    };
  },
  mounted() {
    this.submission.fetch().then((submission) => {
      this.comments = submission.comments;
      this.apiError = false;
    })
      .catch(() => {
        this.apiError = true;
      })
      .finally(() => { this.loading = false; });
  },
};
</script>

<style lang="scss">
@import "../styles/mixins.scss";

/* Global styles for component descendents  */
.comment-list {
  .replies {
    @include reset-list;
  }
}
</style>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.at-title {
  font-size: $at-large-font;
}
.comment-list {
  @include reset-list;
}
.details {
  color: $rt-grey;
  font-size: $at-tiny-font;
}
</style>
