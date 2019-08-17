<template>
  <li class="submission">
    <span class="title">{{ submission.title }}</span>
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
  padding: 10px 30px 10px 30px;
  position: relative;
  line-height: 20px;
}
.meta {
  font-size: .75em;
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
</style>
