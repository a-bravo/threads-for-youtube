<template>
  <div id="options-app">
    <h1>AlienTube Settings</h1>
    <table>
      <tbody>
        <tr>
          <th>tab options</th>
          <td>
            <div>
              default tab
              <select v-model="options.DEFAULT_TAB">
                <option
                  v-for="tab in tabs"
                  :key="tab.value"
                  :value="tab.value"
                >
                  {{ tab.text }}
                </option>
              </select>
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
              display
              <select
                v-model.number="options.NUM_POSTS"
                type="number"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              links at once
            </div>
          </td>
        </tr>

        <tr>
          <th>comments tab options</th>
          <td>
            <div>
              don't show me posts with
              <input
                v-model.number.lazy.trim="options.POST_COMMENT_THRESHOLD"
                min="1"
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
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <button @click="resetOptions">
        Reset to default settings
      </button>
    </div>
  </div>
</template>

<script>
import optionsMixin from '../mixins/optionsMixin';
import { OPTIONS, COMPONENT_TABS } from '../constants';

export default {
  mixins: [optionsMixin],
  data() {
    return {
      tabs: COMPONENT_TABS,
    };
  },
  computed: {
    commentScoreThreshold() {
      return this.options.COMMENT_SCORE_THRESHOLD;
    },
    postCommentThreshold() {
      return this.options.POST_COMMENT_THRESHOLD;
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
    options: {
      handler() {
        this.$browser.storage.sync.set({ options: this.options });
      },
      deep: true,
    },
  },
  methods: {
    resetOptions() {
      this.options = { ...OPTIONS };
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
  .details {
    color: $rt-grey;
    font-size: $at-tiny-font;
  }
}
</style>
