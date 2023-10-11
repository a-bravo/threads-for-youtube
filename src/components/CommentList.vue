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
    >
      <a
        @click="hideAllChildComments = !hideAllChildComments"
      >
        {{ hideAllChildComments ? "show" : "hide" }} all child comments
      </a>
      <a
        @click="!moreLoading && $root.$data.reloadComments(
          submission.id,
          submission.name,
          options.NUM_COMMENTS,
          sort
        )"
      >
        reload comments
      </a>
    </submission>
    <spinner v-if="$root.$data.state.submissions[submission.name].loading" />
    <div v-else-if="$root.$data.state.submissions[submission.name].error">
      Could not reach Reddit.
      <a
        :class="AT_LINK_CLASS"
        @click="loadComments"
      >
        Try again
      </a>
      later.
    </div>
    <div v-else-if="!comments.length">
      there doesn't seem to be anything here
    </div>
    <ul
      v-else
      class="replies"
    >
      <div id="sort-by">
        <span class="subtext">sorted by:</span>
        <select
          v-model="sort"
          :disabled="moreLoading"
        >
          <option
            v-for="s in sorts"
            :key="s.value"
            :value="s.value"
          >
            {{ s.text }}
            <span v-if="!options.IGNORE_SUGGESTED_SORT && s.value === submission.suggested_sort">
              (suggested)
            </span>
          </option>
        </select>
      </div>

      <comment
        v-for="comment in comments"
        :key="comment.data.id"
        :item="comment"
        :options="options"
        :hide-children="hideAllChildComments"
        @moreComments="moreComments"
      />
    </ul>
  </div>
</template>

<script>
import Submission from './Submission.vue';
import Comment from './Comment.vue';
import Spinner from './Spinner.vue';
import { AT_LINK_CLASS, COMMENT_SORTS } from '../constants';

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
      AT_LINK_CLASS,
      sort: this.getSort(),
      sorts: COMMENT_SORTS,
      moreLoading: false,
      hideAllChildComments: this.options.HIDE_CHILD_COMMENTS,
    };
  },
  computed: {
    comments() {
      return this.$root.$data.state.submissions[this.submission.name].comments.map(
        (id) => this.$root.$data.state.comments[id],
      );
    },
  },
  watch: {
    sort() {
      this.$root.$data.setSortAction(this.submission.name, this.sort);
      this.$root.$data.reloadComments(
        this.submission.id,
        this.submission.name,
        this.options.NUM_COMMENTS,
        this.sort,
      );
    },
  },
  mounted() {
    this.loadComments();
  },
  methods: {
    getSort() {
      if (!this.$root.$data.state.submissions[this.submission.name].sort) {
        this.$root.$data.setSortAction(
          this.submission.name,
          this.options.IGNORE_SUGGESTED_SORT
            ? this.options.DEFAULT_COMMENTS_SORT
            : this.submission.suggested_sort || this.options.DEFAULT_COMMENTS_SORT,
        );
      }

      return this.$root.$data.state.submissions[this.submission.name].sort;
    },
    loadComments() {
      this.$root.$data.loadComments(
        this.submission.id,
        this.submission.name,
        this.options.NUM_COMMENTS,
        this.sort,
      );
    },
    moreComments(more) {
      this.moreLoading = true;
      this.$root.$data.loadMoreComments(this.submission.name, more, this.sort)
        .finally(() => { this.moreLoading = false; });
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
#sort-by {
  margin-bottom: $at-spacing;
  border-top: 1px dotted $rt-grey;
}
</style>
