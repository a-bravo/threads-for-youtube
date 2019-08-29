<template>
  <div class="comment-list">
    <submission
      :key="submission.id"
      class="at-title"
      :submission="submission"
    />
    <spinner v-if="loading" />
    <ul
      v-else
      class="replies"
    >
      <comment
        v-for="comment in comments"
        :key="comment.id"
        :item="comment"
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
  },
  data() {
    return {
      comments: null,
      loading: true,
    };
  },
  mounted() {
    this.submission.fetch().then((submission) => {
      this.comments = submission.comments;
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
</style>
