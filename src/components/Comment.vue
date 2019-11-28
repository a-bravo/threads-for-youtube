<template>
  <li
    :id="item.data.name"
    :class="item.kind !== RT_MORE_OBJECT ? 'comment' : 'more'"
  >
    <div v-if="item.kind !== RT_MORE_OBJECT">
      <span>
        <span class="author">
          <a
            :class="isOpen ? YT_LINK_CLASS : 'details'"
            @click="isOpen = !isOpen"
          >
            [{{ isOpen ? '-' : '+' }}]
          </a>
          <a
            :class="isOpen ? authorClass(
              item.data.distinguished,
              item.data.is_submitter
            ) : 'collapsed'"
            :href="`${RT_BASE_URL}/user/${item.data.author}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.data.author }}
          </a>
          <span
            v-if="item.data.is_submitter || item.data.distinguished"
            :class="{ collapsed: !isOpen }"
          >
            {{ getAuthorStatus(item.data.distinguished, item.data.is_submitter) }}
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
              v-if="options.SHOW_USER_FLAIR && item.data.author_flair_text"
              v-show="isOpen"
              class="details"
            >
              - {{ item.data.author_flair_text }}
            </span>
            <span class="points">{{ pluralize(item.data.score, 'point') }}</span>
            <span class="details">{{ timeAgo(item.data.created_utc) }} ago</span>
            <span
              v-if="item.data.stickied"
              class="details stickied"
            >
              - stickied comment
            </span>
          </span>
        </span>
      </span>

      <div v-show="isOpen">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="body"
          v-html="fixCommentLinks(item.data.body_html)"
        />
        <!-- eslint-enable -->
        <div class="details links bold">
          <a
            :href="`${RT_BASE_URL}${item.data.permalink}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            permalink
          </a>
          <a
            v-if="item.data.depth"
            @click="scrollTo(item.data.parent_id)"
          >
            parent
          </a>
        </div>

        <ul
          v-if="item.comments.length"
          class="replies"
        >
          <comment
            v-for="reply in replies"
            :key="reply.data.id"
            :item="reply"
            :options="options"
            @moreComments="(more) => $emit('moreComments', more)"
          />
        </ul>
      </div>
    </div>

    <more-button
      v-else-if="item.data.count"
      :loading="item.moreLoading"
      class="details"
      @more="$emit('moreComments', item.data)"
    >
      <span class="bold">load more comments</span>
      <span class="details">
        ({{ pluralize(item.data.count, 'reply', 'replies') }})
        <span v-if="item.moreError">
          [Could not reach reddit. Try again later.]
        </span>
      </span>
    </more-button>

    <a
      v-else
      :class="YT_LINK_CLASS"
      :href="`${RT_BASE_URL}${$parent.item.data.permalink}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      continue this thread on reddit -->
    </a>
  </li>
</template>

<script>
import MoreButton from './MoreButton.vue';
import authorStatusMixin from '../mixins/authorStatusMixin';
import scrollToMixin from '../mixins/scrollToMixin';
import { timeAgo, pluralize } from '../util';
import {
  YT_LINK_CLASS,
  RT_MORE_OBJECT,
  RT_BASE_URL,
} from '../constants';

export default {
  name: 'Comment',
  components: {
    MoreButton,
  },
  mixins: [authorStatusMixin, scrollToMixin],
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
      RT_MORE_OBJECT,
      RT_BASE_URL,
    };
  },
  computed: {
    replies() {
      return this.item.comments.map(id => this.$root.$data.state.comments[id]);
    },
  },
  methods: {
    timeAgo,
    pluralize,
    isLowScore() {
      // no threshold?
      if (this.options.COMMENT_SCORE_THRESHOLD === '') {
        return false;
      }

      return this.item.data.score < this.options.COMMENT_SCORE_THRESHOLD;
    },
    fixCommentLinks(comment) {
      // make relative urls absolute (with reddit base url)
      const baseUrl = `<a href="${RT_BASE_URL}/`;
      const updatedComment = comment.replace(/<a\shref="\//g, baseUrl);

      // assign attributes to link tags
      const linkAttributes = `<a class="${YT_LINK_CLASS}" rel="noopener noreferrer" target="_blank"`;
      return updatedComment.replace(/<a/g, linkAttributes);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.links {
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
    .comment, .more {
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
.bold {
  font-weight: bold;
}
</style>
