<template>
  <li class="comment">
    <span>
      <span class="author">
        <a
          :class="isOpen ? 'yt-simple-endpoint' : 'details'"
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
          v-if="item.author_flair_text"
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
      </div>

      <ul class="replies">
        <comment
          v-for="reply in item.replies"
          :key="reply.id"
          :item="reply"
        />
      </ul>
    </div>
  </li>
</template>

<script>
import authorStatusMixin from '../mixins/authorStatusMixin';
import { timeAgo, pluralize } from '../util/util';

export default {
  name: 'Comment',
  mixins: [authorStatusMixin],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOpen: true,
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
