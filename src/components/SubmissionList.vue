<template>
  <div class="at-component">
    <h3 v-if="$root.$data.state.init">
      Scroll to load...
    </h3>
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
    <div v-else-if="!submissions.length && !numFilteredSubmissions">
      <div
        v-if="selectTime !== defaultTime"
        class="sort-by"
      >
        <span class="subtext">posts from:</span>
        <select-input
          v-model="selectTime"
          :options="times"
        />
      </div>

      <h3>No posts.</h3>
    </div>
    <ul
      v-else
      class="submission-list"
    >
      <div class="sort-by">
        <span class="subtext">sorted by:</span>
        <select-input
          v-model="selectSort"
          :options="sorts"
        />

        <span class="subtext">from:</span>
        <select-input
          v-model="selectTime"
          :options="times"
        />
      </div>

      <submission
        v-for="submission in submissions"
        :key="submission.id"
        :show-flair="options.SHOW_POST_FLAIR"
        :submission="submission.data"
      />

      <div
        v-if="numFilteredSubmissions"
        class="details pad-bottom"
      >
        {{ numFilteredSubmissions }} {{ pluralize(numFilteredSubmissions, 'post') }} filtered
      </div>

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
import SelectInput from './SelectInput.vue';
import MoreButton from './MoreButton.vue';
import { pluralize } from '../util';
import {
  YT_LINK_CLASS,
  POST_SORTS,
  POST_TIMES,
  DEFAULT_POSTS_TIME,
} from '../constants';

export default {
  components: {
    Submission,
    Spinner,
    SelectInput,
    MoreButton,
  },
  props: {
    submissions: {
      type: Array,
      required: true,
    },
    numFilteredSubmissions: {
      type: Number,
      required: true,
    },
    sort: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      YT_LINK_CLASS,
      sorts: POST_SORTS,
      selectSort: this.sort,
      times: POST_TIMES,
      selectTime: this.time,
      defaultTime: DEFAULT_POSTS_TIME,
    };
  },
  watch: {
    sort() {
      this.selectSort = this.sort;
    },
    selectSort() {
      this.$emit('sortChanged', this.selectSort);
    },
    time() {
      this.selectTime = this.time;
    },
    selectTime() {
      this.$emit('timeChanged', this.selectTime);
    },
  },
  methods: {
    pluralize,
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
.pad-bottom {
  padding-bottom: $at-spacing;
}
.sort-by {
  width: 100%;
  margin-bottom: $at-spacing;
}
</style>
