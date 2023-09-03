<template>
  <li
    v-if="item.kind !== RT_MORE_OBJECT"
    :id="item.data.name"
    class="comment-container"
  >
    <span
      :class="['collapse-button', isOpen ? AT_LINK_CLASS : 'details' ]"
      @click="toggleComment()"
    >
      {{ isOpen ? '-' : '+' }}
    </span>
    <div class="comment">
      <span>
        <span class="author">
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
            <span class="points">
              {{ abbreviateNumber(item.data.score) }} {{ pluralize(item.data.score, 'point') }}
            </span>
            <span class="details">{{ timeAgo($root.$data.state.now, item.data.created_utc) }}</span>
            <span
              v-if="item.data.stickied"
              class="details stickied"
            >
              - stickied comment
            </span>
            <awards-shelf
              v-if="item.data.gilded"
              class="details"
              :gildings="item.data.gildings"
            />
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
          <a
            v-if="!item.data.depth && item.comments.length"
            @click="childrenHidden = !childrenHidden"
          >
            {{ childrenHidden ? "show" : "hide" }} child comments
          </a>
        </div>

        <ul
          v-if="!childrenHidden && item.comments.length"
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
  </li>

  <li
    v-else
    :id="item.data.name"
    class="more"
  >
    <more-button
      v-if="item.data.count"
      :loading="item.moreLoading"
      class="details"
      @more="$emit('moreComments', item.data)"
    >
      <span class="bold">load more comments</span>
      <span class="details">
        ({{ item.data.count }} {{ pluralize(item.data.count, 'reply', 'replies') }})
        <span v-if="item.moreError">
          [Could not reach reddit. Try again later.]
        </span>
      </span>
    </more-button>

    <a
      v-else
      :class="AT_LINK_CLASS"
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
import AwardsShelf from './AwardsShelf.vue';
import authorStatusMixin from '../mixins/authorStatusMixin';
import scrollToMixin from '../mixins/scrollToMixin';
import { timeAgo, pluralize, abbreviateNumber } from '../util';
import {
  AT_LINK_CLASS,
  RT_MORE_OBJECT,
  RT_BASE_URL,
} from '../constants';

export default {
  name: 'Comment',
  components: {
    MoreButton,
    AwardsShelf,
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
    hideChildren: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: !this.isLowScore() && !this.collapseModerator(),
      AT_LINK_CLASS,
      RT_MORE_OBJECT,
      RT_BASE_URL,
      childrenHidden: this.hideChildren,
    };
  },
  computed: {
    replies() {
      return this.item.comments.map((id) => this.$root.$data.state.comments[id]);
    },
  },
  watch: {
    hideChildren() {
      this.childrenHidden = this.hideChildren;
    },
  },
  methods: {
    timeAgo,
    pluralize,
    abbreviateNumber,
    isLowScore() {
      // no threshold?
      if (this.options.COMMENT_SCORE_THRESHOLD === '') {
        return false;
      }

      return this.item.data.score < this.options.COMMENT_SCORE_THRESHOLD;
    },
    collapseModerator() {
      return this.item.data.stickied && this.options.COLLAPSE_MODERATOR && this.item.data.author === 'AutoModerator';
    },
    fixCommentLinks(comment) {
      // make relative urls absolute (with reddit base url)
      const baseUrl = `<a href="${RT_BASE_URL}/`;
      const updatedComment = comment.replace(/<a\shref="\//g, baseUrl);

      // assign attributes to link tags
      const linkAttributes = `<a class="${AT_LINK_CLASS}" rel="noopener noreferrer" target="_blank"`;
      return updatedComment.replace(/<a/g, linkAttributes);
    },
    toggleComment() {
      this.isOpen = !this.isOpen;
      if (!this.isOpen) {
        this.scrollTo(this.item.data.name, true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.comment-container {
  margin-top: $at-comment-spacing;
  display: flex;
}
.comment {
  flex: 1;
  min-width: 0;
  padding-left: $at-comment-spacing;
}
.collapse-button {
  font-weight: 100;
  top: 0;
  left: 0;
  width: $at-collapse-width;
  font-size: 16px;
  text-align: center;
  line-height: 16px;
  background-color: $at-transparent-grey;
  cursor: pointer;
  &:hover {
    color: white !important;
    background-color: $yt-endpoint-blue;
  }
}
.links {
  a {
    color: $rt-grey;
    padding-right: $at-comment-spacing;
  }
}
.author, .points {
  font-size: $at-tiny-font;
  font-weight: bold;
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
