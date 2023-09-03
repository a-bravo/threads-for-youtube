<template>
  <div :id="APP_ID">
    <transition name="fade">
      <back-to-top-button
        v-if="scrolledDown"
        :destination-id="APP_ID"
      />
    </transition>
    <div
      id="content-text"
      :class="[APP_ID]"
    >
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :id="tab.value"
          :key="tab.value"
          :class="['tab-button', { selected: currentTabComponent === tab.value }]"
          @click="currentTabComponent = tab.value"
        >
          {{ getTabTitle(tab) }}
        </button>
      </div>

      <div>
        <keep-alive :include="keepAlive">
          <component
            :is="currentTabComponent"
            v-bind="currentProperties"
            @moreSubmissions="getSubmissions"
            @reload="getSubmissions"
            @sortChanged="s => sort = s"
            @timeChanged="t => time = t"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import SubmissionList from './components/SubmissionList.vue';
import CommentsView from './components/CommentsView.vue';
import YoutubeCommentsView from './components/YoutubeCommentsView.vue';
import BackToTopButton from './components/BackToTopButton.vue';
import optionsMixin from './mixins/optionsMixin';
import { pluralize, abbreviateNumber } from './util';
import {
  APP_ID,
  YT_COMMENTS_ID,
  COMPONENT_TABS,
  DEFAULT_POSTS_TIME,
} from './constants';

const VIDEO_ID_LENGTH = 11;
const SCROLL_THRESHOLD = 3;

export default {
  components: {
    SubmissionList,
    CommentsView,
    YoutubeCommentsView,
    BackToTopButton,
  },
  mixins: [optionsMixin],
  data() {
    return {
      currentTabComponent: '',
      tabs: COMPONENT_TABS,
      query: '',
      APP_ID,
      scrolledDown: false,
      keepAlive: ['comments-view'],
      sort: '',
      time: DEFAULT_POSTS_TIME,
      scrollCount: 0,
    };
  },
  computed: {
    submissions() {
      return this.$root.$data.state.submissionList.map(
        (id) => this.$root.$data.state.submissions[id],
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
          props.sort = this.sort;
          props.time = this.time;
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
        (s) => this.options.FILTERS.indexOf(s.data.subreddit.toLowerCase()) === -1,
      );
    },
  },
  watch: {
    options() {
      this.currentTabComponent = this.options.DEFAULT_TAB;
      this.sort = this.options.DEFAULT_POSTS_SORT;
    },
    sort() {
      this.getSubmissionsIfAfterInit();
    },
    time() {
      this.getSubmissionsIfAfterInit();
    },
  },
  created() {
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

      // ensure app and yt commments are siblings
      window.addEventListener('resize', () => {
        if (comments.previousSibling.id !== APP_ID) {
          comments.before(document.getElementById(APP_ID));
        }
      });
    }

    window.addEventListener('scroll', this.onScrollPosition);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScrollPosition);
  },
  methods: {
    onScrollPosition() {
      if (window.pageYOffset > document.getElementById(APP_ID).offsetTop) {
        this.scrolledDown = true;
      } else {
        this.scrolledDown = false;
      }
    },
    pageChange() {
      const url = new URL(window.location.href);
      const newQuery = url.searchParams.get('v');

      // if loading same page, exit
      if (this.query === newQuery) {
        return;
      }
      this.query = newQuery;

      // reset state
      this.resetScrollLoad();
      this.$root.$data.clearDataAction();
      this.$root.$data.setInitAction(true);
      this.time = DEFAULT_POSTS_TIME;
      this.getOptions();

      // if loading non-video pages, exit
      if (url.pathname !== '/watch' || !newQuery) {
        return;
      }

      // load new submissions on scroll or wheel event
      window.addEventListener('wheel', this.onScrollLoad);
      window.addEventListener('scroll', this.onScrollLoad);
    },
    onScrollLoad() {
      // only load new submissions when past scroll threshold
      // this ensures that any programmatic scroll event is ignored
      this.scrollCount += 1;

      if (this.scrollCount > SCROLL_THRESHOLD) {
        this.resetScrollLoad();
        this.getSubmissions();
      }
    },
    resetScrollLoad() {
      window.removeEventListener('wheel', this.onScrollLoad);
      window.removeEventListener('scroll', this.onScrollLoad);
      this.scrollCount = 0;
    },
    getSubmissions() {
      // if invalid video id, dont try to get subs
      if (!this.query || this.query.length !== VIDEO_ID_LENGTH) {
        this.$root.$data.setInitAction(false);
        this.updateCurrentTabIfNeeded();
        return;
      }

      if (!this.$root.$data.state.nextSubmission) {
        // loading new data: reset cached component (comments view)
        this.keepAlive = [];
        this.$nextTick().then(() => { this.keepAlive = ['comments-view']; });
      }

      this.$root.$data.loadSubmissions(
        this.query,
        this.sort,
        this.time,
        this.options.NUM_POSTS,
        this.$root.$data.state.nextSubmission,
      ).then(() => {
        this.updateCurrentTabIfNeeded();
      });
    },
    getSubmissionsIfAfterInit() {
      // Dont getSubmissions when changing page (init) or loading submissions
      // This avoids calling getSubmissions multiple times on pageChange
      if (!this.$root.$data.state.init
        && !this.$root.$data.state.submissions.loading
      ) {
        // reset nextsubmission
        this.$root.$data.clearDataAction();
        this.getSubmissions();
      }
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
      const num = tab.value === 'submission-list' ? this.filteredSubmissions.length : this.totalComments;

      return `${abbreviateNumber(num)}${more} ${pluralize(num, tab.text.slice(0, -1))}`;
    },
    updateCurrentTabIfNeeded() {
      if (!this.totalComments
        && !this.$root.$data.state.nextSubmission
        && this.time === DEFAULT_POSTS_TIME
        && this.options.BACKUP_YT_TAB
      ) {
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
  color: $yt-text-primary-color;
  font-size: $at-default-size;
  line-height: $at-default-line-height;
  margin-top: $at-spacing;
  word-wrap: break-word;
  @include at-button-link-style;
  .at-app {
    font-family: $at-font-family;
  }
  .stickied {
    color: $rt-mod-green;
  }
  .at-component {
    margin-top: $at-spacing;
    margin-bottom: $at-floating-btn-diameter;
  }
  .at-simple-endpoint {
    color: $yt-endpoint-blue;
  }
  .details {
    color: $rt-grey;
    font-size: $at-tiny-font;
  }
  .subtext {
    color: $rt-grey;
  }
  .md {
    tr,
    code,
    .-cells,
    .-lists,
    .-blocks,
    .-headers,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    th,
    td,
    ul,
    ol,
    .-lists,
    pre,
    blockquote,
    table,
    p,
    ul,
    ol {
      margin: 0;
      padding: 0;
    }
    .-blocks,
    .-lists,
    pre,
    blockquote,
    table,
    p,
    ul,
    ol {
     margin-top:0.35714285714285715em;
     margin-bottom:0.35714285714285715em
    }
    .-headers,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      border: 0;
    }
    h6 {
      text-decoration: underline;
    }
    th,
    strong,
    .-headers,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 600;
      font-style: inherit
    }
    h2,
    h4 {
     font-weight: 500;
    }
    h6 {
     font-weight: 400;
    }
    .md {
      font-size: 1.0769230769230769em;
    }
    h1,
    h2 {
     font-size: 1.2857142857142858em;
     line-height: 1.3888888888888888em;
     margin-top: 0.8333333333333334em;
     margin-bottom: 0.8333333333333334em;
    }
    h3,
    h4 {
     font-size: 1.1428571428571428em;
     line-height: 1.25em;
     margin-top: 0.625em;
     margin-bottom: 0.625em;
    }
    h5,
    h6 {
     font-size: 1em;
     line-height: 1.4285714285714286em;
     margin-top: 0.7142857142857143em;
     margin-bottom: 0.35714285714285715em;
    }
    hr {
      border: 0;
      color: transparent;
      background: #c5c1ad;
      height: 2px;
      padding: 0;
    }
    blockquote {
      border-left: 2px solid #c5c1ad;
      padding: 0 8px;
      padding-left: 10px;
      margin-left: 5px;
    }
    blockquote, del {
     color: $rt-grey;
    }
    ul {
      list-style-type: disc;
    }
    ol {
      list-style-type: decimal;
    }
    .-lists,
    ul,
    ol {
      padding-left: 40px;
    }
    li li,
    li p {
     font-size: 1em !important;
    }
    textarea,
    .-text,
    p,
    pre>code,
    th,
    td,
    li {
      font-size: 1em;
      line-height: 1.4285714285714286em
    }
    table {
      border-collapse: collapse;
    }
    td,
    th {
      border: 1px solid $rt-grey;
      text-align: left;
    }
    td[align=center],
    th[align=center] {
      text-align: center;
    }
    td[align=right],
    th[align=right] {
      text-align: right;
    }
    pre,
    .-cells,
    th,
    td {
      padding: 4px 9px;
    }
    .-headers code,
    h1 code,
    h2 code,
    h3 code,
    h4 code,
    h5 code,
    h6 code {
      font-size: inherit;
    }
    code,
    pre {
      border: 1px solid #e6e6de;
      border-radius: 2px;
    }
    code {
      margin: 0 2px;
      white-space: nowrap;
      word-break: normal;
      padding: 0 4px;
      font-family: monospace, monospace;
    }
    p code {
      line-height: 1em;
    }
    pre {
      overflow: auto;
    }
    pre code {
      white-space: pre;
      background-color: transparent;
      border: 0;
      display: block;
      padding: 0!important;
    }
    .md-spoiler-text {
      border-radius: 2px;
    }
    .md-spoiler-text, .md-spoiler-text * {
        transition: all 1s ease-in;
        background: rgba(79,79,79,0.1);
    }
    .md-spoiler-text:not(:hover), .md-spoiler-text:not(:hover) * {
        color: transparent;
        background: #4f4f4f;
    }
    >:first-child,
    .-cells>:first-child,
    .-lists>:first-child,
    .-blocks>:first-child,
    .-headers>:first-child,
    h1>:first-child,
    h2>:first-child,
    h3>:first-child,
    h4>:first-child,
    h5>:first-child,
    h6>:first-child,
    th>:first-child,
    td>:first-child,
    ul>:first-child,
    ol>:first-child,
    .-lists>:first-child,
    pre>:first-child,
    blockquote>:first-child,
    table>:first-child,
    p>:first-child,
    ul>:first-child,
    ol>:first-child {
      margin-top: 0;
    }
    >:last-child,
    .-cells>:last-child,
    .-lists>:last-child,
    .-blocks>:last-child,
    .-headers>:last-child,
    h1>:last-child,
    h2>:last-child,
    h3>:last-child,
    h4>:last-child,
    h5>:last-child,
    h6>:last-child,
    th>:last-child,
    td>:last-child,
    ul>:last-child,
    ol>:last-child,
    .-lists>:last-child,
    pre>:last-child,
    blockquote>:last-child,
    table>:last-child,
    p>:last-child,
    ul>:last-child,
    ol>:last-child {
      margin-bottom: 0;
    }
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
