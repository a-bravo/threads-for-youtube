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
    <h3 v-else-if="!submissions.length && !numFilteredSubmissions">
      No posts.
    </h3>
    <ul
      v-else
      class="submission-list"
    >
      <div id="sort-by">
        <span class="subtext">sorted by:</span>
        <select v-model="selectSort">
          <option
            v-for="s in sorts"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>
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
        {{ pluralize(numFilteredSubmissions, 'post') }} filtered
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
import MoreButton from './MoreButton.vue';
import { pluralize } from '../util';
import { YT_LINK_CLASS, POST_SORTS } from '../constants';

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
    numFilteredSubmissions: {
      type: Number,
      required: true,
    },
    sort: {
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
    };
  },
  watch: {
    sort() {
      this.selectSort = this.sort;
    },
    selectSort() {
      this.$emit('sortChanged', this.selectSort);
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
#sort-by {
  width: 100%;
  margin-bottom: $at-spacing;
}
</style>
