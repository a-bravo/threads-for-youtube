<template>
  <div id="at-app">
    <div
      id="content-text"
      class="ytd-comment-renderer"
    >
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-button', { selected: currentTabComponent === tab }]"
          @click="currentTabComponent = tab"
        >
          {{ getTabTitle(tab) }}
        </button>
      </div>
      <div>
        <keep-alive>
          <component
            :is="currentTabComponent"
            v-bind="currentProperties"
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
import search from './services/api';

const VIDEO_ID_LENGTH = 11;

export default {
  components: {
    SubmissionList,
    CommentsView,
    YoutubeCommentsView,
  },
  data() {
    return {
      loading: true,
      apiError: false,
      submissions: [],
      currentTabComponent: 'submission-list',
      tabs: ['submission-list', 'comments-view', 'youtube-comments-view'],
      query: '',
    };
  },
  computed: {
    currentProperties() {
      if (this.currentTabComponent !== 'youtube-comments-view') {
        return {
          submissions: this.submissions,
          apiError: this.apiError,
          loading: this.loading,
        };
      }

      return {};
    },
    totalComments() {
      return this.submissions.reduce((sum, sub) => sum + sub.num_comments, 0);
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
    const comments = document.getElementById('comments');
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

      // guard against non-video pages
      // occurs when: youtube pushes 2 history states (last page(video) & new page)
      if (url.pathname !== '/watch' || !newQuery || newQuery.length !== VIDEO_ID_LENGTH) {
        // not a video, cancel any pending calls
        this.debouncedGetSubmissions.cancel();
        this.loading = false;
        return;
      }

      this.debouncedGetSubmissions(newQuery);
    },
    getSubmissions(query) {
      search(query, 'comments')
        .then(listing => listing.fetchAll())
        .then((extendedListing) => {
          this.submissions = extendedListing;
          this.apiError = false;
        })
        .catch(() => {
          this.apiError = true;
          this.submissions = [];
        })
        .finally(() => { this.loading = false; });
    },
    getTabTitle(tab) {
      switch (tab) {
        case 'submission-list':
          return `${this.submissions.length} reddit posts`;
        case 'comments-view':
          return `${this.totalComments} reddit comments`;
        case 'youtube-comments-view':
          return 'Youtube Comments';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss">
@import "./styles/variables.scss";

/* Global app styles */
#at-app {
  font-family: verdana, arial, helvetica, sans-serif;
  margin-top: $at-spacing;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  button {
    cursor: pointer;
  }
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
