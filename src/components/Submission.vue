<template>
  <li class="submission">
    <span :class="{ stickied: submission.stickied }">{{ submission.title }}</span>
    <span
      v-if="showFlair && submission.link_flair_text"
      class="subtext"
    >
      - {{ submission.link_flair_text }}
    </span>
    <span v-if="timestamp">
      <a
        :class="YT_LINK_CLASS"
        @click="goToTimeStamp()"
      >
        (@{{ toHHMMSS(timestamp) }})
      </a>
    </span>
    <br>
    <span class="details">
      <span
        v-if="!slotPassed"
        class="comments-link"
      >
        <a
          :class="YT_LINK_CLASS"
          :href="`${RT_BASE_URL}${submission.permalink}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ submission.num_comments }} {{ pluralize(submission.num_comments, 'comment') }}
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
      <awards-shelf
        v-if="submission.gilded"
        :gildings="submission.gildings"
      />
    </span>
    <div
      v-if="slotPassed"
      class="details links"
    >
      <span class="comments-link bold">
        <a
          :class="YT_LINK_CLASS"
          :href="`${RT_BASE_URL}${submission.permalink}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ submission.num_comments }} {{ pluralize(submission.num_comments, 'comment') }}
        </a>
      </span>
      <span><slot /></span>
    </div>
  </li>
</template>

<script>
import AwardsShelf from './AwardsShelf.vue';
import authorStatusMixin from '../mixins/authorStatusMixin';
import scrollToMixin from '../mixins/scrollToMixin';
import {
  timeAgo,
  pluralize,
  toHHMMSS,
  parseFormattedTime,
} from '../util';
import {
  YT_LINK_CLASS,
  RT_BASE_URL,
  YT_VIDEO_TAG,
  YT_VIDEO_ID,
} from '../constants';

export default {
  components: {
    AwardsShelf,
  },
  mixins: [authorStatusMixin, scrollToMixin],
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
      timestamp: this.setTimeStamp(),
    };
  },
  computed: {
    slotPassed() {
      return !!this.$slots.default;
    },
  },
  methods: {
    timeAgo,
    pluralize,
    toHHMMSS,
    setTimeStamp() {
      // if the video does not exist, ignore the timestamp
      if (!document.querySelector(YT_VIDEO_TAG)) {
        return null;
      }

      // get timestamp from url
      const url = new URL(this.submission.url);
      const time = url.searchParams.get('t');

      return time ? parseFormattedTime(time) : null;
    },
    goToTimeStamp() {
      const player = document.querySelector(YT_VIDEO_TAG);
      player.currentTime = this.timestamp;
      player.play();
      this.scrollTo(YT_VIDEO_ID);
    },
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
.links {
  span {
    padding-right: $at-comment-spacing;
  }
  font-weight: bold;
}
@include author-status;

</style>
