<template>
  <div id="options-app">
    <h1>Threads for YouTube Settings</h1>
    <table>
      <tbody>
        <tr>
          <th>tab options</th>
          <td>
            <div>
              default tab
              <select-input
                v-model="options.DEFAULT_TAB"
                :options="tabs"
              />
            </div>
            <div>
              <input
                v-model="options.BACKUP_YT_TAB"
                type="checkbox"
              >
              <label>
                display YouTube comments if no reddit comments are found
              </label>
            </div>
          </td>
        </tr>

        <tr>
          <th>posts tab options</th>
          <td>
            <div>
              sort posts by
              <select-input
                v-model="options.DEFAULT_POSTS_SORT"
                :options="postSorts"
              />
            </div>
            <div>
              display
              <select-input
                v-model="options.NUM_POSTS"
                :options="[10, 25, 50, 100]"
              />
              links at once
            </div>
          </td>
        </tr>

        <tr>
          <th>comments tab options</th>
          <td>
            <div>
              sort comments by
              <select-input
                v-model="options.DEFAULT_COMMENTS_SORT"
                :options="commentSorts"
              />
            </div>
            <div>
              <input
                v-model="options.IGNORE_SUGGESTED_SORT"
                type="checkbox"
              >
              <label>
                ignore suggested sorts
              </label>
            </div>
            <div>
              <input
                v-model="options.HIDE_CHILD_COMMENTS"
                type="checkbox"
              >
              <label>
                automatically hide all child comments
              </label>
            </div>
            <div>
              <input
                v-model="options.COLLAPSE_MODERATOR"
                type="checkbox"
              >
              <label>
                automatically collapse AutoModerator's stickied comments
              </label>
            </div>
            <div>
              don't show me posts with
              <input
                v-model.number.lazy.trim="options.POST_COMMENT_THRESHOLD"
                size="3"
                maxlength="3"
              >
              comments or less
              <span class="details">(leave blank to show all posts)</span>
            </div>
            <div>
              don't show me comments with a score less than
              <input
                v-model.number.lazy.trim="options.COMMENT_SCORE_THRESHOLD"
                size="4"
                maxlength="4"
              >
              <span class="details">(leave blank to show all comments)</span>
            </div>
            <div>
              display
              <input
                v-model.number.lazy.trim="options.NUM_COMMENTS"
                size="3"
                maxlength="3"
              >
              comments by default
              <span class="details">
                (1 - 500); the smaller the number, the faster the comments will load
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <th>display options</th>
          <td>
            <div>
              <input
                v-model="options.SHOW_USER_FLAIR"
                type="checkbox"
              >
              <label>show user flair</label>
            </div>
            <div>
              <input
                v-model="options.SHOW_POST_FLAIR"
                type="checkbox"
              >
              <label>show post flair</label>
            </div>
            <br>

            <form @submit.prevent="addFilter">
              don't show me posts from certain subreddits
              <input
                id="filters"
                v-model="newFilter"
                placeholder="subreddit"
                size="21"
                maxlength="21"
              >
              <button>Add</button>
            </form>
            <div>
              <div v-if="options.FILTERS && options.FILTERS.length">
                Filtered Subreddits:
                <ul>
                  <li
                    v-for="(filter, index) in options.FILTERS"
                    :key="`filter-${index}`"
                  >
                    {{ filter }}
                    <a
                      class="delete pull-right"
                      @click="removeFilter(index)"
                    >
                      ×
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <th>reset options</th>
          <td>
            <button @click="resetOptions">
              Reset to default settings
            </button>
          </td>
        </tr>
        <tr v-show="saved">
          <th />
          <td>
            <div class="success">
              Options updated
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import SelectInput from '../components/SelectInput.vue';
import optionsMixin from '../mixins/optionsMixin';
import {
  OPTIONS,
  COMPONENT_TABS,
  POST_SORTS,
  COMMENT_SORTS,
} from '../constants';

export default {
  components: {
    SelectInput,
  },
  mixins: [optionsMixin],
  data() {
    return {
      tabs: COMPONENT_TABS,
      postSorts: POST_SORTS,
      commentSorts: COMMENT_SORTS,
      newFilter: '',
      saved: false,
      initialLoad: true,
    };
  },
  computed: {
    commentScoreThreshold() {
      return this.options.COMMENT_SCORE_THRESHOLD;
    },
    postCommentThreshold() {
      return this.options.POST_COMMENT_THRESHOLD;
    },
    numComments() {
      return this.options.NUM_COMMENTS;
    },
  },
  watch: {
    commentScoreThreshold(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== '') {
        this.options.COMMENT_SCORE_THRESHOLD = oldVal;
      }
    },
    postCommentThreshold(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== '') {
        this.options.POST_COMMENT_THRESHOLD = oldVal;
      } else if (newVal < 0) {
        this.options.POST_COMMENT_THRESHOLD = 0;
      }
    },
    numComments(newVal, oldVal) {
      if (typeof newVal === 'string') {
        this.options.NUM_COMMENTS = oldVal;
      } else if (newVal < 1) {
        this.options.NUM_COMMENTS = 1;
      } else if (newVal > 500) {
        this.options.NUM_COMMENTS = 500;
      }
    },
    options: {
      handler() {
        // remove extra properties from options
        const options = pick(this.options, Object.keys(OPTIONS));
        this.$browser.storage.local.set({ options })
          .then(() => {
            if (this.initialLoad) {
              this.initialLoad = false;
            } else {
              this.saved = true;
              setTimeout(() => { this.saved = false; }, 2000);
            }
          });
      },
      deep: true,
    },
  },
  methods: {
    resetOptions() {
      if (window.confirm('Are you sure you want to reset to default settings?')) { // eslint-disable-line no-alert
        this.options = cloneDeep(OPTIONS);
      }
    },
    addFilter() {
      const filter = this.newFilter.trim();
      if (filter === '') {
        return;
      }

      this.options.FILTERS.push(filter.toLowerCase());
      this.newFilter = '';
    },
    removeFilter(index) {
      this.options.FILTERS.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

#options-app {
  font-family: $at-font-family;
  @include at-button-link-style;

  th {
    padding: 10px;
    vertical-align: top;
    text-align: right;
    font-weight: bold;
    white-space: nowrap;
  }
  td {
    padding: 10px;
  }
  ul {
    @include reset-list;
    width: 75%;
    padding: 15px;
    border: 1px solid $rt-grey;
    word-wrap: break-word;
    li:hover {
      background-color: $rt-light-blue;
    }
  }
  .details {
    color: $rt-grey;
    font-size: $at-tiny-font;
  }
  .delete {
    color: $yt-red;
  }
  .success {
    color: $rt-mod-green;
  }
  .pull-right {
    float: right;
  }
}
</style>
