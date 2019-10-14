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
            @moreSubmissions="getSubmissions"
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
      currentTabComponent: '',
      tabs: COMPONENT_TABS,
      query: '',
      APP_ID,
      YT_CONTENT_RENDERER_CLASS,
    };
  },
  computed: {
    submissions() {
      return this.$root.$data.state.submissionList.map(
        id => this.$root.$data.state.submissions[id],
      );
    },
    currentProperties() {
      if (this.currentTabComponent !== 'youtube-comments-view') {
        const props = {
          submissions: this.filteredSubmissions,
          options: this.options,
        };

        if (this.currentTabComponent === 'submission-list') {
          props.numFilteredSubmissions = this.submissions.length - this.filteredSubmissions.length;
        }

        return props;
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
      this.$root.$data.clearDataAction();
      this.$root.$data.setInitAction(true);
      this.getOptions();

      // guard against non-video pages
      // occurs when: youtube pushes 2 history states (last page(video) & new page)
      if (url.pathname !== '/watch' || !newQuery || newQuery.length !== VIDEO_ID_LENGTH) {
        // not a video, cancel any pending calls
        this.debouncedGetSubmissions.cancel();

        // invalid video id, reset state
        if (newQuery) {
          this.$root.$data.setInitAction(false);
          // updateCurrentTabIfNeeded not needed on invalid ids
        }

        return;
      }

      this.debouncedGetSubmissions();
    },
    getSubmissions() {
      this.$root.$data.loadSubmissions(this.query, 'comments', this.options.NUM_POSTS, this.$root.$data.state.nextSubmission)
        .then(() => {
          this.updateCurrentTabIfNeeded();
        });
    },
    getTabTitle(tab) {
      // set youtube title
      if (tab.value === 'youtube-comments-view') {
        return tab.text;
      }

      // set default title on data init/load/error
      if (this.$root.$data.state.init
        || this.$root.$data.state.submissions.loading
        || this.$root.$data.state.submissions.error
      ) {
        return `-- ${tab.text}`;
      }

      // set post/comment title
      const more = this.$root.$data.state.nextSubmission ? '+' : '';
      if (tab.value === 'submission-list') {
        return pluralize(this.filteredSubmissions.length, tab.text.slice(0, -1), more);
      }

      return pluralize(this.totalComments, tab.text.slice(0, -1), more);
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
  .details {
    color: $rt-grey;
    font-size: $at-tiny-font;
  }
  .subtext {
    color: $rt-grey;
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
