<template>
  <li class="submission">
    <span :class="{ stickied: submission.stickied }">{{ submission.title }}</span>
    <span
      v-if="submission.link_flair_text"
      class="meta-title"
    >
      - {{ submission.link_flair_text }}
    </span>
    <br>
    <span class="meta">
      <span class="comments-link">
        <a
          :class="YT_LINK_CLASS"
          :href="`https://old.reddit.com${submission.permalink}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ pluralize(submission.num_comments, 'comment') }}
        </a>
      </span>
      <span class="time">submitted {{ timeAgo(submission.created_utc) }} ago</span>
      <span>
        by
        <a
          :class="authorClass(submission.distinguished)"
          :href="`https://old.reddit.com/user/${submission.author.name}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ submission.author.name }}
        </a>
        <span
          v-if="submission.distinguished"
        >
          {{ getAuthorStatus(submission.distinguished) }}
        </span>
      </span>
      <span class="subreddit">
        to
        <a
          :class="YT_LINK_CLASS"
          :href="`https://old.reddit.com/${submission.subreddit_name_prefixed}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ submission.subreddit_name_prefixed }}
        </a>
      </span>
    </span>
  </li>
</template>

<script>
import authorStatusMixin from '../mixins/authorStatusMixin';
import { timeAgo, pluralize } from '../util/util';
import { YT_LINK_CLASS } from '../constants';

export default {
  mixins: [authorStatusMixin],
  props: {
    submission: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      YT_LINK_CLASS,
    };
  },
  methods: {
    timeAgo,
    pluralize,
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.submission {
  padding-bottom: $at-spacing;
  position: relative;
  line-height: 20px;
}
.meta-title {
  color: $rt-grey;
}
.meta {
  font-size: $at-tiny-font;
  color: $rt-grey;
  .comments-link {
    font-weight: bold;
    a:visited {
      color: $rt-visited-purple;
    }
  }
}
@include author-status;

</style>
