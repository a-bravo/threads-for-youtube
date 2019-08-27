<template>
  <div class="at-component">
    <h3 v-if="loading">
      Loading reddit posts...
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

export default {
  components: {
    CommentList,
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

<style lang="scss">
.comments-view {
  display: flex;
}
.submissions-sidebar {
  font-size: 1.1rem;
  min-width: 12ch;
  max-width: 12ch;
  margin: 0;
  padding: 0 10px 0 0;
  list-style-type: none;
  border-right: 1px solid #ccc;
}
.submissions-sidebar li {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.submissions-sidebar li:hover {
  overflow: visible;
  position: relative;
  z-index: 100;
  background: #FF0000;
}
.submissions-sidebar li:hover div {
  display: inline-block;
  background: #FF0000;
  color: white;
}
.submissions-sidebar li:hover .num-comments {
  display: inline-block;
}
.submissions-sidebar li.selected {
  background: #FF0000;
  color: white;
}
.num-comments {
  display: none;
}
.comments-container {
  padding-left: 10px;
}
.stickied {
  color: #228822;
}
</style>
