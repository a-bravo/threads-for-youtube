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
          :class="isOpen ? authorClass : 'collapsed'"
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
          {{ getAuthorStatus() }}
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
        <span class="points">{{ item.score }} points</span>
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
import timeAgo from '../util/time';

export default {
  name: 'Comment',
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
  computed: {
    authorClass() {
      return {
        'yt-simple-endpoint': !this.item.is_submitter && !this.item.distinguished,
        moderator: this.item.distinguished === 'moderator',
        admin: this.item.distinguished === 'admin',
        special: this.item.distinguished === 'special',
        op: !this.item.distinguished && this.item.is_submitter,
      };
    },
  },
  methods: {
    timeAgo,
    getAuthorStatus() {
      const status = [];

      if (this.item.is_submitter) {
        status.push('S');
      }
      switch (this.item.distinguished) {
        case 'moderator':
          status.push('M');
          break;
        case 'admin':
          status.push('A');
          break;
        case 'special':
          status.push('Δ');
          break;
        default:
          return '';
      }

      return `[${status}]`;
    },
  },
};
</script>

<style lang="scss">
.links, .details {
  font-size: .95rem;
  color: #888;
  a {
    color: #888;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.author, .points {
  font-size: .95rem;
  font-weight: bold;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.replies {
  .replies {
    border-left: 1px dotted #DDF;
    .comment {
      margin-left: 1.8rem;
    }
  }
}
.stickied {
  color: #228822;
}
.moderator {
  background-color: #228822;
  color: white;
  padding: 0px 0px 0px 2px;
}
.admin, .special {
  background-color: red;
  color: white;
  padding: 0px 0px 0px 2px;
}
.op {
  background-color: blue;
  color: white;
  padding: 0px 0px 0px 2px;
}
.collapsed {
  color: #888 !important;
  font-style: italic !important;
}
</style>
