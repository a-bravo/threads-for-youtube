<template>
  <li class="submission">
    <span :class="{ stickied: submission.stickied }">{{ submission.title }}</span>
    <span
      v-if="showFlair && submission.link_flair_text"
      class="subtext"
    >
      - {{ submission.link_flair_text }}
    </span>
    <br>
    <span class="details">
      <span class="comments-link">
        <a
          :class="YT_LINK_CLASS"
          :href="`${RT_BASE_URL}${submission.permalink}`"
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
          :href="`${RT_BASE_URL}/user/${submission.author}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ submission.author }}
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
          :href="`${RT_BASE_URL}/${submission.subreddit_name_prefixed}`"
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
import { timeAgo, pluralize } from '../util';
import { YT_LINK_CLASS, RT_BASE_URL } from '../constants';

export default {
  mixins: [authorStatusMixin],
  props: {
    submission: {
      type: Object,
      required: true,
    },
    showFlair: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      YT_LINK_CLASS,
      RT_BASE_URL,
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
.comments-link {
  font-weight: bold;
  a:visited {
    color: $rt-visited-purple;
  }
}
@include author-status;

</style>
