<template>
  <div class="at-component">
    <h3 v-if="loading">
      <spinner />
    </h3>
    <h3 v-else-if="apiError">
      Could not reach reddit. Try again later.
    </h3>
    <h3 v-else-if="!visibleSubmissions.length">
      No comments.
    </h3>
    <div
      v-else
      class="comments-view"
    >
      <ul class="submissions-sidebar">
        <li
          v-for="submission in visibleSubmissions"
          :key="submission.id"
          :class="[
            { stickied: submission.stickied },
            { selected: submission === currentSubmission }
          ]"
          @click="currentSubmission = submission"
        >
          <div>
            <span id="subreddit">{{ submission.subreddit.display_name }}</span>
            <span class="num-comments">({{ submission.num_comments }})</span>
          </div>
        </li>
      </ul>

      <div class="comments-container">
        <comment-list
          :key="getCurrentSubmission().id"
          :submission="getCurrentSubmission()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentList from './CommentList.vue';
import Spinner from './Spinner.vue';

export default {
  components: {
    CommentList,
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
      currentSubmission: null,
    };
  },
  computed: {
    visibleSubmissions() {
      return this.submissions.filter(submission => submission.num_comments >= 1);
    },
  },
  watch: {
    submissions() {
      this.currentSubmission = null;
    },
  },
  methods: {
    getCurrentSubmission() {
      this.currentSubmission = this.currentSubmission || this.visibleSubmissions[0];
      return this.currentSubmission;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.comments-view {
  display: flex;
}
.submissions-sidebar {
  font-size: $at-small-font;
  min-width: 12ch;
  max-width: 12ch;
  @include reset-list;
  padding-right: 10px;
  border-right: 1px solid $yt-light-grey;
  li {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      overflow: visible;
      position: relative;
      z-index: 100;
      background: $yt-red;
      div {
        display: inline-block;
        background: $yt-red;
        color: white !important;
      }
      .num-comments {
        display: inline-block;
      }
    }
    &.selected {
      background: $yt-red;
      color: white !important;
    }
  }
}
.num-comments {
  display: none;
}
.comments-container {
  min-width: 0;
  padding-left: 10px;
}
</style>
