<template>
  <div id="at-app">
    <div
      id="content-text"
      class="ytd-comment-renderer"
    >
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-button', { active: currentTabComponent === tab }]"
        @click="currentTabComponent = tab"
      >
        {{ getTabTitle(tab) }}
      </button>
      <keep-alive>
        <component
          :is="currentTabComponent"
          v-bind="currentProperties"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import SubmissionList from './components/SubmissionList.vue';
import YoutubeCommentsView from './components/YoutubeCommentsView.vue';
import search from './services/api';

export default {
  components: {
    SubmissionList,
    YoutubeCommentsView,
  },
  data() {
    return {
      loading: true,
      apiError: false,
      submissions: [],
      currentTabComponent: 'submission-list',
      tabs: ['submission-list', 'comments-view', 'youtube-comments-view'],
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
      this.loading = true;
      this.submissions = [];

      // guard against non-video pages
      // occurs when: youtube pushes 2 history states (last page(video) & new page)
      const url = new URL(window.location.href);
      if (url.pathname !== '/watch' || !url.searchParams.get('v')) {
        // not a video, cancel any pending calls
        this.debouncedGetSubmissions.cancel();
        return;
      }

      this.debouncedGetSubmissions(url.searchParams.get('v'));
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

<style>
#at-app {
  font-size: 15px;
  font-family: verdana, arial, helvetica, sans-serif;
}
.tab-button.active {
  background: #e0e0e0;
}
</style>
