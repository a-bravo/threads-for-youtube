<template>
  <li
    :id="item.name"
    class="comment"
  >
    <span>
      <span class="author">
        <a
          :class="isOpen ? YT_LINK_CLASS : 'details'"
          @click="isOpen = !isOpen"
        >
          [{{ isOpen ? '-' : '+' }}]
        </a>
        <a
          :class="isOpen ? authorClass(item.distinguished, item.is_submitter) : 'collapsed'"
          :href="`https://old.reddit.com/user/${item.author.name}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ item.author.name }}
        </a>
        <span
          v-if="item.is_submitter || item.distinguished"
          :class="{ collapsed: !isOpen }"
        >
          {{ getAuthorStatus(item.distinguished, item.is_submitter) }}
        </span>
      </span>
      <span :class="{ collapsed: !isOpen }">
        <span
          v-if="!isOpen && isLowScore()"
          class="details"
        >
          comment score below threshold
        </span>
        <span v-else>
          <span
            v-if="options.SHOW_USER_FLAIR && item.author_flair_text"
            v-show="isOpen"
            class="details"
          >
            - {{ item.author_flair_text }}
          </span>
          <span class="points">{{ pluralize(item.score, 'point') }}</span>
          <span class="details">{{ timeAgo(item.created_utc) }} ago</span>
          <span
            v-if="item.stickied"
            class="details stickied"
          >
            - stickied comment
          </span>
        </span>
      </span>
    </span>

    <div v-show="isOpen">
      <div class="body">
        {{ item.body }}
      </div>
      <div class="links">
        <a
          :href="`https://old.reddit.com${item.permalink}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          permalink
        </a>
        <a
          v-if="item.depth"
          @click="scrollTo(item.parent_id)"
        >
          parent
        </a>
      </div>

      <ul class="replies">
        <comment
          v-for="reply in item.replies"
          :key="reply.id"
          :item="reply"
          :options="options"
        />
      </ul>
    </div>
  </li>
</template>

<script>
import authorStatusMixin from '../mixins/authorStatusMixin';
import { timeAgo, pluralize } from '../util';
import { YT_NAVBAR_ID, YT_LINK_CLASS } from '../constants';

export default {
  name: 'Comment',
  mixins: [authorStatusMixin],
  props: {
    item: {
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
      isOpen: !this.isLowScore(),
      YT_LINK_CLASS,
    };
  },
  methods: {
    timeAgo,
    pluralize,
    isLowScore() {
      // no threshold?
      if (this.options.COMMENT_SCORE_THRESHOLD === '') {
        return false;
      }

      return this.item.score < this.options.COMMENT_SCORE_THRESHOLD;
    },
    scrollTo(id) {
      // scroll to element with id, accounting for YT navbar
      const target = document.getElementById(id);
      const navHeight = document.getElementById(YT_NAVBAR_ID).offsetHeight;

      window.scroll(0, target.offsetTop - navHeight);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.links, .details {
  font-size: $at-tiny-font;
  color: $rt-grey;
  a {
    color: $rt-grey;
  }
}
.author, .points {
  font-size: $at-tiny-font;
  font-weight: bold;
}
.replies {
  .replies {
    border-left: 1px dotted $rt-border-color;
    .comment {
      margin-left: 1.8rem;
    }
  }
}
@include author-status;
.collapsed {
  color: $rt-grey !important;
  font-style: italic !important;
}
.body {
  max-width: 60em;
}
</style>
