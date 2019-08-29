<template>
  <div class="comment-list">
    <submission
      :key="submission.id"
      class="at-title"
      :submission="submission"
    />
    <ul class="replies">
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

export default {
  components: {
    Submission,
    Comment,
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
    };
  },
  mounted() {
    this.submission.fetch().then((submission) => {
      this.comments = submission.comments;
    });
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
