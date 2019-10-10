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
    <spinner v-if="$root.$data.state.submissions[submission.name].loading" />
    <div v-else-if="$root.$data.state.submissions[submission.name].error">
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
        :key="comment.data.id"
        :item="comment"
        :options="options"
        @moreComments="moreComments"
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
  computed: {
    comments() {
      return this.$root.$data.state.submissions[this.submission.name].comments.map(
        id => this.$root.$data.state.comments[id],
      );
    },
  },
  mounted() {
    this.$root.$data.loadComments(this.submission.id, this.submission.name);
  },
  methods: {
    moreComments(more) {
      this.$root.$data.loadMoreComments(this.submission.name, more);
    },
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
