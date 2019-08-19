<template>
  <div id="at-app">
    <div
      id="content-text"
      class="ytd-comment-renderer"
    >
      <h3 v-if="initState">
        ... reddit threads
      </h3>
      <h3 v-else>
        <div v-if="apiError">
          Could not reach reddit. Try again later.
        </div>
        <div v-else>
          {{ submissions.length }} reddit threads
        </div>
      </h3>

      <submission-list
        v-if="!initState"
        :submissions="submissions"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import SubmissionList from './components/SubmissionList.vue';
import search from './services/api';

export default {
  components: {
    SubmissionList,
  },
  data() {
    return {
      initState: true,
      apiError: false,
      submissions: [],
    };
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
  methods: {
    pageChange() {
      this.initState = true;
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
        .finally(() => { this.initState = false; });
    },
  },
};
</script>

<style>
#at-app {
  font-size: 15px;
  font-family: verdana, arial, helvetica, sans-serif;
}
</style>
