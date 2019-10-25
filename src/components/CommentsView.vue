<template>
  <div class="at-component">
    <div v-if="$root.$data.state.init" />
    <h3 v-else-if="$root.$data.state.submissions.loading">
      <spinner />
    </h3>
    <h3 v-else-if="$root.$data.state.submissions.error">
      Could not reach reddit.
      <a
        :class="YT_LINK_CLASS"
        @click="$emit('reload')"
      >
        Try again
      </a>
      later.
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
          :key="submission.data.id"
          :class="[
            { stickied: submission.data.stickied },
            { selected: submission === currentSubmission }
          ]"
          @click="currentSubmission = submission"
        >
          <div>
            <span id="subreddit">{{ submission.data.subreddit }}</span>
            <span class="num-comments">({{ submission.data.num_comments }})</span>
          </div>
        </li>

        <div
          v-if="visibleSubmissions.length < submissions.length"
          class="details"
        >
          {{ submissions.length - visibleSubmissions.length }} hidden
        </div>

        <more-button
          v-if="this.$root.$data.state.nextSubmission"
          :loading="$root.$data.state.submissions.moreLoading"
          @more="$emit('moreSubmissions')"
        >
          load more
        </more-button>
      </ul>

      <div class="comments-container">
        <comment-list
          :key="getCurrentSubmission().data.id"
          :submission="getCurrentSubmission().data"
          :options="options"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentList from './CommentList.vue';
import Spinner from './Spinner.vue';
import MoreButton from './MoreButton.vue';
import { YT_LINK_CLASS } from '../constants';

export default {
  components: {
    CommentList,
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
  data() {
    return {
      currentSubmission: null,
      YT_LINK_CLASS,
    };
  },
  computed: {
    visibleSubmissions() {
      if (this.options.POST_COMMENT_THRESHOLD === '') {
        return this.submissions;
      }
      return this.submissions.filter(
        submission => submission.data.num_comments > this.options.POST_COMMENT_THRESHOLD,
      );
    },
  },
  watch: {
    submissions(newVal, oldVal) {
      /* Only reset currentSubmission when submission's first object differs (loading
      new submissons), not when they are the same (loading more submissions) */
      if (newVal.length > 0 && oldVal.length > 0 && oldVal[0] === newVal[0]) {
        return;
      }

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
  flex: 1;
  padding-left: 10px;
}
</style>
