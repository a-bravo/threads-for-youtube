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
          class="yt-simple-endpoint"
          :href="`https://old.reddit.com${submission.permalink}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ submission.num_comments }} comments
        </a>
      </span>
      <span class="time">submitted {{ timeAgo(submission.created_utc) }} ago</span>
      <span class="subreddit">
        to
        <a
          class="yt-simple-endpoint"
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
import timeAgo from '../util/time';

export default {
  props: {
    submission: {
      type: Object,
      required: true,
    },
  },
  methods: {
    timeAgo,
  },
};
</script>

<style lang="scss">
.submission {
  padding-bottom: 20px;
  position: relative;
  line-height: 20px;
}
.meta-title {
  color: #888;
}
.meta {
  font-size: .95rem;
  color: #888;
  .comments-link {
    font-weight: bold;
  }
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.stickied {
  color: #228822;
}
</style>
