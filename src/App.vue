<template>
  <div :id="APP_ID">
    <div
      id="content-text"
      :class="YT_CONTENT_RENDERER_CLASS"
    >
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-button', { selected: currentTabComponent === tab.value }]"
          @click="currentTabComponent = tab.value"
        >
          {{ getTabTitle(tab) }}
        </button>
      </div>
      <div>
        <keep-alive>
          <component
            :is="currentTabComponent"
            v-bind="currentProperties"
            @moreSubmissions="getMoreSubmissions"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import SubmissionList from './components/SubmissionList.vue';
import CommentsView from './components/CommentsView.vue';
import YoutubeCommentsView from './components/YoutubeCommentsView.vue';
import optionsMixin from './mixins/optionsMixin';
import { search } from './services/api';
import { pluralize } from './util';
import {
  APP_ID,
  YT_COMMENTS_ID,
  YT_CONTENT_RENDERER_CLASS,
  COMPONENT_TABS,
} from './constants';

const VIDEO_ID_LENGTH = 11;

export default {
  components: {
    SubmissionList,
    CommentsView,
    YoutubeCommentsView,
  },
  mixins: [optionsMixin],
  data() {
    return {
      loading: true,
      moreLoading: false,
      apiError: false,
      submissions: [],
      after: null,
      currentTabComponent: '',
      tabs: COMPONENT_TABS,
      query: '',
      APP_ID,
      YT_CONTENT_RENDERER_CLASS,
    };
  },
  computed: {
    currentProperties() {
      if (this.currentTabComponent !== 'youtube-comments-view') {
        return {
          submissions: this.filteredSubmissions,
          apiError: this.apiError,
          loading: this.loading,
          options: this.options,
          morePosts: this.after !== null,
          moreLoading: this.moreLoading,
        };
      }

      return {};
    },
    totalComments() {
      return this.filteredSubmissions.reduce((sum, sub) => sum + sub.data.num_comments, 0);
    },
    filteredSubmissions() {
      return this.submissions.filter(
        s => this.options.FILTERS.indexOf(s.data.subreddit.toLowerCase()) === -1,
      );
    },
  },
  watch: {
    options() {
      this.currentTabComponent = this.options.DEFAULT_TAB;
    },
  },
  created() {
    // debounce api for user navigation/multiple navigation messages
    this.debouncedGetSubmissions = debounce(this.getSubmissions, 3000);

    // listen for page change message from background script
    this.$browser.runtime.onMessage.addListener((message) => {
      if (message.videoChanged) {
        this.pageChange();
      }
    });

    // call when first created
    this.pageChange();
  },
  mounted() {
    const comments = document.getElementById(YT_COMMENTS_ID);
    if (comments) {
      comments.classList.add('hidden');
    }
  },
  methods: {
    pageChange() {
      const url = new URL(window.location.href);
      const newQuery = url.searchParams.get('v');

      // if loading same page, exit
      if (this.query === newQuery) {
        return;
      }
      this.query = newQuery;

      // reset state
      this.loading = true;
      this.submissions = [];
      this.after = null;
      this.getOptions();

      // guard against non-video pages
      // occurs when: youtube pushes 2 history states (last page(video) & new page)
      if (url.pathname !== '/watch' || !newQuery || newQuery.length !== VIDEO_ID_LENGTH) {
        // not a video, cancel any pending calls
        this.debouncedGetSubmissions.cancel();
        this.loading = false;
        return;
      }

      this.debouncedGetSubmissions();
    },
    getSubmissions() {
      search(this.query, 'comments', this.options.NUM_POSTS)
        .then((result) => {
          this.submissions = result.submissions;
          this.after = result.after;
          this.apiError = false;
          this.updateCurrentTabIfNeeded();
        })
        .catch(() => {
          this.apiError = true;
          this.submissions = [];
        })
        .finally(() => { this.loading = false; });
    },
    getMoreSubmissions() {
      this.moreLoading = true;
      search(this.query, 'comments', this.options.NUM_POSTS, this.after)
        .then((result) => {
          this.submissions.push(...result.submissions);
          this.after = result.after;
        })
        .finally(() => { this.moreLoading = false; });
    },
    getTabTitle(tab) {
      let more = '';
      if (this.after) {
        more = '+';
      }

      switch (tab.value) {
        case 'submission-list':
          return pluralize(this.filteredSubmissions.length, tab.text.slice(0, -1), more);
        case 'comments-view':
          return pluralize(this.totalComments, tab.text.slice(0, -1), more);
        case 'youtube-comments-view':
          return tab.text;
        default:
          return '';
      }
    },
    updateCurrentTabIfNeeded() {
      if (!this.totalComments && this.options.BACKUP_YT_TAB) {
        this.currentTabComponent = 'youtube-comments-view';
      }
    },
  },
};
</script>

<style lang="scss">
@import "./styles/variables.scss";
@import "./styles/mixins.scss";

/* Global app styles */
#at-app {
  font-family: $at-font-family;
  margin-top: $at-spacing;
  word-wrap: break-word;
  @include at-button-link-style;
  .stickied {
    color: $rt-mod-green;
  }
  .at-component {
    margin-top: $at-spacing;
  }
}
</style>

<style lang="scss" scoped>
@import "./styles/variables.scss";

/* component styles */
.tabs {
  height: 30px;
}
.tab-button {
  background-color: $yt-dark-grey;
  color: white;
  border: none;
  outline: none;
  height: 24px;
  width: 33%;
  &:hover {
    background-color: $yt-light-grey;
  }
  &.selected {
    background-color: $yt-red;
  }
}
</style>
