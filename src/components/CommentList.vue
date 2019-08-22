<template>
  <div class="comment-list">
    <submission
      :key="submission.id"
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
.replies, .comment-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
